import { useCallback, useEffect, useState } from "react";
import { CreateDonationInput, Donation, donationService } from "../services/donation-service";

type DonationSummary = {
  total: number;
  average: number;
  count: number;
};

const emptySummary: DonationSummary = {
  total: 0,
  average: 0,
  count: 0,
};

export const useDonations = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [summary, setSummary] = useState<DonationSummary>(emptySummary);

  useEffect(() => {
    const load = async () => {
      const [items, totals] = await Promise.all([donationService.list(), donationService.totals()]);
      setDonations(items);
      setSummary(totals);
    };

    load();
  }, []);

  const addDonation = useCallback(async (input: CreateDonationInput) => {
    const donation = await donationService.create(input);
    const totals = await donationService.totals();

    setDonations((prev) => [donation, ...prev]);
    setSummary(totals);
  }, []);

  return {
    donations,
    summary,
    addDonation,
  };
};
