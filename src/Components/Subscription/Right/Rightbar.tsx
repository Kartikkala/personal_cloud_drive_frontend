import React, { useEffect, useRef, useState } from 'react';
import { HiLink } from 'react-icons/hi';
import { useAppDispatch, useAppSelector } from '@/app/Hook';
import { upload_link } from '../../../slice/Link_upload'; 
import { updateDownloads } from '../../../slice/ServerDownloads'; 
import { fetch_files_fun } from '../../../slice/Fetchfiles'; 
import DownloadStatusSection from './DownloadStatusSection'; 
import FileUploadSection from './FileUploadSection'; 
import socket from '../Socket'; 
import axios from 'axios';
import { fetchStorageUsage } from '@/slice/FetchStorageUsage';

const Rightbar = () => {
    const dispatch = useAppDispatch();

    const [file_state, setFileState] = useState<File | null>(null); 
    const [fileUploadMessage, setFileUploadMessage] = useState<string | null>(null);
    const [isFileUploading, setIsFileUploading] = useState<boolean>(false);

    const controllerRef = useRef<AbortController>()
   
    const [uri_state, setUriState] = useState<string>('');
    const [linkErrorStatus, setLinkErrorStatus] = useState(false);
    const [linkDownloadMessage, setLinkDownloadMessage] = useState<string | null>(null); 
    const [progress, setProgress] = useState(0);

    // Combined disable state for the submit button
    const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);

    const downloads = useAppSelector((state) => state.serverDownloads.downloads) || [];
    const linkResult = useAppSelector((state) => state.link_upload.data);


    useEffect(() => {
        
        if (linkResult) {
            const hasError = linkResult.error || !linkResult.valid || linkResult.sizeLimitExceeded;
            setLinkErrorStatus(hasError);
            let message = '';
            if (linkResult.error) message += 'Error downloading file. ';
            if (linkResult.sizeLimitExceeded) message += 'Size limit exceeded. ';
            if (!linkResult.valid) message += 'Invalid link! ';
            setLinkDownloadMessage(message.trim() || (hasError ? "An issue occurred with the link." : null)); 
        } 
        else {
            const latestDownload = Array.isArray(downloads) ? downloads[downloads.length - 1] : null;
            if (!latestDownload || latestDownload.status !== 'error') {
                setLinkDownloadMessage(null);
                setLinkErrorStatus(false);
            }
        }
    }, [linkResult, downloads]);

    // Effect to handle messages based on socket download status updates (for link downloads)
    useEffect(() => {
        const latestDownload = Array.isArray(downloads) ? downloads[downloads.length - 1] : null;
        if (latestDownload && latestDownload.status === 'error') { // Assuming type differentiation if possible
            setLinkErrorStatus(true);
            setLinkDownloadMessage(latestDownload.errorMessage || "An error occurred during download.");
        }
    }, [downloads]);

    useEffect(() => {
        const handleStatusUpdate = (data: any) => {
            dispatch(updateDownloads(data));
        };
        socket.on('statusUpdate', handleStatusUpdate);
        return () => {
            socket.off('statusUpdate', handleStatusUpdate);
        };
    }, [dispatch]);

    useEffect(() => {
        setIsSubmitDisabled(!file_state && uri_state.trim().length === 0);
    }, [file_state, uri_state]);

    // --- Handler for File Upload Section ---
    const handleFileSelected = (selectedFile: File | null) => {
        setFileState(selectedFile);
        if (selectedFile) {
            setUriState(''); 
            setLinkDownloadMessage(null);
            setLinkErrorStatus(false);
            setFileUploadMessage(null);
        }
    };

    const deselectFile = () => {
        setFileState(null);
    }

    // --- Handler for Link Input ---
    const handleUriInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUriState(value);
        setLinkDownloadMessage(null); 
        setLinkErrorStatus(false);
        if (value.trim().length > 0) {
            if (file_state) {
                 setFileState(null);
                 setFileUploadMessage(null);
            }
        }
    };

    // --- Direct File Upload Logic ---
    const inputFileUpload = async () => {
        if(isFileUploading)
        {
            return
        }
        if (!file_state) {
            console.error('No file selected for upload.');
            setFileUploadMessage('No file selected.');
            return;
        }

        setFileUploadMessage(`Uploading file ${progress}%`);
        setLinkDownloadMessage(null);
        setIsFileUploading(true);
        setIsSubmitDisabled(true);
        setProgress(0);

        const formData = new FormData();
        formData.append('file', file_state);
        const token = localStorage.getItem('token');

        try {

            controllerRef.current = new AbortController()
            const getPermission = await axios.get('http://localhost:5000/api/fs/uploadFile',
                {
                    headers: {
                        Authorization: token || '',
                        filesize: file_state.size,
                    }
                },
            );

            const limitReached = await getPermission.data.limitReached
            if(limitReached)
            {
                setFileUploadMessage("Not enough space!")
                return  
            }
            const response = await axios.post('http://localhost:5000/api/fs/uploadFile', formData,
                {
                    headers: {
                        Authorization: token || '',
                        filesize: file_state.size,
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / file_state.size);
                        setProgress(percentCompleted);
                        setFileUploadMessage(`Uploading file ${percentCompleted}%`);
                    },
                    signal : controllerRef.current.signal
                },
            );
            
            const json = await response.data;

            if (!(response.status === 200) || !json.success) {
                console.error('Error uploading file:', json.message || 'Unknown server error');
                setFileUploadMessage(`Upload failed: ${json.message || 'Server error'}`);
            } else {
                setFileUploadMessage('File uploaded successfully!');
                dispatch(fetch_files_fun("/"));
                setFileState(null); // Clear file state after successful upload
                setTimeout(() => setFileUploadMessage(null), 3000); // Clear message after delay
            }
        } catch (error: any) {
            if(!(error.code === 'ERR_CANCELED'))
            {
                console.error('Network or other error during file upload:', error);
                setFileUploadMessage('Upload failed: Network error.');
            }
        } finally {
            setIsFileUploading(false);
            setProgress(0);
            // Re-enable submit button logic is handled by the useEffect watching file_state/uri_state
        }
    };

    // --- Upload cancel logic---

    const cancelUpload = ()=>{
        if(controllerRef.current)
        {
            controllerRef.current.abort()
            setIsFileUploading(false);
            setProgress(0);
            setFileUploadMessage('Upload cancelled.');
        }
    }

    // --- Form Submission Handler ---
    const formSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isFileUploading) {
            // Cancel the ongoing upload - you'll need to implement the cancellation logic
            // For example, you could use an AbortController to cancel the request
            setIsFileUploading(false);
            setFileUploadMessage('Upload cancelled');
            return;
        }

        if (uri_state.trim().length > 0) {
            // Handle link submission
            setLinkDownloadMessage('Initiating download from link...');
            setLinkErrorStatus(false);
            setFileUploadMessage(null); // Clear file messages
            dispatch(upload_link(uri_state));
        } else if (file_state) {
            // Handle file submission
            await inputFileUpload();
            dispatch(fetchStorageUsage())
        } else {
            console.log("Neither link nor file provided."); // Should ideally not happen if button is disabled correctly
        }
    };

    // Determine which message to display
    const displayMessage = fileUploadMessage || linkDownloadMessage;
    const displayErrorStatus = fileUploadMessage?.includes('failed') || fileUploadMessage?.includes('Error') || linkErrorStatus;

    return (
        <div className="w-11/12 h-[96%] flex flex-col justify-between bg-primary-background">
            <div className="bg-primary-background flex flex-col h-full gap-6 xl:gap-8">
                <div className="text-text-heading text-xl font-bold text-center pt-2">Add new files</div>

                <form className="flex flex-col items-center gap-4">
                    {/* File Upload Component */}
                    <FileUploadSection
                        deselectFile={deselectFile}
                        onFileChange={handleFileSelected}
                        isDisabled={uri_state.trim().length > 0 || isFileUploading}
                        selectedFileName={file_state?.name || null}
                    />

                    {/* Or Separator */}
                    <div className="flex 3xl:my-3 my-1 items-center justify-center w-full">
                        <div className="border-t-[1px] xl:w-5/12 w-4/12 h-0 border-primary-border-color"></div>
                        <span className="text-2xl font-Josefin px-2 text-text-primary">or</span>
                        <div className="border-t-[1px] xl:w-5/12 w-4/12 h-0 border-primary-border-color"></div>
                    </div>

                    {/* Link Input Section */}
                    <div className="relative w-full flex justify-center">
                        <label htmlFor="link" className={`xl:text-2xl text-xl absolute bottom-3.5 xl:left-8 left-4 ${file_state ? 'opacity-50' : ''}`}>
                            <HiLink color="#9EA7B0" />
                        </label>
                        <input
                            type="text"
                            disabled={!!file_state || isFileUploading}
                            onChange={handleUriInputChange}
                            value={uri_state}
                            className={`border bg-primary-background focus:border-primary-border-color focus:bg-primary-background hover:bg-primary-background outline-none border-primary-border-color p-3 xl:pl-14 pl-10 xl:w-11/12 w-[96%] font-Josefin rounded-xl text-text-secondary xl:text-base text-sm ${
                                file_state || isFileUploading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            placeholder="Add upload link here"
                            name="link"
                            id="link"
                        />
                    </div>

                    {/* Unified Message Display Area */}
                    <div className={`min-h-[1.25rem] h-auto w-10/12 text-center font-Josefin md:text-sm sm:text-xs text-sm mt-1 ${
                        displayErrorStatus ? 'text-red-500' : 'text-text-primary'
                    }`}>
                        {displayMessage || '\u00A0'}
                    </div>

                    {/* Submit Button with Progress Bar */}
                    <div className="relative w-10/12 mt-1" >
                        {isFileUploading && (
                            <div 
                                className="absolute left-0 bg-red-600 h-full rounded-xl z-0" 
                                style={{ 
                                    width: `${progress}%`,
                                    height : `${progress < 5 ? "95%" : "98%"}`,
                                    top : `${progress < 5 ? "2px" : "1px"}`,
                                    left : `${progress < 5 ? "1px" : "0px"}`,
                                 }}
                            />
                        )}
                        <button
                            onClick={isFileUploading ? cancelUpload : formSubmitHandler}
                            disabled={isSubmitDisabled && !isFileUploading}
                            className={`relative z-10 w-full h-full bg-accent-primary text-text-primary font-Josefin font-extrabold py-3 px-4 duration-200 rounded-xl
                                ${isSubmitDisabled && !isFileUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent-secondary'}
                                ${isFileUploading ? 'bg-red-500 opacity-30 hover:opacity-80 hover:bg-red-500' : ''}`}
                        >
                            {isFileUploading ? 'Cancel' : 'Add File'}
                        </button>
                    </div>
                </form>

                {/* Download Status Section */}
                <DownloadStatusSection />
            </div>
        </div>
    );
};

export default Rightbar;