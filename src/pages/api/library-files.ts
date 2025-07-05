import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const libraryDir = path.join(process.cwd(), 'public', 'data', 'library');
  try {
    const files = fs.readdirSync(libraryDir)
      .filter(f => f.endsWith('.json'));
    res.status(200).json(files);
  } catch (e) {
    res.status(500).json({ error: 'Could not list library files.' });
  }
} 