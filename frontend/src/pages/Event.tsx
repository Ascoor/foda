import React, { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '@/lib/events';
import { fetchAreas } from '@/lib/areas';
import { fetchTeams } from '@/lib/teams';

interface Area { id: number; name: string; }
interface Team { id: number; name: string; }
interface EventType {
  id: number;
  name: string;
  organiser: string;
  location: string;
  date: string;
  description?: string;
  area: Area;
  team: Team;
}

export const Event: React.FC = () => {
  const { language, direction, t } = useLanguage();
  const [events, setEvents] = useState<EventType[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ date: '', area_id: '', team_id: '' });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<EventType | null>(null);
  const [form, setForm] = useState({
    name: '',
    organiser: '',
    location: '',
    date: '',
    area_id: '',
    team_id: '',
    description: '',
  });

  const loadEvents = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchEvents(filters)
      .then((data) => setEvents(data.data ?? data))
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    fetchAreas().then((d) => setAreas(d.data ?? d));
    fetchTeams().then((d) => setTeams(d.data ?? d));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', organiser: '', location: '', date: '', area_id: '', team_id: '', description: '' });
    setIsDialogOpen(true);
  };

  const openEdit = (event: EventType) => {
    setEditing(event);
    setForm({
      name: event.name,
      organiser: event.organiser,
      location: event.location,
      date: event.date,
      area_id: String(event.area?.id ?? ''),
      team_id: String(event.team?.id ?? ''),
      description: event.description ?? '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await updateEvent(editing.id, form);
      } else {
        await createEvent(form);
      }
      setIsDialogOpen(false);
      loadEvents();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t('events.delete'))) return;
    try {
      await deleteEvent(id);
      loadEvents();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  if (loading) {
    return <div className="p-6">{t('common.loading')}</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-destructive">
        {t('common.error')}: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className={`flex items-center justify-between ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
        <h1 className={`text-3xl font-bold ${language === 'ar' ? 'font-arabic-heading' : ''}`}>{t('events.title')}</h1>
        <Button onClick={openCreate} className="transition-glow hover:neon-glow-orange">
          <Plus className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
          <span className={language === 'ar' ? 'font-arabic' : ''}>{t('events.create')}</span>
        </Button>
      </div>

      <div className={`flex flex-wrap gap-4 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
        <Input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          className="w-48"
        />
        <Select
          value={filters.area_id}
          onValueChange={(v) => setFilters({ ...filters, area_id: v })}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder={t('events.area')} />
          </SelectTrigger>
          <SelectContent>
            {areas.map((a) => (
              <SelectItem key={a.id} value={String(a.id)}>
                {a.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.team_id}
          onValueChange={(v) => setFilters({ ...filters, team_id: v })}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder={t('events.team')} />
          </SelectTrigger>
          <SelectContent>
            {teams.map((tm) => (
              <SelectItem key={tm.id} value={String(tm.id)}>
                {tm.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow className={direction === 'rtl' ? 'flex-row-reverse' : ''}>
            <TableHead>{t('events.name')}</TableHead>
            <TableHead>{t('events.date')}</TableHead>
            <TableHead>{t('events.area')}</TableHead>
            <TableHead>{t('events.team')}</TableHead>
            <TableHead>{t('common.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id} className={direction === 'rtl' ? 'flex-row-reverse' : ''}>
              <TableCell>{event.name}</TableCell>
              <TableCell>{event.date}</TableCell>
              <TableCell>{event.area?.name}</TableCell>
              <TableCell>{event.team?.name}</TableCell>
              <TableCell className="space-x-2">
                <Button size="sm" variant="secondary" asChild>
                  <Link to={`/events/${event.id}`}>{t('common.view')}</Link>
                </Button>
                <Button size="sm" variant="outline" onClick={() => openEdit(event)}>
                  {t('common.edit')}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(event.id)}>
                  {t('common.delete')}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className={language === 'ar' ? 'font-arabic-heading' : ''}>
              {editing ? t('events.edit') : t('events.create')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('events.name')}</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('events.organiser')}</Label>
              <Input value={form.organiser} onChange={(e) => setForm({ ...form, organiser: e.target.value })} />
            </div>
            <div>
              <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('events.location')}</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div>
              <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('events.date')}</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('events.area')}</Label>
              <Select value={form.area_id} onValueChange={(v) => setForm({ ...form, area_id: v })}>
                <SelectTrigger>
                  <SelectValue placeholder={t('events.area')} />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((a) => (
                    <SelectItem key={a.id} value={String(a.id)}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('events.team')}</Label>
              <Select value={form.team_id} onValueChange={(v) => setForm({ ...form, team_id: v })}>
                <SelectTrigger>
                  <SelectValue placeholder={t('events.team')} />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((tm) => (
                    <SelectItem key={tm.id} value={String(tm.id)}>
                      {tm.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('events.description')}</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter className={direction === 'rtl' ? 'flex-row-reverse' : ''}>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSubmit}>{t('common.save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Event;
