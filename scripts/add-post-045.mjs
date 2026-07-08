// One-shot script: prepend post #045 to src/data/blog-posts.json
// Run with: node scripts/add-post-045.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const filePath = resolve('src/data/blog-posts.json');
const raw = readFileSync(filePath, 'utf8');
const json = JSON.parse(raw);

const post045 = {
  slug: 'the-problem-with-potential',
  title: 'The Problem With Potential ⚡',
  description:
    'The "ex-gifted-kid-turned-procrastinator" phenomenon is everywhere lately. A take on analysis paralysis, why unrealised potential feels so heavy, and how procrastination is often about protecting the perfect version of the thing in your head.',
  date: '2026-07-08',
  coverImage: '/resources/images/blog/the-problem-with-potential/Thumbnail.jpg',
  tags: ['Mindfulness', 'Philosophy', 'Life Engineering'],
  content: [
    'July 8, 2026',
    '',
    'Hey there,',
    '',
    'I\'ve noticed lately the term "ex-gifted-kid-turned-procrastinator" more and more across social media. It seems like people, especially Gen Z, are recognising a shift in their motivation and effort levels &mdash; once keen readers/artists/students are now barely doing their daily chores and seem to burn out more and more easily.',
    '',
    'And I feel like the core issue is in the amount of "_unrealised potential_" on the table.',
    '',
    '![The problem with potential - the weight of all the versions of yourself you could become](../../resources/images/blog/the-problem-with-potential/potential-hero.jpg)',
    '',
    'I personally define potential as the multitude of outcomes that one can achieve. You have the ability to come up with so many things, to do all the activities, to be all the versions of yourself possible.',
    '',
    "And the number of timelines you have access to is really as big as your imagination. The sky is the limit when you're delusional, or whatever people say ✨",
    '',
    "Exactly this juxtaposition though puts so much pressure on most people. You can very easily get stuck in analysis paralysis when you know how many opportunities stand before you, and oftentimes you're simply spoilt for choice. That's why it's sometimes easier to do life when you have external limitations &mdash; at your job, you often don't have the maximum freedom to do whatever you want; you have a set list of tasks, usually a particular way to do them, and you have deadlines. This eliminates the need to think about the other possibilities, and while usually not easy, it makes it straightforward, at least.",
    '',
    'That relates, I feel, with being a gifted child.',
    '',
    "When you're younger, you're basically potential incarnate &mdash; you can become anything, and you're not yet moulded into a specific shape.",
    '',
    "And what is more important, you have a seemingly endless time horizon in front of you. You don't have to \"take shape\" necessarily, not yet at least. But as time progresses, all gifted children retain the sense of great potential, that they should become something great, and when they're faced with the reality that they can't realistically do _all_ the things that they want to, it leads to burnout.",
    '',
    "It's like this quote:",
    '',
    "> _You can do **anything**, but you can't do **everything**._",
    '',
    "Most of us understand it logically, but not emotionally &mdash; and we latch onto the unrealistic expectations. It's quite soothing, the thought that before you take action, anything is possible. It's only once you start a project that you realise its constraints, and the cost of giving up other opportunities.",
    '',
    "And that's, I think, where a lot of procrastination comes from.",
    '',
    'Not necessarily from laziness, but from trying to preserve the perfect version of the thing in your head. Before you write the article, it can still be great. Before you launch the project, it can still be successful. Before you start the habit, it can still be the thing that fixes your life.',
    '',
    'But once you actually do it, the fantasy becomes measurable. You see the _awkward first draft_, the _missing features_, the _boring repetition_, the amount of _time_ things actually take. The potential gets converted into evidence, and evidence is much less romantic, sadly so.',
    '',
    "And for people who grew up being praised for potential, that can feel weirdly personal. Struggling at something doesn't just feel like struggle &mdash; it feels like disappointing the _hypothetical_ version of yourself that was supposed to be naturally good at everything.",
    '',
    "So you avoid the thing, which protects the fantasy for a while, but also adds another layer of shame on top. The longer you don't do it, the heavier it becomes, because now you're not just starting the task. You're also confronting all the time you spent not starting it, and that's honestly a pain. That's the annoying loop: pressure creates avoidance, avoidance creates shame, and shame makes the next attempt feel even more loaded.",
    '',
    'So all in all, this is more of an observation piece than a "how-to" or a solution piece. I wish I had the answer on how to resolve this tension.',
    '',
    'Honestly, it may just be a good problem to have &mdash; be so optimistic that you can do all that with yourself, that you feel pressured. Cause the opposite of that sounds a bit bleak really 👻',
    '',
    'Weekly Insights',
    '---------------',
    '',
    '![Weekly insights - fresh back from a few sunny days in Valencia, Spain](../../resources/images/blog/the-problem-with-potential/mini-notes.jpg)',
    '',
    '*   _This time the pics are heavy on the trip-side &mdash; just got home from a few days in Valencia, Spain, and the sun was honestly well-appreciated_ ☀️',
    '*   _Valencia managed to impress me quite a bit, mainly with its Oceanografic museum, and the overall chill vibes of the city. Comfortably ranks in my top 3 cities visited so far for sure!_',
    '',
    'Movie Highlight: _Novocaine_',
    '----------------------------',
    '',
    '![Novocaine - Jack Quaid as a man who feels no pain, in over his head after a bank robbery](../../resources/images/blog/the-problem-with-potential/novocaine.jpg)',
    '',
    '"[**Novocaine**](https://www.imdb.com/title/tt29603959/)" is a movie starring Jack Quaid (you may know him as Hughie from "The Boys"), which came out last year. The main plot is quite simple to be honest &mdash; the protagonist, Nate, suffers from a condition called CIPA, which is basically 100% lack of pain sensitivity of all kinds.',
    '',
    "This has led him to grow up quite secluded and sheltered, due to his parents' worries for his condition. But just as he's trying to come out of his bubble, he ends up in the middle of a bank robbery that goes terribly awry, and is now too deep in the mess to back out.",
    '',
    'The movie is honestly quite the good comedy, and it riffs off the whole "insensitivity to pain" schtick quite well, turning it into more of a superpower than a liability, which is also kinda inspiring. But overall, it\'s just a very well-shot and well-executed movie.',
    '',
    "Also, something I liked in particular was right in the intro sequence; we get to know about Nate and the way he lives with his condition mainly from the scenery, rather than from direct dialogue. It's the \"show, don't tell\" technique in its best, where we don't need copious amounts of explanation, but are rather shown things like protectors put on corners of furniture and the way he drives extremely slowly and carefully. I just think that was neat attention to detail 🙌",
    '',
    'Worth Watching This Week',
    '------------------------',
    '',
    '[![12 little luxuries that cost $0 | live rich without being rich - by True Wealth with Amy Wang](../../resources/images/blog/the-problem-with-potential/youtube-12-little-luxuries.jpg)](https://www.youtube.com/watch?v=BjimQLsaooA)',
    '',
    '[**12 little luxuries that cost $0 | live rich without being rich**](https://www.youtube.com/watch?v=BjimQLsaooA) by **True Wealth with Amy Wang** &mdash; a warm reminder that feeling rich is often about small free rituals, not the bank balance.',
    '',
    "[![don't take yourself so seriously - by solace](../../resources/images/blog/the-problem-with-potential/youtube-dont-take-yourself-seriously.jpg)](https://www.youtube.com/watch?v=GfGsYTWO71g)",
    '',
    "[**don't take yourself so seriously**](https://www.youtube.com/watch?v=GfGsYTWO71g) by **solace** &mdash; a light-hearted nudge to loosen the grip of your own expectations.",
    '',
    'Track of the Week',
    '-----------------',
    '',
    '[Love Rehab (Dun Dun) by Issac Frank, Mae Hill](https://open.spotify.com/track/1NTzmzdyvIWgu1aYTGedtJ)',
    '',
    'Closing Thoughts',
    '----------------',
    '',
    'Till next week, stay safe, stay curious, and keep kicking. ✌️',
  ].join('\n'),
  author: 'Yassen Shopov',
};

// Idempotent: skip if slug already present
const existingSlugs = new Set(json.posts.map((p) => p.slug));
if (existingSlugs.has(post045.slug)) {
  console.log(`Post "${post045.slug}" already present; no changes.`);
  process.exit(0);
}

// Reverse-chronological: newest first
json.posts = [post045, ...json.posts];

writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf8');
console.log(`Inserted post: ${post045.slug}`);
console.log(`Total posts now: ${json.posts.length}`);
