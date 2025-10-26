export interface GeoAreaData {
  id: string;
  name: string;
  nameEn: string;
  type: "governorate" | "district" | "city" | "village";
  parentId?: string;
  coordinates: {
    lat: number;
    lng: number;
    bounds?: {
      north: number;
      south: number;
      east: number;
      west: number;
    };
  };
  stats: {
    totalVoters: number;
    registeredVoters: number;
    activeVolunteers: number;
    committees: number;
    coverage: number; // percentage
  };
  campaignStatus: "covered" | "pending" | "high-priority" | "uncovered";
  color: string;
  description?: string;
  children?: string[];
}

export const mockGeoAreas: GeoAreaData[] = [
  {
    id: "1",
    name: "محافظة القاهرة",
    nameEn: "Cairo Governorate",
    type: "governorate",
    coordinates: {
      lat: 30.0444,
      lng: 31.2357,
      bounds: {
        north: 30.2,
        south: 29.8,
        east: 31.5,
        west: 31.0,
      },
    },
    stats: {
      totalVoters: 5678432,
      registeredVoters: 4876543,
      activeVolunteers: 234,
      committees: 1250,
      coverage: 85,
    },
    campaignStatus: "covered",
    color: "#22c55e",
    description: "العاصمة الإدارية ومركز النشاط السياسي",
    children: ["2", "3"],
  },
  {
    id: "2",
    name: "مدينة نصر",
    nameEn: "Nasr City",
    type: "district",
    parentId: "1",
    coordinates: {
      lat: 30.0626,
      lng: 31.3219,
      bounds: {
        north: 30.1,
        south: 30.0,
        east: 31.4,
        west: 31.2,
      },
    },
    stats: {
      totalVoters: 876543,
      registeredVoters: 754321,
      activeVolunteers: 45,
      committees: 187,
      coverage: 92,
    },
    campaignStatus: "covered",
    color: "#22c55e",
  },
  {
    id: "3",
    name: "المعادي",
    nameEn: "Maadi",
    type: "district",
    parentId: "1",
    coordinates: {
      lat: 29.9602,
      lng: 31.2569,
      bounds: {
        north: 30.0,
        south: 29.9,
        east: 31.3,
        west: 31.2,
      },
    },
    stats: {
      totalVoters: 432156,
      registeredVoters: 398765,
      activeVolunteers: 23,
      committees: 98,
      coverage: 78,
    },
    campaignStatus: "pending",
    color: "#f59e0b",
  },
  {
    id: "4",
    name: "محافظة الجيزة",
    nameEn: "Giza Governorate",
    type: "governorate",
    coordinates: {
      lat: 30.0131,
      lng: 31.2089,
      bounds: {
        north: 30.3,
        south: 29.7,
        east: 31.0,
        west: 30.5,
      },
    },
    stats: {
      totalVoters: 3456789,
      registeredVoters: 2987654,
      activeVolunteers: 156,
      committees: 892,
      coverage: 67,
    },
    campaignStatus: "high-priority",
    color: "#ef4444",
    children: ["5", "6"],
  },
  {
    id: "5",
    name: "الدقي",
    nameEn: "Dokki",
    type: "district",
    parentId: "4",
    coordinates: {
      lat: 30.0386,
      lng: 31.2123,
      bounds: {
        north: 30.1,
        south: 30.0,
        east: 31.3,
        west: 31.1,
      },
    },
    stats: {
      totalVoters: 287654,
      registeredVoters: 234567,
      activeVolunteers: 18,
      committees: 76,
      coverage: 54,
    },
    campaignStatus: "high-priority",
    color: "#ef4444",
  },
  {
    id: "6",
    name: "الهرم",
    nameEn: "Haram",
    type: "district",
    parentId: "4",
    coordinates: {
      lat: 29.9893,
      lng: 31.1708,
      bounds: {
        north: 30.0,
        south: 29.9,
        east: 31.2,
        west: 31.1,
      },
    },
    stats: {
      totalVoters: 654321,
      registeredVoters: 543210,
      activeVolunteers: 32,
      committees: 143,
      coverage: 71,
    },
    campaignStatus: "pending",
    color: "#f59e0b",
  },
  {
    id: "7",
    name: "محافظة الإسكندرية",
    nameEn: "Alexandria Governorate",
    type: "governorate",
    coordinates: {
      lat: 31.2001,
      lng: 29.9187,
      bounds: {
        north: 31.4,
        south: 31.0,
        east: 30.2,
        west: 29.7,
      },
    },
    stats: {
      totalVoters: 2345678,
      registeredVoters: 1987654,
      activeVolunteers: 89,
      committees: 567,
      coverage: 43,
    },
    campaignStatus: "uncovered",
    color: "#94a3b8",
    children: ["8"],
  },
  {
    id: "8",
    name: "المنتزه",
    nameEn: "Montaza",
    type: "district",
    parentId: "7",
    coordinates: {
      lat: 31.2156,
      lng: 29.9543,
      bounds: {
        north: 31.3,
        south: 31.1,
        east: 30.0,
        west: 29.8,
      },
    },
    stats: {
      totalVoters: 345678,
      registeredVoters: 287654,
      activeVolunteers: 12,
      committees: 89,
      coverage: 31,
    },
    campaignStatus: "uncovered",
    color: "#94a3b8",
  },
];

export const getCampaignStatusColor = (status: string) => {
  switch (status) {
    case "covered":
      return "#22c55e";
    case "pending":
      return "#f59e0b";
    case "high-priority":
      return "#ef4444";
    case "uncovered":
      return "#94a3b8";
    default:
      return "#6b7280";
  }
};

export const getCampaignStatusLabel = (status: string, isArabic: boolean) => {
  const labels = {
    covered: isArabic ? "مغطاة" : "Covered",
    pending: isArabic ? "قيد المعالجة" : "Pending",
    "high-priority": isArabic ? "أولوية عالية" : "High Priority",
    uncovered: isArabic ? "غير مغطاة" : "Uncovered",
  };
  return labels[status as keyof typeof labels] || status;
};
