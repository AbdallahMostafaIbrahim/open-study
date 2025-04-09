import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { coursesRouter } from "./courses";
import { organizationsRouter } from "./organizations";
import { professorsRouter } from "./professors";
import { studentsRouter } from "./students";

export const adminRouter = createTRPCRouter({
  organizations: organizationsRouter,
  students: studentsRouter,
  professors: professorsRouter,
  courses: coursesRouter,
});
