"use server";

import { extractTextFromPDF } from "@/lib/services/file-parser";

const extractText = async (file: File) => {
  const buffer = Buffer.from(await file.arrayBuffer());
  const text = await extractTextFromPDF(buffer);
  return text;
};

export default extractText;
