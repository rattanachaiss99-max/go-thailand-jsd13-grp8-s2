import { ReactNode } from 'react';

export interface ChildrenProps {
  children: ReactNode;
}

export interface BreadcrumbProps {
  title: string;
  to?: string;
}
