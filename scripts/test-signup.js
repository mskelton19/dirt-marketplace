const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testSignup() {
  try {
    const response = await fetch('http://localhost:3000/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpassword123',
        company: 'Test Company',
        role: 'Project Manager',
        location: 'New York City',
      }),
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
  } catch (error) {
    console.error('Error testing signup:', error);
  }
}

testSignup();

