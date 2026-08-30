// @server/api/products.ts
// Product CRUD endpoints (Admin Features + Product list).
// Currently the backend routes are not built yet — these functions are wired
// to the planned REST paths so the UI layer stays clean (per react-crm-lifecycle).

const API_URL = process.env.NEXT_PUBLIC_SITE_URL || '';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  date?: string;
  tag?: string;
  isService?: boolean;
  imageUrl?: string;
  category?: string;
}

async function handle<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as any).error || `Request failed (${res.status})`);
  return data as T;
}

// GET /api/products — list all products (display)
export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/api/products`);
  return handle(res);
}

// POST /api/products — admin creates a product
export async function createProduct(token: string, input: Partial<Product>): Promise<{ message: string; product: Product }> {
  const res = await fetch(`${API_URL}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(input)
  });
  return handle(res);
}

// PUT /api/products/:id — admin updates a product
export async function updateProduct(token: string, id: string, input: Partial<Product>): Promise<{ message: string; product: Product }> {
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(input)
  });
  return handle(res);
}

// DELETE /api/products/:id — admin removes a product
export async function deleteProduct(token: string, id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  return handle(res);
}
