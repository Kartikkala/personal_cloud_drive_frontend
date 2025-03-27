import { BiSearchAlt2 } from "react-icons/bi";
import { IoVideocam } from "react-icons/io5";
import { AiFillAudio } from "react-icons/ai";
import { FaImages } from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";
import { MdMore } from "react-icons/md";
import { Routes, Route, useLocation } from "react-router-dom"
import ShowFiles from "./ShowFiles";
import { useEffect, useState } from "react";
import Categoriescard from "./Categoriescard";
import File from './FileList'
import History from '../Top/History'
import { useAppDispatch, useAppSelector } from "@/app/Hook";
import { fetch_files_fun } from "../../../slice/Fetchfiles";
import { changeState } from "@/slice/Videofiles";

interface mydata {
    size: number,
    birthtime: string,
    directory: boolean,
    file: boolean,
    symlink: boolean,
    name: string
}
interface myda {
    size: number,
    birthtime: string,
    directory: boolean,
    file: boolean,
    symlink: boolean,
    name: string
    category: string
}

interface size {
    videofilesize: number,
    audiofilesize: number,
    documentfilesize: number,
    imagefilesize: number,
    morefilesize: number,
}
type UpdateStateFunction = (newState: boolean) => void;

interface getting_props {
    downloadhistory: boolean,
    changestate: UpdateStateFunction
}


const Contentbar = (props: getting_props) => {
    const { downloadhistory, changestate } = props;

    const dispatch = useAppDispatch();

    const location = useLocation();
    
    // inital data object for sizedata state variable:
    const sizedata: size = {
        videofilesize: 0,
        audiofilesize: 0,
        documentfilesize: 0,
        imagefilesize: 0,
        morefilesize: 0,
    }

    // const dispatch = useAppDispatch();
    const files = useAppSelector((state) => state.fetch_files.files)
    useEffect(() => {
        dispatch(fetch_files_fun());
    }, [])

    // const [files, setfiles] = useState<mydata[]>(data);
    const [videofiles, setvideofiles] = useState<mydata[]>([]);
    const [audiofiles, setaudiofiles] = useState<mydata[]>([]);
    const [imagefiles, setimagefiles] = useState<mydata[]>([]);
    const [documentfiles, setdocumentfiles] = useState<mydata[]>([]);
    const [morefiles, setmorefiles] = useState<mydata[]>([]);
    const [filesize, setfilesize] = useState<size>(sizedata);


    const arra: { tag: string, img: React.ComponentType, size: number, file_no: number }[] = [
        {
            tag: "Videos",
            img: IoVideocam,
            size: filesize.videofilesize,
            file_no: videofiles.length
        },
        {
            tag: "Audios",
            img: AiFillAudio,
            size: filesize.audiofilesize,
            file_no: audiofiles.length
        }, {
            tag: "Images",
            img: FaImages,
            size: filesize.imagefilesize,
            file_no: imagefiles.length
        }, {
            tag: "Documents",
            img: IoDocumentText,
            size: filesize.documentfilesize,
            file_no: documentfiles.length
        }, {
            tag: "More",
            img: MdMore,
            size: filesize.morefilesize,
            file_no: morefiles.length
        }
    ]
    const [elements, setelements] = useState<{ tag: string, img: React.ComponentType, size: number, file_no: number }[]>(arra);
    const [latest_files, setlatest_files] = useState<myda[] | null>(null);



    const [files_addtional, setfiles_additional] = useState<myda[]>([])

    useEffect(() => {
        const videos: mydata[] = []; const audios: mydata[] = []; const images: mydata[] = []; const documents: mydata[] = []; const more: mydata[] = [];
        const sizeobj: size = { ...sizedata };
        const files_copy: myda[] = [];

        // files.forEach((file) => {
        for (let i = 0; i < files.length; i++) {
            const file = Object.assign({}, files[i]);

            file.size = file.size / 1048576;

            if (file.name.endsWith(".mp4")) {
                videos.push(file);
                sizeobj.videofilesize += file.size;
                const file_copy: myda = { ...file, category: "Videos" };
                files_copy.push(file_copy);

            }
            else if (file.name.endsWith(".mp3")) {
                audios.push(file);
                sizeobj.audiofilesize += file.size;
                const file_copy: myda = { ...file, category: "Audios" };
                files_copy.push(file_copy);
            }
            else if (file.name.endsWith("jpg") || file.name.endsWith(".png")) {
                images.push(file);
                sizeobj.imagefilesize += file.size;
                const file_copy: myda = { ...file, category: "Images" };
                files_copy.push(file_copy);
            }
            else if (file.name.endsWith(".pdf") || file.name.endsWith(".docx")) {
                documents.push(file);
                sizeobj.documentfilesize += file.size;
                const file_copy: myda = { ...file, category: "Documents" };
                files_copy.push(file_copy);
            }
            else {
                more.push(file);
                sizeobj.morefilesize += file.size;
                const file_copy: myda = { ...file, category: "More" };
                files_copy.push(file_copy);
            }
            // })
        }

        files_copy.sort((a, b) => new Date(b.birthtime).getTime() - new Date(a.birthtime).getTime());
        setfiles_additional(files_copy);
        const latest_arr = files_copy;
        setlatest_files(latest_arr);

        setvideofiles(videos);
        dispatch(changeState(videos));
        setaudiofiles(audios);
        setimagefiles(images);
        setdocumentfiles(documents);
        setmorefiles(more);
        setfilesize(sizeobj);

    }, [files])

    useEffect(() => {
        setelements(arra);
    }, [filesize]);

    const [searchbar, setsearchbar] = useState<string>("");
    const [match_array, setmatch_array] = useState<myda[]>([]);
    const search_onchange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setsearchbar(event.target.value);
    }
    useEffect(() => {
        let regex = new RegExp(searchbar, 'i');
        const match_method = files_addtional.filter((value) => {
            return regex.test(value.name);
        })
        setmatch_array(match_method);

    }, [searchbar])
    useEffect(() => { }, [downloadhistory])


    return (
        <div className="h-full w-full flex justify-center border-primary-border-color border rounded-xl overflow-hidden">
            {!downloadhistory && <div className="w-[94%] h-full">

                {/* Search bar */}
                <div className={`flex my-6 rounded-lg ${location.pathname == "/home" ? "2xl:mb-[4%]" : "2xl:mb-[1%]]"} `}>

                    <div className="relative gap-2 w-3/4 justify-around bg-primary-background border border-primary-border-color rounded-3xl flex p-3">
                        <label htmlFor="search" className="sm:text-2xl text-xl xl:bottom-[0.85rem] text-text-secondary bottom-3 border-black">
                            <BiSearchAlt2 />
                        </label>
                        <input type="text" onChange={search_onchange} className="text-text-secondary focus:outline-none font-Josefin xl:ml-0 ml-8 w-full md:text-base sm:text-lg bg-primary-background" name="search" id="search" placeholder="Search by Name" value={searchbar} />
                    </div>
                </div>

                <h1 className="xl:text-3xl text-2xl font-bold my-7 text-text-heading">All Files</h1>
                
                {/* Div to keep File organizers and files inside */}
                <div className="flex flex-col h-full">

                {/* A parent div here */}
                {!searchbar && <div className={`border-primary-border-color h-full bg-primary-background rounded-3xl relative`}>
                    <Routes>
                        <Route path="/category/Videos" element={<ShowFiles data={videofiles} />}></Route>
                        <Route path="/category/Audios" element={<ShowFiles data={audiofiles} />}></Route>
                        <Route path="/category/Images" element={<ShowFiles data={imagefiles} />}></Route>
                        <Route path="/category/Documents" element={<ShowFiles data={documentfiles} />}></Route>
                        <Route path="/category/More" element={<ShowFiles data={morefiles} />}></Route>
                    </Routes>
                    {/* A parent div here */}
                    {location.pathname == "/" && <div className="h-full">
                        <div className="flex gap-3 justify-items-center overflow-auto">
                            {elements.map((value) => {
                                return <Categoriescard key={String(value.tag)} item={value} />;
                            })}
                        </div>

                        <div className="flex justify-between lg:px-4 px-2 pb-2 font-semibold md:text-base text-sm mt-2">
                            <div className="w-[45%] text-text-heading">Name</div>
                            <div className="w-[26%] text-text-heading">Size</div>
                            <div className="w-[26%] text-text-heading">Date</div>
                            <div className="w-[3%] text-text-heading"></div>
                        </div>
                        {/* Files viewer*/}
                        <div className="flex flex-col gap-2 2xl:h-[71%] h-[64%] overflow-y-auto custom-scrollbar">
                            {latest_files && latest_files.map((value, index) => {
                                return <File key={index} fileobj={value} file_type={value.category} />
                            })}
                        </div>
                    </div>}

                </div>}
                {

                    searchbar && <div className="overflow-y-auto 2xl:h-[86%] h-[87%] bg-primary-background mt-5">
                        <div className="flex justify-between lg:px-4 px-2 pb-2 border-b-[1.5px] border-black font-semibold md:text-base text-sm">
                            <div className="w-[45%]">Name</div>
                            <div className="w-[26%]">Size</div>
                            <div className="w-[26%]">Date</div>
                            <div className="w-[3%]"></div>
                        </div>
                        {match_array && match_array.map((value, index) => {
                            return <File key={index} fileobj={value} file_type={value.category} />
                        })}
                    </div>
                }

                </div>
            </div>}
            {downloadhistory && <div className="w-[94%] h-full overflow-y-hidden">
                <History downloadhistory={downloadhistory} changestate={changestate} />
            </div>}
        </div>
    )
}

export default Contentbar;
