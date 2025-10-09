import { ButtonHTMLAttributes } from 'react';

const Button = ({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={`rounded bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/50 ${className}`}
    {...props}
  />
);

export default Button;
