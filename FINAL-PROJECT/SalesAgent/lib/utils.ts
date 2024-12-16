import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const supportedLanguages = [
  {
    name: "English",
    code: "en",
  },
  {
    name: "French",
    code: "fr",
  },
  {
    name: "German",
    code: "de",
  },
  {
    name: "Italian",
    code: "it",
  },
  {
    name: "Spanish",
    code: "es",
  },
  {
    name: "Dutch",
    code: "nl",
  },
  {
    name: "Portuguese",
    code: "pt",
  },
  {
    name: "Norwegian",
    code: "no",
  },
  {
    name: "Swedish",
    code: "sv",
  },
  {
    name: "Danish",
    code: "da",
  },
  {
    name: "Polish",
    code: "pl",
  },
  {
    name: "Ukrainian",
    code: "uk",
  },
  {
    name: "Russian",
    code: "ru",
  },
  {
    name: "Czech",
    code: "cs",
  },
  {
    name: "Slovak",
    code: "sk",
  },
  {
    name: "Romanian",
    code: "ro",
  },
  {
    name: "Bulgarian",
    code: "bg",
  },
  {
    name: "Croatian",
    code: "hr",
  },
  {
    name: "Greek",
    code: "el",
  },
  {
    name: "Hungarian",
    code: "hu",
  },
  {
    name: "Finnish",
    code: "fi",
  },
  {
    name: "Turkish",
    code: "tr",
  },
  {
    name: "Classic Arabic",
    code: "ar",
  },
  {
    name: "Chinese",
    code: "zh",
  },
  {
    name: "Japanese",
    code: "ja",
  },
  {
    name: "Korean",
    code: "ko",
  },
  {
    name: "Vietnamese",
    code: "vi",
  },
  {
    name: "Filipino",
    code: "fil",
  },
  {
    name: "Indonesian",
    code: "id",
  },
  {
    name: "Malay",
    code: "ms",
  },
  {
    name: "Tamil",
    code: "ta",
  },
  {
    name: "Hindi",
    code: "hi",
  },
];
