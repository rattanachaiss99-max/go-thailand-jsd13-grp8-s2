// ============================================================================
// CRM Member Service — Network & API Boundary Layer
// Follows react-crm-lifecycle: ALL fetch/async calls live here, separated from UI.
// ============================================================================

export interface CrmMember {
  id: string; // Server-assigned string ID (Mongo ObjectId or UUID)
  firstName: string;
  lastName: string;
  position: string;
  role: 'user' | 'admin';
  createdAt?: string;
}

const STORAGE_KEY = 'gt_crm_members';
const NETWORK_DELAY_MS = 200;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const INITIAL_MEMBERS: CrmMember[] = [
  {
    id: '67cb9f01a1b2c3d4e5f60001',
    firstName: 'Somchai',
    lastName: 'Sukjai',
    position: 'Tour Guide Leader',
    role: 'admin',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: '67cb9f01a1b2c3d4e5f60002',
    firstName: 'Wichai',
    lastName: 'Rattana',
    position: 'Booking Coordinator',
    role: 'user',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: '67cb9f01a1b2c3d4e5f60003',
    firstName: 'Apinya',
    lastName: 'Prasert',
    position: 'Customer Support',
    role: 'user',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

function getStoredMembers(): CrmMember[] {
  if (typeof window === 'undefined') return INITIAL_MEMBERS;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MEMBERS));
    return INITIAL_MEMBERS;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return INITIAL_MEMBERS;
  }
}

function saveStoredMembers(members: CrmMember[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  }
}

// Generate server-like ObjectId (24 hex characters) to satisfy pitfall:
// "never invent id (Date.now() collides). Trust server-assigned id string."
function generateServerId(): string {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const random = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  return timestamp + random;
}

export const crmService = {
  // GET: ดึงรายการสมาชิกทั้งหมด (Read All)
  async getMembers(): Promise<CrmMember[]> {
    await delay(NETWORK_DELAY_MS);
    return [...getStoredMembers()];
  },

  // POST: สร้างสมาชิกใหม่ (Create) — Server assigns unique ID
  async createMember(input: {
    firstName: string;
    lastName: string;
    position: string;
    role?: 'user' | 'admin';
  }): Promise<CrmMember> {
    await delay(NETWORK_DELAY_MS);

    // Validation at API boundary
    if (!input.firstName?.trim() || !input.lastName?.trim() || !input.position?.trim()) {
      throw new Error('กรุณากรอกข้อมูลให้ครบทุกช่อง (First Name, Last Name, Position)');
    }

    const newMember: CrmMember = {
      id: generateServerId(), // Server-assigned ID
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      position: input.position.trim(),
      role: input.role || 'user',
      createdAt: new Date().toISOString()
    };

    const current = getStoredMembers();
    saveStoredMembers([...current, newMember]);
    return newMember;
  },

  // DELETE: ลบสมาชิกตาม ID
  async deleteMember(id: string): Promise<{ success: boolean; id: string }> {
    await delay(NETWORK_DELAY_MS);
    const current = getStoredMembers();
    const filtered = current.filter((m) => m.id !== id);
    if (filtered.length === current.length) {
      throw new Error(`ไม่พบสมาชิกที่มี ID: ${id}`);
    }
    saveStoredMembers(filtered);
    return { success: true, id };
  },

  // PUT: อัปเดตข้อมูลสมาชิก (Update)
  async updateMember(id: string, updates: Partial<Omit<CrmMember, 'id'>>): Promise<CrmMember> {
    await delay(NETWORK_DELAY_MS);
    const current = getStoredMembers();
    const index = current.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new Error(`ไม่พบสมาชิกที่มี ID: ${id}`);
    }

    const updated: CrmMember = {
      ...current[index],
      ...updates
    };

    current[index] = updated;
    saveStoredMembers(current);
    return updated;
  }
};
