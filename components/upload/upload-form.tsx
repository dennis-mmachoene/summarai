"use client";
import { z } from "zod";
import { toast } from "sonner";
import UploadFormInput from "./upload-form-input";
import { useUploadThing } from "@/utils/uploadthing";
import {
  generatePdfSummary,
  storePdfSummaryAction,
} from "@/actions/upload-actions";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine(
      (file) => file.size <= 20 * 1024 * 1024,
      "File must be less than 20MB"
    )
    .refine(
      (file) => file.type.startsWith("application/pdf"),
      "File must be a PDF"
    ),
});

const UploadForm = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      console.log("Upload successfully!");
    },
    onUploadError: (err) => {
      console.error("An error has occured while upload", err);
      toast.error("An error has occurred while uploading", {
        description: err.message,
      });
    },
    onUploadBegin: ({ file }) => {
      console.log("Upload has begun for", file);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;
      console.log("submitted");

      //validate file
      const validatedFields = schema.safeParse({ file });
      //schema validation with zod
      console.log(validatedFields);
      if (!validatedFields.success) {
        console.log(
          validatedFields.error.flatten().fieldErrors.file?.[0] ??
            "Invalid File"
        );
        toast("❌ Something went wrong", {
          description:
            validatedFields.error.flatten().fieldErrors.file?.[0] ??
            "Invalid File",
          style: { backgroundColor: "#f87171", color: "white" }, // Red destructive styling
        });
        setIsLoading(false);
        return;
      }
      toast("📄 Uploading PDF", {
        description: "We are uploading your PDF! ✨",
      });

      //upload file
      const response = await startUpload([file]);

      if (!response) {
        toast("❌ Something went wrong", {
          description: "Please use a different file",
          style: { backgroundColor: "#dc2626", color: "white" }, // Tailwind red-600
        });
        setIsLoading(false);
        return;
      }

      toast("📄 Processing PDF", {
        description: "Hang tight! Our AI is reading through your document! ✨",
      });
      //parse pdf using langchain
      const result = await generatePdfSummary(response);

      const { data = null, message = null } = result || {};

      if (data) {
        let storeResult: any;
        toast("📄 Saving PDF...", {
          description: "Hang Tight! We are saving your summary! ✨",
        });

        if (data.summary) {
          storeResult = await storePdfSummaryAction({
            summary: data.summary,
            fileUrl: response[0].serverData.file.url,
            title: data.title,
            fileName: file.name,
          });

          toast("📄 Summary saved!", {
            description: "Your summary has been saved! ✨",
          });

          formRef.current?.reset();
          router.push(`/summaries/${storeResult.data.id}`)
        }

        
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      formRef.current?.reset();
    }finally{
      setIsLoading(false);
    }

    //save summary to db
    //redirect to the [id] summary page
  };
  return (
    <div className="felx flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput
        isLoading={isLoading}
        onSubmit={handleSubmit}
        ref={formRef}
      />
    </div>
  );
};

export default UploadForm;
