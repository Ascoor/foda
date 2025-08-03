import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Election {
  id: number;
  name: string;
  date: string;
}

const sample: Election[] = [
  { id: 1, name: '2024 National', date: '2024-11-05' }
];

const ElectionList: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{t('elections.title')}</h1>
        <button className="btn btn-primary">{t('elections.add')}</button>
      </div>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1 text-left">{t('elections.name')}</th>
            <th className="border px-2 py-1 text-left">{t('elections.date')}</th>
            <th className="border px-2 py-1">{t('common.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {sample.map((e) => (
            <tr key={e.id}>
              <td className="border px-2 py-1">{e.name}</td>
              <td className="border px-2 py-1">{e.date}</td>
              <td className="border px-2 py-1 text-center">
                <button className="text-blue-600 mr-2">{t('common.edit')}</button>
                <button className="text-red-600">{t('common.delete')}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ElectionList;
