import { z } from "zod";
import { createTRPCRouter, professorProcedure } from "~/server/api/trpc";

export const assignmentsRouter = createTRPCRouter({
  get: professorProcedure
    .input(z.object({ sectionId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.assignment.findMany({
        where: {
          courseSectionId: input.sectionId,
          courseSection: {
            professors: { some: { professorId: ctx.session.user.id } },
          },
        },
        select: {
          id: true,
          title: true,
          author: { select: { user: { select: { name: true } } } },
          date: true,
          text: true,
          isPublished: true,
          files: true,
          dueDate: true,
          publishAt: true,
          points: true,
          _count: {
            select: { submissions: true },
          },
        },
      });
    }),
  getOne: professorProcedure
    .input(z.object({ id: z.string(), sectionId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.assignment.findFirst({
        where: {
          id: input.id,
          courseSection: {
            id: input.sectionId,
            professors: { some: { professorId: ctx.session.user.id } },
          },
        },
        select: {
          id: true,
          title: true,
          author: { select: { user: { select: { name: true, image: true } } } },
          date: true,
          files: true,
          text: true,
          isPublished: true,
          dueDate: true,
          maxAttempts: true,
          points: true,
          submissions: true,
        },
      });
    }),
  create: professorProcedure
    .input(
      z.object({
        sectionId: z.number(),
        title: z.string(),
        text: z.string().optional(),
        files: z
          .array(
            z.object({
              fileKey: z.string(),
              fileType: z.string(),
              fileName: z.string(),
            }),
          )
          .optional(),
        group: z.string().optional(),
        published: z.boolean().optional(),
        points: z.number(),
        dueDate: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.assignment.create({
        data: {
          title: input.title,
          text: input.text,
          isPublished: input.published,
          courseSectionId: input.sectionId,
          authorId: ctx.session.user.id,
          points: input.points,
          dueDate: input.dueDate,
          files: {
            createMany: {
              data:
                input.files?.map((file) => ({
                  link: file.fileKey,
                  type: file.fileType,
                  name: file.fileName,
                })) || [],
            },
          },
        },
      });
    }),
  publish: professorProcedure
    .input(
      z.object({
        id: z.string(),
        sectionId: z.number(),
        published: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.assignment.updateMany({
        where: {
          id: input.id,
          courseSection: {
            id: input.sectionId,
            professors: { some: { professorId: ctx.session.user.id } },
          },
        },
        data: {
          isPublished: input.published,
        },
      });
    }),
  delete: professorProcedure
    .input(z.object({ id: z.string(), sectionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.assignment.deleteMany({
        where: {
          id: input.id,
          courseSection: {
            id: input.sectionId,
            professors: { some: { professorId: ctx.session.user.id } },
          },
        },
      });
    }),
});
