import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export const dashboardContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export const dashboardItemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

type DashboardPageShellProps = {
  icon: ReactNode;
  title: string;
  description: string;
  toolbar?: ReactNode;
  children: ReactNode;
  contentClassName?: string;
};

export function DashboardPageShell({
  icon,
  title,
  description,
  toolbar,
  children,
  contentClassName,
}: DashboardPageShellProps) {
  return (
    <div className='flex h-screen flex-col'>
      <motion.div
        variants={dashboardContainerVariants}
        initial='hidden'
        animate='visible'
        className='flex-shrink-0 p-6'
      >
        <motion.div variants={dashboardItemVariants} className='mb-1 flex items-center gap-3'>
          {icon}
          <h1 className='text-2xl font-semibold text-guardai-darkgray'>{title}</h1>
        </motion.div>
        <motion.p variants={dashboardItemVariants} className='mb-4 ml-9 text-guardai-gray'>
          {description}
        </motion.p>
        {toolbar ? (
          <motion.div variants={dashboardItemVariants} className='mb-4 ml-9 mr-6 flex items-center gap-3'>
            {toolbar}
          </motion.div>
        ) : null}
      </motion.div>

      <ScrollArea className={cn('flex-1 px-6', contentClassName)}>
        <motion.div
          variants={dashboardContainerVariants}
          initial='hidden'
          animate='visible'
          className='space-y-6 pb-6'
        >
          {children}
        </motion.div>
      </ScrollArea>
    </div>
  );
}

export function dashboardTabButtonClass(active: boolean) {
  return cn(
    'rounded-md px-4 py-2 text-sm font-medium transition-colors',
    active ? 'bg-white text-guardai-red shadow-sm' : 'text-gray-600 hover:text-gray-900'
  );
}

export const dashboardTabListClass = 'flex w-fit space-x-1 rounded-lg bg-gray-100 p-1';
