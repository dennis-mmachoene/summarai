import React from "react";
import { Button } from "../ui/button";

interface UploadFormInputProps {
    
}
const UploadFormInput = ({
    onSubmit
}) => {
  return (
    <form className="flex flex-col gap-6">
      <input type="file" />
      <Button>Upload your PDF</Button>
    </form>
  );
};

export default UploadFormInput;
