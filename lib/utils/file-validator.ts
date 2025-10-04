// lib/utils/file-validator.ts
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from "@/lib/constants/file";

interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateResumeFile(file: File | null): ValidationResult {
  if (!file) {
    return {
      valid: false,
      error: "No file provided",
    };
  }

  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Only PDF, DOC, and DOCX files are allowed",
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    const maxSizeMB = MAX_FILE_SIZE / (1024 * 1024);
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`,
    };
  }

  // Check file extension matches MIME type
  const extension = file.name.split(".").pop()?.toLowerCase();
  const expectedExtensions: Record<string, string[]> = {
    "application/pdf": ["pdf"],
    "application/msword": ["doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      "docx",
    ],
  };

  const allowedExtensions = expectedExtensions[file.type] || [];
  if (extension && !allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: "File extension does not match file type",
    };
  }

  return { valid: true };
}
