'use client';

// @mui
import Box from '@mui/material/Box';

// @project
import { Navbar1 } from '@/blocks/navbar';
import { NavbarContent1 } from '@/blocks/navbar/navbar-content';
import ThemeProviders from '@/components/ThemeProvider';
import { UserProvider } from '@/contexts/UserContext';

// @data
import { navbar } from './data';

// @types
import { ChildrenProps } from '@/types/root';

const headerColor = { bgcolor: 'grey.100' };

/***************************  LAYOUT - MAIN  ***************************/

export default function MainLayout({ children }: ChildrenProps) {
  return (
    <ThemeProviders>
      <UserProvider>
        <>
          {/* header section */}
          <Box sx={headerColor}>
            <Navbar1 triggerSX={headerColor}>
              <NavbarContent1 {...navbar} />
            </Navbar1>
          </Box>

          {/* app/(landing)/* */}
          <main>{children}</main>
        </>
      </UserProvider>
    </ThemeProviders>
  );
}
