// Simple test script to verify image upload functionality
const fs = require('fs');
const path = require('path');

async function testImageUpload() {
  try {
    // Create a simple test image (1x1 pixel PNG)
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00,
      0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0xE2, 0x21, 0xBC, 0x33,
      0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);

    // Create FormData
    const FormData = require('form-data');
    const form = new FormData();
    form.append('file', testImageBuffer, {
      filename: 'test-image.png',
      contentType: 'image/png'
    });
    form.append('altText', 'Test image');
    form.append('description', 'Test image upload');

    // Upload the image
    const response = await fetch('http://localhost:5001/api/admin/media', {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Upload successful!');
    console.log('📁 File:', result.originalName);
    console.log('🔗 URL:', result.fileUrl);
    console.log('📏 Size:', result.fileSize, 'bytes');
    console.log('🆔 ID:', result.id);

    // Test fetching media library
    const mediaResponse = await fetch('http://localhost:5001/api/admin/media');
    if (!mediaResponse.ok) {
      throw new Error(`Failed to fetch media library: ${mediaResponse.status}`);
    }

    const media = await mediaResponse.json();
    console.log('\n📚 Media Library:');
    console.log(`Found ${media.length} items`);
    media.forEach((item, index) => {
      console.log(`${index + 1}. ${item.originalName} (${item.fileSize} bytes)`);
    });

    return true;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// Run the test
console.log('🧪 Testing image upload functionality...\n');
testImageUpload().then(success => {
  if (success) {
    console.log('\n🎉 All tests passed! Image upload is working correctly.');
  } else {
    console.log('\n💥 Tests failed. Check the error messages above.');
  }
});