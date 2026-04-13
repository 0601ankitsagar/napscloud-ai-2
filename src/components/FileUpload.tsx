import React, { useState, useRef } from "react";
import { Upload, FileText, X, File as FileIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export function FileUpload({ onFileSelect, isProcessing }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (isValidFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const isValidFile = (file: File) => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    return validTypes.includes(file.type) || file.name.endsWith(".docx");
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "relative group cursor-pointer border-2 border-dashed rounded-2xl p-12 transition-all duration-300 flex flex-col items-center justify-center gap-4",
                isDragging
                  ? "border-blue-500 bg-blue-50/50"
                  : "border-zinc-200 hover:border-blue-400 hover:bg-zinc-50/50"
              )}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.docx,.txt"
              />
              
              <div className={cn(
                "p-4 rounded-full transition-transform duration-300 group-hover:scale-110",
                isDragging ? "bg-blue-100 text-blue-600" : "bg-zinc-100 text-zinc-500 group-hover:text-blue-500"
              )}>
                <Upload className="w-8 h-8" />
              </div>

              <div className="text-center">
                <p className="text-lg font-semibold text-zinc-900">
                  Click or drag to upload
                </p>
                <p className="text-sm text-zinc-500 mt-1">
                  Support for PDF, DOCX, and TXT files
                </p>
              </div>

              <div className="flex gap-2 mt-2">
                <span className="px-2 py-1 bg-zinc-100 text-[10px] font-bold text-zinc-500 rounded uppercase tracking-wider">PDF</span>
                <span className="px-2 py-1 bg-zinc-100 text-[10px] font-bold text-zinc-500 rounded uppercase tracking-wider">DOCX</span>
                <span className="px-2 py-1 bg-zinc-100 text-[10px] font-bold text-zinc-500 rounded uppercase tracking-wider">TXT</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="file-info"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card className="p-6 border-zinc-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <FileIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900 truncate max-w-[200px] md:max-w-md">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {isProcessing ? (
                    <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearFile();
                      }}
                      className="text-zinc-400 hover:text-red-500 hover:bg-red-50"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
