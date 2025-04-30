import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getS3PresignedURL } from "~/lib/storage";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";

const schema = z.object({
  sectionId: z.number(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user.professor) {
      return NextResponse.json({
        error: "Unauthorized",
      });
    }
    // Get Body Parameters
    const body = await request.json();
    const { data, success } = schema.safeParse(body);
    if (!success) {
      return NextResponse.json({
        error: "Invalid request body",
      });
    }
    const { sectionId } = data;

    try {
      const section = await api.professor.courses.getOne(sectionId);
      if (!section) {
        throw new Error("Section not found");
      }
    } catch (error) {
      return NextResponse.json({
        error: "Section not found",
      });
    }

    const { uploadUrl, fileKey } = await getS3PresignedURL({
      folder: `courses/${sectionId}/materials`,
    });

    if (!uploadUrl || !fileKey) {
      return NextResponse.json({
        error: "Failed to generate presigned URL",
      });
    }

    return NextResponse.json({
      uploadUrl,
      fileKey,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({
      error: "Failed to upload file",
    });
  }
}
