import { env } from "~/env";

export const NAME = "Open Study";
export const VERSION = "0.0.1";
export const SIDEBAR_COOKIE = "sidebar_state";
export const S3_URL = `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/`;
