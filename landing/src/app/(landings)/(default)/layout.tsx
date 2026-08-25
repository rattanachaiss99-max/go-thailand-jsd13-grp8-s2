// @next
import dynamic from 'next/dynamic';

// @types
import { ChildrenProps } from '@/types/root';

const ScrollFab = dynamic(() => import('@/components/ScrollFab'));
const MainLayout = dynamic(() => import('@/views/landings/default/layout'));

/***************************  LAYOUT - DEFAULT  ***************************/

export default function Default({ children }: ChildrenProps) {
  return (
    <MainLayout>
      <>
        {children}

        {/* scroll to top section */}
        <ScrollFab />
      </>
    </MainLayout>
  );
}
