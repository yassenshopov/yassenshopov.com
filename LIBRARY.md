# Library Page Documentation

## Overview

The Library page is a unified media tracking system that allows you to manage and showcase your books, movies, and series with reviews, ratings, and personal notes.

## Features

- **Multi-media Support**: Track books, movies, and TV series in one place
- **Status Tracking**: Mark items as completed, in-progress, want-to-read, or want-to-watch
- **Rating System**: 5-star rating system for all media
- **Personal Notes**: Add your thoughts and reviews
- **Genre Tagging**: Categorize items by genre
- **External Links**: Link to Goodreads, Amazon, IMDB, Netflix, etc.
- **Filtering**: Filter by media type and status
- **Responsive Design**: Works on all devices

## Adding New Items

To add new books, movies, or series, edit the `src/data/library.ts` file:

```typescript
{
  id: 'unique-id',
  title: 'Item Title',
  author: 'Author Name', // For books
  director: 'Director Name', // For movies
  creator: 'Creator Name', // For series
  type: 'book' | 'movie' | 'series',
  rating: 5, // 1-5 stars
  status: 'completed' | 'in-progress' | 'want-to-read' | 'want-to-watch',
  dateCompleted: '2024-01-15', // Optional
  dateStarted: '2024-01-01', // Optional
  genre: ['Genre1', 'Genre2'],
  description: 'Brief description of the item',
  notes: 'Your personal thoughts and review',
  coverImage: '/path/to/cover/image.jpg', // Optional
  links: {
    goodreads: 'https://goodreads.com/...',
    amazon: 'https://amazon.com/...',
    imdb: 'https://imdb.com/...',
    netflix: 'https://netflix.com/...'
  }
}
```

## Customization

### Adding New Media Types

To add new media types (e.g., podcasts, games):

1. Update the `LibraryItem` interface in `src/data/library.ts`
2. Add the new type to the `mediaTypes` array
3. Add appropriate icons and handling in the component

### Adding New Status Types

Update the `statusTypes` array in `src/data/library.ts` to add new status options.

### Styling

The page uses your existing design system with:
- Tailwind CSS for styling
- Framer Motion for animations
- Lucide React for icons
- Your custom UI components

## File Structure

```
src/
├── app/library/
│   └── page.tsx          # Main library page component
├── data/
│   └── library.ts        # Library data and types
└── components/ui/
    └── badge.tsx         # Badge component for status/genres
```

## Usage Tips

1. **Regular Updates**: Keep your library updated by adding new items as you consume them
2. **Detailed Notes**: Add meaningful notes to help others discover great content
3. **Accurate Ratings**: Use the full 1-5 star range for better recommendations
4. **External Links**: Always add relevant links for easy access
5. **Cover Images**: Add cover images for better visual appeal (optional)

## Future Enhancements

Possible improvements you could add:
- Search functionality
- Sort by rating/date
- Export to CSV/JSON
- Reading/watching goals tracking
- Social sharing
- Integration with external APIs (Goodreads, TMDB)
- Statistics dashboard 