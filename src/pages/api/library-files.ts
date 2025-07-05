import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// Cache for the combined library data
let cachedLibraryData: any = null;
let cacheTimestamp: number = 0;
let isRefreshing: boolean = false;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const STALE_DURATION = 10 * 60 * 1000; // 10 minutes (stale-while-revalidate)

// Try to load build-time cache first
function loadBuildTimeCache(): any | null {
  try {
    const cacheFile = path.join(process.cwd(), '.next', 'cache', 'library-cache.json');
    if (fs.existsSync(cacheFile)) {
      const cacheContent = fs.readFileSync(cacheFile, 'utf-8');
      const cacheData = JSON.parse(cacheContent);
      console.log(`Library API: Loaded build-time cache with ${cacheData.totalItems} items`);
      return cacheData;
    }
  } catch (error) {
    console.warn('Failed to load build-time cache:', error);
  }
  return null;
}

// Preload function that runs in background
async function preloadLibraryData() {
  if (isRefreshing) return;
  
  isRefreshing = true;
  const startTime = Date.now();
  
  try {
    const libraryDir = path.join(process.cwd(), 'public', 'data', 'library');
    const files = fs.readdirSync(libraryDir)
      .filter(f => f.endsWith('.json'));
    
    console.log(`Library API: Preloading ${files.length} JSON files...`);
    
    const allItems: any[] = [];
    
    for (const file of files) {
      try {
        const filePath = path.join(libraryDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        
        if (data.items && Array.isArray(data.items)) {
          allItems.push(...data.items);
        }
      } catch (error) {
        console.warn(`Failed to load library file ${file}:`, error);
      }
    }
    
    const combinedData = {
      items: allItems,
      totalItems: allItems.length,
      exportDate: new Date().toISOString(),
      source: 'combined-external-files'
    };
    
    cachedLibraryData = combinedData;
    cacheTimestamp = Date.now();
    
    const loadTime = Date.now() - startTime;
    console.log(`Library API: Preloaded ${allItems.length} items in ${loadTime}ms`);
    
  } catch (error) {
    console.error('Error preloading library data:', error);
  } finally {
    isRefreshing = false;
  }
}

// Initialize cache with build-time data if available
if (typeof window === 'undefined' && !cachedLibraryData) {
  const buildTimeCache = loadBuildTimeCache();
  if (buildTimeCache) {
    cachedLibraryData = buildTimeCache;
    cacheTimestamp = Date.now();
  } else {
    // Fallback to preloading
    preloadLibraryData();
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const startTime = Date.now();
  const now = Date.now();
  
  // Allow cache invalidation for development
  if (req.query.refresh === 'true') {
    cachedLibraryData = null;
    cacheTimestamp = 0;
    isRefreshing = false;
  }
  
  // Check if we have valid cached data
  if (cachedLibraryData && (now - cacheTimestamp) < CACHE_DURATION) {
    const loadTime = Date.now() - startTime;
    console.log(`Library API: Cache hit, loaded in ${loadTime}ms`);
    
    res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes
    res.status(200).json({
      ...cachedLibraryData,
      _debug: { loadTime, source: 'cache' }
    });
    return;
  }
  
  // Stale-while-revalidate: return stale data if available while refreshing in background
  if (cachedLibraryData && (now - cacheTimestamp) < STALE_DURATION) {
    const loadTime = Date.now() - startTime;
    console.log(`Library API: Stale cache hit, loaded in ${loadTime}ms (refreshing in background)`);
    
    // Start background refresh if not already refreshing
    if (!isRefreshing) {
      preloadLibraryData();
    }
    
    res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes
    res.status(200).json({
      ...cachedLibraryData,
      _debug: { loadTime, source: 'stale-cache' }
    });
    return;
  }

  // No cache available, load fresh data
  const libraryDir = path.join(process.cwd(), 'public', 'data', 'library');
  
  try {
    const files = fs.readdirSync(libraryDir)
      .filter(f => f.endsWith('.json'));
    
    console.log(`Library API: Loading ${files.length} JSON files...`);
    
    // Load and combine all JSON files
    const allItems: any[] = [];
    
    for (const file of files) {
      try {
        const filePath = path.join(libraryDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        
        if (data.items && Array.isArray(data.items)) {
          allItems.push(...data.items);
        }
      } catch (error) {
        console.warn(`Failed to load library file ${file}:`, error);
      }
    }
    
    // Create combined response
    const combinedData = {
      items: allItems,
      totalItems: allItems.length,
      exportDate: new Date().toISOString(),
      source: 'combined-external-files'
    };
    
    // Update cache
    cachedLibraryData = combinedData;
    cacheTimestamp = now;
    
    const loadTime = Date.now() - startTime;
    console.log(`Library API: Loaded ${allItems.length} items in ${loadTime}ms`);
    
    // Set cache headers
    res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes
    res.status(200).json({
      ...combinedData,
      _debug: { loadTime, source: 'fresh', filesProcessed: files.length }
    });
    
  } catch (e) {
    console.error('Error loading library files:', e);
    res.status(500).json({ error: 'Could not load library files.' });
  }
} 