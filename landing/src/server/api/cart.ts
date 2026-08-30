// @server/api/cart.ts
// Cart endpoints for a given user (Task 6: POST/GET/PUT/DELETE).
// Backend routes are not built yet — wired to planned REST paths.

const API_URL = process.env.NEXT_PUBLIC_SITE_URL || '';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  status?: string;
}

async function handle<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as any).error || `Request failed (${res.status})`);
  return data as T;
}

// POST /api/cart — add a selected product to cart
export async function addToCart(token: string, input: CartItem): Promise<{ message: string; cart: Cart }> {
  const res = await fetch(`${API_URL}/api/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(input)
  });
  return handle(res);
}

// GET /api/cart/:user_id — return the user's cart
export async function getCart(token: string, userId: string): Promise<Cart> {
  const res = await fetch(`${API_URL}/api/cart/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return handle(res);
}

// PUT /api/cart/:id — update item quantity / status
export async function updateCartItem(token: string, id: string, input: Partial<CartItem>): Promise<{ message: string; cart: Cart }> {
  const res = await fetch(`${API_URL}/api/cart/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(input)
  });
  return handle(res);
}

// DELETE /api/cart/:id — remove an item from cart
export async function removeFromCart(token: string, id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/api/cart/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  return handle(res);
}
