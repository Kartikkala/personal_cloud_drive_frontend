import { HiLink } from "react-icons/hi";
import { useState } from "react";
import { useAppDispatch } from "@/app/Hook";
import { upload_link } from "../../../slice/Link_upload"
import { fetch_files_fun } from "../../../slice/Fetchfiles";
import { UploadCloud } from "lucide-react";
import DownloadStatusSection from "./DownloadStatusSection";

const Rightbar = () => {

    const dispatch = useAppDispatch();

    const [file_state, setfile_state] = useState<File | string>("");
    const [uri_state, seturi_state] = useState<string>("");
    const [linkvalidation, setlinkvalidation] = useState<string | null>(null);
    const [disable, setdisable] = useState<boolean>(true);

    const normalDownloadPattern = /https?:\/\/[^\s\/$.?#].[^\s]*\/[^\s]*(download|\.zip|\.exe|\.pdf|\.mp3|\.mp4|\.jpg|\.jpeg|\.png|\.gif|\.tar\.gz|\.rar|\.7z|\.iso|\.docx?|\.xlsx?|\.pptx?|\.txt|\.apk|\.dmg|\.bin|\.msi|\.deb|\.rpm|\.pkg|\.avi|\.mov|\.wmv|\.flv|\.mkv|\.webm|\.ogg|\.wav|\.aac)(\?[^\s]*)?(?!.*\.torrent)/gi;


    const torrentAndMagnetPattern = /(https?:\/\/[^\s\/$.?#].[^\s]*\/[^\s]*\.torrent(\?[^\s]*)?|magnet:\?xt=urn:btih:[a-zA-Z0-9]{40,}(\&[^\s]*)?)/gi;

    const onchange_fileinput = (event: React.ChangeEvent<HTMLInputElement>) => {

        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setfile_state(selectedFile);
            setdisable(false);
        }
        else {
            setfile_state("");
            setdisable(true);
        }
    }

    const onchange_uriinput = (e: React.ChangeEvent<HTMLInputElement>) => {
        // const dispatch = useAppDispatch();

        seturi_state(e.target.value);
        if (!normalDownloadPattern.test(e.target.value) && !torrentAndMagnetPattern.test(e.target.value) && e.target.value.length != 0) {
            setlinkvalidation("Invalid Link format");
            setdisable(true);
        }
        else if (e.target.value.length == 0) {
            setlinkvalidation(null);
        }
        else {
            setlinkvalidation(null);
            setdisable(false);
        }
    }

    const inputFileUpload = async () => {
        if (!file_state) {
            console.error('No file selected');
            return;
        }

        if (typeof file_state === 'string') {
            console.error('File state is a string, not a File');
            return;
        }

        const formData = new FormData();
        formData.append('file', file_state);

        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/fs/uploadFile', {
            method: 'POST',
            headers: {
                "Authorization": token as string,
                "filesize": file_state.size.toString(), // Convert size to string
            },
            body: formData,
        });

        const json = await response.json();
        if (!json.success) {
            console.log("Error in uploading the file to the cloud");
        }
        else {
            dispatch(fetch_files_fun());
            console.log("file added successfully");
        }
    };

    const formsumbit_handler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (uri_state.length != 0) {
            if (normalDownloadPattern.test(uri_state)) {
                dispatch(upload_link(uri_state));
                // socket.on('statusUpdate', (value: ArrayOfObjects) => {
                //     const val = value[0];
                //     dispatch(changestate(val));
                //     if (value[0].totalLength == value[0].uploadLength) {
                //         dispatch(fetch_files_fun());
                //     }
                // })
            }

        } else {
            inputFileUpload();
            dispatch(fetch_files_fun());
        }
    };

    return (
        <div className="w-11/12 h-[96%] flex flex-col justify-between bg-primary-background">

            <div className="bg-primary-background flex flex-col h-full gap-10">
                    <div className="text-text-heading text-xl font-bold text-center pt-2">Add new files</div>

                        <form onSubmit={formsumbit_handler} className="flex flex-col items-center">
                            {/* Upload file button */}
                        <label className="flex flex-col items-center cursor-pointer bg-secondary-background w-full rounded-xl p-4">
                            <div className="flex flex-col rounded-xl">
                            <UploadCloud size={64} color="white"/>
                                <div className="mx-auto text-text-primary">
                                Upload
                                </div>
                            </div>
                            <input 
                                type="file" 
                                disabled={uri_state.length !== 0} 
                                onChange={onchange_fileinput} 
                                className="hidden" />
                            </label>
                            {/* End of upload file button */}
                            <div className="flex 3xl:my-5 my-3 items-center justify-center w-full">
                                <div className=" border-t-[1px] xl:w-5/12 w-4/12 h-0"></div>
                                <span className="text-2xl font-Josefin px-2 text-text-primary">or</span>
                                <div className="border-t-[1px] xl:w-5/12 w-4/12 h-0"></div>
                            </div>

                            <div className="relative w-full flex justify-center">
                                <label htmlFor="link" className="xl:text-2xl text-xl absolute bottom-4 xl:left-8 left-3"><HiLink color="#9EA7B0"/></label>
                                <input type="text" disabled={file_state != ""} onChange={onchange_uriinput} value={uri_state} className="border bg-primary-background focus:border-primary-border-color focus:bg-primary-background hover:bg-primary-background outline-none border-primary-border-color p-3 xl:pl-14 pl-9 xl:w-11/12 w-[96%] font-Josefin rounded-xl text-text-secondary xl:text-base text-sm" placeholder="Add upload link here" name="link" id="link" />
                            </div>

                            <div className="text-red-500 h-5 font-Josefin md:text-sm sm:text-xs text-sm mt-2">{linkvalidation}</div>

                            <button disabled={disable} className="bg-accent-primary hover:bg-accent-secondary text-text-primary font-Josefin font-extrabold  py-3 px-4 w-10/12 duration-200 rounded-xl">
                                Add File
                            </button>
                        </form>

                        <DownloadStatusSection/>
                        

            </div>
        </div>
    )
}

export default Rightbar;
