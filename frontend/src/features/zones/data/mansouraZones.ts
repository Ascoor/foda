import type { Polygon } from "geojson";
import type { ElectoralZone } from "../types";

const createSquarePolygon = (
  lat: number,
  lng: number,
  offset = 0.01,
): Polygon => ({
  type: "Polygon",
  coordinates: [
    [
      [lng - offset, lat - offset],
      [lng + offset, lat - offset],
      [lng + offset, lat + offset],
      [lng - offset, lat + offset],
      [lng - offset, lat - offset],
    ],
  ],
});

export const mansouraZones: ElectoralZone[] = [
  {
    id: "north",
    name: "المنطقة الشمالية",
    status: "مغطاة",
    voters: 12000,
    volunteers: 150,
    committees: 10,
    geometry: createSquarePolygon(31.065, 31.378, 0.012),
  },
  {
    id: "south",
    name: "المنطقة الجنوبية",
    status: "غير مغطاة",
    voters: 9500,
    volunteers: 80,
    committees: 8,
    geometry: createSquarePolygon(31.01, 31.378, 0.0115),
  },
  {
    id: "east",
    name: "المنطقة الشرقية",
    status: "أولوية قصوى",
    voters: 15000,
    volunteers: 200,
    committees: 12,
    geometry: createSquarePolygon(31.04, 31.415, 0.0125),
  },
  {
    id: "west",
    name: "المنطقة الغربية",
    status: "مغطاة",
    voters: 11000,
    volunteers: 120,
    committees: 9,
    geometry: createSquarePolygon(31.04, 31.34, 0.012),
  },
  {
    id: "center",
    name: "المنطقة الوسطى",
    status: "مغطاة",
    voters: 18000,
    volunteers: 250,
    committees: 15,
    geometry: createSquarePolygon(31.043, 31.382, 0.0095),
  },
  {
    id: "northeast",
    name: "الشمال الشرقي",
    status: "غير مغطاة",
    voters: 8000,
    volunteers: 60,
    committees: 6,
    geometry: createSquarePolygon(31.075, 31.41, 0.01),
  },
  {
    id: "southeast",
    name: "الجنوب الشرقي",
    status: "مغطاة",
    voters: 7000,
    volunteers: 55,
    committees: 5,
    geometry: createSquarePolygon(31.02, 31.41, 0.0095),
  },
  {
    id: "southwest",
    name: "الجنوب الغربي",
    status: "أولوية قصوى",
    voters: 6000,
    volunteers: 40,
    committees: 4,
    geometry: createSquarePolygon(31.015, 31.345, 0.009),
  },
];
