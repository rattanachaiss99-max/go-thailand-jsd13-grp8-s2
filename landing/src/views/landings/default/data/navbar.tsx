// @project
import { ADMIN_PATH } from '@/path';

/***************************  DEFAULT - NAVBAR  ***************************/

const linkProps = { target: '_blank', rel: 'noopener noreferrer' };
export const navbar = {
  customization: true,
  navItems: [
    { id: 'home', title: 'หน้าแรก', link: '/' },
    { id: 'dashboard', title: 'แดชบอร์ด', link: ADMIN_PATH, ...linkProps }
  ]
};
