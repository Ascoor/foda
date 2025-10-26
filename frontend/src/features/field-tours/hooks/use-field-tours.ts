import { useCallback, useEffect, useState } from "react";
import {
  CreateFieldTourInput,
  FieldTour,
  FieldTourStatus,
  fieldTourService,
} from "../services/field-tour-service";

export const useFieldTours = () => {
  const [tours, setTours] = useState<FieldTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const items = await fieldTourService.list();
        setTours(items);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to load field tours");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const addTour = useCallback(async (input: CreateFieldTourInput) => {
    const tour = await fieldTourService.create(input);
    setTours((prev) => [...prev, tour]);
  }, []);

  const updateStatus = useCallback(async (id: string, status: FieldTourStatus) => {
    const updated = await fieldTourService.updateStatus(id, status);
    if (!updated) return;
    setTours((prev) => prev.map((tour) => (tour.id === id ? updated : tour)));
  }, []);

  return {
    tours,
    loading,
    error,
    addTour,
    updateStatus,
  };
};
