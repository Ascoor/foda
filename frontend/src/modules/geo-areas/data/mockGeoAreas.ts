export type GeoStatus = 'covered' | 'uncovered' | 'high-priority';

export interface GeoDistrict {
  id: string;
  name: { en: string; ar: string };
  status: GeoStatus;
  stats: {
    voters: number;
    volunteers: number;
    committees: number;
  };
  coordinates: [number, number][]; // Polygon coordinates
}

const square = (lat: number, lng: number, size = 0.1): [number, number][] => [
  [lat - size, lng - size],
  [lat - size, lng + size],
  [lat + size, lng + size],
  [lat + size, lng - size],
];

export const mockGeoDistricts: GeoDistrict[] = [
  {
    id: 'north',
    name: { en: 'North District', ar: 'المنطقة الشمالية' },
    status: 'covered',
    stats: { voters: 12000, volunteers: 150, committees: 10 },
    coordinates: square(25.0, 46.7),
  },
  {
    id: 'south',
    name: { en: 'South District', ar: 'المنطقة الجنوبية' },
    status: 'uncovered',
    stats: { voters: 9500, volunteers: 80, committees: 8 },
    coordinates: square(24.4, 46.7),
  },
  {
    id: 'east',
    name: { en: 'East District', ar: 'المنطقة الشرقية' },
    status: 'high-priority',
    stats: { voters: 15000, volunteers: 200, committees: 12 },
    coordinates: square(24.7, 47.0),
  },
  {
    id: 'west',
    name: { en: 'West District', ar: 'المنطقة الغربية' },
    status: 'covered',
    stats: { voters: 11000, volunteers: 120, committees: 9 },
    coordinates: square(24.7, 46.4),
  },
  {
    id: 'central',
    name: { en: 'Central District', ar: 'المنطقة الوسطى' },
    status: 'covered',
    stats: { voters: 18000, volunteers: 250, committees: 15 },
    coordinates: square(24.7, 46.7, 0.05),
  },
  {
    id: 'north-east',
    name: { en: 'North East', ar: 'الشمال الشرقي' },
    status: 'uncovered',
    stats: { voters: 8000, volunteers: 60, committees: 6 },
    coordinates: square(25.0, 47.0),
  },
  {
    id: 'south-east',
    name: { en: 'South East', ar: 'الجنوب الشرقي' },
    status: 'covered',
    stats: { voters: 7000, volunteers: 55, committees: 5 },
    coordinates: square(24.4, 47.0),
  },
  {
    id: 'south-west',
    name: { en: 'South West', ar: 'الجنوب الغربي' },
    status: 'high-priority',
    stats: { voters: 6000, volunteers: 40, committees: 4 },
    coordinates: square(24.4, 46.4),
  },
];

export default mockGeoDistricts;
