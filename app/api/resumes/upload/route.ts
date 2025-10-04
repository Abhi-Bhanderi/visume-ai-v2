import { uploadToS3 } from "@/lib/services/s3";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import {
  cleanResumeText,
  extractTextFromPDF,
} from "@/lib/services/file-parser";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Extract text from PDF
    const text = await extractTextFromPDF(buffer);
    const cleanText = cleanResumeText(text);

    // Upload to S3
    const { url } = await uploadToS3(buffer, file.name, file.type, "resumes");

    const resume = await prisma.resume.create({
      data: {
        ownerUserId: session.user.id,
        sourceFileName: file.name,
        sourceFileType: file.type,
        sourceUrl: url,
        rawText: cleanText,
      },
    });

    return NextResponse.json({ resume }, { status: 200 });
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
