import { z } from "zod";
import { createTRPCRouter, professorProcedure } from "~/server/api/trpc";

export const materialRouter = createTRPCRouter({
  get: professorProcedure
    .input(z.object({ sectionId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.material.findMany({
        where: { courseSectionId: input.sectionId },
        select: {
          id: true,
          title: true,
          author: { select: { user: { select: { name: true } } } },
          date: true,
          text: true,
          group: true,
          files: true,
          isPublished: true,
        },
      });
    }),
  groups: professorProcedure
    .input(z.object({ sectionId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.material.findMany({
        where: { courseSectionId: input.sectionId },
        select: { group: true },
        distinct: ["group"],
      });
    }),
  getOne: professorProcedure
    .input(z.object({ id: z.string(), sectionId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.material.findFirst({
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
          group: true,
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
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.material.create({
        data: {
          title: input.title,
          text: input.text,
          group: input.group,
          isPublished: input.published,
          courseSectionId: input.sectionId,
          authorId: ctx.session.user.id,
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
      return await ctx.db.material.updateMany({
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
      return await ctx.db.material.deleteMany({
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
