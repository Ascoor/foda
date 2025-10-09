import { PropsWithChildren } from 'react';

interface TableProps extends PropsWithChildren {
  headers: string[];
}

const Table = ({ headers, children }: TableProps) => (
  <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
      <thead className="bg-slate-50 text-right text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        <tr>
          {headers.map((header) => (
            <th key={header} scope="col" className="px-4 py-3 font-semibold">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900">{children}</tbody>
    </table>
  </div>
);

export default Table;
