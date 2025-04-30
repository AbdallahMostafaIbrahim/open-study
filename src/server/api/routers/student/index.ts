import { createTRPCRouter } from "~/server/api/trpc";
import { coursesRouter } from "./courses";
import { miscRouter } from "./misc";

export const StudentRouter = createTRPCRouter({
  courses: coursesRouter,
  misc: miscRouter,
});
