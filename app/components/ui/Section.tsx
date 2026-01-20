'use client';

import { forwardRef, ReactNode } from 'react';
import { motion, HTMLMotionProps, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionProps extends Omit<HTMLMotionProps<'section'>, 'children'> {
  variant?: 'default' | 'gray' | 'dark' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  container?: boolean;
  containerSize?: 'default' | 'narrow' | 'wide';
  children?: ReactNode;
}

const variantStyles = {
  default: 'bg-white',
  gray: 'bg-surface-100',
  dark: 'bg-primary-900 text-white',
  gradient: 'bg-gradient-hero',
};

const sizeStyles = {
  sm: 'py-12 md:py-16 lg:py-20',
  md: 'py-16 md:py-24 lg:py-32',
  lg: 'py-20 md:py-32 lg:py-40',
};

const containerStyles = {
  default: 'max-w-7xl',
  narrow: 'max-w-5xl',
  wide: 'max-w-screen-2xl',
};

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      container = true,
      containerSize = 'default',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <motion.section
        ref={ref}
        className={cn(variantStyles[variant], sizeStyles[size], className)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={sectionVariants}
        {...props}
      >
        {container ? (
          <div className={cn('mx-auto px-4 sm:px-6 lg:px-8', containerStyles[containerSize])}>
            {children}
          </div>
        ) : (
          children
        )}
      </motion.section>
    );
  }
);

Section.displayName = 'Section';

// Section Header Component
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
  badge?: string;
  className?: string;
}

const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ className, title, subtitle, description, align = 'center', badge }, ref) => {
    const alignStyles = {
      left: 'text-left',
      center: 'text-center mx-auto',
      right: 'text-right ml-auto',
    };

    return (
      <motion.div
        ref={ref}
        className={cn('max-w-3xl mb-12 md:mb-16', alignStyles[align], className)}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        }}
      >
        {badge && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mb-4">
            {badge}
          </span>
        )}
        {subtitle && (
          <p className="text-accent-500 font-semibold text-sm uppercase tracking-wider mb-3">
            {subtitle}
          </p>
        )}
        <h2 className="heading-2 text-balance">{title}</h2>
        {description && <p className="body-lg mt-4 text-balance">{description}</p>}
      </motion.div>
    );
  }
);

SectionHeader.displayName = 'SectionHeader';

export { Section, SectionHeader };
export type { SectionProps, SectionHeaderProps };
