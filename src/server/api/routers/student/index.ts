import { createTRPCRouter } from "~/server/api/trpc";
import { chatRouter } from "./chat";
import { coursesRouter } from "./courses";
import { miscRouter } from "./misc";

export const studentRouter = createTRPCRouter({
  courses: coursesRouter,
  misc: miscRouter,
  chat: chatRouter,
});
