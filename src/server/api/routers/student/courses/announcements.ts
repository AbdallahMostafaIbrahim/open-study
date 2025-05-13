import { z } from "zod";
import { createTRPCRouter, studentProcedure } from "~/server/api/trpc";

export const announcementsRouter = createTRPCRouter({
    get: studentProcedure
        .input(z.object({ sectionId: z.number() }))
        .query(async ({ ctx, input }) => {
            return await ctx.db.annoucement.findMany({
                where: {
                    courseSectionId: input.sectionId,
                    courseSection: {
                        students: { some: { studentId: ctx.session.user.id } },
                    },
                },
                select: {
                    id: true,
                    title: true,
                    content: true,
                    author: {
                        select: { user: { select: { name: true, image: true, id: true } } },
                    },
                    date: true,
                },
            });
        }),
});
