"use client";

import { FormDescription, FormLabel } from "~/components/ui/form";
import { Checkbox } from "~/components/ui/checkbox";
import type { UseFormReturn } from "react-hook-form";
import type { FormValues } from "../page";

interface MultipleChoiceQuestionProps {
    form: UseFormReturn<FormValues>;
    index: number;
}

export default function MultipleChoiceQuestion({ form, index }: MultipleChoiceQuestionProps) {
    return (
        <div className="space-y-3 pt-4">
            <FormLabel>Correct Answer(s)</FormLabel>
            <div className="space-y-2">
                {form.watch(`questions.${index}.options`)?.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                        <Checkbox
                            id={`correct-${index}-${optionIndex}`}
                            checked={(form.watch(`questions.${index}.correctAnswer`) || []).includes(option)}
                            onCheckedChange={(checked) => {
                                const currentAnswers = form.getValues(`questions.${index}.correctAnswer`) || [];
                                if (checked) {
                                    form.setValue(`questions.${index}.correctAnswer`, [...currentAnswers, option]);
                                } else {
                                    form.setValue(
                                        `questions.${index}.correctAnswer`,
                                        currentAnswers.filter(answer => answer !== option)
                                    );
                                }
                            }}
                        />
                        <label
                            htmlFor={`correct-${index}-${optionIndex}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            {option || `Option ${optionIndex + 1}`}
                        </label>
                    </div>
                ))}
            </div>
            <FormDescription>Select all correct answers</FormDescription>
        </div>
    );
}
