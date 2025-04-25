import { create } from "domain";
import { z } from "zod";
import { deleteEmptyUser } from "~/lib/db/user";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const studentsRouter = createTRPCRouter({
  get: protectedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    return await ctx.db.student.findMany({
      select: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
            id: true,
          },
        },
        organization: true,
        studentId: true,
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
        email: z.string(),
        organizationId: z.number(),
        studentId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if student already exists
      const existingStudent = await ctx.db.student.findFirst({
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

      if (existingStudent) {
        // Check if the user is already in the organization
        if (existingStudent.organization.id !== input.organizationId) {
          throw new Error("Student already exists in another organization");
        } else {
          throw new Error("Student already exists in this organization");
        }
      }

      await ctx.db.student.create({
        data: {
          studentId: input.studentId,
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
      await ctx.db.student.delete({
        where: {
          userId: input,
        },
      });

      await deleteEmptyUser(ctx.db, input);
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
