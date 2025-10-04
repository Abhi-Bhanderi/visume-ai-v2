import { fromPath } from "pdf2pic";

export async function generatePdfSnapshot(pdfUrl: string) {
  const options = {
    density: 100,
    saveFilename: "untitled",
    savePath: "./images",
    format: "png",
    width: 600,
    height: 600,
  };

  const convert = fromPath(pdfUrl, options);

  const pageToConvertAsImage = 1;

  const imageURL = await convert(pageToConvertAsImage, {
    responseType: "image",
  });

  return imageURL;
}
