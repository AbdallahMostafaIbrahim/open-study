import { createTRPCRouter } from "~/server/api/trpc";
import { coursesRouter } from "./courses";
import { organizationsRouter } from "./organizations";
import { professorsRouter } from "./professors";
import { studentsRouter } from "./students";
import { semestersRouter } from "./semesters";

export const adminRouter = createTRPCRouter({
  organizations: organizationsRouter,
  students: studentsRouter,
  professors: professorsRouter,
  courses: coursesRouter,
  semesters: semestersRouter,
});
