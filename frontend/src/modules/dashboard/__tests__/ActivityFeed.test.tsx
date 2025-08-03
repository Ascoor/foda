import { render, screen } from '@testing-library/react';
import { ActivityFeed } from '../components/ActivityFeed';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Vote } from 'lucide-react';

test('renders activity feed', () => {
  const activities = [
    { id: 1, type: 'election_created', title: 'Election created', time: 'now', icon: Vote }
  ];
  render(
    <LanguageProvider>
      <ActivityFeed activities={activities} />
    </LanguageProvider>
  );
  expect(screen.getByText('Election created')).toBeInTheDocument();
  expect(screen.getByText('View All Activities')).toBeInTheDocument();
});
