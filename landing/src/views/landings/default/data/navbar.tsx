// @project
import { ADMIN_PATH } from '@/path';

/***************************  DEFAULT - NAVBAR  ***************************/

const linkProps = { target: '_blank', rel: 'noopener noreferrer' };
export const navbar = {
  customization: true,
  navItems: [
    { id: 'home', title: 'หน้าแรก', link: '/' },
    { id: 'accommodations', title: 'ที่พัก', link: '/accommodations' },
    { id: 'dashboard', title: 'แดชบอร์ด', link: '/dashboard' }
  ]
};


