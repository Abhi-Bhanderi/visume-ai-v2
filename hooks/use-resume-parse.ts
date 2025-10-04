import { Resume } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { ResumeData } from "@/components/resumes/resume-details";

interface ParseResumeResponse {
  resume: ResumeData;
}

interface ParseResumeVariables {
  resumeText: string;
  jobDescription: string;
}

export const useResumeParse = () => {
  return useMutation<ParseResumeResponse, Error, ParseResumeVariables>({
    mutationFn: async ({ resumeText, jobDescription }) => {
      const response = await axios.post<ParseResumeResponse>(
        "/api/resumes/parse",
        { resumeText, jobDescription }
      );

      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Resume parsed successfully!");
      console.log(data);
    },
    onError: (error) => {
      console.error("Parse error:", error);
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.error || error.message
        : "Parse failed";
      toast.error(`Failed to parse resume: ${errorMessage}`);
    },
  });
};
