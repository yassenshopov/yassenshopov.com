import { describe, it, expect } from 'vitest';
import type { LibraryItem } from '@/data/library';
import {
  getCreatorLabel,
  getStatusColor,
  getSeriesInfo,
  getRelationshipLabel,
  getRelatedItems,
  getEntryYears,
  calculateStatistics,
} from './library-utils';

function makeItem(overrides: Partial<LibraryItem> & { id: string }): LibraryItem {
  return {
    title: `Title ${overrides.id}`,
    type: 'book',
    rating: null,
    status: 'completed',
    genre: [],
    description: '',
    ...overrides,
  };
}

describe('getCreatorLabel', () => {
  it('returns the right field per media type', () => {
    expect(getCreatorLabel(makeItem({ id: 'a', type: 'book', author: 'Author' }))).toBe('Author');
    expect(getCreatorLabel(makeItem({ id: 'b', type: 'movie', director: 'Director' }))).toBe(
      'Director'
    );
    expect(getCreatorLabel(makeItem({ id: 'c', type: 'series', creator: 'Creator' }))).toBe(
      'Creator'
    );
  });

  it('returns empty string when the field is missing', () => {
    expect(getCreatorLabel(makeItem({ id: 'd', type: 'book' }))).toBe('');
  });
});

describe('getStatusColor', () => {
  it('returns distinct classes for known statuses', () => {
    expect(getStatusColor('completed')).toContain('green');
    expect(getStatusColor('in-progress')).toContain('blue');
    expect(getStatusColor('dnf')).toContain('rose');
    expect(getStatusColor('want-to-read')).toContain('amber');
  });

  it('falls back to a neutral class for unknown statuses', () => {
    expect(getStatusColor('mystery')).toContain('gray');
  });
});

describe('getEntryYears', () => {
  it('returns descending unique years from entries', () => {
    const item = makeItem({
      id: 'e',
      entries: [
        { status: 'completed', dateCompleted: '2022-04-01' },
        { status: 'completed', dateCompleted: '2026-01-01' },
        { status: 'completed', dateStarted: '2022-01-01' },
      ],
    });
    expect(getEntryYears(item)).toEqual([2026, 2022]);
  });

  it('returns an empty array for wishlist items with no entries', () => {
    expect(getEntryYears(makeItem({ id: 'f', status: 'want-to-read' }))).toEqual([]);
  });
});

describe('getSeriesInfo', () => {
  const all = [
    makeItem({ id: 's2', series: 'Saga', seriesOrder: 2 }),
    makeItem({ id: 's1', series: 'Saga', seriesOrder: 1 }),
    makeItem({ id: 's3', series: 'Saga', seriesOrder: 3 }),
    makeItem({ id: 'x', series: 'Other', seriesOrder: 1 }),
  ];

  it('orders series items by seriesOrder and locates the current one', () => {
    const info = getSeriesInfo(all[0], all);
    expect(info).not.toBeNull();
    expect(info!.totalItems).toBe(3);
    expect(info!.items.map((i) => i.id)).toEqual(['s1', 's2', 's3']);
    expect(info!.currentIndex).toBe(1);
  });

  it('returns null for an item not in a series', () => {
    expect(getSeriesInfo(makeItem({ id: 'lone' }), all)).toBeNull();
  });
});

describe('getRelationshipLabel', () => {
  it('labels explicit adaptations by target type', () => {
    const book = makeItem({ id: 'book', relationships: { adaptations: ['movie'] } });
    const movie = makeItem({ id: 'movie', type: 'movie' });
    expect(getRelationshipLabel(book, movie)).toBe('Movie Adaptation');
  });

  it('labels sequels and prequels', () => {
    const from = makeItem({ id: 'one', relationships: { sequel: 'two', prequel: 'zero' } });
    expect(getRelationshipLabel(from, makeItem({ id: 'two' }))).toBe('Sequel');
    expect(getRelationshipLabel(from, makeItem({ id: 'zero' }))).toBe('Prequel');
  });

  it('derives series position when no explicit relationship exists', () => {
    const from = makeItem({ id: 'b1', series: 'Saga', seriesOrder: 1 });
    const next = makeItem({ id: 'b2', series: 'Saga', seriesOrder: 2 });
    expect(getRelationshipLabel(from, next)).toBe('Next in Series');
    expect(getRelationshipLabel(next, from)).toBe('Previous in Series');
  });

  it('defaults to "Related"', () => {
    expect(getRelationshipLabel(makeItem({ id: 'p' }), makeItem({ id: 'q' }))).toBe('Related');
  });
});

describe('getRelatedItems', () => {
  it('prioritises explicit relationships, then fills with scored similarity', () => {
    const target = makeItem({
      id: 'target',
      genre: ['scifi'],
      relationships: { related: ['explicit'] },
    });
    const explicit = makeItem({ id: 'explicit', genre: ['romance'] });
    const sameGenre = makeItem({ id: 'genre-match', genre: ['scifi'] });
    const unrelated = makeItem({ id: 'unrelated', genre: ['cooking'] });

    const related = getRelatedItems(target, [target, explicit, sameGenre, unrelated], 2);
    expect(related[0].id).toBe('explicit');
    expect(related.map((r) => r.id)).toContain('genre-match');
    expect(related.map((r) => r.id)).not.toContain('target');
  });

  it('respects the limit', () => {
    const target = makeItem({ id: 't', genre: ['a'] });
    const pool = Array.from({ length: 10 }, (_, i) => makeItem({ id: `p${i}`, genre: ['a'] }));
    expect(getRelatedItems(target, [target, ...pool], 3)).toHaveLength(3);
  });
});

describe('calculateStatistics', () => {
  it('counts only completed items and computes the average rating', () => {
    const items = [
      makeItem({ id: 'b1', type: 'book', status: 'completed', rating: 5, genre: ['scifi'] }),
      makeItem({ id: 'b2', type: 'book', status: 'completed', rating: 3, genre: ['scifi'] }),
      makeItem({ id: 'm1', type: 'movie', status: 'completed', rating: 4, genre: ['drama'] }),
      makeItem({ id: 'wish', type: 'book', status: 'want-to-read', rating: null }),
      makeItem({ id: 'wip', type: 'series', status: 'in-progress', rating: null }),
    ];
    const stats = calculateStatistics(items);
    expect(stats.totalCompleted).toBe(3);
    expect(stats.books).toBe(2);
    expect(stats.movies).toBe(1);
    expect(stats.series).toBe(0);
    expect(stats.avgRating).toBeCloseTo(4, 5);
    expect(stats.fiveStarCount).toBe(1);
    expect(stats.topGenres[0][0]).toBe('scifi');
  });

  it('handles an empty list without dividing by zero', () => {
    const stats = calculateStatistics([]);
    expect(stats.totalCompleted).toBe(0);
    expect(stats.avgRating).toBe(0);
    expect(stats.topGenres).toEqual([]);
  });
});
