"use client";

import React, { useRef, useState } from "react";
import { Camera, FileUp, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "./textarea";
import { Input } from "./input";

interface FileUploadProps {
  label?: string;
  onFileSelect?: (file: File) => void;
  accept?: string;
  mode?: "all" | "camera" | "file";
  className?: string;
}

const FileUpload = ({
  label = "Click to upload Image or PDF",
  onFileSelect,
  accept = "image/*, application/pdf",
  mode = "all",
  className,
}: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelect?.(file);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening file dialog
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className={cn("relative w-full group", className)}>
      <div
        onClick={handleAreaClick}
        className={cn(
          "relative flex flex-col items-center justify-center min-h-[120px] p-4",
          "border-2 border-dashed border-muted-foreground/25 rounded-xl",
          "hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer",
        )}
      >
        {/* Icons logic based on mode */}
        <div className="flex gap-3 mb-2 text-muted-foreground group-hover:text-primary transition-colors">
          {(mode === "all" || mode === "camera") && (
            <Camera size={28} strokeWidth={1.5} />
          )}
          {(mode === "all" || mode === "file") && (
            <FileUp size={28} strokeWidth={1.5} />
          )}
        </div>

        <p className="text-sm font-medium text-center text-muted-foreground">
          {fileName ? (
            <span className="text-primary flex items-center gap-2">
              {fileName}
              <X
                size={14}
                className="hover:text-destructive"
                onClick={clearFile}
              />
            </span>
          ) : (
            label
          )}
        </p>

        {/* This stays hidden but provides accessibility */}
        <Textarea className="sr-only" readOnly tabIndex={-1} />
      </div>

      <Input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        // If mode is camera, hint to mobile devices to open camera directly
        capture={mode === "camera" ? "environment" : undefined}
        className="hidden"
      />
    </div>
  );
};

export default FileUpload;
