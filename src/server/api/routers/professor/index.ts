import { createTRPCRouter } from "~/server/api/trpc";
import { coursesRouter } from "./courses";

export const professorRouter = createTRPCRouter({
  courses: coursesRouter,
});
