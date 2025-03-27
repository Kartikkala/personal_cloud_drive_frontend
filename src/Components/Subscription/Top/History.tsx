
import { IoArrowBackCircleSharp } from "react-icons/io5";
type UpdateStateFunction = (newState: boolean) => void;
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "@/shadcn/ui/menubar"
import { HiDotsVertical } from "react-icons/hi";
import { useAppDispatch, useAppSelector } from '@/app/Hook';
import { useEffect, useState } from "react";
import { guiddelete } from "@/slice/Link_upload";
import { reversestate } from "@/slice/StatusUpdate";


interface history_props {
    changestate: UpdateStateFunction,
    downloadhistory: boolean
}
const History = (props: history_props) => {
    const { changestate, downloadhistory } = props;

    const back_handler = () => {
        changestate(false);
    }
    // file,uploadSpeed,totalLength,uploadLength

    const dispatch = useAppDispatch();
    const state_update = useAppSelector((state) => state.status_update);
    const guid = useAppSelector((state) => { state.link_upload.data?.guid })
    const [progress_percent, setprogress_percent] = useState<number>(0);
    const [pauseorcontinue, setpauseorcontinue] = useState<string>("Pause");
    const [filestatus, setfile_status] = useState<string>("Uploading");

    useEffect(() => {
        if (state_update.length != 0) {
            const percent = (Number(state_update[0].uploadLength) / Number(state_update[0].totalLength)) * 100;
            const round = Math.round(percent);
            setprogress_percent(round);
        }
    }, [state_update])

    const pauseclick = async () => {
        if (pauseorcontinue == "Pause") {
            const response = await fetch(`http://localhost:5000/api/aria/cancelDownload/${guid}`);
            const json = await response.json();
            setpauseorcontinue("Resume");
            setfile_status("Paused");
        }
        else {
            const response = await fetch(`http://localhost:5000/api/aria/resumeDownload/${guid}`);
            const json = await response.json();
            setpauseorcontinue("Pause");
            setfile_status("Uploading");
        }
    }
    const cancelclick = async () => {
        const response = await fetch(`http://localhost:5000/api/aria/cancelDownload/${guid}`);
        const json = await response.json();
        dispatch(guiddelete());
        dispatch(reversestate());
    }

    return (
        <div className='mt-10'>
            <div className="flex h-14 bg-white border-b-2 border-black rounded-xl items-center p-4">
                <IoArrowBackCircleSharp onClick={back_handler} className='xl:text-4xl text-3xl hover:cursor-pointer mr-10' />
                <div className="text-xl font-bold">Uploading Files :</div>
            </div>
            {state_update.length == 0 && <div className="mt-5">
                No file,uploading currenty
            </div>}

            {state_update.length != 0 && state_update[0].totalLength != state_update[0].uploadLength && <div className='h-16 hover:bg-gray-300 border-[1.5px] border-gray-500 rounded  font-Josefin lg:px-4 px-2 xl:text-base sm:text-sm text-xs mt-6 flex justify-between'>
                <div className="flex flex-col items-center w-11/12 space-y-2">
                    <h3>{state_update[0].file}</h3>
                    <progress id="file" value={progress_percent} max="100" className='h-1 w-11/12 rounded-none'> {progress_percent} </progress>
                    <div className="text-xs">{`${state_update[0].uploadSpeed} B/s - ${progress_percent}% of ${(Number(state_update[0].totalLength) / 1048576).toFixed(2)} MB, ${filestatus}`}</div>
                </div>

                <Menubar className="w-1/12 h-full">
                    <MenubarMenu >
                        <MenubarTrigger className='h-full w-full flex justify-center'>
                            <HiDotsVertical />
                        </MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem>
                                <button onClick={pauseclick} className='text-black mr-2' > ${pauseorcontinue}</button>
                            </MenubarItem>
                            <MenubarItem>
                                <button onClick={cancelclick} className='text-black mr-2' > Cancel</button>
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
            </div>}
        </div>
    )
}

export default History

