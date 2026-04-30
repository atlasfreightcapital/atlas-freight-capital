"use client";

import { useState } from "react";
import { Upload } from "lucide-react";

interface UploadDropzoneProps {
  label: string;
  helperText?: string;
  name: string;
  required?: boolean;
}

export function UploadDropzone({ label, helperText, name, required }: UploadDropzoneProps) {
  const [fileName, setFileName] = useState<string>("");

  return (
    <label className="block rounded-lg border border-dashed border-[#b9c6c2] bg-[#fbfcfa] p-4 text-sm text-[#40515a]">
      <span className="mb-2 block font-medium text-[#162026]">{label}</span>
      <span className="mb-3 flex items-center gap-2 text-[#62737a]">
        <Upload className="h-4 w-4" />
        Drag and drop or tap to upload
      </span>
      <input
        type="file"
        name={name}
        required={required}
        className="hidden"
        onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
      />
      <span className="text-xs text-[#62737a]">{fileName || helperText || "PDF, JPG, PNG accepted"}</span>
    </label>
  );
}
