// lib/utils/file-utils.ts
import { v4 as uuidv4 } from "uuid";

interface FilenameResult {
  uniqueFilename: string;
  s3Key: string;
}

export function generateUniqueFilename(
  originalName: string,
  userId: string | null
): FilenameResult {
  const fileExtension = originalName.split(".").pop();
  const uniqueFilename = `${uuidv4()}.${fileExtension}`;
  const s3Key = `resumes/${userId || "anonymous"}/${uniqueFilename}`;

  return {
    uniqueFilename,
    s3Key,
  };
}

export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "";
}

export function sanitizeFilename(filename: string): string {
  // Remove special characters and spaces
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .replace(/_{2,}/g, "_")
    .toLowerCase();
}
