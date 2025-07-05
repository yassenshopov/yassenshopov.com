# Library System

This directory contains the library system that supports both internal data and external JSON files.

## Structure

- `library.ts` - Main library file with internal items and exports
- `library-loader.ts` - Utility for loading both internal and external items
- `external-*.json` - External JSON files with additional library items

## Backward Compatibility

The system maintains full backward compatibility:

- `libraryItems` export remains unchanged
- All existing imports continue to work
- Internal items are always available immediately

## Forward Compatibility

The system now supports external JSON files:

- External files are loaded asynchronously
- Items are merged with internal items
- Duplicate IDs are automatically handled (external items take precedence)
- Graceful fallback to internal-only if external files fail to load

## External JSON Format

External JSON files should follow this format:

```json
{
  "exportDate": "2025-01-07T10:00:00.000Z",
  "totalItems": 1,
  "items": [
    {
      "id": "unique-id",
      "title": "Item Title",
      "author": "Author Name",
      "type": "book",
      "rating": 4,
      "status": "completed",
      "dateCompleted": "2024-12-15",
      "genre": ["Fiction", "Fantasy"],
      "description": "Item description",
      "coverImage": "/resources/images/library/item-cover.webp",
      "links": {
        "goodreads": "https://www.goodreads.com/book/..."
      }
    }
  ]
}
```

## Usage

### For immediate access (backward compatible):
```typescript
import { libraryItems } from '@/data/library';
```

### For all items including external (forward compatible):
```typescript
import { loadAllLibraryItems } from '@/data/library';

const allItems = await loadAllLibraryItems();
```

### In components (automatic):
The `useLibrary` hook automatically handles both internal and external items.

## Adding External Files

1. Create a new JSON file in `public/data/library/`
2. Follow the format above
3. Add the file path to `externalJsonFiles` in `library-loader.ts`
4. Ensure unique IDs across all files

## Benefits

- **Modularity**: Separate concerns into different files
- **Performance**: Internal items load immediately, external items load asynchronously
- **Maintainability**: Easier to manage large libraries
- **Flexibility**: Add new items without touching main library file
- **Reliability**: Graceful fallback if external files are unavailable 