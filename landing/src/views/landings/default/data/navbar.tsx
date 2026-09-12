// @project
import { ADMIN_PATH } from '@/path';

/***************************  DEFAULT - NAVBAR  ***************************/

const linkProps = { target: '_blank', rel: 'noopener noreferrer' };
export const navbar = {
  customization: true,
  navItems: [
    { id: 'home', title: 'หน้าแรก', link: '/' },
    { id: 'products', title: 'แพ็กเกจทัวร์', link: '/products' },
    { id: 'accommodations', title: 'ที่พัก', link: '/accommodations' },
    { id: 'guides', title: 'ไกด์นำเที่ยว', link: '/guides' },
    { id: 'cart', title: 'ตะกร้าสินค้า', link: '/cart' },
    { id: 'profile', title: 'โปรไฟล์', link: '/profile' },
    { id: 'dashboard', title: 'แดชบอร์ด', link: '/dashboard' },
    { id: 'crm', title: 'CRM สมาชิก', link: '/crm' }
  ]
};


