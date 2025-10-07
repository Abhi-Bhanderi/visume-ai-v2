"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { DetailsType, ProgressType } from "@/app/initial/page";

export const formSchema = z.object({
  title: z.string().min(2).max(50),
  company: z.string().min(2).max(50).optional(),
  description: z.string().min(2).max(1000),
});

export default function JobForm({
  handleProgress,
  handleResumeAndJobDetails,
}: {
  handleProgress: (step: number, form: ProgressType["form"]) => void;
  handleResumeAndJobDetails: ({ resume, job }: DetailsType) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      company: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    handleResumeAndJobDetails({
      job: {
        description: values.description,
        title: values.title,
        company: values.company ?? "",
      },
    });
    handleProgress(2, "RESUEM_UPLOAD_FORM");
  }

  return (
    <section className="flex flex-col justify-center gap-10">
      <div className="space-y-2">
        <h1 className="text-xl font-bold">Add your Job details</h1>
        <p className="text-muted-foreground text-sm">
          Let&apos;s get you started with your resume.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-xl">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Software Engineer"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Google" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Paste the full job description here..."
                    {...field}
                    rows={15}
                    className="text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between items-center">
            <p className="text-muted-foreground text-sm">
              Now upload your resume to match with the job description.
            </p>
            <Button type="submit">Continue</Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
