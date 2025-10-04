/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Loader2, Circle, AlertCircle } from "lucide-react";
import { DetailsType, ProgressType } from "@/app/initial/page";
import axios from "axios";

interface Props {
  handleProgress: (step: number, form: ProgressType["form"]) => void;
  resumeAndJobDetails: DetailsType;
}

type StepStatuses = {
  [key: number]: {
    status: "loading" | "completed" | "error";
    error: string | null;
  };
};

export const ParsingResume = ({
  handleProgress,
  resumeAndJobDetails,
}: Props) => {
  console.log("🚀 ~ ParsingResume ~ resumeAndJobDetails:", resumeAndJobDetails);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [parsedResume, setParsedResume] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [stepStatuses, setStepStatuses] = useState<StepStatuses>({});
  const [match, setMatch] = useState(null);

  console.log("🚀 ~ ParsingResume ~ match:", match);

  // Define your steps with their API calls
  const steps = [
    {
      id: 1,
      name: "Uploading your Resume...",
      apiCall: async () => {
        const resume = resumeAndJobDetails.resume;

        const formData = new FormData();
        formData.append("file", resume?.file ?? new Blob());

        const response = await axios.post("/api/resumes/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.ok) {
          setResumeId(response.data.resume.id);
        }
        return response.data;
      },
    },
    {
      id: 2,
      name: "Building your Resume...",
      apiCall: async () => {
        const response = await axios.post("/api/resumes/parse", {
          resumeId,
          resumeText: resumeAndJobDetails.resume?.text,
        });
        if (response.data.ok) {
          setParsedResume(response.data.resume);
        }
        return response.data;
      },
    },
    {
      id: 3,
      name: "Running the AI Resume Analyzer...",
      apiCall: async () => {
        if (!parsedResume || !resumeAndJobDetails.job?.description) {
          setStepStatuses((prev) => ({
            ...prev,
            [3]: {
              status: "error",
              error: "Parsed resume and job description are required",
            },
          }));
          return;
        }
        // Replace with your actual API call
        const response = await axios.post("/api/resumes/match", {
          parsedResume,
          jobDescription: resumeAndJobDetails.job?.description,
        });
        if (response.data.ok) {
          setMatch(response.data.data);
        }
        return response.data;
      },
    },
    {
      id: 4,
      name: "Finalizing Setup",
      apiCall: async () => {
        // INSERT_YOUR_CODE
        await new Promise((resolve) => setTimeout(resolve, 3000));
      },
    },
  ];

  useEffect(() => {
    if (currentStep >= steps.length) {
      setIsComplete(true);
      return;
    }

    const executeStep = async () => {
      const step = steps[currentStep];

      try {
        setStepStatuses((prev) => ({
          ...prev,
          [step.id]: { status: "loading", error: null },
        }));

        // Execute the API call
        await step.apiCall();

        // Mark as completed
        setStepStatuses((prev) => ({
          ...prev,
          [step.id]: { status: "completed", error: null },
        }));

        // Move to next step after a brief delay
        setTimeout(() => {
          setCurrentStep((prevStep) => prevStep + 1);
        }, 300);
      } catch (error) {
        // Handle error
        console.log(error);

        setStepStatuses((prev) => ({
          ...prev,
          [step.id]: {
            status: "error",
            error: error instanceof Error ? error.message : "Unknown error",
          },
        }));
      }
    };

    executeStep();
  }, [currentStep]);

  const getStepStatus = (stepIndex: number) => {
    const step = steps[stepIndex];
    const status: any = stepStatuses[step.id as keyof typeof stepStatuses];

    if (!status) return "pending";
    return status.status;
  };

  const getStepError = (stepIndex: number) => {
    const step = steps[stepIndex];
    const status: any = stepStatuses[step.id as keyof typeof stepStatuses];
    console.log(status);
    return status?.error;
  };

  const resetLoader = () => {
    setCurrentStep(0);
    setStepStatuses({});
    setIsComplete(false);
  };

  const retryFailedStep = () => {
    const step = steps[currentStep];
    setStepStatuses((prev) => ({
      ...prev,
      [step.id]: { status: "loading", error: null },
    }));

    // Trigger re-execution by updating the step
    setCurrentStep(currentStep);
  };

  const hasError = Object.values(stepStatuses).some(
    (s: any) => s.status === "error"
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-center text-primary">
          Setting up your dashboard...
        </h2>
        <div className="space-y-6 mt-12">
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            const error = getStepError(index);

            return (
              <div key={step.id} className="space-y-2">
                <div className="flex items-center gap-3">
                  {status === "completed" && (
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                  )}
                  {status === "loading" && (
                    <Loader2 className="w-6 h-6 text-primary animate-spin flex-shrink-0" />
                  )}
                  {status === "error" && (
                    <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  )}
                  {status === "pending" && (
                    <Circle className="w-6 h-6 text-gray-300 flex-shrink-0" />
                  )}

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`font-medium ${
                          status === "completed"
                            ? "text-green-600"
                            : status === "loading"
                              ? "text-primary"
                              : status === "error"
                                ? "text-red-700"
                                : "text-gray-400"
                        }`}
                      >
                        {step.name}
                      </span>
                      {status === "loading" && (
                        <span className="text-sm text-gray-500">
                          Processing...
                        </span>
                      )}
                      {status === "completed" && (
                        <span className="text-sm text-green-600">Done</span>
                      )}
                      {status === "error" && (
                        <span className="text-sm text-red-600">Failed</span>
                      )}
                    </div>

                    <Progress
                      value={
                        status === "completed"
                          ? 100
                          : status === "loading"
                            ? null
                            : 0
                      }
                      className="h-2"
                    />

                    {error && (
                      <p className="text-sm text-red-600 mt-1">
                        Error: {error}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {hasError && !isComplete && (
          <div className="pt-4 flex gap-3">
            <button
              onClick={retryFailedStep}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Retry Step
            </button>
          </div>
        )}

        <div className="pt-4 flex gap-3">
          <button
            onClick={resetLoader}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Restart
          </button>
        </div>
      </div>
    </div>
  );
};
