import { z } from "zod";
import { deleteEmptyUser } from "~/lib/db/user";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const professorsRouter = createTRPCRouter({
  get: protectedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    return await ctx.db.professor.findMany({
      select: {
        user: {
          select: { id: true, email: true, name: true },
        },
        _count: { select: { courses: true } },
      },
      where: { organizationId: input },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        email: z.string(),
        name: z.string(),
        professorId: z.string(),
        organizationId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if professor already exists
      const existingProfessor = await ctx.db.professor.findFirst({
        where: {
          user: { email: input.email },
        },
        select: {
          organization: { select: { id: true } },
          user: {
            select: { id: true },
          },
        },
      });

      if (existingProfessor) {
        // Check if the user is already in the organization
        if (existingProfessor.organization.id !== input.organizationId) {
          throw new Error("Student already exists in another organization");
        } else {
          throw new Error("Student already exists in this organization");
        }
      }

      await ctx.db.professor.create({
        data: {
          professorId: input.professorId,
          organization: { connect: { id: input.organizationId } },
          user: {
            connectOrCreate: {
              where: { email: input.email },
              create: {
                email: input.email,
                name: input.name,
              },
            },
          },
        },
      });
    }),
  remove: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.professor.delete({
        where: {
          userId: input,
        },
      });
      await deleteEmptyUser(ctx.db, input);
    }),
});
