import type { ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
const button = cva('button', {
  variants: {
    variant: { default: 'button-default', ghost: 'button-ghost', outline: 'button-outline' },
    size: { default: '', icon: 'button-icon', small: 'button-small' },
  },
  defaultVariants: { variant: 'outline', size: 'default' },
});
export function Button({
  className,
  variant,
  size,
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button>) {
  return <button type={type} className={clsx(button({ variant, size }), className)} {...props} />;
}
