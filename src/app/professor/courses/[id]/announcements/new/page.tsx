"use client";

import { Check, ChevronLeft, Loader2, Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/trpc/react";

// UI Components
import { zodResolver } from "@hookform/resolvers/zod";
import { FileUploader } from "~/components/file-uploader";
import { Button } from "~/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";
import { S3_URL } from "~/lib/constants";
import { toast } from "sonner";

// Form schema matching your input schema
const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
});

export type FormValues = z.infer<typeof formSchema>;

export default function CreateAnnouncementForm() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const sectionId = parseInt(params.id, 10);
    const { mutate, isPending } = api.professor.courses.announcements.create.useMutation({
        onSuccess() {
            toast.success("Announcement created successfully");
            router.push(`/professor/courses/${sectionId}/announcements`);
        }
    });

    // Form hook moved to top level
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            content: "",
        },
    });

    const { control, handleSubmit } = form;

    return (
        <div className="container max-w-5xl py-8">
            <Form {...form}>
                <form onSubmit={handleSubmit((data) => mutate({ ...data, sectionId }))}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Create Announcement</CardTitle>
                            <CardDescription>Create a new announcement for your course</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Announcement title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Content</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Write your announcement here..."
                                                className="min-h-32"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push(`/professor/courses/${sectionId}/announcements`)}
                            >
                                <ChevronLeft className="h-4 w-4 mr-2" />
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </div>
    );
}
