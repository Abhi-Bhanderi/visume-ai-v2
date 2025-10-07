import pdf from "pdf-parse";

export interface ParsedResume {
  text: string;
  pages: number;
  metadata: {
    title?: string;
    author?: string;
    creator?: string;
    producer?: string;
    creationDate?: Date;
    modificationDate?: Date;
  };
  sections: {
    type: string;
    content: string;
    startIndex: number;
    endIndex: number;
  }[];
}

export async function parseResumeFromBuffer(
  buffer: Buffer
): Promise<ParsedResume> {
  try {
    const data = await pdf(buffer);
    // console.log("🚀 ~ parseResumeFromBuffer ~ data:", data);

    const sections = extractSections(data.text);
    // console.log("🚀 ~ parseResumeFromBuffer ~ sections:", sections);
    return {
      text: data.text,
      pages: data.numpages,
      metadata: {
        title: data.info?.Title,
        author: data.info?.Author,
        creator: data.info?.Creator,
        producer: data.info?.Producer,
        creationDate: data.info?.CreationDate,
        modificationDate: data.info?.ModDate,
      },
      sections,
    };
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error("Failed to parse resume PDF");
  }
}

function extractSections(text: string): Array<{
  type: string;
  content: string;
  startIndex: number;
  endIndex: number;
}> {
  const sections: Array<{
    type: string;
    content: string;
    startIndex: number;
    endIndex: number;
  }> = [];

  // Common section headers patterns
  const sectionPatterns = [
    {
      type: "contact",
      patterns: ["contact", "personal information", "contact information"],
    },
    {
      type: "summary",
      patterns: ["summary", "profile", "objective", "about", "overview"],
    },
    {
      type: "experience",
      patterns: [
        "experience",
        "work experience",
        "employment",
        "career history",
        "professional experience",
      ],
    },
    {
      type: "education",
      patterns: [
        "education",
        "academic background",
        "qualifications",
        "degrees",
      ],
    },
    {
      type: "skills",
      patterns: [
        "skills",
        "technical skills",
        "core competencies",
        "expertise",
        "technologies",
      ],
    },
    {
      type: "projects",
      patterns: [
        "projects",
        "key projects",
        "notable projects",
        "personal projects",
      ],
    },
    {
      type: "achievements",
      patterns: [
        "achievements",
        "accomplishments",
        "awards",
        "honors",
        "recognition",
      ],
    },
    {
      type: "certifications",
      patterns: ["certifications", "certificates", "licenses", "credentials"],
    },
    { type: "languages", patterns: ["languages", "language skills"] },
    {
      type: "interests",
      patterns: ["interests", "hobbies", "activities", "volunteer"],
    },
  ];

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();

    for (const section of sectionPatterns) {
      for (const pattern of section.patterns) {
        if (line.includes(pattern) && line.length < 50) {
          // Likely a header
          // Find content for this section
          let content = "";
          let j = i + 1;
          let nextSectionFound = false;

          while (j < lines.length && !nextSectionFound) {
            const nextLine = lines[j].toLowerCase();

            // Check if we've hit another section
            for (const otherSection of sectionPatterns) {
              for (const otherPattern of otherSection.patterns) {
                if (
                  nextLine.includes(otherPattern) &&
                  nextLine.length < 50 &&
                  otherSection.type !== section.type
                ) {
                  nextSectionFound = true;
                  break;
                }
              }
              if (nextSectionFound) break;
            }

            if (!nextSectionFound) {
              content += lines[j] + "\n";
              j++;
            }
          }

          if (content.trim()) {
            sections.push({
              type: section.type,
              content: content.trim(),
              startIndex: text.indexOf(lines[i]),
              endIndex: text.indexOf(lines[j - 1]) + lines[j - 1].length,
            });
          }
          break;
        }
      }
    }
  }

  return sections;
}

export function extractContactInfo(text: string): {
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  website?: string;
} {
  const contact: {
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  } = {};

  // Email regex
  const emailMatch = text.match(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
  );
  if (emailMatch) contact.email = emailMatch[0];

  // Phone regex (US format)
  const phoneMatch = text.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) contact.phone = phoneMatch[0];

  // LinkedIn regex
  const linkedinMatch = text.match(
    /(?:linkedin\.com\/in\/|linkedin\.com\/pub\/)[a-zA-Z0-9-]+/
  );
  if (linkedinMatch) contact.linkedin = `https://${linkedinMatch[0]}`;

  // GitHub regex
  const githubMatch = text.match(/github\.com\/[a-zA-Z0-9-]+/);
  if (githubMatch) contact.github = `https://${githubMatch[0]}`;

  // Website regex
  const websiteMatch = text.match(
    /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/
  );
  if (
    websiteMatch &&
    !websiteMatch[0].includes("linkedin") &&
    !websiteMatch[0].includes("github")
  ) {
    contact.website = websiteMatch[0].startsWith("http")
      ? websiteMatch[0]
      : `https://${websiteMatch[0]}`;
  }

  return contact;
}

export function extractBulletPoints(sectionContent: string): string[] {
  const bullets: string[] = [];
  const lines = sectionContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  for (const line of lines) {
    // Check if line starts with bullet indicators
    if (
      line.match(/^[•·▪▫▸▹‣⁃◦‒–—*\-+]\s/) ||
      line.match(/^\d+\.\s/) ||
      line.match(/^[a-zA-Z]\)\s/)
    ) {
      bullets.push(line.replace(/^[•·▪▫▸▹‣⁃◦‒–—*\-+\d+\.\w\)\s]+/, "").trim());
    } else if (line.length > 20 && line.length < 200) {
      // Potential bullet point without explicit marker
      bullets.push(line);
    }
  }

  return bullets;
}
