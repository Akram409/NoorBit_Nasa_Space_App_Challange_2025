import { useState, useRef } from "react";

export function useFileInput({
    accept,
    maxSize
}) {
    const [fileName, setFileName] = useState("");
    const [error, setError] = useState("");
    const fileInputRef = useRef(null);
    const [fileSize, setFileSize] = useState(0);

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        validateAndSetFile(file);
    };

    const validateAndSetFile = (file) => {
        setError("");

        if (file) {
            if (maxSize && file.size > maxSize * 1024 * 1024) {
                setError(`File size must be less than ${maxSize}MB`);
                return;
            }

            if (
                accept &&
                !file.type.match(accept.replace("/*", "/"))
            ) {
                setError(`File type must be ${accept}`);
                return;
            }

            setFileSize(file.size);
            setFileName(file.name);
        }
    };

    const clearFile = () => {
        setFileName("");
        setError("");
        setFileSize(0);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return {
        fileName,
        error,
        fileInputRef,
        handleFileSelect,
        validateAndSetFile,
        clearFile,
        fileSize,
    };
}