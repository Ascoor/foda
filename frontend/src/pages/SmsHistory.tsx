import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchSms } from '@/lib/sms';
import { useLanguage } from '@/contexts/LanguageContext';

const SmsHistory = () => {
  const { t, direction } = useLanguage();
  const { data, isLoading, error } = useQuery({ queryKey: ['sms-history'], queryFn: fetchSms });

  if (isLoading) return <div className="p-6">{t('common.loading')}</div>;
  if (error) return <div className="p-6 text-red-500">{(error as Error).message}</div>;

  const messages = data?.data ?? data;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{t('sms.history')}</h1>
      <Table>
        <TableHeader>
          <TableRow className={direction === 'rtl' ? 'text-right' : ''}>
            <TableHead>{t('sms.recipient')}</TableHead>
            <TableHead>{t('sms.message')}</TableHead>
            <TableHead>{t('sms.status')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages?.map((m: any) => (
            <TableRow key={m.id} className={direction === 'rtl' ? 'text-right' : ''}>
              <TableCell>{m.recipient}</TableCell>
              <TableCell>{m.message}</TableCell>
              <TableCell>{m.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SmsHistory;
