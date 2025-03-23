"use client";
import { z } from "zod";
import { Button } from "../ui/button";
import UploadFormInput from "./upload-form-input";

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
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;
    console.log("submitted");

    //validate file
    const validatedFields = schema.safeParse({ file });
    //schema validation with zod
    console.log(validatedFields)
    if (!validatedFields.success) {
      console.log(
        validatedFields.error.flatten().fieldErrors.file?.[0] ?? "Invalid File"
      );
      return;
    }

    //upload file
    //parse pdf using langchain
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
