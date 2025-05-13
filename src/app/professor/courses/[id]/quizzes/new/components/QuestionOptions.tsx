"use client";

import { Button } from "~/components/ui/button";
import { FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Plus, Trash } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { FormValues } from "../page";

interface QuestionOptionsProps {
    form: UseFormReturn<FormValues>;
    index: number;
}

export default function QuestionOptions({ form, index }: QuestionOptionsProps) {
    const questionType = form.watch(`questions.${index}.type`);
    const isTrueFalse = questionType === "TRUE_FALSE";
    const isMultipleChoice = questionType === "MULTIPLE_CHOICE";

    if (questionType === "SHORT_ANSWER") {
        return null;
    }
    if (isTrueFalse) {
        return null;
    }

    return (
        <div className="space-y-3 pt-2">
            <FormLabel>Answer Options</FormLabel>
            {form.watch(`questions.${index}.options`)?.map((_, optionIndex) => (
                <div className="flex gap-2" key={optionIndex}>
                    <Input
                        placeholder={`Option ${optionIndex + 1}`}
                        value={form.watch(`questions.${index}.options.${optionIndex}`) || ""}
                        onChange={(e) => {
                            const newOptions = [...(form.getValues(`questions.${index}.options`) || [])];
                            newOptions[optionIndex] = e.target.value;
                            form.setValue(`questions.${index}.options`, newOptions);
                        }}
                        disabled={isTrueFalse}
                    />
                    {isMultipleChoice && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                const currentOptions = form.getValues(`questions.${index}.options`) || [];
                                currentOptions.splice(optionIndex, 1);
                                form.setValue(`questions.${index}.options`, currentOptions);
                            }}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            ))}

            {isMultipleChoice && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                        const currentOptions = form.getValues(`questions.${index}.options`) || [];
                        form.setValue(`questions.${index}.options`, [...currentOptions, ""]);
                    }}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Option
                </Button>
            )}
        </div>
    );
}
