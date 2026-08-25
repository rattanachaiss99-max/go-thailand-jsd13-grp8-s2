// @mui
import Divider from '@mui/material/Divider';
import Link, { LinkProps } from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
import branding from '@/branding.json';
import { NextLink } from '../routes';

/***************************  AUTH - COPYRIGHT  ***************************/

export default function Copyright() {
  const copyrightSX = { display: { xs: 'none', md: 'flex' } };

  const linkProps: LinkProps = {
    component: NextLink,
    variant: 'caption',
    color: 'text.secondary',
    target: '_blank',
    rel: 'noopener noreferrer',
    underline: 'hover',
    sx: { '&:hover': { color: 'primary.main' } }
  };

  return (
    <Stack sx={{ gap: 1, width: 'fit-content', mx: 'auto' }}>
      <Stack direction="row" sx={{ justifyContent: 'center', gap: { xs: 1, md: 1.5 }, textAlign: 'center' }}>
        <Typography variant="caption" sx={{ ...copyrightSX, color: 'text.secondary', whiteSpace: 'nowrap' }}>
          © 2024
          <Link {...linkProps} aria-label="company" href={branding.company.url} sx={{ ...linkProps.sx, marginLeft: 0.5 }}>
            {branding.company.name}
          </Link>
        </Typography>
        <Divider orientation="vertical" flexItem sx={copyrightSX} />
        <Link {...linkProps} aria-label="privacy policy" href="/privacy-policy">
          Privacy Policy
        </Link>
        <Divider orientation="vertical" flexItem />
        <Link {...linkProps} aria-label="terms & conditions" href="https://mui.com/store/terms">
          Terms & Conditions
        </Link>
      </Stack>
      <Box sx={{ textAlign: 'center', display: { xs: 'block', md: 'none' } }}>
        <Divider sx={{ marginBottom: 1 }} />
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          © 2024
          <Link {...linkProps} aria-label="company" href={branding.company.url} sx={{ ...linkProps.sx, marginLeft: 0.5 }}>
            {branding.company.name}
          </Link>
        </Typography>
      </Box>
    </Stack>
  );
}
