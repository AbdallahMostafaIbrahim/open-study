"use client";

import { FormDescription, FormLabel } from "~/components/ui/form";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import type { UseFormReturn } from "react-hook-form";
import type { FormValues } from "../page";

interface TrueFalseQuestionProps {
    form: UseFormReturn<FormValues>;
    index: number;
}

export default function TrueFalseQuestion({ form, index }: TrueFalseQuestionProps) {
    const currentAnswer = (form.watch(`questions.${index}.correctAnswer`) || [])[0];

    return (
        <div className="space-y-3 pt-4">
            <FormLabel>Correct Answer</FormLabel>
            <RadioGroup
                value={currentAnswer}
                onValueChange={(value: string) => form.setValue(`questions.${index}.correctAnswer`, [value])}
                className="flex space-x-4"
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="True" id={`correct-true-${index}`} />
                    <Label htmlFor={`correct-true-${index}`} className="text-sm font-normal">True</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="False" id={`correct-false-${index}`} />
                    <Label htmlFor={`correct-false-${index}`} className="text-sm font-normal">False</Label>
                </div>
            </RadioGroup>
        </div>
    );
}
