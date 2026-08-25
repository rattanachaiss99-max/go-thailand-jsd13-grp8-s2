// @project
import branding from '@/branding.json';
import { PAGE_PATH, SECTION_PATH } from '@/path';

/***************************  SEO METADATA - MAIN LAYOUT  ***************************/

const title = `${branding.brandName} — ${branding.title}`;
const description =
  'Go Thailand แพลตฟอร์มท่องเที่ยวไทย ค้นหาและจองสถานที่ท่องเที่ยว ที่พัก และแพ็กเกจทัวร์ทั่วประเทศ พร้อมข้อมูลครบถ้วนในที่เดียว';

const ogCommonMetadata = {
  locale: 'th_TH',
  type: 'website',
  siteName: `${branding.brandName}`,
  images: '/assets/images/metadata/og.png' // recommended dimensions of 1200x630
};

export const mainMetadata = {
  title: {
    template: `%s | ${branding.brandName}`,
    default: title // a default is required when creating a template
  },
  description,
  applicationName: branding.brandName,
  keywords: [
    'เที่ยวไทย',
    'ท่องเที่ยวไทย',
    'สถานที่ท่องเที่ยว',
    'แพ็กเกจทัวร์',
    'จองที่พัก',
    'Go Thailand',
    'travel Thailand'
  ],
  creator: `${branding.company.name}`,
  metadataBase: new URL(process.env.NEXT_PUBLIC_METADATA_BASE || 'http://localhost:3000'),
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title,
    description,
    url: '/',
    ...ogCommonMetadata
  }
};

/***************************  SEO METADATA - PAGES  ***************************/

// TODO(JSD13): เพิ่ม meta ของหน้าใหม่ที่นี่เมื่อสร้างหน้า (สินค้า / ตะกร้า / สมาชิก)

const sectionCommonMeta = {
  title: 'บล็อกส่วนประกอบ',
  description: `รวมส่วนประกอบหน้าเว็บของ ${branding.brandName}`
};

const aboutPageCommonMeta = {
  title: 'เกี่ยวกับเรา',
  description: `รู้จัก ${branding.brandName} ทีมงานและแนวคิดเบื้องหลังแพลตฟอร์มท่องเที่ยวไทยที่รวมสถานที่ ที่พัก และแพ็กเกจทัวร์ไว้ในที่เดียว`
};

const careerPageCommonMeta = {
  title: 'ร่วมงานกับเรา',
  description: `ร่วมเป็นส่วนหนึ่งของทีม ${branding.brandName} เปิดรับผู้ที่สนใจงานด้านออกแบบ พัฒนา และการท่องเที่ยว`
};

const faqPageCommonMeta = {
  title: 'คำถามที่พบบ่อย',
  description: `คำตอบสำหรับคำถามที่พบบ่อยเกี่ยวกับการจอง การชำระเงิน และการใช้งาน ${branding.brandName}`
};

const pricingPageCommonMeta = {
  title: 'แพ็กเกจและราคา',
  description: `เปรียบเทียบแพ็กเกจท่องเที่ยวและราคาของ ${branding.brandName} เลือกแพ็กเกจที่เหมาะกับการเดินทางของคุณ`
};

const contactUsCommonMeta = {
  title: 'ติดต่อเรา',
  description: `ติดต่อทีมงาน ${branding.brandName} สอบถามข้อมูลการเดินทาง การจอง หรือแจ้งปัญหาการใช้งาน`
};

const privacyPolicyCommonMeta = {
  title: 'นโยบายความเป็นส่วนตัว',
  description: `นโยบายความเป็นส่วนตัวของ ${branding.brandName} อธิบายวิธีการเก็บ ใช้ และดูแลข้อมูลของผู้ใช้งาน`
};

const termsConditionCommonMeta = {
  title: 'ข้อกำหนดและเงื่อนไข',
  description: `ข้อกำหนดและเงื่อนไขการใช้บริการของ ${branding.brandName}`
};

const comingSoonPageCommonMeta = { title: 'เปิดให้บริการเร็ว ๆ นี้', description: 'เปิดให้บริการเร็ว ๆ นี้' };
const error404PageCommonMeta = { title: 'ไม่พบหน้าที่ต้องการ', description: 'ไม่พบหน้าที่ต้องการ (404)' };
const error500PageCommonMeta = { title: 'เกิดข้อผิดพลาดของระบบ', description: 'เกิดข้อผิดพลาดของระบบ (500)' };

const underMaintenanceCommonMeta = {
  title: 'ปิดปรับปรุงระบบ',
  description: `${branding.brandName} ปิดปรับปรุงระบบชั่วคราว ขออภัยในความไม่สะดวก`
};

export const SEO_CONTENT = {
  section: { ...sectionCommonMeta, openGraph: { ...sectionCommonMeta, ...ogCommonMetadata, url: SECTION_PATH } },
  aboutPage: { ...aboutPageCommonMeta, openGraph: { ...aboutPageCommonMeta, ...ogCommonMetadata, url: PAGE_PATH.aboutPage } },
  careerPage: { ...careerPageCommonMeta, openGraph: { ...careerPageCommonMeta, ...ogCommonMetadata, url: PAGE_PATH.careerPage } },
  faqPage: { ...faqPageCommonMeta, openGraph: { ...faqPageCommonMeta, ...ogCommonMetadata, url: PAGE_PATH.faqPage } },
  pricingPage: { ...pricingPageCommonMeta, openGraph: { ...pricingPageCommonMeta, ...ogCommonMetadata, url: PAGE_PATH.pricingPage } },
  contactUs: { ...contactUsCommonMeta, openGraph: { ...contactUsCommonMeta, ...ogCommonMetadata, url: PAGE_PATH.contactPage } },
  privacyPolicy: {
    ...privacyPolicyCommonMeta,
    openGraph: { ...privacyPolicyCommonMeta, ...ogCommonMetadata, url: PAGE_PATH.privacyPolicyPage }
  },
  termsCondition: { ...termsConditionCommonMeta, openGraph: { ...termsConditionCommonMeta, ...ogCommonMetadata } },
  comingSoonPage: {
    ...comingSoonPageCommonMeta,
    openGraph: { ...comingSoonPageCommonMeta, ...ogCommonMetadata, url: PAGE_PATH.comingSoon }
  },
  error404Page: { ...error404PageCommonMeta, openGraph: { ...error404PageCommonMeta, ...ogCommonMetadata, url: PAGE_PATH.error404 } },
  error500Page: { ...error500PageCommonMeta, openGraph: { ...error500PageCommonMeta, ...ogCommonMetadata, url: PAGE_PATH.error500 } },
  underMaintenance: {
    ...underMaintenanceCommonMeta,
    openGraph: { ...underMaintenanceCommonMeta, ...ogCommonMetadata, url: PAGE_PATH.underMaintenance }
  }
};
