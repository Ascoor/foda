<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use ReflectionClass;
use ReflectionMethod;
use SplFileInfo;

class InspectArchitecture extends Command
{
    protected $signature = 'app:inspect-architecture';

    protected $description = 'Inspect and validate backend architecture (controllers, models, services, routes, migrations).';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Scanning backend components...');

        $controllers = $this->scanControllers();
        $models = $this->scanModels();
        $services = $this->scanServices();
        $routes = $this->scanRoutes();
        $migrations = $this->scanMigrations();
        $treeStructure = $this->buildTreeStructure();

        $services = $this->mapServiceUsage($services, $controllers);
        $validation = $this->validateArchitecture($controllers, $models, $services, $routes, $migrations);
        $report = $this->buildReport($controllers, $models, $services, $routes, $validation, $treeStructure);

        $this->line($report);

        Storage::disk('local')->put('architecture-report.md', $report);
        $this->info('Report saved to storage/app/architecture-report.md');

        return self::SUCCESS;
    }

    /**
     * Scan controller classes and describe their actions/dependencies.
     */
    private function scanControllers(): array
    {
        $directory = app_path('Http/Controllers');
        $controllers = [];

        foreach ($this->gatherPhpFiles($directory) as $file) {
            $class = $this->classFromPath($file);

            if (! $class || ! class_exists($class)) {
                continue;
            }

            $reflection = new ReflectionClass($class);

            if ($reflection->isAbstract()) {
                continue;
            }

            $actions = [];
            foreach ($reflection->getMethods(ReflectionMethod::IS_PUBLIC) as $method) {
                if ($method->class !== $reflection->getName()) {
                    continue;
                }

                if ($method->isConstructor() || $method->isDestructor() || $method->isStatic()) {
                    continue;
                }

                $actions[] = [
                    'name' => $method->getName(),
                    'signature' => $this->formatMethodSignature($method),
                ];
            }

            $dependencies = [];
            if ($reflection->hasMethod('__construct')) {
                foreach ($reflection->getMethod('__construct')->getParameters() as $parameter) {
                    $type = $parameter->getType();

                    if ($type && ! $type->isBuiltin()) {
                        $dependencies[] = $type->getName();
                    }
                }
            }

            $controllers[$reflection->getName()] = [
                'class' => $reflection->getName(),
                'namespace' => $reflection->getNamespaceName(),
                'short_name' => $reflection->getShortName(),
                'actions' => $actions,
                'dependencies' => array_values(array_unique($dependencies)),
                'file' => $file,
            ];
        }

        ksort($controllers);

        return $controllers;
    }

    /**
     * Scan available API routes (preferring the Router's resolved list).
     */
    private function scanRoutes(): array
    {
        $routes = [];

        foreach (Route::getRoutes() as $route) {
            $uri = $route->uri();

            if (! Str::startsWith($uri, 'api')) {
                continue;
            }

            $actionName = $route->getActionName();
            $controllerClass = null;
            $controllerMethod = null;

            if ($actionName !== 'Closure') {
                if (str_contains($actionName, '@')) {
                    [$controllerClass, $controllerMethod] = explode('@', $actionName);
                } else {
                    $controllerClass = $actionName;
                    $controllerMethod = '__invoke';
                }
            }

            foreach ($route->methods() as $httpMethod) {
                if ($httpMethod === 'HEAD') {
                    continue;
                }

                $actionDisplay = $actionName === 'Closure'
                    ? 'Closure'
                    : sprintf('%s@%s', $controllerClass, $controllerMethod);

                $routes[] = [
                    'key' => md5($httpMethod.'|'.$uri.'|'.$actionDisplay),
                    'method' => $httpMethod,
                    'uri' => $uri,
                    'action' => $actionDisplay,
                    'controller' => $controllerClass,
                    'controllerMethod' => $controllerMethod,
                ];
            }
        }

        return $routes;
    }

    /**
     * Scan model classes and describe their tables/relationships.
     */
    private function scanModels(): array
    {
        $files = $this->gatherPhpFiles(app_path('Models'));

        foreach ($this->gatherPhpFiles(app_path()) as $file) {
            if (str_contains($file, DIRECTORY_SEPARATOR.'Models'.DIRECTORY_SEPARATOR)) {
                continue;
            }

            if (! $this->isLikelyModelFile($file)) {
                continue;
            }

            $files[] = $file;
        }

        $files = array_values(array_unique($files));
        $models = [];

        foreach ($files as $file) {
            $class = $this->classFromPath($file);

            if (! $class || ! class_exists($class)) {
                continue;
            }

            $reflection = new ReflectionClass($class);

            if ($reflection->isAbstract() || ! $reflection->isSubclassOf(\Illuminate\Database\Eloquent\Model::class)) {
                continue;
            }

            $defaults = $reflection->getDefaultProperties();
            $table = $defaults['table'] ?? Str::snake(Str::pluralStudly($reflection->getShortName()));

            $models[$reflection->getName()] = [
                'class' => $reflection->getName(),
                'short_name' => $reflection->getShortName(),
                'table' => $table,
                'relationships' => $this->extractRelationships($file),
                'file' => $file,
            ];
        }

        ksort($models);

        return $models;
    }

    /**
     * Scan service classes (files ending with Service.php).
     */
    private function scanServices(): array
    {
        $directories = [app_path('Services'), app_path()];
        $files = [];

        foreach ($directories as $directory) {
            $files = array_merge($files, $this->gatherPhpFiles($directory));
        }

        $files = array_values(array_unique($files));
        $services = [];

        foreach ($files as $file) {
            if (! str_ends_with($file, 'Service.php')) {
                continue;
            }

            $class = $this->classFromPath($file);

            if (! $class || ! class_exists($class)) {
                continue;
            }

            $reflection = new ReflectionClass($class);

            if ($reflection->isAbstract() || ! $reflection->isInstantiable()) {
                continue;
            }

            $methods = [];
            foreach ($reflection->getMethods(ReflectionMethod::IS_PUBLIC) as $method) {
                if ($method->class !== $reflection->getName() || $method->isConstructor() || $method->isStatic()) {
                    continue;
                }

                $methods[] = $this->formatMethodSignature($method);
            }

            $services[$reflection->getName()] = [
                'class' => $reflection->getName(),
                'short_name' => $reflection->getShortName(),
                'methods' => $methods,
                'used_by' => [],
            ];
        }

        ksort($services);

        return $services;
    }

    /**
     * Scan migration files and capture table creation statements.
     */
    private function scanMigrations(): array
    {
        $directory = database_path('migrations');
        $tables = [];

        foreach ($this->gatherPhpFiles($directory) as $file) {
            $contents = file_get_contents($file);

            if (preg_match_all("/Schema::create\\(\\s*['\"]([^'\"]+)['\"]/", $contents, $matches)) {
                foreach ($matches[1] as $table) {
                    $tables[$table] = $file;
                }
            }
        }

        ksort($tables);

        return ['tables' => $tables];
    }

    /**
     * Determine which controllers inject each service.
     */
    private function mapServiceUsage(array $services, array $controllers): array
    {
        foreach ($controllers as $controller) {
            foreach ($controller['dependencies'] as $dependency) {
                if (isset($services[$dependency])) {
                    $services[$dependency]['used_by'][] = $controller['class'];
                }
            }
        }

        foreach ($services as $class => $service) {
            $services[$class]['used_by'] = array_values(array_unique($service['used_by']));
        }

        return $services;
    }

    /**
     * Validate cross-component relationships.
     */
    private function validateArchitecture(array $controllers, array $models, array $services, array $routes, array $migrations): array
    {
        $errors = [];
        $warnings = [];
        $routeIssues = [];

        foreach ($routes as $route) {
            $issues = [];

            if ($route['controller']) {
                if (! class_exists($route['controller'])) {
                    $message = sprintf('ERROR: Route %s %s references missing controller %s.', $route['method'], '/'.ltrim($route['uri'], '/'), $route['controller']);
                    $errors[] = $message;
                    $issues[] = $message;
                } elseif ($route['controllerMethod'] && ! method_exists($route['controller'], $route['controllerMethod'])) {
                    $message = sprintf('ERROR: Route %s %s references missing method %s::%s.', $route['method'], '/'.ltrim($route['uri'], '/'), $route['controller'], $route['controllerMethod']);
                    $errors[] = $message;
                    $issues[] = $message;
                } elseif ($route['controllerMethod']) {
                    $reflectionMethod = new ReflectionMethod($route['controller'], $route['controllerMethod']);

                    if (! $reflectionMethod->isPublic()) {
                        $message = sprintf('ERROR: Route %s %s points to non-public method %s::%s.', $route['method'], '/'.ltrim($route['uri'], '/'), $route['controller'], $route['controllerMethod']);
                        $errors[] = $message;
                        $issues[] = $message;
                    }
                }
            }

            if (! empty($issues)) {
                $routeIssues[$route['key']] = $issues;
            }
        }

        foreach ($controllers as $controller) {
            foreach ($controller['dependencies'] as $dependency) {
                if (! class_exists($dependency)) {
                    $message = sprintf('ERROR: Controller %s depends on missing class %s.', $controller['class'], $dependency);
                    $errors[] = $message;
                }
            }
        }

        foreach ($models as $model) {
            $hasMigration = array_key_exists($model['table'], $migrations['tables']);

            if (! $hasMigration) {
                $warnings[] = sprintf('WARNING: Model %s expects table "%s" but no migration was found.', $model['class'], $model['table']);
            }

            foreach ($model['relationships'] as $relationship) {
                $target = $relationship['target'];

                if ($target && ! class_exists($target)) {
                    $warnings[] = sprintf('WARNING: Relationship %s::%s targets missing model %s.', $model['class'], $relationship['name'], $target);
                }
            }
        }

        foreach ($services as $service) {
            if (empty($service['used_by'])) {
                $warnings[] = sprintf('WARNING: Service %s is not referenced by any controller.', $service['class']);
            }
        }

        return [
            'errors' => $errors,
            'warnings' => $warnings,
            'routeIssues' => $routeIssues,
        ];
    }

    /**
     * Build the Markdown report body.
     */
    private function buildReport(array $controllers, array $models, array $services, array $routes, array $validation, string $treeStructure): string
    {
        $lines = [];
        $lines[] = '# Backend Architecture Report';
        $lines[] = '';
        $lines[] = '## Summary';
        $lines[] = sprintf('- Total controllers: %d', count($controllers));
        $lines[] = sprintf('- Total models: %d', count($models));
        $lines[] = sprintf('- Total services: %d', count($services));
        $lines[] = sprintf('- Total API routes: %d', count($routes));
        $lines[] = sprintf('- Errors: %d', count($validation['errors']));
        $lines[] = sprintf('- Warnings: %d', count($validation['warnings']));
        $lines[] = '';
        $lines[] = '## Tree Structure';
        $lines[] = $treeStructure ?: '_Tree unavailable_';
        $lines[] = '';
        $lines[] = '## Controllers';

        if (empty($controllers)) {
            $lines[] = '_No controllers found._';
        } else {
            foreach ($controllers as $controller) {
                $lines[] = sprintf('- **%s** (%s)', $controller['class'], $controller['file']);
                $lines[] = '  - Actions:';

                if (empty($controller['actions'])) {
                    $lines[] = '    - _No public actions detected_';
                } else {
                    foreach ($controller['actions'] as $action) {
                        $lines[] = sprintf('    - `%s`', $action['signature']);
                    }
                }

                $lines[] = '  - Injected dependencies:';
                if (empty($controller['dependencies'])) {
                    $lines[] = '    - _None_';
                } else {
                    foreach ($controller['dependencies'] as $dependency) {
                        $lines[] = sprintf('    - %s', $dependency);
                    }
                }
            }
        }

        $lines[] = '';
        $lines[] = '## API Routes';

        if (empty($routes)) {
            $lines[] = '_No API routes registered._';
        } else {
            foreach ($routes as $route) {
                $issueLabel = '';

                if (isset($validation['routeIssues'][$route['key']])) {
                    $issueLabel = ' ⚠️';
                }

                $lines[] = sprintf('- **%s** /%s → %s%s', $route['method'], ltrim($route['uri'], '/'), $route['action'], $issueLabel);
            }
        }

        $lines[] = '';
        $lines[] = '## Models';

        if (empty($models)) {
            $lines[] = '_No models found._';
        } else {
            foreach ($models as $model) {
                $lines[] = sprintf('- **%s** (table: `%s`)', $model['class'], $model['table']);

                if (empty($model['relationships'])) {
                    $lines[] = '  - Relationships: _None detected_';
                } else {
                    $lines[] = '  - Relationships:';

                    foreach ($model['relationships'] as $relationship) {
                        $target = $relationship['target'] ?: 'unknown target';
                        $lines[] = sprintf('    - `%s()` → %s (%s)', $relationship['name'], $target, $relationship['type']);
                    }
                }
            }
        }

        $lines[] = '';
        $lines[] = '## Services';

        if (empty($services)) {
            $lines[] = '_No services found._';
        } else {
            foreach ($services as $service) {
                $lines[] = sprintf('- **%s**', $service['class']);
                $lines[] = '  - Methods:';

                if (empty($service['methods'])) {
                    $lines[] = '    - _No public methods detected_';
                } else {
                    foreach ($service['methods'] as $method) {
                        $lines[] = sprintf('    - `%s`', $method);
                    }
                }

                $lines[] = '  - Used by:';
                if (empty($service['used_by'])) {
                    $lines[] = '    - _Not referenced by controllers_';
                } else {
                    foreach ($service['used_by'] as $consumer) {
                        $lines[] = sprintf('    - %s', $consumer);
                    }
                }
            }
        }

        $lines[] = '';
        $lines[] = '## Validation';

        if (empty($validation['errors']) && empty($validation['warnings'])) {
            $lines[] = '_No issues detected._';
        } else {
            foreach ($validation['errors'] as $error) {
                $lines[] = '- ❌ '.$error;
            }

            foreach ($validation['warnings'] as $warning) {
                $lines[] = '- ⚠️ '.$warning;
            }
        }

        return implode("\n", $lines)."\n";
    }

    /**
     * Build a limited depth tree for the primary backend directories.
     */
    private function buildTreeStructure(): string
    {
        $targets = [
            app_path(),
            app_path('Http'),
            app_path('Http/Controllers'),
            app_path('Models'),
            app_path('Services'),
            database_path(),
            database_path('migrations'),
            base_path('routes'),
        ];

        $sections = [];
        foreach ($targets as $path) {
            if (is_dir($path)) {
                $sections[] = $this->renderDirectory($path);
            }
        }

        return implode("\n", $sections);
    }

    private function renderDirectory(string $path, int $depth = 0, int $maxDepth = 2): string
    {
        $indent = str_repeat('  ', $depth);
        $relative = str_replace(base_path().DIRECTORY_SEPARATOR, '', $path);
        $relative = $relative === '' ? basename($path) : $relative;
        $relative = rtrim($relative, DIRECTORY_SEPARATOR);
        $suffix = is_dir($path) ? '/' : '';
        $line = sprintf('%s- %s%s', $indent, $relative, $suffix);

        if (! is_dir($path) || $depth >= $maxDepth) {
            return $line;
        }

        $children = array_values(array_filter(scandir($path), function ($item) {
            return ! in_array($item, ['.', '..']);
        }));

        $children = array_slice($children, 0, 15);
        $childLines = [$line];

        foreach ($children as $child) {
            $childLines[] = $this->renderDirectory($path.DIRECTORY_SEPARATOR.$child, $depth + 1, $maxDepth);
        }

        return implode("\n", $childLines);
    }

    /**
     * Heuristic check to determine whether a PHP file likely hosts an Eloquent model.
     */
    private function isLikelyModelFile(string $file): bool
    {
        if (! is_readable($file)) {
            return false;
        }

        $contents = file_get_contents($file);

        if ($contents === false) {
            return false;
        }

        return str_contains($contents, 'extends Model')
            || str_contains($contents, 'extends \\Illuminate\\Database\\Eloquent\\Model');
    }

    /**
     * Extract relationship metadata from a model file.
     */
    private function extractRelationships(string $path): array
    {
        if (! is_readable($path)) {
            return [];
        }

        $code = file_get_contents($path);
        $relationships = [];
        $functionPattern = '/function\s+(\w+)\s*\([^)]*\)\s*\{([\s\S]*?)\}/m';

        if (preg_match_all($functionPattern, $code, $matches, PREG_SET_ORDER)) {
            foreach ($matches as $match) {
                $body = $match[2];

                if (preg_match('/\$this->(hasOne|hasMany|belongsTo|belongsToMany|morphTo|morphMany|morphOne)\s*\(([^;]+)\)/', $body, $relationMatch)) {
                    $relationships[] = [
                        'name' => $match[1],
                        'type' => $relationMatch[1],
                        'target' => $this->normalizeRelationshipTarget($relationMatch[2] ?? ''),
                    ];
                }
            }
        }

        return $relationships;
    }

    /**
     * Normalize the target class of a relationship method.
     */
    private function normalizeRelationshipTarget(string $argument): ?string
    {
        $argument = trim($argument);

        if ($argument === '') {
            return null;
        }

        if (str_contains($argument, ',')) {
            $argument = Str::before($argument, ',');
        }

        $argument = trim($argument);
        $argument = trim($argument, "\"' ");

        if ($argument === '') {
            return null;
        }

        if (str_contains($argument, '::class')) {
            $argument = trim(str_replace('::class', '', $argument));
            $argument = ltrim($argument, '\\');
            if ($argument === '') {
                return null;
            }

            if (! Str::startsWith($argument, 'App\\')) {
                $argument = 'App\\Models\\'.$argument;
            } else {
                $argument = $argument;
            }

            return $argument;
        }

        if (! Str::startsWith($argument, 'App\\')) {
            $argument = 'App\\Models\\'.ltrim($argument, '\\');
        }

        return $argument;
    }

    /**
     * Convert a file path under app/ to its class name.
     */
    private function classFromPath(string $path): ?string
    {
        $appPath = app_path();

        if (! Str::startsWith($path, $appPath)) {
            return null;
        }

        $relative = trim(Str::after($path, $appPath), DIRECTORY_SEPARATOR);
        $relative = str_replace(['/', '\\'], '\\', $relative);
        $relative = preg_replace('/\.php$/', '', $relative);

        if ($relative === '') {
            return null;
        }

        return 'App\\'.$relative;
    }

    /**
     * Gather PHP files for a directory.
     */
    private function gatherPhpFiles(string $directory): array
    {
        if (! is_dir($directory)) {
            return [];
        }

        $files = [];
        $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($directory));

        /** @var SplFileInfo $file */
        foreach ($iterator as $file) {
            if ($file->isDir()) {
                continue;
            }

            if ($file->getExtension() !== 'php') {
                continue;
            }

            $files[] = $file->getPathname();
        }

        return $files;
    }

    /**
     * Render a nice method signature string.
     */
    private function formatMethodSignature(ReflectionMethod $method): string
    {
        $parameters = [];

        foreach ($method->getParameters() as $parameter) {
            $segment = '$'.$parameter->getName();

            if ($parameter->isOptional()) {
                $segment .= '=?';
            }

            $parameters[] = $segment;
        }

        return sprintf('%s(%s)', $method->getName(), implode(', ', $parameters));
    }
}
