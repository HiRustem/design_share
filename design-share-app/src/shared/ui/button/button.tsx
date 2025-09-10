import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';
import styles from './button.module.scss';

const buttonVariants = cva(
  styles.button,
  {
    variants: {
      variant: {
        primary: styles.primary,
        secondary: styles.secondary,
        outline: styles.outline,
        ghost: styles.ghost,
        destructive: styles.destructive,
      },
      size: {
        small: styles.small,
        default: styles.default,
        large: styles.large,
        icon: styles.icon,
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size }),
          loading && styles.loading,
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? null : children}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };