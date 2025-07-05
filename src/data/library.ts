export interface LibraryItem {
  id: string;
  title: string;
  author?: string; // For books
  director?: string; // For movies
  creator?: string; // For series
  type: 'book' | 'movie' | 'series';
  rating: number; // 1-5 stars
  status: 'completed' | 'in-progress' | 'want-to-read' | 'want-to-watch';
  dateCompleted?: string;
  dateStarted?: string;
  genre: string[];
  description: string;
  notes?: string;
  coverImage?: string;
  // New relationship fields
  series?: string; // Name of the series/collection this belongs to
  seriesOrder?: number; // Order within the series (1, 2, 3, etc.)
  relationships?: {
    adaptations?: string[]; // IDs of adaptations (book -> movie, etc.)
    basedOn?: string[]; // IDs of source material
    sequel?: string; // ID of the sequel
    prequel?: string; // ID of the prequel
    related?: string[]; // IDs of related works
    sameUniverse?: string[]; // IDs of works in same universe
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

export const libraryItems: LibraryItem[] = [
  {
    id: '1',
      title: 'Money Heist',
      creator: 'Álex Pina',
      type: 'series',
      rating: 5,
      status: 'completed',
      dateCompleted: '2025-06-01',
      genre: ['Crime', 'Drama', 'Thriller'],
      description: 'A criminal mastermind who goes by "The Professor" has a plan to pull off the biggest heist in recorded history.',
      coverImage: '/resources/images/library/money-heist.webp',
      links: {
        imdb: 'https://www.imdb.com/title/tt6468322/'
      }
    },
      {
      id: '2',
      title: 'Lilo & Stitch (2025)',
      director: 'Dean DeBlois',
      type: 'movie',
      rating: 4,
      status: 'completed',
      dateCompleted: '2025-06-01',
      genre: ['Animation', 'Family', 'Comedy'],
      description: 'A Hawaiian girl adopts an unusual pet who is actually a notorious extra-terrestrial fugitive.',
      coverImage: '/resources/images/library/lilo-and-stitch.webp',
      links: {
        imdb: 'https://www.imdb.com/title/tt0275847/'
      }
    },
    {
      id: '3',
      title: 'The Last of Us',
      creator: 'Craig Mazin, Neil Druckmann',
      type: 'series',
      rating: 5,
      status: 'completed',
      dateCompleted: '2025-05-01',
      genre: ['Post-apocalyptic', 'Drama', 'Survival', 'Adaptation'],
      description: 'Following the events of Season 1, Ellie and Joel\'s journey continues as they face new challenges in a world still ravaged by the fungal infection. Based on the critically acclaimed video game \'The Last of Us Part II\', this season promises to explore themes of revenge, consequences, and the cycle of violence, while testing the bonds formed in their previous journey.',
      coverImage: '/resources/images/library/the-last-of-us.webp',
      links: {
        imdb: 'https://www.imdb.com/title/tt1888075/'
      }
    },
    {
      id: '4',
      title: 'Thunderbolts',
      director: 'Jake Schreier',
      type: 'movie',
      rating: 4,
      status: 'completed',
      dateCompleted: '2025-05-01',
      genre: ['Action', 'Superhero', 'Adventure'],
      description: 'A team of antiheroes from the Marvel Cinematic Universe come together for a mission.',
      coverImage: '/resources/images/library/thunderbolts.webp',
      links: {
        imdb: 'https://www.imdb.com/title/tt13651794/'
      }
    },
    {
      id: '5',
      title: 'Gundi',
      type: 'movie',
      rating: 4,
      status: 'completed',
      dateCompleted: '2025-03-01',
      genre: ['Drama'],
      description: 'A compelling drama exploring personal and social themes.',
      coverImage: '/resources/images/library/gundi.webp',
      links: {}
    },
  {
    id: '6',
    title: 'Peaky Blinders',
    creator: 'Steven Knight',
    type: 'series',
    rating: 5,
    status: 'completed',
    dateCompleted: '2025-02-01',
    genre: ['Crime', 'Drama', 'Historical'],
    description: 'A gangster family epic set in 1900s England, centering on a gang who sew razor blades in the peaks of their caps, and their fierce boss Tommy Shelby.',
      coverImage: '/resources/images/library/peaky-blinders.webp',
    links: {
      imdb: 'https://www.imdb.com/title/tt2442560/'
    }
  },
  {
    id: '7',
    title: 'Gladiator II',
    director: 'Ridley Scott',
    type: 'movie',
    rating: 4,
    status: 'completed',
    dateCompleted: '2025-01-01',
    genre: ['Action', 'Drama', 'Historical'],
    description: 'The sequel to the epic historical drama Gladiator, continuing the story in ancient Rome.',
      coverImage: '/resources/images/library/gladiator-ii.webp',
    links: {
      imdb: 'https://www.imdb.com/title/tt9218128/'
    }
  },
  {
    id: '8',
    title: 'Paddington in Peru',
    director: 'Dougal Wilson',
    type: 'movie',
    rating: 4,
    status: 'completed',
    dateCompleted: '2025-01-01',
    genre: ['Family', 'Adventure', 'Comedy'],
    description: 'Paddington travels to Peru to visit his beloved Aunt Lucy, who now resides at the Home for Retired Bears.',
      coverImage: '/resources/images/library/paddington-in-peru.webp',
    links: {
      imdb: 'https://www.imdb.com/title/tt8076346/'
    }
  },
  {
    id: '9',
    title: 'Undercover',
    creator: 'Nico Moolenaar',
    type: 'series',
    rating: 4,
    status: 'completed',
    dateCompleted: '2024-12-01',
    genre: ['Crime', 'Drama', 'Thriller'],
    description: 'Undercover agents infiltrate a drug ring, but their mission becomes complicated when personal and professional lines blur.',
      coverImage: '/resources/images/library/undercover.webp',
    links: {
      imdb: 'https://www.imdb.com/title/tt9016974/'
    }
  },
      {
      id: '10',
      title: 'Joker: Folie à Deux',
      director: 'Todd Phillips',
      type: 'movie',
      rating: 3,
      status: 'completed',
      dateCompleted: '2024-10-01',
      genre: ['Drama', 'Crime', 'Musical'],
      description: 'The sequel to Joker, exploring Arthur Fleck\'s continued descent into madness alongside Harley Quinn.',
      coverImage: '/resources/images/library/joker-folie-deux.webp',
      links: {
        imdb: 'https://www.imdb.com/title/tt11315808/'
      }
    },
    {
      id: '11',
      title: 'Fight Club',
    director: 'David Fincher',
      type: 'movie',
      rating: 5,
      status: 'completed',
      dateCompleted: '2024-09-01',
      genre: ['Drama', 'Thriller'],
      description: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.',
      coverImage: '/resources/images/library/fight-club.webp',
      links: {
        imdb: 'https://www.imdb.com/title/tt0137523/'
      }
    },
  {
    id: '12',
    title: 'The Boys',
    creator: 'Eric Kripke',
    type: 'series',
    rating: 5,
    status: 'completed',
    dateCompleted: '2024-08-01',
    genre: ['Action', 'Comedy', 'Crime', 'Superhero'],
    description: 'In a world where superheroes abuse their powers, a group of vigilantes known as "The Boys" sets out to expose the corrupt and dangerous actions of these superhumans. Led by the determined and vengeful Billy Butcher, they embark on a mission to take down the most powerful and revered superhero group, "The Seven," while uncovering dark secrets along the way.',
      coverImage: '/resources/images/library/the-boys.webp',
    links: {
      imdb: 'https://www.imdb.com/title/tt1190634/'
    }
  },
      {
      id: '13',
      title: 'Inside Out 2',
      director: 'Kelsey Mann',
      type: 'movie',
      rating: 4,
      status: 'completed',
      dateCompleted: '2024-07-01',
      genre: ['Animation', 'Family', 'Comedy'],
      description: 'The sequel to Inside Out, continuing Riley\'s emotional journey as she navigates new challenges.',
      coverImage: '/resources/images/library/inside-out-2.webp',
      links: {
        imdb: 'https://www.imdb.com/title/tt22022452/'
      }
    },
    {
      id: '14',
      title: 'Despicable Me 4',
      director: 'Chris Renaud',
      type: 'movie',
      rating: 3,
      status: 'completed',
      dateCompleted: '2024-07-01',
      genre: ['Animation', 'Family', 'Comedy'],
      description: 'Gru and his family face new adventures and challenges in the fourth installment of the beloved franchise.',
      coverImage: '/resources/images/library/despicable-me-4.webp',
      links: {}
    },
  {
    id: '15',
    title: 'Creed III',
    director: 'Michael B. Jordan',
    type: 'movie',
    rating: 4,
    status: 'completed',
    dateCompleted: '2024-06-01',
    genre: ['Drama', 'Sport'],
    description: 'Adonis Creed faces his most formidable opponent yet in this third installment of the Creed series.',
      coverImage: '/resources/images/library/creed-iii.webp',
    links: {
      imdb: 'https://www.imdb.com/title/tt11145118/'
    }
  },
      {
      id: '16',
      title: 'Creed II',
      director: 'Steven Caple Jr.',
      type: 'movie',
      rating: 4,
      status: 'completed',
      dateCompleted: '2024-06-01',
      genre: ['Drama', 'Sport'],
      description: 'Adonis Creed faces the son of Ivan Drago, the man who killed his father Apollo Creed in the ring.',
      coverImage: '/resources/images/library/creed-ii.webp',
      links: {
        imdb: 'https://www.imdb.com/title/tt6343314/'
      }
    },
    {
      id: '17',
      title: 'Project Hail Mary',
      author: 'Andy Weir',
      type: 'book',
      rating: 5,
      status: 'completed',
      genre: ['Sci-Fi', 'Science', 'Adventure'],
      description: 'A lone astronaut must save humanity in this thrilling science fiction novel about problem-solving, friendship, and sacrifice.',
      coverImage: '/resources/images/library/project-hail-mary.webp',
      links: {}
    },
    {
      id: '18',
      title: 'The Ballad of Songbirds and Snakes',
      author: 'Suzanne Collins',
      type: 'book',
      rating: 4,
      status: 'completed',
      dateCompleted: '2023-11-01',
      genre: ['Dystopian', 'Survival', 'Political', 'Young Adult'],
      description: 'A prequel to The Hunger Games trilogy, exploring the early days of Panem and the origins of President Snow.',
      coverImage: '/resources/images/library/the-ballad-of-songbirds-and-snakes.webp',
      series: 'The Hunger Games',
      seriesOrder: 0, // Prequel
      relationships: {
        related: ['40', '41', '42'], // The main trilogy
        adaptations: ['43'] // Movie adaptation
      },
      links: {}
    },
    {
      id: '19',
      title: 'The Martian',
      author: 'Andy Weir',
      type: 'book',
      rating: 5,
      status: 'completed',
      genre: ['Sci-Fi', 'Science', 'Adventure'],
      description: 'An astronaut becomes stranded on Mars and must use his ingenuity to survive while awaiting rescue.',
      coverImage: '/resources/images/library/the-martian.webp',
      links: {}
    },
    {
      id: '20',
      title: '12 Rules for Life: An Antidote to Chaos',
      author: 'Jordan B. Peterson',
      type: 'book',
      rating: 4,
      status: 'completed',
      dateCompleted: '2023-04-01',
      genre: ['Advice', 'Non-fiction', 'Psychology', 'Self-improvement'],
      description: 'A set of principles for living a meaningful life, combining psychology, philosophy, and personal anecdotes.',
      coverImage: '/resources/images/library/12-rules-for-life-an-antidote-to-chaos.webp',
      links: {}
    },
    {
      id: '21',
      title: 'Beyond Order: 12 More Rules for Life',
      author: 'Jordan B. Peterson',
      type: 'book',
      rating: 4,
      status: 'completed',
      dateCompleted: '2023-07-01',
      genre: ['Advice', 'Non-fiction', 'Psychology', 'Self-improvement'],
      description: 'The sequel to 12 Rules for Life, offering additional principles for navigating life\'s complexities.',
      coverImage: '/resources/images/library/beyond-order-12-more-rules-for-life.webp',
      links: {}
    },
    {
      id: '22',
      title: 'The Poppy War',
      author: 'Rebecca Kuang',
      type: 'book',
      rating: 4,
      status: 'completed',
      dateCompleted: '2024-01-01',
      genre: ['Fantasy', 'Political', 'Young Adult'],
      description: 'A grimdark military fantasy inspired by 20th-century Chinese history, following a war orphan who discovers her deadly powers.',
      coverImage: '/resources/images/library/the-poppy-war.webp',
      links: {}
    },
    {
      id: '23',
      title: 'Everything is F*cked',
      author: 'Mark Manson',
      type: 'book',
      rating: 4,
      status: 'completed',
      dateCompleted: '2021-11-01',
      genre: ['Non-fiction', 'Psychology', 'Self-improvement'],
      description: 'A book about hope, exploring why we struggle to find meaning in modern life and how to build resilience.',
      coverImage: '/resources/images/library/everything-is-fcked.webp',
      links: {}
    },
    {
      id: '24',
      title: 'The Subtle Art of Not Giving a F*ck',
      author: 'Mark Manson',
      type: 'book',
      rating: 4,
      status: 'completed',
      genre: ['Non-fiction', 'Psychology', 'Self-improvement'],
      description: 'A counterintuitive approach to living a good life by focusing on what truly matters and letting go of what doesn\'t.',
      coverImage: '/resources/images/library/the-subtle-art-of-not-giving-a-fck.webp',
      links: {}
    },
    {
      id: '25',
      title: 'Lifespan: Why We Age - and Why We Don\'t Have To',
      author: 'David Sinclair',
      type: 'book',
      rating: 4,
      status: 'completed',
      genre: ['Non-fiction', 'Science'],
      description: 'A groundbreaking exploration of aging and longevity research, offering insights into extending human lifespan.',
      coverImage: '/resources/images/library/lifespan-why-we-age-and-why-we-dont-have-to.webp',
      links: {}
    },
    {
      id: '26',
      title: 'Dotcom Secrets',
      author: 'Russell Brunson',
      type: 'book',
      rating: 4,
      status: 'completed',
      dateCompleted: '2023-08-01',
      genre: ['Non-fiction', 'Business', 'Marketing'],
      description: 'The underground playbook for growing your company online with sales funnels and digital marketing strategies.',
      coverImage: '/resources/images/library/dotcom-secrets.webp',
      links: {}
    },
    {
      id: '27',
      title: 'Immune: A Journey into the Mysterious System That Keeps You Alive',
      author: 'Philipp Dettmer',
      type: 'book',
      rating: 4,
      status: 'completed',
      dateCompleted: '2023-12-01',
      genre: ['Non-fiction', 'Science'],
      description: 'An accessible and engaging exploration of the human immune system and how it protects us from disease.',
      coverImage: '/resources/images/library/immune-a-journey-into-the-mysterious-system-that-keeps-you-alive.webp',
      links: {}
    },
    {
      id: '28',
      title: 'Outlive: The Science and Art of Longevity',
      author: 'Peter Attia',
      type: 'book',
      rating: 4,
      status: 'completed',
      dateCompleted: '2023-09-01',
      genre: ['Non-fiction', 'Science'],
      description: 'A comprehensive guide to living longer and healthier through evidence-based strategies for longevity.',
      coverImage: '/resources/images/library/outlive-the-science-and-art-of-longevity.webp',
      links: {}
    },
    {
      id: '29',
      title: 'Всички и никой',
      author: 'Yordan Radichkov',
      type: 'book',
      rating: 4,
      status: 'completed',
      dateCompleted: '2023-06-01',
      genre: ['Realism', 'Thriller & Mystery'],
      description: 'A Bulgarian literary work exploring themes of identity and society.',
      coverImage: '/resources/images/library/vsichki-i-nikoj.webp',
      links: {}
    },
    {
      id: '30',
      title: 'Transcend: 9 Steps to Living Well Forever',
      author: 'Ray Kurzweil',
      type: 'book',
      rating: 4,
      status: 'completed',
      dateCompleted: '2023-05-01',
      genre: ['Non-fiction', 'Science'],
      description: 'A guide to extending human lifespan through technology, nutrition, and lifestyle optimization.',
      coverImage: '/resources/images/library/transcend-9-steps-to-living-well-forever.webp',
      links: {}
    },
    {
      id: '31',
      title: 'Killing Commendatore',
      author: 'Haruki Murakami',
      type: 'book',
      rating: 4,
      status: 'completed',
      dateCompleted: '2023-05-01',
      genre: ['Fantasy', 'Thriller & Mystery'],
      description: 'A surreal novel about a portrait painter who discovers a mysterious painting that changes his life.',
      coverImage: '/resources/images/library/killing-commendatore.webp',
      links: {}
    },
    {
      id: '32',
      title: 'The Chrysalids',
      author: 'John Wyndham',
      type: 'book',
      rating: 4,
      status: 'completed',
      dateCompleted: '2023-03-01',
      genre: ['Fantasy', 'Dystopian', 'Supernatural'],
      description: 'A post-apocalyptic novel about telepathic children in a society that fears genetic mutations.',
      coverImage: '/resources/images/library/the-chrysalids.webp',
      links: {}
    },
    {
      id: '33',
      title: 'Design for How People Think: Using Brain Science to Build Better Products',
      author: 'John Whalen',
      type: 'book',
      rating: 4,
      status: 'completed',
      dateCompleted: '2023-02-01',
      genre: ['Non-fiction', 'Marketing', 'Psychology', 'Design'],
      description: 'A guide to creating user-centered products by understanding how the human brain processes information.',
      coverImage: '/resources/images/library/design-for-how-people-think-using-brain-science-to-build-better-products.webp',
      links: {}
    },
    {
      id: '34',
      title: 'The Science of Storytelling: Why Stories Make Us Human, and How to Tell Them Better',
      author: 'Will Storr',
      type: 'book',
      rating: 4,
      status: 'completed',
      dateCompleted: '2023-02-01',
      genre: ['Non-fiction', 'Psychology', 'Creativity'],
      description: 'An exploration of the psychology behind storytelling and how to craft compelling narratives.',
      coverImage: '/resources/images/library/the-science-of-storytelling-why-stories-make-us-human-and-how-to-tell-them-better.webp',
      links: {}
    },
    {
      id: '35',
      title: 'A Clash of Kings',
      author: 'George R. R. Martin',
      type: 'book',
      rating: 5,
      status: 'completed',
      dateCompleted: '2022-12-01',
      genre: ['Fantasy Fiction', 'High Fantasy', 'Political Fiction'],
      description: 'The second book in A Song of Ice and Fire series, continuing the epic tale of war and politics in Westeros.',
      coverImage: '/resources/images/library/a-clash-of-kings.webp',
      series: 'A Song of Ice and Fire',
      seriesOrder: 2,
      relationships: {
        prequel: '36',
        sequel: '48',
        related: ['36', '48'],
        adaptations: ['49']
      },
      links: {}
    },
    {
      id: '36',
      title: 'A Game of Thrones',
      author: 'George R. R. Martin',
      type: 'book',
      rating: 5,
      status: 'completed',
      dateCompleted: '2022-10-01',
      genre: ['Fantasy Fiction', 'High Fantasy', 'Political Fiction'],
      description: 'The first book in the epic A Song of Ice and Fire series, introducing the world of Westeros and its complex characters.',
      coverImage: '/resources/images/library/a-game-of-thrones.webp',
      series: 'A Song of Ice and Fire',
      seriesOrder: 1,
      relationships: {
        sequel: '35',
        related: ['35', '48'],
        adaptations: ['49']
      },
      links: {}
    },
    {
      id: '37',
      title: 'The E-Myth Revisited',
      author: 'Michael E. Gerber',
      type: 'book',
      rating: 4,
      status: 'completed',
      genre: ['Non-fiction', 'Business', 'Productivity'],
      description: 'A guide to building successful businesses by working on your business, not just in it.',
      coverImage: '/resources/images/library/the-emyth-revisited.webp',
      links: {}
    },
    {
      id: '38',
      title: 'Building a Second Brain',
      author: 'Tiago Forte',
      type: 'book',
      rating: 4,
      status: 'completed',
      genre: ['Non-fiction', 'Organisation', 'Productivity'],
      description: 'A proven method for organizing your digital life and unlocking your creative potential.',
      coverImage: '/resources/images/library/building-a-second-brain.webp',
      links: {}
    },
    {
      id: '39',
      title: 'Thirst',
      author: 'Zachary Karabashliev',
    type: 'book',
    rating: 4,
      status: 'completed',
      genre: ['Realism'],
      description: 'A contemporary Bulgarian novel exploring themes of desire and human nature.',
      coverImage: '/resources/images/library/thirst.webp',
      links: {}
  },
  // The Hunger Games Series
  {
    id: '40',
    title: 'The Hunger Games',
    author: 'Suzanne Collins',
    type: 'book',
    rating: 5,
    status: 'completed',
    dateCompleted: '2023-10-01',
    genre: ['Dystopian', 'Survival', 'Political', 'Young Adult'],
    description: 'In a dark vision of the near future, sixteen-year-old Katniss Everdeen is forced to compete in the Hunger Games, a televised fight to the death.',
    coverImage: '/resources/images/library/the-hunger-games.webp',
    series: 'The Hunger Games',
    seriesOrder: 1,
    relationships: {
      sequel: '41',
      related: ['18', '41', '42'], // Prequel and other books
      adaptations: ['44', '45'] // Movie adaptations
    },
    links: {}
  },
  {
    id: '41',
    title: 'Catching Fire',
    author: 'Suzanne Collins',
    type: 'book',
    rating: 5,
    status: 'completed',
    dateCompleted: '2023-10-15',
    genre: ['Dystopian', 'Survival', 'Political', 'Young Adult'],
    description: 'Katniss Everdeen and Peeta Mellark become targets of the Capitol after their victory in the 74th Hunger Games sparks a rebellion.',
    coverImage: '/resources/images/library/catching-fire.webp',
    series: 'The Hunger Games',
    seriesOrder: 2,
    relationships: {
      prequel: '40',
      sequel: '42',
      related: ['18', '40', '42'],
      adaptations: ['46']
    },
    links: {}
  },
  {
    id: '42',
    title: 'Mockingjay',
    author: 'Suzanne Collins',
    type: 'book',
    rating: 4,
    status: 'completed',
    dateCompleted: '2023-11-01',
    genre: ['Dystopian', 'Survival', 'Political', 'Young Adult'],
    description: 'Katniss Everdeen reluctantly becomes the symbol of a mass rebellion against the autocratic Capitol.',
    coverImage: '/resources/images/library/mockingjay.webp',
    series: 'The Hunger Games',
    seriesOrder: 3,
    relationships: {
      prequel: '41',
      related: ['18', '40', '41'],
      adaptations: ['47', '48']
    },
    links: {}
  },
  // Movie Adaptations
  {
    id: '43',
    title: 'The Ballad of Songbirds and Snakes (2023)',
    director: 'Francis Lawrence',
    type: 'movie',
    rating: 4,
    status: 'completed',
    dateCompleted: '2023-11-20',
    genre: ['Dystopian', 'Drama', 'Adaptation'],
    description: 'Years before he would become the tyrannical President of Panem, 18-year-old Coriolanus Snow is the last hope for his fading lineage.',
    coverImage: '/resources/images/library/ballad-movie.webp',
    series: 'The Hunger Games',
    seriesOrder: 0,
    relationships: {
      basedOn: ['18'],
      sameUniverse: ['44', '45', '46', '47', '48']
    },
    links: {}
  },
  {
    id: '44',
    title: 'The Hunger Games (2012)',
    director: 'Gary Ross',
    type: 'movie',
    rating: 4,
    status: 'completed',
    dateCompleted: '2023-10-05',
    genre: ['Dystopian', 'Action', 'Adaptation'],
    description: 'Katniss Everdeen voluntarily takes her younger sister\'s place in the Hunger Games: a televised competition in which two teenagers from each district fight to the death.',
    coverImage: '/resources/images/library/hunger-games-movie.webp',
    series: 'The Hunger Games',
    seriesOrder: 1,
    relationships: {
      basedOn: ['40'],
      sequel: '45',
      sameUniverse: ['43', '45', '46', '47', '48']
    },
    links: {}
  },
  {
    id: '45',
    title: 'The Hunger Games: Catching Fire (2013)',
    director: 'Francis Lawrence',
    type: 'movie',
    rating: 5,
    status: 'completed',
    dateCompleted: '2023-10-10',
    genre: ['Dystopian', 'Action', 'Adaptation'],
    description: 'Katniss and Peeta are forced to compete in the 75th Hunger Games, known as the Quarter Quell, against other previous victors.',
    coverImage: '/resources/images/library/catching-fire-movie.webp',
    series: 'The Hunger Games',
    seriesOrder: 2,
    relationships: {
      basedOn: ['41'],
      prequel: '44',
      sequel: '46',
      sameUniverse: ['43', '44', '46', '47', '48']
    },
    links: {}
  },
  {
    id: '46',
    title: 'The Hunger Games: Mockingjay - Part 1 (2014)',
    director: 'Francis Lawrence',
    type: 'movie',
    rating: 4,
    status: 'completed',
    dateCompleted: '2023-10-12',
    genre: ['Dystopian', 'Action', 'Adaptation'],
    description: 'Katniss becomes the reluctant leader of a rebellion against the Capitol, while Peeta is held captive and used against her.',
    coverImage: '/resources/images/library/mockingjay-part1.webp',
    series: 'The Hunger Games',
    seriesOrder: 3,
    relationships: {
      basedOn: ['42'],
      prequel: '45',
      sequel: '47',
      sameUniverse: ['43', '44', '45', '47', '48']
    },
    links: {}
  },
  {
    id: '47',
    title: 'The Hunger Games: Mockingjay - Part 2 (2015)',
    director: 'Francis Lawrence',
    type: 'movie',
    rating: 4,
    status: 'completed',
    dateCompleted: '2023-10-15',
    genre: ['Dystopian', 'Action', 'Adaptation'],
    description: 'Katniss and a team of rebels from District 13 prepare for the final battle that will decide the fate of Panem.',
    coverImage: '/resources/images/library/mockingjay-part2.webp',
    series: 'The Hunger Games',
    seriesOrder: 4,
    relationships: {
      basedOn: ['42'],
      prequel: '46',
      sameUniverse: ['43', '44', '45', '46', '48']
    },
    links: {}
  },
  // Game of Thrones relationships
  {
    id: '48',
    title: 'A Storm of Swords',
    author: 'George R. R. Martin',
    type: 'book',
    rating: 5,
    status: 'completed',
    dateCompleted: '2023-01-01',
    genre: ['Fantasy Fiction', 'High Fantasy', 'Political Fiction'],
    description: 'The third book in A Song of Ice and Fire series, featuring the Red Wedding and other pivotal events.',
    coverImage: '/resources/images/library/a-storm-of-swords.webp',
    series: 'A Song of Ice and Fire',
    seriesOrder: 3,
    relationships: {
      prequel: '35', // A Clash of Kings
      related: ['35', '36'], // Other books in series
      adaptations: ['49'] // Game of Thrones TV series
    },
    links: {}
  },
  {
    id: '49',
    title: 'Game of Thrones',
    creator: 'David Benioff, D.B. Weiss',
    type: 'series',
    rating: 5,
    status: 'completed',
    dateCompleted: '2023-02-01',
    genre: ['Fantasy', 'Drama', 'Political', 'Adaptation'],
    description: 'An epic fantasy series based on George R.R. Martin\'s A Song of Ice and Fire novels, featuring political intrigue and supernatural elements.',
    coverImage: '/resources/images/library/game-of-thrones-series.webp',
    series: 'A Song of Ice and Fire',
    relationships: {
      basedOn: ['35', '36', '48'], // Based on the books
      related: ['50'] // House of the Dragon
    },
    links: {}
  },
  {
    id: '50',
    title: 'House of the Dragon',
    creator: 'Ryan Condal, Miguel Sapochnik',
    type: 'series',
    rating: 4,
    status: 'completed',
    dateCompleted: '2023-03-01',
    genre: ['Fantasy', 'Drama', 'Political'],
    description: 'A prequel to Game of Thrones, focusing on the Targaryen civil war known as the Dance of the Dragons.',
    coverImage: '/resources/images/library/house-of-the-dragon.webp',
    series: 'A Song of Ice and Fire',
    seriesOrder: 0, // Prequel
    relationships: {
      related: ['49'], // Game of Thrones
      sameUniverse: ['35', '36', '48', '49']
    },
    links: {}
  },
  {
    id: '51',
    title: '18% Gray (2008)',
    author: 'Zachary Karabashliev',
    type: 'book',
    rating: 4,
    status: 'completed',
    genre: ['Realism'],
    description: 'A Bulgarian novel about a man searching for meaning and love across Europe and America.',
    coverImage: '/resources/images/library/18-percent-gray.webp',
    links: {}
  },
  {
    id: '52',
    title: 'Sunrise on the Reaping (2025)',
    author: 'Suzanne Collins',
    type: 'book',
    rating: 5,
    status: 'completed',
    genre: ['Dystopian', 'Survival', 'Political', 'Young Adult'],
    description: 'The upcoming fifth book in The Hunger Games series, set in Panem.',
    coverImage: '/resources/images/library/sunrise-on-the-reaping.webp',
    links: {}
  },
  {
    id: '53',
    title: '21 Lessons for the 21st Century',
    author: 'Yuval Noah Harari',
    type: 'book',
    rating: 5,
    status: 'completed',
    genre: ['Non-fiction'],
    description: 'A thought-provoking look at today\'s most urgent issues by the author of Sapiens.',
    coverImage: '/resources/images/library/21-lessons-for-the-21st-century.webp',
    links: {}
  },
  {
    id: '54',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    type: 'book',
    rating: 5,
    status: 'completed',
    genre: ['Non-fiction', 'Finances', 'Psychology'],
    description: 'Timeless lessons on wealth, greed, and happiness.',
    coverImage: '/resources/images/library/the-psychology-of-money.webp',
    links: {}
  },
  {
    id: '55',
    title: 'Prisoners of Geography',
    author: 'Tim Marshall',
    type: 'book',
    rating: 5,
    status: 'completed',
    genre: ['Geography', 'Politics', 'Non-fiction', 'History'],
    description: 'Ten maps that tell you everything you need to know about global politics.',
    coverImage: '/resources/images/library/prisoners-of-geography.webp',
    links: {}
  },
  {
    id: '56',
    title: 'The Millionaire Fastlane: Crack the Code to Wealth and Live Rich for a Lifetime!',
    author: 'M. J. DeMarco',
    type: 'book',
    rating: 5,
    status: 'completed',
    genre: ['Non-fiction', 'Finances', 'Business'],
    description: 'A roadmap to wealth and financial freedom.',
    coverImage: '/resources/images/library/the-millionaire-fastlane.webp',
    links: {}
  },
  {
    id: '57',
    title: 'The Righteous Mind: Why Good People are Divided by Politics and Religion',
    author: 'Jonathan Haidt',
    type: 'book',
    rating: 5,
    status: 'completed',
    genre: ['Advice', 'Non-fiction', 'Religion', 'Psychology'],
    description: 'Explores why people have such different yet strongly held moral beliefs.',
    coverImage: '/resources/images/library/the-righteous-mind.webp',
    links: {}
  },
  {
    id: '58',
    title: 'Skulduggery Pleasant Book 1',
    author: 'Derek Landy',
    type: 'book',
    rating: 5,
    status: 'completed',
    genre: ['Fantasy', 'Adventure'],
    description: 'A witty, magical detective adventure featuring a skeleton detective.',
    coverImage: '/resources/images/library/skulduggery-pleasant-book-1.webp',
    links: {}
  },
  {
    id: '59',
    title: 'The Almanack of Naval Ravikant',
    author: 'Naval Ravikant',
    type: 'book',
    rating: 5,
    status: 'completed',
    genre: ['Non-fiction', 'Advice'],
    description: 'A collection of wisdom and experience from entrepreneur Naval Ravikant.',
    coverImage: '/resources/images/library/the-almanack-of-naval-ravikant.webp',
    links: {}
  },
  {
    id: '60',
    title: 'Ageless: The New Science of Getting Older Without Getting Old',
    author: 'Andrew Steele',
    type: 'book',
    rating: 5,
    status: 'completed',
    genre: ['Non-fiction', 'Science'],
    description: 'A look at the science of aging and how we might slow or reverse it.',
    coverImage: '/resources/images/library/ageless.webp',
    links: {}
  },
  {
    id: '61',
    title: 'The Motivation Myth: How High Achievers Really Set Themselves Up to Win',
    author: 'Jeff Haden',
    type: 'book',
    rating: 5,
    status: 'completed',
    genre: ['Non-fiction', 'Self-improvement'],
    description: 'Debunks the idea that motivation leads to success, showing instead how success breeds motivation.',
    coverImage: '/resources/images/library/the-motivation-myth.webp',
    links: {}
  },
  {
    id: '62',
    title: 'The Total Money Makeover: A Proven Plan for Financial Fitness',
    author: 'Dave Ramsey',
    type: 'book',
    rating: 5,
    status: 'completed',
    genre: ['Non-fiction', 'Finances'],
    description: 'A step-by-step plan for financial fitness and debt freedom.',
    coverImage: '/resources/images/library/the-total-money-makeover.webp',
    links: {}
  },
  {
    id: '63',
    title: 'Make Time: How to Focus on What Matters Every Day',
    author: 'Jake Knapp, John Zeratsky',
    type: 'book',
    rating: 5,
    status: 'completed',
    genre: ['Non-fiction', 'Productivity'],
    description: 'Practical strategies to help you make time for what matters.',
    coverImage: '/resources/images/library/make-time.webp',
    links: {}
  },
  {
    id: '64',
    title: 'Digital Minimalism: Choosing a Focused Life in a Noisy World',
    author: 'Cal Newport',
    type: 'book',
    rating: 5,
    status: 'completed',
    genre: ['Non-fiction', 'Self-improvement'],
    description: 'A guide to living better with less technology.',
    coverImage: '/resources/images/library/digital-minimalism.webp',
    links: {}
  },
  {
    id: '65',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    type: 'book',
    rating: 5,
    status: 'completed',
    genre: ['Non-fiction', 'History'],
    description: 'A sweeping history of humankind from the Stone Age to the present.',
    coverImage: '/resources/images/library/sapiens.webp',
    links: {}
  },
  {
    id: '66',
    title: 'I Will Teach You to Be Rich (2019)',
    author: 'Ramit Sethi',
    type: 'book',
    rating: 5,
    status: 'completed',
    genre: ['Non-fiction', 'Finances'],
    description: 'A practical guide to personal finance and wealth-building.',
    coverImage: '/resources/images/library/i-will-teach-you-to-be-rich.webp',
    links: {}
  },
  {
    id: '67',
    title: 'Making Money (2007)',
    author: 'Terry Pratchett',
    type: 'book',
    rating: 5,
    status: 'completed',
    genre: ['Fantasy', 'Adventure'],
    description: 'A Discworld novel about the world of banking and economics.',
    coverImage: '/resources/images/library/making-money.webp',
    series: 'Discworld',
    seriesOrder: 36,
    relationships: { sameUniverse: ['70', '71', '72'] },
    links: {}
  },
  {
    id: '68',
    title: 'A Blink of the Screen (2012)',
    author: 'Terry Pratchett',
    type: 'book',
    rating: 5,
    status: 'completed',
    genre: ['Fantasy', 'Adventure'],
    description: 'A collection of short fiction by Terry Pratchett.',
    coverImage: '/resources/images/library/a-blink-of-the-screen.webp',
    links: {}
  },
  {
    id: '69',
    title: 'The Messenger (2002)',
    author: 'Markus Zusak',
    type: 'book',
    rating: 5,
    status: 'completed',
    genre: ['Drama'],
    description: 'A young man receives mysterious messages that change his life.',
    coverImage: '/resources/images/library/the-messenger.webp',
    links: {}
  },
  {
    id: '70',
    title: 'Reaper Man (1991)',
    author: 'Terry Pratchett',
    type: 'book',
    rating: 5,
    status: 'completed',
    genre: ['Fantasy', 'Adventure'],
    description: 'A Discworld novel where Death takes a holiday.',
    coverImage: '/resources/images/library/reaper-man.webp',
    series: 'Discworld',
    seriesOrder: 11,
    relationships: { sameUniverse: ['67', '71', '72'] },
    links: {}
  },
  {
    id: '71',
    title: 'Mort (1987)',
    author: 'Terry Pratchett',
    type: 'book',
    rating: 5,
    status: 'completed',
    genre: ['Fantasy', 'Adventure'],
    description: 'A Discworld novel about a boy who becomes Death\'s apprentice.',
    coverImage: '/resources/images/library/mort.webp',
    series: 'Discworld',
    seriesOrder: 4,
    relationships: { sameUniverse: ['67', '70', '72'] },
    links: {}
  },
  {
    id: '72',
    title: 'Moving Pictures (1990)',
    author: 'Terry Pratchett',
    type: 'book',
    rating: 5,
    status: 'completed',
    genre: ['Fantasy', 'Adventure'],
    description: 'A Discworld novel satirizing the movie industry.',
    coverImage: '/resources/images/library/moving-pictures.webp',
    series: 'Discworld',
    seriesOrder: 10,
    relationships: { sameUniverse: ['67', '70', '71'] },
    links: {}
  },
  {
    id: '73',
    title: 'Of Mice and Men (1937)',
    author: 'John Steinbeck',
    type: 'book',
    rating: 5,
    status: 'completed',
    genre: ['Realism'],
    description: 'A classic novella about two displaced migrant ranch workers during the Great Depression.',
    coverImage: '/resources/images/library/of-mice-and-men.webp',
    links: {}
  },
];

export const mediaTypes = [
  { value: 'all', label: 'All Media', icon: 'Filter' },
  { value: 'book', label: 'Books', icon: 'BookOpen' },
  { value: 'movie', label: 'Movies', icon: 'Film' },
  { value: 'series', label: 'Series', icon: 'Monitor' },
];

export const statusTypes = [
  { value: 'all', label: 'All Status' },
  { value: 'completed', label: 'Completed' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'want-to-read', label: 'Want to Read' },
  { value: 'want-to-watch', label: 'Want to Watch' },
]; 