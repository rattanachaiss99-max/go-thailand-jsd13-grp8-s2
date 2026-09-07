// landing/scripts/test-render-api.mjs
// Script to test the live Render User Web Service from the landing folder

const BASE_URL = 'https://go-thailand-jsd13-grp8-s2.onrender.com';

async function runTest() {
  console.log(`🌐 Testing Render Backend at: ${BASE_URL}\n`);

  // 1. Health Check
  console.log('--- Step 1: Health Check ---');
  try {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    console.log(`Status Code: ${res.status}`);
    console.log('Response:', data);
    if (!res.ok) throw new Error('Health check failed');
    console.log('✅ Health Check passed!\n');
  } catch (err) {
    console.error('❌ Health Check error:', err.message);
    return;
  }

  // Generate unique test user
  const randomSuffix = Math.floor(Math.random() * 10000);
  const testUser = {
    email: `tester_${randomSuffix}@gothailand.com`,
    password: 'Password123!',
    firstName: 'สมชาย',
    lastName: 'นักท่องเที่ยว',
    phone: '089-999-8888'
  };

  let token = null;

  // 2. Register
  console.log('--- Step 2: Register New Customer ---');
  console.log(`Registering: ${testUser.email}`);
  try {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    const data = await res.json();
    console.log(`Status Code: ${res.status}`);
    console.log('Response:', data);
    if (res.status === 201) {
      token = data.token;
      console.log('✅ Register passed!\n');
    } else {
      console.warn('⚠️ Register response:', data);
    }
  } catch (err) {
    console.error('❌ Register error:', err.message);
  }

  // 3. Login
  console.log('--- Step 3: Login Customer ---');
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });
    const data = await res.json();
    console.log(`Status Code: ${res.status}`);
    console.log('Response:', data);
    if (res.ok) {
      token = data.token;
      console.log('✅ Login passed!\n');
    } else {
      throw new Error(data.error || 'Login failed');
    }
  } catch (err) {
    console.error('❌ Login error:', err.message);
    return;
  }

  // 4. Get Current User (/api/auth/me) with Token
  console.log('--- Step 4: Get Current User Profile (/api/auth/me) ---');
  try {
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();
    console.log(`Status Code: ${res.status}`);
    console.log('Response:', JSON.stringify(data, null, 2));
    if (res.ok && data.isAuthenticated) {
      console.log(`\n🎉 Success! Retrieved user: ${data.user.firstName} ${data.user.lastName} (${data.user.email})`);
      console.log(`Role: ${data.user.role}, Membership Tier: ${data.user.membershipTier || 'bronze'}`);
      console.log('✅ Auth Verification (/api/auth/me) passed 100%!\n');
    } else {
      throw new Error(data.error || 'Failed to verify me');
    }
  } catch (err) {
    console.error('❌ GetMe error:', err.message);
  }
}

runTest();
