import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { File } from "./file";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getPresignedURL(fileName: string): Promise<string> {
  const resp = await fetch(`${import.meta.env.VITE_BASE_URL}/files`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileName,
    }),
  });
  const data = await resp.json();

  return data.url;
}

export async function getFiles(): Promise<File[]> {
  const resp = await fetch(`${import.meta.env.VITE_BASE_URL}/files`, {});
  const data = await resp.json();

  return data;
}

export async function processFile(file: File) {
  await fetch(
    `${import.meta.env.VITE_BASE_URL}/files/start-process/${file.id}`,
    {
      method: "POST",
    }
  );
}
