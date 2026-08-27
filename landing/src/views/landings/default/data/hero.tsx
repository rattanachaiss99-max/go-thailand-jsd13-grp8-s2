// @mui
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

export const hero = {
  chip: {
    label: (
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        Go Thailand
      </Typography>
    )
  },
  headLine: 'เที่ยวไทยครบทุกเส้นทาง',
  captionLine: 'ค้นหาและจองสถานที่ท่องเที่ยว ที่พัก และแพ็กเกจทัวร์ทั่วประเทศไทย ในที่เดียว',
  image: '/assets/images/hero/lady-2.png',
  primaryBtn: { children: 'เริ่มต้นเที่ยว', href: '/' },
  secondaryBtn: { children: 'สมัครสมาชิก / ล็อกอิน', href: '/register', variant: 'outlined', component: 'a' } as object,
  listData: [
    { image: '/assets/images/shared/react.svg', title: 'React 19' },
    { image: '/assets/images/shared/next-js.svg', title: 'Next.js' },
    { image: '/assets/images/shared/material-ui.svg', title: 'Material UI v7' },
    { image: '/assets/images/shared/typescript.svg', title: 'TypeScript' }
  ]
};
