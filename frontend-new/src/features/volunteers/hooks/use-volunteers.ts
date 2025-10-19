import { useCallback, useEffect, useMemo, useState } from "react";
import { CreateVolunteerInput, Volunteer, VolunteerStatus, volunteerService } from "../services/volunteer-service";
import { VolunteerStats } from "../types";

const initialStats: VolunteerStats = {
  total: 0,
  active: 0,
  inactive: 0,
  training: 0,
  hoursThisWeek: 0,
};

export const useVolunteers = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const items = await volunteerService.list();
        setVolunteers(items);
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to load volunteers");
        setLoading(false);
      }
    };

    load();
  }, []);

  const stats = useMemo<VolunteerStats>(() => {
    if (volunteers.length === 0) return initialStats;

    return volunteers.reduce<VolunteerStats>(
      (acc, volunteer) => {
        acc.total += 1;
        acc.hoursThisWeek += volunteer.hoursThisWeek;
        acc[volunteer.status] += 1;
        return acc;
      },
      { ...initialStats },
    );
  }, [volunteers]);

  const addVolunteer = useCallback(async (input: CreateVolunteerInput) => {
    const volunteer = await volunteerService.create(input);
    setVolunteers((prev) => [...prev, volunteer]);
  }, []);

  const updateStatus = useCallback(async (id: string, status: VolunteerStatus) => {
    const volunteer = await volunteerService.updateStatus(id, status);
    if (!volunteer) return;

    setVolunteers((prev) => prev.map((item) => (item.id === id ? volunteer : item)));
  }, []);

  return {
    volunteers,
    loading,
    error,
    stats,
    addVolunteer,
    updateStatus,
  };
};
