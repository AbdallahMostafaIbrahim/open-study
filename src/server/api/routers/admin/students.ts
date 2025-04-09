import { create } from "domain";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const studentsRouter = createTRPCRouter({
  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return await ctx.db.student.findMany({
      select: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
            organization: true,
            id: true,
          },
        },
        studentId: true,
      },
      where: {
        user: {
          organizationId: input,
        },
      },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        organizationId: z.string(),
        studentId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.create({
        data: {
          name: input.name,
          email: input.email,
          image: null,
          organizationId: input.organizationId,
          student: {
            create: {
              studentId: input.studentId,
            },
          },
        },
      });
    }),

  remove: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.student.delete({
        where: {
          userId: input,
        },
      });

      await ctx.db.user.delete({
        where: {
          id: input,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        studentId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          email: input.email,
          student: {
            update: {
              studentId: input.studentId,
            },
          },
        },
      });
    }),
});
