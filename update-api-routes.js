const fs = require('fs');
const path = require('path');

// Function to recursively find all route.ts files in the api directory
function findAPIRoutes(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findAPIRoutes(filePath, fileList);
    } else if (file === 'route.ts' || file === 'route.js') {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to add dynamic = 'force-static' to a file
function addDynamicExport(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if the file already has the dynamic export
  if (content.includes("export const dynamic = 'force-static'") || 
      content.includes('export const dynamic = "force-static"')) {
    console.log(`✅ File already has dynamic export: ${filePath}`);
    return;
  }
  
  // Add the dynamic export at the top of the file
  const dynamicExport = "// Add dynamic export for static site generation\nexport const dynamic = 'force-static';\n\n";
  content = dynamicExport + content;
  
  // Write the updated content back to the file
  fs.writeFileSync(filePath, content);
  console.log(`✅ Added dynamic export to: ${filePath}`);
}

// Main function
function main() {
  const apiDirectory = path.join(__dirname, 'src', 'app', 'api');
  
  if (!fs.existsSync(apiDirectory)) {
    console.error(`❌ API directory not found: ${apiDirectory}`);
    return;
  }
  
  console.log(`🔍 Searching for API routes in: ${apiDirectory}`);
  const routeFiles = findAPIRoutes(apiDirectory);
  
  console.log(`🔄 Found ${routeFiles.length} API route files. Adding dynamic export to each...`);
  routeFiles.forEach(addDynamicExport);
  
  console.log('✨ Done!');
}

// Run the script
main(); 