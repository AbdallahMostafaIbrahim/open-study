import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { v4 as uuid } from "uuid";
import { env } from "~/env";

const s3 = new S3Client({
  region: env.NEXT_PUBLIC_S3_REGION,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
});

interface UploadToS3Params {
  folder: string;
}

export async function getS3PresignedURL({
  folder,
}: UploadToS3Params): Promise<{ uploadUrl: string; fileKey: string }> {
  const fileKey = `${folder}/${uuid()}`;
  const putCommand = new PutObjectCommand({
    Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME,
    Key: fileKey,
  });
  try {
    const uploadUrl = await getSignedUrl(s3, putCommand);
    return { uploadUrl, fileKey };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Failed to upload file");
  }
}
