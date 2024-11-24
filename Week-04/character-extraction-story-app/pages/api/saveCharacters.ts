import { readFileSync, writeFileSync } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

type Character = {
  name: string;
  description: string;
  personality: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const characters: Character[] = req.body.characters;
    const charactersPath = path.join(process.cwd(), 'lib', 'characters.json');
    const existingData = JSON.parse(readFileSync(charactersPath, 'utf8'));
    existingData.extractedCharacters = characters;
    writeFileSync(charactersPath, JSON.stringify(existingData, null, 2));
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Failed to save characters:', error);
    res.status(500).json({ error: 'Failed to save characters' });
  }
}
