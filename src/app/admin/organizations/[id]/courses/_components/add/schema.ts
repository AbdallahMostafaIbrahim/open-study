import { z } from "zod";

export const sectionSchema = z.object({
  sectionNumber: z.string().min(1, { message: "Section number is required" }),
  professors: z.array(z.string()),
  students: z.array(z.string()),
  semesterId: z.number(),
});

export const courseFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  courseCode: z.string(),
  sections: z.array(sectionSchema),
});

export type SectionFormValues = z.infer<typeof sectionSchema>;
export type CourseFormValues = z.infer<typeof courseFormSchema>;
export interface SelectedPerson {
  id: string;
  name: string;
  imageUrl?: string;
}
