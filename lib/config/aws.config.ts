// lib/config/aws.config.ts

interface S3Config {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
}

export function getS3Config(): S3Config {
  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const bucketName = process.env.AWS_S3_BUCKET;

  if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
    throw new Error(
      "Missing required AWS environment variables. Please check your .env file."
    );
  }

  return {
    region,
    accessKeyId,
    secretAccessKey,
    bucketName,
  };
}
