# Library Components

This directory contains the modular components for the library page, following Next.js best practices and DRY principles.

## Components

### `LibraryHero.tsx`
- **Purpose**: Hero section with title, description, and statistics overview
- **Props**: `stats` - Library statistics object
- **Features**: Animated entrance, responsive design

### `LibraryStats.tsx`
- **Purpose**: Statistics dashboard with detailed analytics
- **Props**: `showStats`, `libraryItems`, `stats`
- **Features**: Animated expand/collapse, rating distribution charts, genre breakdown

### `LibraryFilters.tsx`
- **Purpose**: Floating filters menu with all filtering options
- **Props**: All filter states and their setters, export functions
- **Features**: Animated menu, keyboard shortcuts, export functionality

### `LibraryItemCard.tsx`
- **Purpose**: Reusable card component for both grid and list views
- **Props**: Item data, view mode, interaction handlers
- **Features**: Heart animations, copy functionality, responsive layouts

### `LibraryModal.tsx`
- **Purpose**: Detailed modal view for library items
- **Props**: Selected item, navigation functions, utility functions
- **Features**: Color extraction, related items, keyboard navigation

### `LibraryResults.tsx`
- **Purpose**: Results summary display
- **Props**: Item count and search query
- **Features**: Dynamic text based on search state

## Hooks

### `useLibrary.ts`
- **Purpose**: Custom hook managing all library state and logic
- **Features**: 
  - State management for filters, view modes, favorites
  - LocalStorage persistence
  - Filtering and sorting logic
  - Statistics calculations
  - Export functionality

## Utilities

### `library-utils.ts`
- **Purpose**: Pure utility functions for library operations
- **Functions**:
  - `getCreatorLabel()` - Get author/director/creator label
  - `getStatusColor()` - Get CSS classes for status badges
  - `getReadingTime()` - Calculate estimated reading/watching time
  - `getSeriesInfo()` - Get series information
  - `getRelationshipLabel()` - Get relationship type labels
  - `getRelatedItems()` - Find related items algorithm
  - `calculateStatistics()` - Calculate library statistics
  - `exportToCSV()` - Export data to CSV
  - `exportToJSON()` - Export data to JSON

## Best Practices Implemented

1. **Separation of Concerns**: Each component has a single responsibility
2. **DRY Principle**: Common logic extracted to utilities and hooks
3. **Type Safety**: Full TypeScript support with proper interfaces
4. **Performance**: Memoization and efficient rendering patterns
5. **Accessibility**: Proper ARIA labels and keyboard navigation
6. **Responsive Design**: Mobile-first approach with Tailwind CSS
7. **State Management**: Centralized state in custom hook
8. **Error Handling**: Graceful fallbacks and error boundaries
9. **Testing Ready**: Pure functions and isolated components
10. **Documentation**: Clear component purposes and prop interfaces

## Usage Example

```tsx
import { useLibrary } from '@/hooks/useLibrary';
import LibraryHero from '@/components/library/LibraryHero';
import LibraryStats from '@/components/library/LibraryStats';
// ... other imports

export default function LibraryPage() {
  const {
    // State and functions from hook
    stats,
    showStats,
    // ... other destructured values
  } = useLibrary();

  return (
    <Layout>
      <LibraryHero stats={stats} />
      <LibraryStats showStats={showStats} stats={stats} />
      {/* ... other components */}
    </Layout>
  );
}
```

## File Structure

```
src/
├── components/
│   └── library/
│       ├── LibraryHero.tsx
│       ├── LibraryStats.tsx
│       ├── LibraryFilters.tsx
│       ├── LibraryItemCard.tsx
│       ├── LibraryModal.tsx
│       ├── LibraryResults.tsx
│       └── README.md
├── hooks/
│   └── useLibrary.ts
└── lib/
    └── library-utils.ts
```

This modular approach makes the codebase more maintainable, testable, and follows React/Next.js best practices. 