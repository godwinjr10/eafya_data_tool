import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Testing upload service...');
console.log('Current directory:', __dirname);
console.log('Uploads directory:', path.join(__dirname, 'sql', 'uploads'));

// Check if uploads directory exists
const uploadsDir = path.join(__dirname, 'sql', 'uploads');
if (fs.existsSync(uploadsDir)) {
  console.log('✅ Uploads directory exists');
  
  // List CSV files
  const files = fs.readdirSync(uploadsDir);
  const csvFiles = files.filter(file => file.endsWith('.csv'));
  console.log('📊 Found CSV files:', csvFiles);
} else {
  console.log('❌ Uploads directory does not exist');
}

console.log('Test completed');
