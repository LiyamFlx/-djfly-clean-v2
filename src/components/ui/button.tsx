// Example: You can replace this with your actual button UI
import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

export const Button = ({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'outline' | 'default' }) => {
  return (
    <button
      className={clsx(
        'px-4 py-2 rounded-md font-medium transition',
        props.variant === 'outline'
          ? 'border border-gray-400 text-gray-700 bg-white hover:bg-gray-100'
          : 'bg-black text-white hover:bg-gray-800',
        className
      )}
      {...props}
    />
  );
};
