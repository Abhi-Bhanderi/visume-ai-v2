import { useState, useEffect, useCallback, useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Loader2, Circle, AlertCircle } from "lucide-react";
import { DetailsType, ProgressType } from "@/app/initial/page";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Props {
  handleProgress: (step: number, form: ProgressType["form"]) => void;
  resumeAndJobDetails: DetailsType;
}

type StepStatus = "pending" | "loading" | "completed" | "error";

type StepStatuses = {
  [key: number]: {
    status: StepStatus;
    error: string | null;
  };
};

interface ParsedResume {
  id: string;
  [key: string]: unknown;
}

interface MatchData {
  [key: string]: unknown;
}

interface StepItemProps {
  name: string;
  status: StepStatus;
  error: string | null;
}

const StepItem = ({ name, status, error }: StepItemProps) => {
  const getStatusIcon = () => {
    switch (status) {
      case "completed":
        return (
          <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
        );
      case "loading":
        return (
          <Loader2 className="w-6 h-6 text-primary animate-spin flex-shrink-0" />
        );
      case "error":
        return <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />;
      default:
        return <Circle className="w-6 h-6 text-gray-300 flex-shrink-0" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "loading":
        return <span className="text-sm text-primary">Processing...</span>;
      case "completed":
        return <span className="text-sm text-green-600">Done</span>;
      case "error":
        return <span className="text-sm text-red-600">Failed</span>;
      default:
        return null;
    }
  };

  const getTextColor = () => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "loading":
        return "text-primary";
      case "error":
        return "text-red-700";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        {getStatusIcon()}

        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className={`font-medium ${getTextColor()}`}>{name}</span>
            {getStatusText()}
          </div>

          {error && <p className="text-sm text-red-600 mt-1">Error: {error}</p>}
        </div>
      </div>
    </div>
  );
};

export const ParsingResume = ({ resumeAndJobDetails }: Props) => {
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [stepStatuses, setStepStatuses] = useState<StepStatuses>({});
  const [match, setMatch] = useState<MatchData | null>(null);
  const isExecutingRef = useRef(false);
  const router = useRouter();

  // Define steps with their API calls using useCallback to prevent recreating on each render
  const executeUploadStep = useCallback(async () => {
    const resume = resumeAndJobDetails.resume;
    if (!resume?.file) {
      throw new Error("No resume file provided");
    }

    const formData = new FormData();
    formData.append("file", resume.file);

    const response = await axios.post("/api/resumes/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data?.resume?.id) {
      setResumeId(response.data.resume.id);
    } else {
      throw new Error("Failed to get resume ID from upload response");
    }
    return response.data;
  }, [resumeAndJobDetails.resume]);

  const executeParseStep = useCallback(async () => {
    if (!resumeId) {
      throw new Error("Resume ID is required for parsing");
    }

    const response = await axios.post("/api/resumes/parse", {
      resumeId,
      resumeText: resumeAndJobDetails.resume?.text,
    });

    if (response.data?.resume) {
      setParsedResume(response.data.resume);
    } else {
      throw new Error("Failed to get parsed resume from response");
    }
    return response.data;
  }, [resumeId, resumeAndJobDetails.resume?.text]);

  const executeMatchStep = useCallback(async () => {
    if (!parsedResume) {
      throw new Error("Parsed resume is required for matching");
    }
    if (!resumeAndJobDetails.job?.description) {
      throw new Error("Job description is required for matching");
    }

    const response = await axios.post("/api/resumes/match", {
      parsedResume,
      jobDescription: resumeAndJobDetails.job.description,
    });

    if (response.data?.data) {
      setMatch(response.data.data);
    }
    return response.data;
  }, [parsedResume, resumeAndJobDetails.job?.description]);

  const executeFinalizeStep = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    router.push(`/dashboard/resumes/${resumeId}`);
  }, []);

  const steps = [
    {
      id: 1,
      name: "Uploading your Resume",
      apiCall: executeUploadStep,
    },
    {
      id: 2,
      name: "Building your Resume",
      apiCall: executeParseStep,
    },
    {
      id: 3,
      name: "Running the AI Resume Analyzer",
      apiCall: executeMatchStep,
    },
    {
      id: 4,
      name: "Finalizing Setup",
      apiCall: executeFinalizeStep,
    },
  ];

  useEffect(() => {
    if (currentStep >= steps.length) {
      setIsComplete(true);
      return;
    }

    // Prevent duplicate execution
    if (isExecutingRef.current) {
      return;
    }

    const executeStep = async () => {
      const step = steps[currentStep];

      // Skip if already completed or loading
      if (
        stepStatuses[step.id]?.status === "completed" ||
        stepStatuses[step.id]?.status === "loading"
      ) {
        return;
      }

      isExecutingRef.current = true;

      try {
        setStepStatuses((prev) => ({
          ...prev,
          [step.id]: { status: "loading", error: null },
        }));

        await step.apiCall();

        setStepStatuses((prev) => ({
          ...prev,
          [step.id]: { status: "completed", error: null },
        }));

        setTimeout(() => {
          isExecutingRef.current = false;
          setCurrentStep((prevStep) => prevStep + 1);
        }, 300);
      } catch (error) {
        console.error(`Error in step ${step.id}:`, error);

        setStepStatuses((prev) => ({
          ...prev,
          [step.id]: {
            status: "error",
            error:
              error instanceof Error ? error.message : "Unknown error occurred",
          },
        }));

        isExecutingRef.current = false;
      }
    };

    executeStep();
  }, [currentStep, steps, stepStatuses]);

  const getStepStatus = useCallback(
    (stepIndex: number): StepStatus => {
      const step = steps[stepIndex];
      const status = stepStatuses[step.id];

      if (!status) return "pending";
      return status.status;
    },
    [steps, stepStatuses]
  );

  const getStepError = useCallback(
    (stepIndex: number): string | null => {
      const step = steps[stepIndex];
      const status = stepStatuses[step.id];
      return status?.error ?? null;
    },
    [steps, stepStatuses]
  );

  const resetLoader = useCallback(() => {
    setCurrentStep(0);
    setStepStatuses({});
    setIsComplete(false);
    setResumeId(null);
    setParsedResume(null);
    setMatch(null);
    isExecutingRef.current = false;
  }, []);

  const retryFailedStep = useCallback(() => {
    const step = steps[currentStep];
    isExecutingRef.current = false;

    setStepStatuses((prev) => {
      const newStatuses = { ...prev };
      delete newStatuses[step.id];
      return newStatuses;
    });

    // Force re-execution
    setCurrentStep(currentStep);
  }, [currentStep, steps]);

  const hasError = Object.values(stepStatuses).some(
    (status) => status.status === "error"
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-center text-primary">
          Setting up your dashboard...
        </h2>

        <div className="space-y-6 mt-12 w-md">
          {steps.map((step, index) => (
            <StepItem
              key={step.id}
              name={step.name}
              status={getStepStatus(index)}
              error={getStepError(index)}
            />
          ))}
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

        {isComplete && (
          <div className="pt-4 flex gap-3">
            <button
              onClick={resetLoader}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Restart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
