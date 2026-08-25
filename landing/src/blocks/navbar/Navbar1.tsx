'use client';

// @mui
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

// @project
import ElevationScroll, { NavbarProps } from './ElevationScroll';
import ContainerWrapper from '@/components/ContainerWrapper';

export const navbar1Height = { xs: 64, sm: 72, md: 92 };

// override media queries injected by theme.mixins.toolbar
const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  '@media all': {
    minHeight: navbar1Height.md,
    paddingLeft: 0,
    paddingRight: 0
  },
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    '@media all': { minHeight: navbar1Height.sm },
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  [theme.breakpoints.down('sm')]: {
    '@media all': { minHeight: navbar1Height.xs },
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5)
  }
}));

/***************************  NAVBAR - 1  ***************************/

/**
 *
 * Demos:
 * - [Navbar1](https://www.saasable.io/blocks/navbar/navbar1)
 *
 * API:
 * - [Navbar1 API](https://phoenixcoded.gitbook.io/saasable/ui-kit/development/components/navbar/navbar1#props-details)
 */

export default function Navbar1({ children, isFixed = true, ...props }: NavbarProps) {
  return (
    <>
      <ElevationScroll isFixed={isFixed} {...props}>
        <AppBar {...(!isFixed && { position: 'static', elevation: 0 })} component="nav" color="inherit" sx={{ background: 'transparent' }}>
          <StyledToolbar>
            <ContainerWrapper>{children}</ContainerWrapper>
          </StyledToolbar>
        </AppBar>
      </ElevationScroll>
      {isFixed && <StyledToolbar />}
    </>
  );
}
