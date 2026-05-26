// Validates the four newest posts: JSON shape, chronological order, no dup slugs,
// and that every relative image referenced in their markdown exists on disk.
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const json = JSON.parse(readFileSync(resolve("src/data/blog-posts.json"), "utf8"));
const slugs = ["introversion-extroversion","just-needed-another-war","ship-of-theseus","pretty-with-a-purpose"];

let problems = 0;
const seen = new Set();
for (const p of json.posts) {
  if (seen.has(p.slug)) { console.log("DUP SLUG:", p.slug); problems++; }
  seen.add(p.slug);
}

const dates = json.posts.map((p) => p.date);
for (let i = 1; i < dates.length; i++) {
  if (dates[i] > dates[i - 1]) {
    console.log("ORDER:", dates[i], ">", dates[i - 1], "(", json.posts[i].slug, ")");
    problems++;
  }
}

const imgRe = /!\[[^\]]*\]\((\.\.\/\.\.\/resources\/images\/blog\/[^)]+)\)/g;
for (const slug of slugs) {
  const post = json.posts.find((p) => p.slug === slug);
  if (!post) { console.log("MISSING POST:", slug); problems++; continue; }
  const required = ["slug","title","description","date","coverImage","tags","content","author"];
  for (const k of required) {
    if (!post[k]) { console.log("MISSING FIELD", k, "in", slug); problems++; }
  }
  if (!existsSync(resolve("public" + post.coverImage))) {
    console.log("MISSING COVER:", post.coverImage);
    problems++;
  }
  for (const m of post.content.matchAll(imgRe)) {
    const rel = m[1].replace(/^\.\.\/\.\.\//, "public/");
    if (!existsSync(resolve(rel))) {
      console.log("MISSING IMG:", rel, "(in", slug + ")");
      problems++;
    }
  }
}

console.log("Total posts:", json.posts.length);
console.log("Problems:", problems);
process.exit(problems > 0 ? 1 : 0);
