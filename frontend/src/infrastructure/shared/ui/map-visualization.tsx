import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Map, MapPin, Layers, Search, Filter } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Badge } from "./badge";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { GeoArea } from "@/features/modules/geo-areas/types";
import { safeArray } from "@/infrastructure/shared/lib/safeData";

interface MapVisualizationProps {
  geoAreas: GeoArea[];
  onAreaClick?: (area: GeoArea) => void;
  className?: string;
}

// Mock map component (replace with actual map library)
const MapContainer = ({
  areas,
  onAreaClick,
}: {
  areas: GeoArea[];
  onAreaClick?: (area: GeoArea) => void;
}) => {
  const [selectedArea, setSelectedArea] = useState<GeoArea | null>(null);

  const getAreaColor = (area: GeoArea) => {
    switch (area.type) {
      case "governorate":
        return "bg-primary/20 border-primary";
      case "district":
        return "bg-secondary/20 border-secondary";
      case "city":
        return "bg-accent/20 border-accent";
      case "village":
        return "bg-success/20 border-success";
      default:
        return "bg-muted/20 border-muted";
    }
  };

  return (
    <div className="relative w-full h-96 glass-card overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />

      {/* Grid overlay for visual appeal */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="border border-current" />
          ))}
        </div>
      </div>

      {/* Area markers */}
      <div className="relative w-full h-full p-4">
        <div className="grid grid-cols-4 gap-4 h-full">
          {safeArray(areas).map((area, index) => (
            <motion.div
              key={area.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`
                relative cursor-pointer rounded-lg p-3 transition-all duration-300
                ${getAreaColor(area)}
                hover:scale-105 hover:shadow-lg hover:shadow-current/20
                ${selectedArea?.id === area.id ? "ring-2 ring-current" : ""}
              `}
              onClick={() => {
                setSelectedArea(area);
                onAreaClick?.(area);
              }}
            >
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-current" />
                <div className="min-w-0">
                  <h4 className="text-xs font-medium truncate">{area.name}</h4>
                  <p className="text-xs opacity-70">
                    {area.total_voters} voters
                  </p>
                </div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 rounded-lg bg-current opacity-0 hover:opacity-10 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Selected area tooltip */}
      {selectedArea && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 right-4 glass-card p-3 min-w-48"
        >
          <h3 className="font-semibold">{selectedArea.name}</h3>
          <p className="text-sm text-muted-foreground capitalize">
            {selectedArea.type}
          </p>
          <div className="mt-2 space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Voters:</span>
              <span className="font-medium">{selectedArea.total_voters}</span>
            </div>
            <div className="flex justify-between">
              <span>Committees:</span>
              <span className="font-medium">
                {selectedArea.total_committees}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export const MapVisualization: React.FC<MapVisualizationProps> = ({
  geoAreas,
  onAreaClick,
  className = "",
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");

  const filteredAreas = safeArray(geoAreas).filter((area) => {
    const matchesSearch = area.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || area.type === selectedType;
    return matchesSearch && matchesType;
  });

  const areaTypes = ["governorate", "district", "city", "village"];
  const typeColors = {
    governorate: "primary",
    district: "secondary",
    city: "accent",
    village: "success",
  };

  return (
    <Card className={`glass-card ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5 text-primary" />
            {t("geo_areas.map_visualization")}
          </CardTitle>
          <Badge variant="secondary" className="glass">
            {filteredAreas.length} {t("geo_areas.areas")}
          </Badge>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("common.search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass"
            />
          </div>

          <div className="flex gap-1">
            <Button
              variant={selectedType === "" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("")}
              className="glass-button"
            >
              {t("common.all")}
            </Button>
            {areaTypes.map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type)}
                className="glass-button"
              >
                {t(`geo_areas.types.${type}`)}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <MapContainer areas={filteredAreas} onAreaClick={onAreaClick} />

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-2">
          {areaTypes.map((type) => (
            <div key={type} className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded border border-${typeColors[type as keyof typeof typeColors]}`}
              />
              <span className="text-xs text-muted-foreground">
                {t(`geo_areas.types.${type}`)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
