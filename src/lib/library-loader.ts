import { LibraryItem } from '@/data/library';

// Internal items from library.ts
import { libraryItems as internalItems } from '@/data/library';

// Dynamically load all JSON files in /public/data/library/ using the API route
async function getAllExternalJsonFiles(): Promise<string[]> {
  try {
    const apiRes = await fetch('/api/library-files');
    if (apiRes.ok) {
      const files: string[] = await apiRes.json();
      return files.map(f => `/data/library/${f}`);
    }
  } catch (e) {
    // fallback below
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
  try {
    // Start with internal items
    let allItems: LibraryItem[] = [...internalItems];
    // Dynamically get all external JSONs
    const externalJsonFiles = await getAllExternalJsonFiles();
    for (const jsonFile of externalJsonFiles) {
      try {
        const response = await fetch(jsonFile);
        if (response.ok) {
          const data: LibraryData = await response.json();
          if (data.items && Array.isArray(data.items)) {
            // Merge items, avoiding duplicates by ID
            const existingIds = new Set(allItems.map(item => item.id));
            const newItems = data.items.filter(item => !existingIds.has(item.id));
            allItems = [...allItems, ...newItems];
          }
        }
      } catch (error) {
        console.warn(`Failed to load external library file ${jsonFile}:`, error);
      }
    }
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
export async function checkExternalFiles(): Promise<{ [key: string]: boolean }> {
  const status: { [key: string]: boolean } = {};
  const externalJsonFiles = await getAllExternalJsonFiles();
  for (const jsonFile of externalJsonFiles) {
    try {
      const response = await fetch(jsonFile, { method: 'HEAD' });
      status[jsonFile] = response.ok;
    } catch (error) {
      status[jsonFile] = false;
    }
  }
  return status;
} 