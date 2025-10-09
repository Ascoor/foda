import { PropsWithChildren } from 'react';

interface CardProps extends PropsWithChildren {
  title?: string;
  subtitle?: string;
}

const Card = ({ children, title, subtitle }: CardProps) => (
  <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    {title && <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>}
    {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
    <div className={title || subtitle ? 'mt-4' : ''}>{children}</div>
  </div>
);

export default Card;
