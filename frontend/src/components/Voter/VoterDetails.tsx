/**
 * Simple voter details component.
 * Legacy reference: old/application/modules/voter/controllers/voter.php::voterDetails
 * Test: render with a voter object and verify fields.
 */
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Voter {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  voter_id: string;
  area?: { id: number; name: string };
  address?: string;
  sex?: string;
  birthdate?: string;
}

type Props = { voter: Voter };

export const VoterDetails: React.FC<Props> = ({ voter }) => {
  const { t, direction } = useLanguage();
  return (
    <div className={`space-y-2 p-4 ${direction === 'rtl' ? 'text-right' : ''}`}>
      <h2 className="text-xl font-bold">{voter.name}</h2>
      <p>{t('voters.voter_id')}: {voter.voter_id}</p>
      {voter.email && <p>{t('voters.email')}: {voter.email}</p>}
      {voter.phone && <p>{t('voters.phone')}: {voter.phone}</p>}
      {voter.area && <p>{t('voters.area')}: {voter.area.name}</p>}
      {voter.address && <p>{t('voters.address')}: {voter.address}</p>}
      {voter.sex && <p>{t('voters.sex')}: {voter.sex}</p>}
      {voter.birthdate && <p>{t('voters.birthdate')}: {voter.birthdate}</p>}
    </div>
  );
};
