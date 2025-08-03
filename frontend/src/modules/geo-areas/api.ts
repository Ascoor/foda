import { GeoArea } from './types';

// Mock data for development
export const mockGeoAreas: GeoArea[] = [
  {
    id: '1',
    name: 'Cairo',
    parent_id: null,
    type: 'governorate',
    total_voters: 125420,
    total_committees: 156,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    children_count: 12
  },
  {
    id: '2',
    name: 'Nasr City',
    parent_id: '1',
    type: 'district',
    total_voters: 45230,
    total_committees: 45,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    parent_name: 'Cairo',
    children_count: 8
  },
  {
    id: '3',
    name: 'New Cairo',
    parent_id: '1',
    type: 'city',
    total_voters: 32150,
    total_committees: 35,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    parent_name: 'Cairo',
    children_count: 5
  },
  {
    id: '4',
    name: 'Alexandria',
    parent_id: null,
    type: 'governorate',
    total_voters: 98750,
    total_committees: 120,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    children_count: 15
  },
  {
    id: '5',
    name: 'Montazah',
    parent_id: '4',
    type: 'district',
    total_voters: 28900,
    total_committees: 32,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    parent_name: 'Alexandria',
    children_count: 6
  }
];

// API simulation functions
export const fetchGeoAreas = async (): Promise<GeoArea[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockGeoAreas;
};

export const createGeoArea = async (data: Omit<GeoArea, 'id' | 'created_at' | 'updated_at'>): Promise<GeoArea> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newArea: GeoArea = {
    ...data,
    id: Math.random().toString(36).substr(2, 9),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  return newArea;
};

export const updateGeoArea = async (id: string, data: Partial<GeoArea>): Promise<GeoArea> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const existing = mockGeoAreas.find(area => area.id === id);
  if (!existing) throw new Error('Area not found');
  
  return {
    ...existing,
    ...data,
    updated_at: new Date().toISOString(),
  };
};

export const deleteGeoArea = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  // In real implementation, this would call the API
};