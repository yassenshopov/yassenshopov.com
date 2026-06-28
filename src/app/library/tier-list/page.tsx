import { getLibraryItems } from '@/data/library.server';
import { LibraryTierListView } from '@/components/library/LibraryTierListView';

// Server component: loads + validates the catalogue server-side and passes it
// into the interactive tier-list island. Tier assignments themselves are small
// and stay client-side (see `data/library-tiers.ts`).
export default function LibraryTierListPage() {
  const items = getLibraryItems();
  return <LibraryTierListView items={items} />;
}
