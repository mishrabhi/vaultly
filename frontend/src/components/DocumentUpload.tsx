import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { FileUp, Loader2 } from "lucide-react";

import { uploadDocument } from "../services/api";
import type { Document } from "../types/api";

interface DocumentUploadProps {
  onUploaded: (document: Document) => void;
}

function DocumentUpload({
  onUploaded,
}: DocumentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const document = await uploadDocument(file);

      onUploaded(document);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to upload document.",
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function openFilePicker() {
    inputRef.current?.click();
  }

  return (
    <div className="upload-container">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileChange}
        hidden
      />

      <button
        type="button"
        className="upload-button"
        onClick={openFilePicker}
        disabled={uploading}
      >
        {uploading ? (
          <>
            <Loader2
              size={16}
              className="spin"
            />
            Uploading...
          </>
        ) : (
          <>
            <FileUp size={16} />
            Upload PDF
          </>
        )}
      </button>

      {error && (
        <p className="upload-error">
          {error}
        </p>
      )}
    </div>
  );
}

export default DocumentUpload;