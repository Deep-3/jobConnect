import React, { useState, useEffect } from 'react';
import { useDropzone } from "react-dropzone";
import { toast } from 'react-hot-toast';
import { FaTimes } from 'react-icons/fa';

const Upload = ({ register, errors, name,setValue }) => {
  useEffect(() => {
    register(name, { required: "CompanyLogo is required" });

  }, [register, name]);

  const [previewSource, setPreviewSource] = useState(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      previewFile(file);
      setValue(name,file);
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setPreviewSource(null);
    setValue(name, null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png']
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDrop,
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      if (error.code === 'file-too-large') {
        toast.error('File size should be less than 5MB');
      } else if (error.code === 'file-invalid-type') {
        toast.error('Please upload an image file');
      } else {
        toast.error('Invalid file. Please try again.');
      }
    }
  });

  const previewFile = (file) => {
    const fileUrl = URL.createObjectURL(file);
    setPreviewSource(fileUrl);
  };

  return (
    <div className="flex flex-col items-center">
      <div
  {...getRootProps()}
  className={`${
    isDragActive ? "bg-[#E6F4F1] border-[#0B877D]" : "bg-white border-gray-300"
  } flex min-h-[250px] w-full max-w-md cursor-pointer items-center justify-center rounded-md border-2 border-dotted transition-colors duration-300 relative hover:border-[#0B877D] hover:bg-[#F0FAF9]`}
>
        <input {...getInputProps()}/>

        {previewSource ? (
          <div className="relative">
            <img src={previewSource} alt="Preview" className="max-h-48 rounded-md" />
            <button
              type="button"
              onClick={handleRemoveFile}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-red-500 hover:text-white transition-colors"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <p className="text-gray-500">Drag & drop an image here, or click to select one</p>
        )}
      </div>

      {errors[name] && (
        <span className="mt-2 text-xs text-red-500">
          {errors[name].message}
        </span>
      )}
    </div>
  );
};

export default Upload;