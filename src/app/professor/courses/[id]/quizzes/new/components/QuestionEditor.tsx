"use client";

import { Trash } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import type { FormValues } from "../page";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import QuestionOptions from "./QuestionOptions";
import TrueFalseQuestion from "./TrueFalseQuestion";

interface QuestionEditorProps {
  form: UseFormReturn<FormValues>;
  index: number;
  onRemove: () => void;
  canRemove: boolean;
}

export default function QuestionEditor({
  form,
  index,
  onRemove,
  canRemove,
}: QuestionEditorProps) {
  const questionType = form.watch(`questions.${index}.type`);

  return (
    <div className="space-y-4">
      {/* Question text */}
      <FormField
        control={form.control}
        name={`questions.${index}.question`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Question</FormLabel>
            <FormControl>
              <Textarea placeholder="Enter your question here" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Question type */}
      <FormField
        control={form.control}
        name={`questions.${index}.type`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Question Type</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                // Reset options when changing type
                if (
                  value === "MULTIPLE_CHOICE" &&
                  !form.getValues(`questions.${index}.options`)
                ) {
                  form.setValue(`questions.${index}.options`, ["", ""]);
                  form.setValue(`questions.${index}.correctAnswer`, []);
                } else if (value === "TRUE_FALSE") {
                  form.setValue(`questions.${index}.options`, [
                    "True",
                    "False",
                  ]);
                  form.setValue(`questions.${index}.correctAnswer`, []);
                } else {
                  form.setValue(`questions.${index}.options`, []);
                  form.setValue(`questions.${index}.correctAnswer`, [""]);
                }
              }}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="MULTIPLE_CHOICE">Multiple Choice</SelectItem>
                <SelectItem value="TRUE_FALSE">True/False</SelectItem>
                <SelectItem value="SHORT_ANSWER">Short Answer</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Question points */}
      <FormField
        control={form.control}
        name={`questions.${index}.points`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Points</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                value={field.value || 0}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Question order (hidden, automatically set) */}
      <input
        type="hidden"
        {...form.register(`questions.${index}.order`)}
        value={index}
      />

      {/* Options for multiple choice or true/false */}
      {(questionType === "MULTIPLE_CHOICE" ||
        questionType === "TRUE_FALSE") && (
        <QuestionOptions form={form} index={index} />
      )}

      {/* Correct Answer(s) - specific to question type */}
      {questionType === "MULTIPLE_CHOICE" && (
        <MultipleChoiceQuestion form={form} index={index} />
      )}

      {questionType === "TRUE_FALSE" && (
        <TrueFalseQuestion form={form} index={index} />
      )}

      {/* Remove question button */}
      <div className="flex justify-end">
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={onRemove}
          disabled={!canRemove}
        >
          <Trash className="mr-2 h-4 w-4" />
          Remove Question
        </Button>
      </div>
    </div>
  );
}
