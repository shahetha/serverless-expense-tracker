import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuid } from "uuid";
import { ok, err, userSub } from "../lib/response";

const s3     = new S3Client({});
const BUCKET = process.env.RECEIPTS_BUCKET!;

export async function handler(event: APIGatewayProxyEventV2WithJWTAuthorizer) {
  try {
    const sub  = userSub(event);
    const body = JSON.parse(event.body || "{}");
    const { filename, contentType } = body;
    if (!filename || !contentType) return err("filename and contentType required");

    const ext = filename.split(".").pop() || "jpg";
    const key = `receipts/${sub}/${uuid()}.${ext}`;

    const uploadUrl = await getSignedUrl(
      s3,
      new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType }),
      { expiresIn: 300 }
    );

    return ok({ uploadUrl, key });
  } catch (e: any) {
    console.error(e);
    if (e.message === "Unauthorized") return err("Unauthorized", 401);
    return err(e.message || "Internal error", 500);
  }
}
