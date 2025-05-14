import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";
import { prompt } from "~/lib/ai/prompt";
import { S3_URL } from "~/lib/constants";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export const maxDuration = 30;

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    system: prompt,
    onError: (error) => {
      console.error("Error:", error);
    },
    tools: {
      getCourses: tool({
        parameters: z.object({}),
        description: "Get the courses of the user ",
        execute: async () => {
          const courses = await db.courseSection.findMany({
            where: {
              students: {
                some: {
                  studentId: session.user.id,
                },
              },
            },
            select: {
              course: {
                select: {
                  name: true,
                  courseCode: true,
                },
              },
              sectionNumber: true,
              id: true,
              semester: {
                select: {
                  name: true,
                },
              },
            },
          });
          return courses;
        },
      }),
      getMaterial: tool({
        parameters: z.object({ courseId: z.number() }),
        description: "Get the materials of a course",
        execute: async ({ courseId }) => {
          const materials = await db.material.findMany({
            where: {
              courseSectionId: courseId,
              isPublished: true,
            },
            select: {
              text: true,
              title: true,
              files: {
                select: {
                  name: true,
                  type: true,
                  link: true,
                },
              },
            },
          });
          // make the links absolute
          const absoluteLinks = materials.map((material) => {
            return {
              ...material,
              files: material.files.map((file) => ({
                ...file,
                link: S3_URL + file.link,
              })),
            };
          });
          return absoluteLinks;
        },
      }),
      getAssignments: tool({
        parameters: z.object({ courseId: z.number() }),
        description: "Get the assignments of a course",
        execute: async ({ courseId }) => {
          const assignments = await db.assignment.findMany({
            where: {
              courseSectionId: courseId,
              isPublished: true,
            },
            select: {
              title: true,
              dueDate: true,
              grades: true,
              submissions: true,
              points: true,
              text: true,
              files: {
                select: {
                  name: true,
                  type: true,
                  link: true,
                },
              },
            },
          });
          return assignments;
        },
      }),
      getAnnouncements: tool({
        parameters: z.object({ courseId: z.number() }),
        description: "Get the announcements of a course",
        execute: async ({ courseId }) => {
          return await db.annoucement.findMany({
            where: {
              courseSectionId: courseId,
            },
            select: {
              title: true,
              content: true,
            },
          });
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
