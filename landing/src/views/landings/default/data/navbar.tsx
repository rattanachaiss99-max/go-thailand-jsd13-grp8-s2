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
    {
      id: 'features',
      title: 'แนะนำฟีเจอร์',
      link: '/features',
      children: [
        { id: 'stamps', title: 'แสตมป์', link: '/features?tab=stamps', icon: '🗺️', desc: 'พาสปอร์ตสะสมแสตมป์ 77 จังหวัด' },
        { id: 'ai-planner', title: 'เพื่อนวางแผนเที่ยว', link: '/features?tab=ai-planner', icon: '✨', desc: 'AI Travel Copilot อัจฉริยะ' },
        { id: 'trails', title: 'เส้นทางแนะนำ', link: '/features?tab=trails', icon: '🧭', desc: 'เส้นทางตัวอย่างแนะนำ: เชียงราย (Chiang Rai Guest Trails)' }
      ]
    },
    { id: 'cart', title: 'ตะกร้าสินค้า', link: '/cart' },
    { id: 'profile', title: 'โปรไฟล์', link: '/profile' },
    { id: 'dashboard', title: 'แดชบอร์ด', link: '/dashboard' },
    { id: 'crm', title: 'CRM สมาชิก', link: '/crm' }
  ]
};


