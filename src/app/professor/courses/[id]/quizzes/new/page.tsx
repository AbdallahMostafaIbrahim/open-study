"use client";

import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/trpc/react";

// UI Components
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { toast } from "sonner";

// Components
import QuizDetailsForm from "./components/QuizDetailsForm";
import QuestionsForm from "./components/QuestionsForm";

// Form schema
const questionSchema = z.object({
  question: z.string().min(1, "Question is required"),
  type: z.enum(["MULTIPLE_CHOICE", "TRUE_FALSE", "SHORT_ANSWER"]),
  points: z.number().min(0, "Points must be a positive number"),
  order: z.number(),
  options: z.array(z.string()).optional(),
  correctAnswer: z.array(z.string()).optional(),
});

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  points: z.number().min(0, "Points must be a positive number"),
  dueDate: z.date().optional(),
  maxAttempts: z.number().optional(),
  durationInSeconds: z.number().optional(),
  isPublished: z.boolean(),
  questions: z
    .array(questionSchema)
    .min(1, "At least one question is required"),
});

export type FormValues = z.infer<typeof formSchema>;

export default function CreateQuizForm() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const sectionId = parseInt(params.id, 10);

  // Create quiz mutation
  const createQuiz = api.professor.courses.quizzes.create.useMutation({
    onSuccess: () => {
      toast.success("Quiz created successfully");
      router.push(`/professor/courses/${sectionId}/quizzes`);
      router.refresh();
    },
    onError: (error) => {
      toast.error(`Error creating quiz: ${error.message}`);
    },
  });

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      points: 0,
      maxAttempts: 1,
      isPublished: false,
      questions: [
        {
          question: "",
          type: "MULTIPLE_CHOICE",
          points: 1,
          order: 0,
          options: ["", ""],
          correctAnswer: [], // Add this default
        },
      ],
    },
  });

  // Submit handler
  const onSubmit = (values: FormValues) => {
    createQuiz.mutate({
      sectionId,
      ...values,
    });
  };

  return (
    <div className="container max-w-5xl py-0">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Quizzes
        </Button>
        <h1 className="text-3xl font-bold">Create New Quiz</h1>
        <p className="text-muted-foreground mt-2">
          Create a new quiz with multiple question types to test your students'
          knowledge.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Quiz Details Form Section */}
          <QuizDetailsForm form={form} />

          {/* Questions Form Section */}
          <QuestionsForm
            form={form}
            onCancel={() => router.back()}
            onSubmit={form.handleSubmit(onSubmit)}
            isSubmitting={createQuiz.isPending}
          />
        </form>
      </Form>
    </div>
  );
}
