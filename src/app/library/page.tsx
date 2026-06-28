import { getLibraryItems } from '@/data/library.server';
import { LibraryView } from '@/components/library/LibraryView';

// Server component: the catalogue is loaded and validated server-side, then the
// trimmed list is handed to the client island. Keeps `library-items.json` + Zod
// out of the browser bundle.
export default function LibraryPage() {
  const items = getLibraryItems();
  return <LibraryView items={items} />;
}
