import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { organizationsRouter } from "./organizations";
import { studentsRouter } from "./students";

export const adminRouter = createTRPCRouter({
  organizations: organizationsRouter,
  students: studentsRouter,
});
