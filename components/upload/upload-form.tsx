"use client";
import { z } from "zod";
import { toast } from "sonner";
import UploadFormInput from "./upload-form-input";
import { useUploadThing } from "@/utils/uploadthing";
import { generatePdfSummary } from "@/actions/upload-actions";

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

    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;
    console.log("submitted");

    //validate file
    const validatedFields = schema.safeParse({ file });
    //schema validation with zod
    console.log(validatedFields);
    if (!validatedFields.success) {
      console.log(
        validatedFields.error.flatten().fieldErrors.file?.[0] ?? "Invalid File"
      );
      toast("❌ Something went wrong", {
        description:
          validatedFields.error.flatten().fieldErrors.file?.[0] ??
          "Invalid File",
        style: { backgroundColor: "#f87171", color: "white" }, // Red destructive styling
      });

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
          
      return;
    }

    toast("📄 Processing PDF", {
        description: "Hang tight! Our AI is reading through your document! ✨",
      });
    //parse pdf using langchain
    const summary = await generatePdfSummary(response);
    console.log(summary)
    //save summary to db
    //redirect to the [id] summary page
  };
  return (
    <div className="felx flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput onSubmit={handleSubmit} />
    </div>
  );
};

export default UploadForm;
