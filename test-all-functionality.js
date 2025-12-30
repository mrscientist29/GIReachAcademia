import { config } from 'dotenv';
import fetch from 'node-fetch';

config();

const BASE_URL = 'http://localhost:5001';

// Test data
const testData = {
  testimonial: {
    name: "Test User",
    role: "Student",
    institution: "Test University",
    content: "This is a test testimonial to verify database functionality.",
    rating: 5
  },
  publication: {
    title: "Test Publication",
    authors: "Test Author, Co-Author",
    journal: "Test Journal",
    year: 2024,
    type: "Research Paper",
    impactFactor: "3.5",
    doi: "10.1234/test.2024.001",
    abstract: "This is a test publication abstract."
  },
  contact: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@test.com",
    phone: "+1234567890",
    inquiryType: "General Inquiry",
    message: "This is a test contact submission."
  },
  joinApplication: {
    name: "Jane Smith",
    email: "jane.smith@test.com",
    phone: "+1234567891",
    role: "Mentee",
    institution: "Test University",
    experience: "2 years research experience",
    motivation: "Want to advance my research skills"
  },
  feedback: {
    name: "Test Reviewer",
    email: "reviewer@test.com",
    role: "Student",
    rating: 5,
    content: "Excellent platform for research collaboration!"
  },
  user: {
    email: "testuser@example.com",
    firstName: "Test",
    lastName: "User",
    role: "user",
    institution: "Test University"
  }
};

async function testAPI(endpoint, method = 'GET', data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const result = await response.json();
    
    return {
      success: response.ok,
      status: response.status,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function runAllTests() {
  console.log("🧪 Starting Comprehensive Functionality Tests\n");
  console.log("=" .repeat(60));
  
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };
  
  // Test 1: Testimonials
  console.log("\n📝 Testing Testimonials...");
  
  // Get existing testimonials
  let test = await testAPI('/api/testimonials');
  if (test.success) {
    console.log("✅ GET testimonials: SUCCESS");
    console.log(`   Found ${test.data.length} testimonials`);
    results.passed++;
  } else {
    console.log("❌ GET testimonials: FAILED", test.error || test.status);
    results.failed++;
  }
  results.tests.push({name: 'GET testimonials', success: test.success});
  
  // Create new testimonial
  test = await testAPI('/api/testimonials', 'POST', testData.testimonial);
  if (test.success) {
    console.log("✅ POST testimonial: SUCCESS");
    console.log(`   Created testimonial with ID: ${test.data.id}`);
    results.passed++;
  } else {
    console.log("❌ POST testimonial: FAILED", test.error || test.status);
    results.failed++;
  }
  results.tests.push({name: 'POST testimonial', success: test.success});
  
  // Test 2: Publications
  console.log("\n📚 Testing Publications...");
  
  test = await testAPI('/api/publications');
  if (test.success) {
    console.log("✅ GET publications: SUCCESS");
    console.log(`   Found ${test.data.length} publications`);
    results.passed++;
  } else {
    console.log("❌ GET publications: FAILED", test.error || test.status);
    results.failed++;
  }
  results.tests.push({name: 'GET publications', success: test.success});
  
  test = await testAPI('/api/publications', 'POST', testData.publication);
  if (test.success) {
    console.log("✅ POST publication: SUCCESS");
    console.log(`   Created publication with ID: ${test.data.id}`);
    results.passed++;
  } else {
    console.log("❌ POST publication: FAILED", test.error || test.status);
    results.failed++;
  }
  results.tests.push({name: 'POST publication', success: test.success});
  
  // Test 3: Contact Submissions
  console.log("\n📞 Testing Contact Submissions...");
  
  test = await testAPI('/api/contact', 'POST', testData.contact);
  if (test.success) {
    console.log("✅ POST contact: SUCCESS");
    console.log(`   Created contact submission with ID: ${test.data.id}`);
    results.passed++;
  } else {
    console.log("❌ POST contact: FAILED", test.error || test.status);
    results.failed++;
  }
  results.tests.push({name: 'POST contact', success: test.success});
  
  // Test 4: Join Applications
  console.log("\n🤝 Testing Join Applications...");
  
  test = await testAPI('/api/join', 'POST', testData.joinApplication);
  if (test.success) {
    console.log("✅ POST join application: SUCCESS");
    console.log(`   Created join application with ID: ${test.data.id}`);
    results.passed++;
  } else {
    console.log("❌ POST join application: FAILED", test.error || test.status);
    results.failed++;
  }
  results.tests.push({name: 'POST join application', success: test.success});
  
  // Test 5: Feedback Submissions
  console.log("\n💬 Testing Feedback...");
  
  test = await testAPI('/api/feedback', 'POST', testData.feedback);
  if (test.success) {
    console.log("✅ POST feedback: SUCCESS");
    console.log(`   Created feedback with ID: ${test.data.id}`);
    results.passed++;
  } else {
    console.log("❌ POST feedback: FAILED", test.error || test.status);
    results.failed++;
  }
  results.tests.push({name: 'POST feedback', success: test.success});
  
  // Test 6: Projects
  console.log("\n🔬 Testing Projects...");
  
  test = await testAPI('/api/projects');
  if (test.success) {
    console.log("✅ GET projects: SUCCESS");
    console.log(`   Found ${test.data.length} projects`);
    results.passed++;
  } else {
    console.log("❌ GET projects: FAILED", test.error || test.status);
    results.failed++;
  }
  results.tests.push({name: 'GET projects', success: test.success});
  
  // Test 7: Admin APIs
  console.log("\n👨‍💼 Testing Admin APIs...");
  
  test = await testAPI('/api/admin/users');
  if (test.success) {
    console.log("✅ GET admin users: SUCCESS");
    console.log(`   Found ${test.data.length} users`);
    results.passed++;
  } else {
    console.log("❌ GET admin users: FAILED", test.error || test.status);
    results.failed++;
  }
  results.tests.push({name: 'GET admin users', success: test.success});
  
  test = await testAPI('/api/admin/feedback');
  if (test.success) {
    console.log("✅ GET admin feedback: SUCCESS");
    console.log(`   Found ${test.data.length} feedback items`);
    results.passed++;
  } else {
    console.log("❌ GET admin feedback: FAILED", test.error || test.status);
    results.failed++;
  }
  results.tests.push({name: 'GET admin feedback', success: test.success});
  
  test = await testAPI('/api/admin/settings');
  if (test.success) {
    console.log("✅ GET admin settings: SUCCESS");
    console.log(`   Found ${test.data.length} settings`);
    results.passed++;
  } else {
    console.log("❌ GET admin settings: FAILED", test.error || test.status);
    results.failed++;
  }
  results.tests.push({name: 'GET admin settings', success: test.success});
  
  test = await testAPI('/api/admin/media');
  if (test.success) {
    console.log("✅ GET admin media: SUCCESS");
    console.log(`   Found ${test.data.length} media items`);
    results.passed++;
  } else {
    console.log("❌ GET admin media: FAILED", test.error || test.status);
    results.failed++;
  }
  results.tests.push({name: 'GET admin media', success: test.success});
  
  // Test 8: Content Management
  console.log("\n📄 Testing Content Management...");
  
  test = await testAPI('/api/content');
  if (test.success) {
    console.log("✅ GET content: SUCCESS");
    console.log(`   Found ${test.data.length} content pages`);
    results.passed++;
  } else {
    console.log("❌ GET content: FAILED", test.error || test.status);
    results.failed++;
  }
  results.tests.push({name: 'GET content', success: test.success});
  
  // Test 9: Webinars
  console.log("\n🎥 Testing Webinars...");
  
  test = await testAPI('/api/webinars');
  if (test.success) {
    console.log("✅ GET webinars: SUCCESS");
    console.log(`   Found ${test.data.length} webinars`);
    results.passed++;
  } else {
    console.log("❌ GET webinars: FAILED", test.error || test.status);
    results.failed++;
  }
  results.tests.push({name: 'GET webinars', success: test.success});
  
  // Test 10: Feedback Forms
  console.log("\n📋 Testing Feedback Forms...");
  
  test = await testAPI('/api/feedback-forms/active');
  if (test.success) {
    console.log("✅ GET feedback forms: SUCCESS");
    console.log(`   Found ${test.data.length} active forms`);
    results.passed++;
  } else {
    console.log("❌ GET feedback forms: FAILED", test.error || test.status);
    results.failed++;
  }
  results.tests.push({name: 'GET feedback forms', success: test.success});
  
  // Final Results
  console.log("\n" + "=" .repeat(60));
  console.log("🎯 TEST RESULTS SUMMARY");
  console.log("=" .repeat(60));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📊 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
  
  if (results.failed === 0) {
    console.log("\n🎉 ALL TESTS PASSED! Database functionality is working perfectly!");
  } else {
    console.log("\n⚠️  Some tests failed. Check the details above.");
    console.log("\nFailed tests:");
    results.tests.filter(t => !t.success).forEach(t => {
      console.log(`   - ${t.name}`);
    });
  }
  
  console.log("\n📋 Detailed Test Results:");
  results.tests.forEach((test, index) => {
    console.log(`${index + 1}. ${test.name}: ${test.success ? '✅ PASS' : '❌ FAIL'}`);
  });
  
  return results;
}

// Run tests
runAllTests().then(() => {
  console.log("\n🏁 Testing completed!");
  process.exit(0);
}).catch(error => {
  console.error("❌ Test runner failed:", error);
  process.exit(1);
});