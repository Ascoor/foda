<?php

namespace App\Services\External;

class GoogleMapsService
{
    public function buildInteractiveConfig(array $filters = []): array
    {
        $baseConfig = [
            'apiKey' => config('external.maps.key'),
            'mapType' => $filters['map_type'] ?? config('external.maps.default_map_type'),
            'zoom' => (int) ($filters['zoom'] ?? config('external.maps.default_zoom')),
        ];

        return array_merge($baseConfig, [
            'staticMapUrl' => $this->buildStaticMapUrl($filters, $baseConfig),
            'visibleLayers' => $this->resolveVisibleLayers($filters),
        ]);
    }

    private function buildStaticMapUrl(array $filters, array $baseConfig): string
    {
        $baseUrl = rtrim((string) config('external.maps.base_url'), '/') . '/staticmap';
        $params = [
            'key' => $baseConfig['apiKey'],
            'maptype' => $baseConfig['mapType'],
            'zoom' => $baseConfig['zoom'],
            'size' => $filters['size'] ?? '640x360',
            'center' => $filters['center'] ?? null,
        ];

        if (! empty($filters['markers']) && is_array($filters['markers'])) {
            $params['markers'] = $this->formatMarkers($filters['markers']);
        }

        $params = array_filter($params);

        return $baseUrl . '?' . http_build_query($params);
    }

    private function formatMarkers(array $markers): string
    {
        $formatted = array_map(function ($marker) {
            if (is_string($marker)) {
                return $marker;
            }

            $lat = $marker['lat'] ?? $marker['latitude'] ?? null;
            $lng = $marker['lng'] ?? $marker['longitude'] ?? null;
            $label = $marker['label'] ?? null;

            $parts = [];
            if ($label) {
                $parts[] = 'label:' . $label;
            }

            if ($lat !== null && $lng !== null) {
                $parts[] = sprintf('%s,%s', $lat, $lng);
            }

            return implode('|', $parts);
        }, $markers);

        return implode('|', $formatted);
    }

    private function resolveVisibleLayers(array $filters): array
    {
        $layers = $filters['visible_layers'] ?? [];

        if (is_string($layers)) {
            $layers = array_map('trim', explode(',', $layers));
        }

        return array_values(array_filter((array) $layers));
    }
}
