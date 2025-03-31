import React, { useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import { MdOutlineCancel } from "react-icons/md";
import { shortenFilename } from './utils';

// Define props for the component
interface FileUploadSectionProps {
    onFileChange: (file: File | null) => void;
    deselectFile: ()=>void;
    isDisabled: boolean;
    selectedFileName: string | null;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
    onFileChange,
    deselectFile,
    isDisabled,
    selectedFileName
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] || null;
        onFileChange(selectedFile);

        if (event.target) {
            event.target.value = '';
        }
    };

    return (
        <div className="w-full flex flex-col items-center">
            {/* Label acts as the visible upload button */}
            <label
                className={`flex flex-col items-center bg-secondary-background w-full rounded-xl p-4 ${
                    isDisabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'cursor-pointer hover:bg-opacity-80' // Add hover effect if enabled
                }`}
            >
                <div className="flex flex-col rounded-xl">
                    <UploadCloud size={64} color="white" />
                    <div className="mx-auto text-text-primary mt-1">Upload</div>
                </div>
                {/* Hidden actual file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    disabled={isDisabled}
                    onChange={handleFileChange}
                    className="hidden"
                    aria-hidden="true" // Hide from accessibility tree as label handles interaction
                />
            </label>
             {/* Display selected filename below the button */}
             {selectedFileName && !isDisabled && (
                <div className="text-text-secondary text-sm mt-1 text-center px-2 flex items-center gap-2" title={selectedFileName}>
                    <div>
                        Selected: {shortenFilename(selectedFileName, 10, 6)}
                    </div>
                    <button onClick={deselectFile}>
                        <MdOutlineCancel size={24} className='text-red-500 hover:text-opacity-60 duration-200'/>
                    </button>
                </div>
            )}
        </div>
    );
};

export default FileUploadSection;