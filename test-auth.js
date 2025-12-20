// Simple test script to verify authentication is working

async function testRegistration() {
  try {
    console.log('Testing user registration...');
    
    const response = await fetch('http://localhost:5001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        institution: 'Test University',
        yearOfStudy: '2nd Year'
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Registration successful!');
      console.log('User data:', data.user);
      console.log('Token received:', !!data.token);
      return data;
    } else {
      console.log('❌ Registration failed:', data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Registration error:', error);
    return null;
  }
}

async function testLogin(email, password) {
  try {
    console.log('Testing user login...');
    
    const response = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Login successful!');
      console.log('User data:', data.user);
      console.log('Token received:', !!data.token);
      return data;
    } else {
      console.log('❌ Login failed:', data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Login error:', error);
    return null;
  }
}

async function runTests() {
  console.log('🧪 Starting authentication tests...\n');
  
  // Test registration
  const registrationResult = await testRegistration();
  
  if (registrationResult) {
    console.log('\n');
    // Test login with the same credentials
    await testLogin('test@example.com', 'password123');
  }
  
  console.log('\n🏁 Tests completed!');
}

runTests();