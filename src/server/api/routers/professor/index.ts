import { createTRPCRouter } from "~/server/api/trpc";
import { coursesRouter } from "./courses";
import { miscRouter } from "./misc";

export const professorRouter = createTRPCRouter({
  courses: coursesRouter,
  misc: miscRouter,
});
