export interface NotionTemplate {
  id: string;
  title: string;
  description: string;
  image: string;
  unoptimized?: boolean;
  categories: string[];
  price: string;
  gumroadLink: string;
  productHuntLink?: string;
}

export const notionCategories = [
  { value: 'all', label: 'All Templates' },
  { value: 'finances', label: 'Finances' },
  { value: 'career', label: 'Career' },
  { value: 'study', label: 'Study' },
  { value: 'mindfulness', label: 'Mindfulness' },
  { value: 'planners', label: 'Planners' },
  { value: 'content-creation', label: 'Content Creation' },
] as const;

export const categoryLabel = (value: string) =>
  notionCategories.find((c) => c.value === value)?.label ?? value;

export const FEATURED_ID = 'ultimate-investing-dashboard';

export const isFree = (price: string) => price === '0$' || price === '$0' || price === '0';

export const formatPrice = (price: string) =>
  isFree(price) ? 'Free' : `$${price.replace(/\$/g, '').trim()}`;

export const templates: NotionTemplate[] = [
  {
    id: 'ultimate-investing-dashboard',
    title: 'Ultimate Investing Dashboard',
    description:
      'Automate your investment portfolio tracking and market research with this beautiful Notion template. Automatically synced with Yahoo! Finances',
    image: '/resources/images/notion/Ultimate_Investing_Dashboard.webp',
    unoptimized: true,
    categories: ['finances', 'planners'],
    price: '22$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/ultimate-investing-dashboard',
    productHuntLink: 'https://www.producthunt.com/posts/ultimate-investing-dashboard-in-notion',
  },
  {
    id: 'resume-builder',
    title: 'Resume Builder',
    description:
      'Build a professional resume by simply adding your details in this minimalistic Notion template.',
    image: '/resources/images/notion/Resume_Builder_Thumbnail.webp',
    categories: ['career'],
    price: '0$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/resume-builder',
    productHuntLink: 'https://www.producthunt.com/posts/resume-builder-notion-template',
  },
  {
    id: 'flash-card-builder',
    title: 'Flash Card Builder',
    description: 'Create easy-to-use flashcards with the Anki method inside your Notion workspace.',
    image: '/resources/images/notion/Flash_Card_Builder_Thumbnail.webp',
    categories: ['study'],
    price: '0$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/flash-card-builder',
  },
  {
    id: 'project-management-database',
    title: 'Project Management Database',
    description: 'Track all your projects in one centralised database - in Notion.',
    image: '/resources/images/notion/Project_Management_Database.webp',
    categories: ['career', 'planners'],
    price: '0$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/projects-database',
  },
  {
    id: '5-minute-daily-journal',
    title: '5-Minute Daily Journal',
    description:
      'Receive a fully-populated database for each date in 2022, where you are able to log your daily data and journal entries.',
    image: '/resources/images/notion/5-Minute_Daily_Journaling.webp',
    categories: ['mindfulness', 'planners'],
    price: '0$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/5-minute-daily-journal',
  },
  {
    id: 'travel-planner',
    title: 'Travel Planner',
    description: 'Plan your next adventure with this comprehensive travel planning template.',
    image: '/resources/images/notion/Travel_Planner.webp',
    categories: ['planners'],
    price: '0$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/travel-planning',
  },
  {
    id: 'uk-university-hq',
    title: 'UK University HQ',
    description: 'Organize your university life with this comprehensive template for UK students.',
    image: '/resources/images/notion/UK_University_HQ.webp',
    categories: ['study'],
    price: '0$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/uk-university-hq',
  },
  {
    id: 'to-do-list-database',
    title: 'To-Do List Database',
    description: 'A powerful task management system built in Notion.',
    image: '/resources/images/notion/To-Do_List_Database.webp',
    categories: ['planners'],
    price: '0$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/todo-list-database',
  },
  {
    id: 'social-media-production',
    title: 'Social Media Production',
    description: 'Streamline your social media content creation and scheduling.',
    image: '/resources/images/notion/Social_Media_Production.webp',
    categories: ['content-creation'],
    price: '0$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/social-media-production',
  },
  {
    id: 'social-circle-management',
    title: 'Social Circle Management',
    description: 'Keep track of your relationships and social interactions.',
    image: '/resources/images/notion/Social_Circle_Management.webp',
    categories: ['mindfulness'],
    price: '0$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/social-circle-management',
  },
  {
    id: 'investments-tracker-database',
    title: 'Investments Tracker Database',
    description: 'Track and analyze your investment portfolio performance.',
    image: '/resources/images/notion/Investments_Tracker_Database.webp',
    categories: ['finances'],
    price: '0$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/investment-tracker-automated',
  },
  {
    id: 'job-application-tracker',
    title: 'Job Application Tracker',
    description: 'Organize and track your job applications and interviews.',
    image: '/resources/images/notion/Job_Application_Tracker.webp',
    categories: ['career'],
    price: '0$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/job-application-tracker',
  },
  {
    id: 'interactive-media-hub',
    title: 'Interactive Media Hub',
    description: 'Manage your media consumption and recommendations.',
    image: '/resources/images/notion/Interactive_Media_Hub.webp',
    categories: ['content-creation'],
    price: '0$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/interactive-media-hub',
  },
  {
    id: 'financial-goals-tracker',
    title: 'Financial Goals Tracker',
    description: 'Set and track your financial goals and milestones.',
    image: '/resources/images/notion/Financial_Goals_Tracker.webp',
    categories: ['finances'],
    price: '0$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/financial-goal-planning',
  },
  {
    id: 'family-tree-database',
    title: 'Family Tree Database',
    description: 'Document and visualize your family history and relationships.',
    image: '/resources/images/notion/Family_Tree_Database.webp',
    categories: ['planners'],
    price: '0$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/family-tree-database',
  },
  {
    id: 'daily-tracking-2022',
    title: 'Daily Tracking 2022',
    description: 'Track your daily habits and progress throughout the year.',
    image: '/resources/images/notion/Daily_Tracking_2022.webp',
    categories: ['planners'],
    price: '0$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/daily-tracking-2022',
  },
  {
    id: 'digital-art-commissions',
    title: 'Digital Art Commissions',
    description: 'Manage your art commissions and client relationships.',
    image: '/resources/images/notion/Digital_Art_Commissions.webp',
    categories: ['content-creation'],
    price: '0$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/digital-art-commissions',
  },
  {
    id: 'blog-writing-management',
    title: 'Blog Writing Management',
    description: 'Organize your blog content creation and publishing schedule.',
    image: '/resources/images/notion/Blog_Writing_Management.webp',
    categories: ['content-creation'],
    price: '0$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/blog-management-database',
  },
  {
    id: 'assignment-tracking-for-uni',
    title: 'Assignment Tracking for University',
    description: 'Keep track of your university assignments and deadlines.',
    image: '/resources/images/notion/Assignment_Tracking_for_Uni.webp',
    categories: ['study'],
    price: '0$',
    gumroadLink: 'https://yassenshopov.gumroad.com/l/university-assignment-tracking',
  },
];
