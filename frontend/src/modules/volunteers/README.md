# Volunteers Module

The Volunteers module manages volunteer registration, assignment, and coordination for election campaigns.

## Features

- **Volunteer Management**: Create, read, update, delete volunteers
- **Committee Assignment**: Assign volunteers to specific committees
- **Skills Tracking**: Track volunteer skills and specializations
- **Safe Data Handling**: Robust error handling and loading states
- **Export Functionality**: Export volunteer data to CSV

## Components

### VolunteersList.tsx
Main list component with:
- Search and filtering capabilities
- Safe data rendering with loading/error states
- Action buttons (view, edit, assign, delete)
- Committee assignment functionality
- Export to CSV feature

### VolunteerForm.tsx
Form component for creating/editing volunteers:
- Name, role, and committee selection
- Form validation
- Success/error feedback

### VolunteerDetails.tsx
Detail view component:
- Display volunteer information
- Edit functionality
- Modal dialog interface

## API Endpoints

### Mock Data (Current)
```typescript
GET /volunteers - Fetch volunteers with filters
POST /volunteers - Create volunteer
PUT /volunteers/:id - Update volunteer
DELETE /volunteers/:id - Delete volunteer
POST /volunteers/:id/assign - Assign to committee
```

## Types

```typescript
interface Volunteer {
  id: string;
  name: string;
  role: string;
  committee_id?: string | null;
  committee_name?: string;
}

interface VolunteerFilters {
  role?: string;
  committee_id?: string;
}
```

## Usage

```tsx
import { VolunteersList } from './VolunteersList';

function VolunteersPage() {
  return <VolunteersList />;
}
```

## Safe Data Handling

- Uses `safeArray()` utility for safe array operations
- Implements loading, error, and empty states
- Graceful error handling with user feedback
- Retry functionality on API failures

## Styling

- Glass morphism design with gradient accents
- Responsive layout for mobile/desktop
- Hover effects and smooth transitions
- Theme-aware styling (dark/light mode)

## Testing

Unit tests cover:
- Component rendering
- User interactions
- API integration
- Error scenarios
- Data safety