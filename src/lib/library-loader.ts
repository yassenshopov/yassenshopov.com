import { LibraryItem } from '@/data/library';

// Internal items from library.ts
import { libraryItems as internalItems } from '@/data/library';

// Load all external library items from the optimized API
async function getExternalLibraryItems(): Promise<LibraryItem[]> {
  try {
    const apiRes = await fetch('/api/library-files');
    if (apiRes.ok) {
      const data = await apiRes.json();
      
      // Log debug info if available
      if (data._debug) {
        console.log(`Library loader: ${data._debug.source} load in ${data._debug.loadTime}ms`);
      }
      
      return data.items || [];
    }
  } catch (e) {
    console.warn('Failed to load external library items:', e);
  }
  return [];
}

export interface LibraryData {
  items: LibraryItem[];
  totalItems: number;
  exportDate?: string;
  filters?: any;
  statistics?: any;
}

export async function loadAllLibraryItems(): Promise<LibraryItem[]> {
  const startTime = Date.now();
  
  try {
    // Start with internal items
    let allItems: LibraryItem[] = [...internalItems];
    
    // Get external items from optimized API
    const externalItems = await getExternalLibraryItems();
    
    // Merge items, avoiding duplicates by ID
    const existingIds = new Set(allItems.map(item => item.id));
    const newItems = externalItems.filter(item => !existingIds.has(item.id));
    allItems = [...allItems, ...newItems];
    
    const totalTime = Date.now() - startTime;
    console.log(`Library loader: Total load time ${totalTime}ms (${allItems.length} items)`);
    
    return allItems;
  } catch (error) {
    console.error('Error loading library items:', error);
    // Fallback to internal items only
    return internalItems;
  }
}

// For backward compatibility - returns internal items immediately
export function getInternalLibraryItems(): LibraryItem[] {
  return internalItems;
}

// Check if external files are available (for development/debugging)
export async function checkExternalFiles(): Promise<{ available: boolean; totalItems?: number }> {
  try {
    const response = await fetch('/api/library-files');
    if (response.ok) {
      const data = await response.json();
      return { 
        available: true, 
        totalItems: data.totalItems 
      };
    }
  } catch (error) {
    console.warn('External files check failed:', error);
  }
  return { available: false };
} 