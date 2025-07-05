const fs = require('fs');
const path = require('path');

// Build-time script to pre-generate library cache
function buildLibraryCache() {
  console.log('🔧 Building library cache...');
  
  const libraryDir = path.join(process.cwd(), 'public', 'data', 'library');
  const cacheDir = path.join(process.cwd(), '.next', 'cache');
  const cacheFile = path.join(cacheDir, 'library-cache.json');
  
  try {
    // Ensure cache directory exists
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    
    // Read all JSON files
    const files = fs.readdirSync(libraryDir)
      .filter(f => f.endsWith('.json'));
    
    console.log(`📁 Found ${files.length} library files`);
    
    const allItems = [];
    let totalItems = 0;
    
    for (const file of files) {
      try {
        const filePath = path.join(libraryDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        
        if (data.items && Array.isArray(data.items)) {
          allItems.push(...data.items);
          totalItems += data.items.length;
        }
      } catch (error) {
        console.warn(`⚠️  Failed to load library file ${file}:`, error.message);
      }
    }
    
    // Create cache data
    const cacheData = {
      items: allItems,
      totalItems: totalItems,
      exportDate: new Date().toISOString(),
      source: 'build-time-cache',
      buildTime: Date.now()
    };
    
    // Write cache file
    fs.writeFileSync(cacheFile, JSON.stringify(cacheData, null, 2));
    
    console.log(`✅ Built library cache with ${totalItems} items`);
    console.log(`📄 Cache saved to: ${cacheFile}`);
    
  } catch (error) {
    console.error('❌ Error building library cache:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  buildLibraryCache();
}

module.exports = { buildLibraryCache }; 