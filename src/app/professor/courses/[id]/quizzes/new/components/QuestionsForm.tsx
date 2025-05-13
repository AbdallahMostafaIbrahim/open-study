"use client";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import { Plus, Save, Loader2 } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { FormValues } from "../page";
import { useFieldArray } from "react-hook-form";
import QuestionEditor from "./QuestionEditor";

interface QuestionsFormProps {
    form: UseFormReturn<FormValues>;
    onCancel: () => void;
    onSubmit: () => void;
    isSubmitting: boolean;
}

export default function QuestionsForm({ form, onCancel, onSubmit, isSubmitting }: QuestionsFormProps) {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "questions",
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Quiz Questions</CardTitle>
                <CardDescription>
                    Add questions of different types to your quiz.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Accordion type="multiple" className="w-full">
                    {fields.map((field, index) => (
                        <AccordionItem value={`question-${index}`} key={field.id}>
                            <AccordionTrigger className="px-4 py-2 bg-muted/30 rounded-md">
                                <div className="flex items-center space-x-2 text-left">
                                    <span className="font-medium">Question {index + 1}: </span>
                                    <span className="truncate">
                                        {form.watch(`questions.${index}.question`) || "New Question"}
                                    </span>
                                    <span className="text-muted-foreground text-sm">
                                        ({form.watch(`questions.${index}.points`)} pts)
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-2 pt-4">
                                <QuestionEditor
                                    form={form}
                                    index={index}
                                    onRemove={() => remove(index)}
                                    canRemove={fields.length > 1}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>

                {/* Add question button */}
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        append({
                            question: "",
                            type: "MULTIPLE_CHOICE",
                            points: 1,
                            order: fields.length,
                            options: ["", ""],
                            correctAnswer: [], // Add default empty array
                        });
                    }}
                    className="w-full"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Question
                </Button>
            </CardContent>

            <CardFooter className="flex justify-between pt-6">
                <Button
                    variant="outline"
                    type="button"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} onClick={onSubmit}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Quiz...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Create Quiz
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
