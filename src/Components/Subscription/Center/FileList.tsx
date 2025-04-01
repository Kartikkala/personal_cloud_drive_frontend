import React, { useEffect, useState } from 'react'
import { HiDotsVertical } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { FiDownload } from "react-icons/fi";
import { FaPlay } from "react-icons/fa6";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "@/shadcn/ui/menubar"
import { useAppDispatch } from '@/app/Hook';
import { fetch_files_fun } from '@/slice/Fetchfiles';
import { changestate } from '@/slice/Streamslice';
import { useNavigate } from 'react-router-dom';
import { shortenFilename } from '../Right/utils';
import { Folder } from 'lucide-react';
import { FileText } from 'lucide-react';
import { Music } from 'lucide-react';
import { Video } from 'lucide-react';
import { FileQuestion } from 'lucide-react';
import { Image } from 'lucide-react';
import { mydata } from './Contentbar';
import { addDirectory } from '@/slice/CurrentPath';

interface myprops {
    fileobj: mydata,
    file_type: string
}
type IconComponentType = React.ComponentType<{ className?: string }>;

interface image {
    [key: string]: {icon : React.ComponentType, css : string};
}

const FileList = (props: myprops) => {
    const dispatch = useAppDispatch();
    const [clickLock, setClickLock] = useState(false)

    const obj: image = {
        Videos: {icon : Video, css : "text-purple-400"},
        Audios: {icon : Music, css : "text-red-400"},
        Images: {icon : Image, css : "text-pink-400"},
        Documents: {icon : FileText, css : "text-blue-400"},
        Folders: {icon : Folder, css : "text-yellow-500"},
        More: {icon : FileQuestion, css : "text-green-400"}
    }

    const navigate = useNavigate();

    const { fileobj, file_type } = props;
    const [Selectedicon, setSelectedicon] = useState<{icon : IconComponentType, css : string} | null>(null);
    useEffect(() => {
        const value = () => obj[file_type];
        setSelectedicon(value);
    }, [file_type])

    const handleFolderClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
        if(clickLock)
            return;
        setClickLock(true)
        setTimeout(()=>{
            setClickLock(false)
        }, 300)
        if (fileobj.isDirectory) {
            dispatch(addDirectory(`${fileobj.name}`))
            dispatch(fetch_files_fun(`/${fileobj.name}`));
        }
    };

    const Downloadclick = async () => {

        const token: string | null = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/fs/downloadFileClient', {
            method : "POST",
            headers: {
                "Authorization": token as string,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ targetPath: `/${fileobj.name}` })
        })
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = fileobj.name;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } else {
            console.error('Failed to download file');
        }

    }
    const Deleteclick = async () => {
        const token: string | null = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/fs/delete', {
            method : "POST",
            headers: {
                "Authorization": token as string,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ targetPath: `/${fileobj.name}` })
        })
        const json = await response.json();
        if(Array.isArray(json))
        {
            const deleted = json.pop().deleted
            if(deleted)
            {
                //Do something
            }
        }
        dispatch(fetch_files_fun());
    }

    const playclick = () => {
        if (file_type == "Videos") {
            const filepath = "/"+fileobj.name
            dispatch(changestate(filepath));
            navigate("/Streamvideos");
        }
    }

    return (

        <div className={`min-h-12 hover:bg-secondary-background bg-primary-background
        border-primary-border-color rounded-3xl flex justify-between items-center
        font-Josefin lg:px-4 px-2 xl:text-base sm:text-sm text-xs text-text-primary ${fileobj.isDirectory ? "cursor-pointer": null}`}
        onClick={fileobj.isDirectory ? handleFolderClick : undefined}>
            
            
            <div className="flex w-[45%] items-center">
                {Selectedicon && <Selectedicon.icon className={`sm:text-2xl text-xl xl:pr-2 ${Selectedicon.css}`} />}
                <div className="">{shortenFilename(fileobj.name, 20, 8)}</div>
            </div>

            <div className="w-[26%]">{fileobj.size.toFixed(2)} MB</div>
            <div className="w-[26%] ">{fileobj.birthtime.split('T')[0]}</div>
            <div className="w-[3%] h-full hover:cursor-pointer border-blue-500 flex justify-center ">
                <Menubar className="w-full h-full">
                    <MenubarMenu>
                        <MenubarTrigger className='h-full w-full justify-between focus:bg-secondary-background hover:bg-secondary-background' 
                         onDoubleClick={fileobj.isDirectory? handleFolderClick : undefined}
                         >
                            <HiDotsVertical className=' focus:text-text-primary text-text-primary'/>
                        </MenubarTrigger>
                            <MenubarContent className={`bg-secondary-background`} hidden={fileobj.isDirectory} align='end' alignOffset={-100}>
                                <MenubarItem className='text-text-primary'>
                                    <button onClick={Downloadclick} className='flex items-center'><FiDownload className='text-text-primary mr-2  ' />   Download</button>
                                </MenubarItem>
                                <MenubarItem className='text-text-primary'>
                                    <button onClick={Deleteclick} className='flex items-center'><MdDelete className='text-text-primary mr-2 ' /> Delete</button>
                                </MenubarItem>
                                <MenubarItem className={`text-text-primary ${file_type == "Videos" ? "" : "hidden"}`}>
                                    <button onClick={playclick} className='flex items-center '><FaPlay className='text-text-primary mr-2 ' /> Play</button>
                                </MenubarItem>
                            </MenubarContent>
                    </MenubarMenu>
                </Menubar>

            </div>
        </div>
    )
}

export default FileList;

