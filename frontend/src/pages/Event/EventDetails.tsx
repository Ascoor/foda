/**
 * EventDetails.tsx
 * Legacy Source: old/application/modules/event/controllers/event.php::eventDetails
 * Purpose: Display a single event's details and metadata.
 * Testing: Navigate to /events/:id, verify fetches GET /api/v1/events/{id}.
 */
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchEvent } from '@/lib/events';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language, direction, t } = useLanguage();

  const { data, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: () => fetchEvent(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="p-6">{t('common.loading')}</div>;
  }

  if (error) {
    return <div className="p-6 text-destructive">{t('common.error')}</div>;
  }

  const event = data?.data ?? data;

  return (
    <div className="space-y-4 p-6">
      <div className={`flex items-center justify-between ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
        <h1 className={`text-3xl font-bold ${language === 'ar' ? 'font-arabic-heading' : ''}`}>{event.name}</h1>
        <Button variant="outline" asChild>
          <Link to="/events" className={language === 'ar' ? 'font-arabic' : ''}>
            {t('common.back')}
          </Link>
        </Button>
      </div>
      <div className="space-y-2">
        <p><strong>{t('events.organiser')}:</strong> {event.organiser}</p>
        <p><strong>{t('events.location')}:</strong> {event.location}</p>
        <p><strong>{t('events.date')}:</strong> {event.date}</p>
        <p><strong>{t('events.area')}:</strong> {event.area?.name}</p>
        <p><strong>{t('events.team')}:</strong> {event.team?.name}</p>
        {event.description && <p><strong>{t('events.description')}:</strong> {event.description}</p>}
      </div>
    </div>
  );
};

export default EventDetails;
