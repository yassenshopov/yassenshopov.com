import itemsData from './library-items.json';

export interface LibraryItem {
  id: string;
  title: string;
  author?: string;
  director?: string;
  creator?: string;
  type: 'book' | 'movie' | 'series';
  rating: number | null;
  status:
    | 'completed'
    | 'in-progress'
    | 'on-pause'
    | 'dnf'
    | 'want-to-read'
    | 'want-to-watch';
  year?: number;
  topics?: string[];
  externalUrl?: string;
  dateCompleted?: string;
  dateStarted?: string;
  genre: string[];
  description: string;
  notes?: string;
  coverImage?: string;
  series?: string;
  seriesOrder?: number;
  relationships?: {
    adaptations?: string[];
    basedOn?: string[];
    sequel?: string;
    prequel?: string;
    related?: string[];
    sameUniverse?: string[];
  };
  links?: {
    goodreads?: string;
    amazon?: string;
    imdb?: string;
    netflix?: string;
    spotify?: string;
    youtube?: string;
    [key: string]: string | undefined;
  };
}

export const libraryItems: LibraryItem[] = itemsData as LibraryItem[];
