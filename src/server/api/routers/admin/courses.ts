import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const coursesRouter = createTRPCRouter({
  get: protectedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    return await ctx.db.course.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        _count: { select: { sections: true } },
      },
      where: {
        organizationId: input,
      },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        courseCode: z.string().optional(),
        organizationId: z.number(),
        sections: z.array(
          z.object({
            sectionNumber: z.string(),
            professors: z.array(z.string()),
            students: z.array(z.string()),
            semesterId: z.number(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // This is so hot
      await ctx.db.$transaction(async (tx) => {
        // Step 1: Create the course
        const course = await tx.course.create({
          data: {
            name: input.name,
            description: input.description,
            courseCode: input.courseCode,
            organizationId: input.organizationId,
          },
        });

        // Step 2: Create course sections with professors and students
        for (const section of input.sections) {
          // Create the section
          const courseSection = await tx.courseSection.create({
            data: {
              sectionNumber: section.sectionNumber,
              courseId: course.id,
              semesterId: section.semesterId,
            },
          });

          // Connect professors to the section
          if (section.professors.length > 0) {
            await Promise.all(
              section.professors.map((professorId) =>
                tx.courseProfessor.create({
                  data: {
                    courseSectionId: courseSection.id,
                    professorId: professorId,
                  },
                }),
              ),
            );
          }

          // Connect students to the section
          if (section.students.length > 0) {
            await Promise.all(
              section.students.map((studentId) =>
                tx.courseStudent.create({
                  data: {
                    courseSectionId: courseSection.id,
                    studentId: studentId,
                  },
                }),
              ),
            );
          }
        }
      });
    }),
});
