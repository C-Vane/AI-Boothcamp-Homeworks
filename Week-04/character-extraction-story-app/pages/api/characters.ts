import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

const charactersFilePath = path.join(process.cwd(), "lib", "characters.json");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "POST") {
      // Add new character
      const character = req.body;
      const data = JSON.parse(fs.readFileSync(charactersFilePath, "utf8"));
      data.predefinedCharacters.push(character);
      fs.writeFileSync(charactersFilePath, JSON.stringify(data, null, 2));
      res.status(200).json({ message: "Character added successfully" });
    } else if (req.method === "DELETE") {
      // Delete character
      const { name } = req.query;
      const data = JSON.parse(fs.readFileSync(charactersFilePath, "utf8"));
      data.predefinedCharacters = data.predefinedCharacters.filter(
        (char: any) => char.name !== name,
      );
      fs.writeFileSync(charactersFilePath, JSON.stringify(data, null, 2));
      res.status(200).json({ message: "Character deleted successfully" });
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error handling character:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
