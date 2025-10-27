# FODA - Election Management System

A comprehensive election management system built with React + TypeScript frontend and Laravel backend.

> Version synced with backend schema as of 2025-10-14.


## 🏗️ Architecture Overview

### Frontend (React + TypeScript + Vite)
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.1
- **UI Library**: Radix UI + Tailwind CSS + shadcn/ui
- **State Management**: React Context + TanStack Query
- **Routing**: React Router v6
- **Internationalization**: i18next (Arabic/English)
- **Animations**: Framer Motion
- **Maps**: Leaflet + React Leaflet

### Backend (Laravel 8)
- **Framework**: Laravel 8.75
- **Authentication**: Laravel Sanctum
- **Authorization**: Spatie Laravel Permission
- **API**: RESTful API with v1 versioning
- **Database**: MySQL/PostgreSQL (configurable)

## 📁 Project Structure

```
foda/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── auth/         # Authentication components
│   │   │   ├── dashboard/    # Dashboard-specific components
│   │   │   ├── geo-areas/    # Geographic area components
│   │   │   ├── layout/       # Layout components (Header, Sidebar, etc.)
│   │   │   └── ui/           # Base UI components (shadcn/ui)
│   │   ├── contexts/         # React Context providers
│   │   │   ├── AuthContext.tsx      # Authentication state
│   │   │   ├── LanguageContext.tsx  # i18n state
│   │   │   └── ThemeContext.tsx     # Theme state
│   │   ├── hooks/            # Custom React hooks
│   │   ├── i18n/             # Internationalization config
│   │   ├── lib/              # Utility libraries
│   │   │   └── api.ts        # API client with caching
│   │   ├── modules/          # Feature modules
│   │   │   ├── agents/       # Election agents management
│   │   │   ├── analytics/    # Analytics and reporting
│   │   │   ├── campaigns/    # Campaign management
│   │   │   ├── candidates/   # Candidate management
│   │   │   ├── committees/   # Committee management
│   │   │   ├── dashboard/    # Main dashboard
│   │   │   ├── elections/    # Election management
│   │   │   ├── geo-areas/    # Geographic areas
│   │   │   ├── observations/ # Election observations
│   │   │   ├── settings/     # System settings
│   │   │   ├── volunteers/   # Volunteer management
│   │   │   └── voters/       # Voter management
│   │   ├── pages/            # Page components
│   │   │   ├── AuthRedirect.tsx
│   │   │   ├── Index.tsx
│   │   │   ├── Landing.tsx
│   │   │   ├── Login.tsx
│   │   │   └── NotFound.tsx
│   │   └── App.tsx           # Main application component
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # Laravel backend application
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   ├── Api/V1/       # API v1 controllers
│   │   │   └── ElectionCircle/ # Election circle controllers
│   │   ├── Models/           # Eloquent models
│   │   └── Policies/         # Authorization policies
│   ├── database/
│   │   ├── migrations/       # Database migrations
│   │   └── seeders/          # Database seeders
│   ├── routes/
│   │   ├── api.php           # API routes
│   │   └── web.php           # Web routes
│   └── composer.json
└── start.sh                  # Development startup script
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PHP 8.0+
- Composer
- MySQL/PostgreSQL

### Development Setup

1. **Start both frontend and backend:**
   ```bash
   ./start.sh
   ```

2. **Or start individually:**
   ```bash
   # Backend (Laravel)
   cd backend
   composer install
   php artisan serve --port=8000

   # Frontend (React)
   cd frontend
   npm install
   npm run dev -- --port=8080
   ```

### Environment Variables

**Frontend (.env):**
```env
VITE_API_URL=http://127.0.0.1:8000
```

**Backend (.env):**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=foda
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:8080
```

## 🧹 Housekeeping

The repository has been streamlined by removing legacy documentation bundles and generated frontend artifacts (logs, bundle reports). Historical documentation is no longer shipped with the project; consult previous releases if you need the archival material.

## 🎯 Core Features

### 1. Authentication & Authorization
- **Login/Logout**: JWT-based authentication via Laravel Sanctum
- **Role-based Access**: Admin, User roles with permissions
- **Protected Routes**: Automatic redirection based on auth state
- **Token Management**: Automatic token injection and refresh

### 2. Dashboard
- **Real-time Stats**: Election statistics and progress tracking
- **Activity Feed**: Recent system activities
- **Progress Charts**: Visual progress indicators
- **Voter Turnout Map**: Geographic turnout visualization

### 3. Election Management
- **Election Creation**: Create and manage elections
- **Election Details**: Detailed election information
- **Status Tracking**: Real-time election status updates

### 4. Geographic Areas
- **Interactive Map**: Leaflet-based geographic visualization
- **Area Management**: Create, edit, delete geographic areas
- **Status Tracking**: Area-specific status and statistics
- **Search & Filter**: Advanced filtering capabilities

### 5. Voter Management
- **Voter Registration**: Register and manage voters
- **Import/Export**: CSV import/export functionality
- **Voter Details**: Comprehensive voter information
- **Search & Filter**: Advanced voter search

### 6. Candidate Management
- **Candidate Registration**: Register election candidates
- **Profile Management**: Detailed candidate profiles
- **Document Management**: Upload and manage documents

### 7. Committee Management
- **Committee Creation**: Create election committees
- **Member Assignment**: Assign members to committees
- **Role Management**: Define committee roles and permissions

### 8. Volunteer Management
- **Volunteer Registration**: Register and manage volunteers
- **Skill Tracking**: Track volunteer skills and specializations
- **Assignment Management**: Assign volunteers to committees
- **Export Functionality**: Export volunteer data

### 9. Agent Management
- **Agent Registration**: Register election agents
- **Assignment Tracking**: Track agent assignments
- **Performance Monitoring**: Monitor agent performance

### 10. Observation Management
- **Observation Creation**: Create election observations
- **Status Tracking**: Track observation status
- **Report Generation**: Generate observation reports

### 11. Campaign Management
- **Campaign Creation**: Create election campaigns
- **Resource Management**: Manage campaign resources
- **Progress Tracking**: Track campaign progress

### 12. Analytics & Reporting
- **Real-time Analytics**: Live election analytics
- **Custom Reports**: Generate custom reports
- **Data Visualization**: Charts and graphs
- **Export Options**: Multiple export formats

### 13. Settings
- **System Configuration**: Configure system settings
- **User Preferences**: User-specific settings
- **Theme Management**: Light/dark theme support
- **Language Settings**: Arabic/English support

## 🔧 Technical Implementation

### Frontend Architecture

#### State Management
- **Context API**: Global state for auth, theme, language
- **TanStack Query**: Server state management and caching
- **Local State**: Component-level state with useState/useReducer

#### Component Structure
- **Atomic Design**: Components organized by complexity
- **Compound Components**: Complex UI patterns
- **Custom Hooks**: Reusable logic extraction
- **Error Boundaries**: Graceful error handling

#### API Integration
- **Axios**: HTTP client with interceptors
- **Request Caching**: Built-in caching mechanism
- **Error Handling**: Global error handling
- **Loading States**: Consistent loading patterns

#### Routing
- **React Router v6**: Declarative routing
- **Protected Routes**: Authentication-based routing
- **Nested Routes**: Complex route hierarchies
- **Route Guards**: Permission-based access control

## 🗺️ Frontend Logic Mapping

### Application Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FODA Frontend Flow                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌──────────────┐    ┌─────────────────┐    │
│  │   main.tsx  │───▶│   App.tsx    │───▶│  AuthRedirect   │    │
│  │             │    │              │    │                 │    │
│  └─────────────┘    └──────────────┘    └─────────────────┘    │
│         │                   │                      │            │
│         │                   │                      ▼            │
│         │                   │              ┌──────────────┐    │
│         │                   │              │   Landing    │    │
│         │                   │              │   (Public)   │    │
│         │                   │              └──────────────┘    │
│         │                   │                      │            │
│         │                   │                      ▼            │
│         │                   │              ┌──────────────┐    │
│         │                   │              │    Login     │    │
│         │                   │              │   (Public)   │    │
│         │                   │              └──────────────┘    │
│         │                   │                      │            │
│         │                   │                      ▼            │
│         │                   │              ┌──────────────┐    │
│         │                   │              │ ProtectedRoute│    │
│         │                   │              │   (Guard)    │    │
│         │                   │              └──────────────┘    │
│         │                   │                      │            │
│         │                   │                      ▼            │
│         │                   │              ┌──────────────┐    │
│         │                   │              │  MainLayout  │    │
│         │                   │              │  (Wrapper)   │    │
│         │                   │              └──────────────┘    │
│         │                   │                      │            │
│         │                   │                      ▼            │
│         │                   │              ┌──────────────┐    │
│         │                   │              │   Modules    │    │
│         │                   │              │  (Features)  │    │
│         │                   │              └──────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Context Provider Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                    Context Provider Tree                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                QueryClientProvider                      │    │
│  │                                                         │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │                AuthProvider                     │    │    │
│  │  │                                                 │    │    │
│  │  │  ┌─────────────────────────────────────────┐    │    │    │
│  │  │  │            ThemeProvider                │    │    │    │
│  │  │  │                                         │    │    │    │
│  │  │  │  ┌─────────────────────────────────┐    │    │    │    │
│  │  │  │  │        LanguageProvider         │    │    │    │    │
│  │  │  │  │                                 │    │    │    │    │
│  │  │  │  │  ┌─────────────────────────┐    │    │    │    │    │
│  │  │  │  │  │    TooltipProvider      │    │    │    │    │    │
│  │  │  │  │  │                         │    │    │    │    │    │
│  │  │  │  │  │  ┌─────────────────┐    │    │    │    │    │    │
│  │  │  │  │  │  │   BrowserRouter │    │    │    │    │    │    │
│  │  │  │  │  │  │                 │    │    │    │    │    │    │
│  │  │  │  │  │  │  ┌───────────┐  │    │    │    │    │    │    │
│  │  │  │  │  │  │  │   Routes  │  │    │    │    │    │    │    │
│  │  │  │  │  │  │  │           │  │    │    │    │    │    │    │
│  │  │  │  │  │  │  └───────────┘  │    │    │    │    │    │    │
│  │  │  │  │  │  └─────────────────┘    │    │    │    │    │    │
│  │  │  │  │  └─────────────────────────┘    │    │    │    │    │
│  │  │  │  └─────────────────────────────────┘    │    │    │    │
│  │  │  └─────────────────────────────────────────┘    │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Component Architecture Patterns

#### 1. Module Structure Pattern
```
modules/
├── {module-name}/
│   ├── components/           # Module-specific components
│   │   ├── {Module}List.tsx     # List view component
│   │   ├── {Module}Form.tsx     # Create/Edit form
│   │   ├── {Module}Details.tsx  # Detail view
│   │   └── {Module}Card.tsx     # Card component
│   ├── api/                 # API functions
│   │   └── {module}Api.ts
│   ├── types/               # TypeScript types
│   │   └── {module}Types.ts
│   ├── hooks/               # Custom hooks
│   │   └── use{Module}.ts
│   ├── data/                # Mock data (if needed)
│   │   └── mock{Module}.ts
│   └── README.md            # Module documentation
```

#### 2. Component Composition Pattern
```
┌─────────────────────────────────────────────────────────────────┐
│                    Component Composition                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                Page Component                           │    │
│  │  (e.g., Dashboard, VotersList, CandidatesList)         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                 │
│                              ▼                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Layout Components                          │    │
│  │  (MainLayout, Header, Sidebar, Navigation)             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                 │
│                              ▼                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Feature Components                         │    │
│  │  (StatsCard, DataTable, Form, Modal)                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                 │
│                              ▼                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                UI Components                            │    │
│  │  (Button, Input, Select, Card, etc.)                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Patterns

#### 1. Authentication Flow
```
┌─────────────────────────────────────────────────────────────────┐
│                    Authentication Flow                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  User Login Request                                             │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────┐    ┌──────────────┐    ┌─────────────────┐    │
│  │ LoginForm   │───▶│ AuthContext  │───▶│   API Client    │    │
│  │             │    │              │    │                 │    │
│  └─────────────┘    └──────────────┘    └─────────────────┘    │
│         │                   │                      │            │
│         │                   │                      ▼            │
│         │                   │              ┌──────────────┐    │
│         │                   │              │   Backend    │    │
│         │                   │              │   /login     │    │
│         │                   │              └──────────────┘    │
│         │                   │                      │            │
│         │                   │                      ▼            │
│         │                   │              ┌──────────────┐    │
│         │                   │              │   Token      │    │
│         │                   │              │  Response    │    │
│         │                   │              └──────────────┘    │
│         │                   │                      │            │
│         │                   │                      ▼            │
│         │                   │              ┌──────────────┐    │
│         │                   │              │ Store Token  │    │
│         │                   │              │ & Redirect   │    │
│         │                   │              └──────────────┘    │
│         │                   │                      │            │
│         │                   │                      ▼            │
│         │                   │              ┌──────────────┐    │
│         │                   │              │  Dashboard   │    │
│         │                   │              │   (Protected)│    │
│         │                   │              └──────────────┘    │
│         │                   │                                 │
│         ▼                   ▼                                 │
│  ┌─────────────┐    ┌──────────────┐                          │
│  │   Success   │    │   Error      │                          │
│  │  Feedback   │    │  Handling    │                          │
│  └─────────────┘    └──────────────┘                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 2. API Data Flow
```
┌─────────────────────────────────────────────────────────────────┐
│                      API Data Flow                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Component Request                                              │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────┐    ┌──────────────┐    ┌─────────────────┐    │
│  │   useApi    │───▶│   api.ts     │───▶│  Axios Client   │    │
│  │   Hook      │    │              │    │                 │    │
│  └─────────────┘    └──────────────┘    └─────────────────┘    │
│         │                   │                      │            │
│         │                   │                      ▼            │
│         │                   │              ┌──────────────┐    │
│         │                   │              │  Request     │    │
│         │                   │              │ Interceptor  │    │
│         │                   │              └──────────────┘    │
│         │                   │                      │            │
│         │                   │                      ▼            │
│         │                   │              ┌──────────────┐    │
│         │                   │              │   Backend    │    │
│         │                   │              │   API        │    │
│         │                   │              └──────────────┘    │
│         │                   │                      │            │
│         │                   │                      ▼            │
│         │                   │              ┌──────────────┐    │
│         │                   │              │  Response    │    │
│         │                   │              │ Interceptor  │    │
│         │                   │              └──────────────┘    │
│         │                   │                      │            │
│         │                   │                      ▼            │
│         │                   │              ┌──────────────┐    │
│         │                   │              │   Cache      │    │
│         │                   │              │  (Optional)  │    │
│         │                   │              └──────────────┘    │
│         │                   │                      │            │
│         │                   │                      ▼            │
│         │                   │              ┌──────────────┐    │
│         │                   │              │   Component  │    │
│         │                   │              │   State      │    │
│         │                   │              └──────────────┘    │
│         │                   │                                 │
│         ▼                   ▼                                 │
│  ┌─────────────┐    ┌──────────────┐                          │
│  │   Loading   │    │   Error      │                          │
│  │   State     │    │   State      │                          │
│  └─────────────┘    └──────────────┘                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Module-Specific Logic Mapping

#### Dashboard Module
```
┌─────────────────────────────────────────────────────────────────┐
│                    Dashboard Module Logic                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                Dashboard.tsx                            │    │
│  │                                                         │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │              useApi Hook                        │    │    │
│  │  │  - Fetches /dashboard endpoint                  │    │    │
│  │  │  - Manages loading/error states                 │    │    │
│  │  │  - Implements request deduplication             │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  │                                                         │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │              Data Processing                    │    │    │
│  │  │  - Transforms API response                      │    │    │
│  │  │  - Maps stats to UI components                  │    │    │
│  │  │  - Handles empty/error states                   │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  │                                                         │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │              UI Components                      │    │    │
│  │  │  - StatsCard (4 cards)                         │    │    │
│  │  │  - ProgressChart (visualization)               │    │    │
│  │  │  - ActivityFeed (recent activities)            │    │    │
│  │  │  - VoterTurnoutMap (geographic data)           │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

#### Voters Module
```
┌─────────────────────────────────────────────────────────────────┐
│                    Voters Module Logic                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                VotersList.tsx                          │    │
│  │                                                         │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │              State Management                   │    │    │
│  │  │  - items: Voter[]                              │    │    │
│  │  │  - filters: VoterFilters                       │    │    │
│  │  │  - loading: boolean                            │    │    │
│  │  │  - error: boolean                              │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  │                                                         │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │              Data Operations                    │    │    │
│  │  │  - load(): fetch voters                        │    │    │
│  │  │  - handleAdd(): create new voter               │    │    │
│  │  │  - handleEdit(): edit existing voter           │    │    │
│  │  │  - handleDelete(): remove voter                │    │    │
│  │  │  - handleExport(): export to CSV               │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  │                                                         │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │              UI Components                      │    │    │
│  │  │  - SearchBar (filter by name/ID)               │    │    │
│  │  │  - FilterControls (status, area filters)       │    │    │
│  │  │  - DataTable (voter list with actions)         │    │    │
│  │  │  - Pagination (page navigation)                │    │    │
│  │  │  - ActionButtons (view, edit, delete)          │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### State Management Patterns

#### 1. Context Pattern
```typescript
// Context Definition
interface AuthContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Context Provider
export const AuthProvider = ({ children }: Props) => {
  const [token, setToken] = useState<string | null>(() =>
    typeof window !== 'undefined' ? localStorage.getItem('token') : null
  );

  const login = async (email: string, password: string) => {
    // API call and token management
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Context Consumer
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
```

#### 2. Custom Hook Pattern
```typescript
// API Hook
export function useApi<T = any>(
  config: AxiosRequestConfig,
  options: { useCache?: boolean; ttl?: number } = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(
    async (overrideConfig?: AxiosRequestConfig) => {
      setLoading(true);
      setError(null);
      try {
        const result = await request<T>({ ...config, ...overrideConfig }, options);
        setData(result);
        return result;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [config, options]
  );

  return { data, error, loading, execute };
}
```

### Error Handling Patterns

#### 1. Component-Level Error Handling
```typescript
// Error Boundary
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

#### 2. API Error Handling
```typescript
// API Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Performance Optimization Patterns

#### 1. Memoization
```typescript
// Component Memoization
const StatsCard = React.memo(({ title, value, change, trend, icon, color }: StatsCardProps) => {
  return (
    <div className="glass-card p-6">
      {/* Component content */}
    </div>
  );
});

// Value Memoization
const statsData = useMemo(() => 
  statConfig.map((s) => ({
    title: `dashboard.${s.key}`,
    value: data?.stats?.[s.key]?.value?.toString() ?? '0',
    change: data?.stats?.[s.key]?.change ?? '0%',
    trend: (data?.stats?.[s.key]?.trend ?? 'up') as 'up' | 'down',
    icon: s.icon,
    color: s.color,
  })), [data?.stats]
);
```

#### 2. Lazy Loading
```typescript
// Route-based Code Splitting
const Dashboard = lazy(() => import('@/modules/dashboard/Dashboard'));
const VotersList = lazy(() => import('@/modules/voters/List'));

// Component Lazy Loading
const LazyComponent = lazy(() => import('./HeavyComponent'));
```

### Internationalization Patterns

#### 1. Translation Hook
```typescript
// Language Context
export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const { i18n, t } = useTranslation();
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('language');
    return (stored as Language) || 'ar';
  });

  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', language);
    localStorage.setItem('language', language);
  }, [language, direction, i18n]);

  return (
    <LanguageContext.Provider value={{ language, direction, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
```

#### 2. RTL Support
```typescript
// RTL-aware styling
const isRTL = direction === 'rtl';
const textAlign = isRTL ? 'text-right' : 'text-left';
const marginStart = isRTL ? 'mr-4' : 'ml-4';
const marginEnd = isRTL ? 'ml-4' : 'mr-4';
```

### Backend Architecture

#### API Design
- **RESTful API**: Standard REST conventions
- **Versioning**: API versioning with v1 prefix
- **Resource Controllers**: Laravel resource controllers
- **API Resources**: Consistent response formatting

#### Authentication
- **Laravel Sanctum**: Token-based authentication
- **Middleware**: Authentication and authorization middleware
- **Role-based Access**: Spatie permission package

#### Database
- **Migrations**: Version-controlled database schema
- **Seeders**: Sample data generation
- **Factories**: Model factories for testing
- **Relationships**: Eloquent relationships

## 🌐 Internationalization

### Supported Languages
- **Arabic (ar)**: RTL support with proper text direction
- **English (en)**: LTR support

### Implementation
- **i18next**: Internationalization framework
- **Language Detection**: Automatic language detection
- **Dynamic Loading**: Lazy-loaded translations
- **Context Integration**: Language context provider

## 🎨 UI/UX Design

### Design System
- **shadcn/ui**: Modern component library
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Framer Motion**: Smooth animations

### Theme Support
- **Light Theme**: Clean, professional appearance
- **Dark Theme**: Modern dark mode
- **System Theme**: Automatic theme detection
- **Theme Persistence**: User preference storage

### Responsive Design
- **Mobile First**: Mobile-optimized design
- **Breakpoints**: Responsive breakpoints
- **Flexible Layouts**: Adaptive layouts
- **Touch Friendly**: Touch-optimized interactions

## 🔒 Security Features

### Frontend Security
- **XSS Protection**: Input sanitization
- **CSRF Protection**: CSRF token validation
- **Secure Storage**: Secure token storage
- **Input Validation**: Client-side validation

### Backend Security
- **Authentication**: Secure authentication system
- **Authorization**: Role-based access control
- **Input Validation**: Server-side validation
- **SQL Injection**: Parameterized queries
- **CORS**: Cross-origin resource sharing

## 🧪 Testing

### Frontend Testing
- **Vitest**: Unit testing framework
- **Testing Library**: Component testing
- **Jest DOM**: DOM testing utilities
- **Mock Service Worker**: API mocking

### Backend Testing
- **PHPUnit**: Unit testing framework
- **Feature Tests**: API endpoint testing
- **Database Testing**: Database interaction testing
- **Mocking**: Service mocking

## 📊 Performance Optimization

### Frontend Optimizations
- **Code Splitting**: Dynamic imports
- **Lazy Loading**: Component lazy loading
- **Memoization**: React.memo and useMemo
- **Bundle Optimization**: Vite optimizations
- **Image Optimization**: Optimized images

### Backend Optimizations
- **Query Optimization**: Efficient database queries
- **Caching**: Redis caching
- **API Caching**: Response caching
- **Database Indexing**: Optimized indexes

## 🚀 Deployment

### Frontend Deployment
- **Build Process**: Vite production build
- **Static Hosting**: CDN deployment
- **Environment Variables**: Production configuration
- **Asset Optimization**: Minified assets

### Backend Deployment
- **Laravel Deployment**: Standard Laravel deployment
- **Database Migration**: Production database setup
- **Environment Configuration**: Production settings
- **SSL Configuration**: HTTPS setup

## 🔧 Development Tools

### Frontend Tools
- **Vite**: Fast build tool
- **ESLint**: Code linting
- **TypeScript**: Type checking
- **Prettier**: Code formatting

### Backend Tools
- **Artisan**: Laravel command-line tool
- **Composer**: Dependency management
- **PHP CS Fixer**: Code formatting
- **Laravel Telescope**: Debugging tool

## 📝 API Documentation

### Authentication Endpoints
```
POST /api/v1/login          # User login
POST /api/v1/logout         # User logout
POST /api/v1/register       # User registration
GET  /api/v1/profile        # Get user profile
PUT  /api/v1/profile        # Update user profile
```

### Core Endpoints
```
GET  /api/v1/dashboard      # Dashboard data
GET  /api/v1/home           # Home data (alias for dashboard)
GET  /api/v1/areas          # Geographic areas
GET  /api/v1/elections      # Elections
GET  /api/v1/voters         # Voters
GET  /api/v1/candidates     # Candidates
GET  /api/v1/committees     # Committees
GET  /api/v1/volunteers     # Volunteers
GET  /api/v1/agents         # Agents
```

### Election Circle Endpoints
```
GET  /api/ec/elections      # Election circle elections
GET  /api/ec/geo-areas      # Election circle areas
GET  /api/ec/committees     # Election circle committees
GET  /api/ec/candidates     # Election circle candidates
GET  /api/ec/voters         # Election circle voters
GET  /api/ec/agents         # Election circle agents
GET  /api/ec/volunteers     # Election circle volunteers
GET  /api/ec/observations   # Election observations
GET  /api/ec/campaigns      # Election campaigns
```

## 🐛 Known Issues & Fixes

### Fixed Issues
1. **Dashboard 404 Error**: Fixed by adding `/dashboard` alias route
2. **Multiple API Requests**: Fixed with useRef guard in Dashboard component
3. **Token Storage**: Fixed token injection timing for immediate navigation
4. **Duplicate Dependencies**: Removed duplicate `leaflet` entry in package.json

### Current Issues
1. **Authentication Flow**: Some edge cases in token refresh
2. **Error Handling**: Inconsistent error handling across modules
3. **Loading States**: Some components lack proper loading states
4. **Type Safety**: Some API responses lack proper typing

## 🔮 Future Enhancements

### Planned Features
1. **Real-time Updates**: WebSocket integration
2. **Advanced Analytics**: More detailed reporting
3. **Mobile App**: React Native mobile application
4. **Offline Support**: Progressive Web App features
5. **Advanced Security**: Two-factor authentication
6. **Audit Logging**: Comprehensive audit trails
7. **API Rate Limiting**: Request rate limiting
8. **Advanced Caching**: Redis integration

### Technical Improvements
1. **Microservices**: Service-oriented architecture
2. **Containerization**: Docker deployment
3. **CI/CD**: Automated deployment pipeline
4. **Monitoring**: Application performance monitoring
5. **Testing**: Comprehensive test coverage
6. **Documentation**: API documentation with Swagger

## 📞 Support

For technical support or questions:
- **Documentation**: Check this README and inline code comments
- **Issues**: Report issues in the project repository
- **Development**: Follow the development guidelines

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**FODA Election Management System** - Built with ❤️ for transparent and efficient election management.
