export type AboutTimelineIcon =
  'graduation' | 'paintbrush' | 'home' | 'briefcase' | 'rocket' | 'heart';

export type AboutTimelineEntry = {
  year: string;
  title: string;
  description: string;
  icon: AboutTimelineIcon;
  mainImg: string;
  mainImgCaption: string;
  sideImg: string;
  sideImgCaption: string;
  links: { text: string; url: string }[];
};

export const aboutTimeline: AboutTimelineEntry[] = [
  {
    year: '2019',
    title: 'High school & Glasgow',
    description:
      'Graduated from First English Language School in Sofia, started at the University of Strathclyde, and worked my first job in a Sofia coffee shop.',
    icon: 'graduation',
    mainImg: '/resources/images/about/2019.webp',
    mainImgCaption:
      'The University of Strathclyde, Glasgow — where the adventure began. First time in the UK and first time sharing a flat with three other people.',
    sideImg: '/resources/images/about/2019_side.webp',
    sideImgCaption:
      'My summer job in Sofia — first real work experience, plenty of coffee, and learning to run on little sleep.',
    links: [
      { text: 'First English Language School', url: 'https://www.fels-sofia.org' },
      { text: 'University of Strathclyde', url: 'https://www.strath.ac.uk' },
    ],
  },
  {
    year: '2020',
    title: 'Digital art & web projects',
    description:
      'Launched kofiscrib, built early websites, and started the Life Engineering newsletter while navigating COVID from Glasgow back home.',
    icon: 'paintbrush',
    mainImg: '/resources/images/about/2020.webp',
    mainImgCaption:
      'Early digital art and site experiments from the kofiscrib era — still finding my visual voice.',
    sideImg: '/resources/images/about/2020_side.webp',
    sideImgCaption:
      'Pandemic-era pivot: back in Bulgaria overnight, filling time with art and teaching myself web development.',
    links: [
      { text: 'kofiscrib.com', url: 'https://kofiscrib.com' },
      { text: 'Life Engineering', url: '/blog' },
    ],
  },
  {
    year: '2021',
    title: 'First tech job',
    description:
      'Returned to Glasgow for biomedical engineering while landing my first tech role at Bulgarian ed-tech startup Boom.dev.',
    icon: 'graduation',
    mainImg: '/resources/images/about/2021.webp',
    mainImgCaption:
      'Third year in Glasgow — lighter uni schedule, more time for projects and exploring Scotland.',
    sideImg: '/resources/images/about/2021_side.webp',
    sideImgCaption:
      'Boom.dev opened the door to professional web work and startup life — the job that really kicked off my career.',
    links: [
      { text: 'University of Strathclyde', url: 'https://www.strath.ac.uk' },
      { text: 'Boom.dev', url: 'https://boom.dev' },
    ],
  },
  {
    year: '2022',
    title: 'Independence & Nuvei',
    description:
      'Gap year from uni, moved into my own place in Sofia, and joined Nuvei as a front-end developer.',
    icon: 'home',
    mainImg: '/resources/images/about/2022.webp',
    mainImgCaption:
      'Housing in post-COVID Glasgow fell through — gap year, full-time IT in Sofia, youngest person in the Nuvei office, and living on my own for the first time.',
    sideImg: '/resources/images/about/2022_side.webp',
    sideImgCaption:
      'A supportive team and a legacy stack — great foundations, and a clear signal to keep pushing for newer challenges.',
    links: [{ text: 'Nuvei', url: 'https://www.nuvei.com' }],
  },
  {
    year: '2023–2024',
    title: 'Graduation & balance',
    description:
      'Part-time at Nuvei, dissertation year in Glasgow, and graduating with a 2:1 from Strathclyde.',
    icon: 'briefcase',
    mainImg: '/resources/images/about/2023.webp',
    mainImgCaption:
      'Final year blur — dissertation, part-time work, and eventually crossing the graduation stage.',
    sideImg: '/resources/images/about/2023_side.webp',
    sideImgCaption:
      'Last long stretch living in Glasgow — rain, quirks, and a city that stuck with me.',
    links: [{ text: 'University of Strathclyde', url: 'https://www.strath.ac.uk' }],
  },
  {
    year: 'Late 2024',
    title: 'TalentSight',
    description:
      'Joined friends from high school at TalentSight to build AI-powered recruitment tooling.',
    icon: 'rocket',
    mainImg: '/resources/images/about/2024.webp',
    mainImgCaption:
      'Back in Sofia for good — building a product with classmates I have known for years.',
    sideImg: '/resources/images/about/2024_side.webp',
    sideImgCaption:
      'Still shipping the platform — learning fast about AI products and early-stage startup rhythm.',
    links: [{ text: 'TalentSight', url: 'https://talsight.com' }],
  },
  {
    year: '2025',
    title: 'Creative revival',
    description:
      'Refocused on public writing, health, and side projects — including client work like eculink.io.',
    icon: 'heart',
    mainImg: '/resources/images/about/2025.webp',
    mainImgCaption:
      'AI tooling helped me ship several apps in early 2025, including my first independent client project.',
    sideImg: '/resources/images/about/2025_side.webp',
    sideImgCaption:
      'Fresh goals after uni: revive the newsletter, take fitness seriously, and keep building in public.',
    links: [
      { text: 'Life Engineering', url: '/blog' },
      { text: 'eculink.io', url: 'https://eculink.io' },
    ],
  },
];

export const aboutSkills = [
  {
    title: 'Web development',
    description: 'Next.js, React, TypeScript, Tailwind CSS',
  },
  {
    title: 'Design',
    description: 'UI/UX, digital illustration, Notion systems',
  },
  {
    title: 'Content',
    description: 'Technical writing, video, social storytelling',
  },
] as const;
