import { useEffect, useState } from "react";
import { GrStorage } from "react-icons/gr";
import { Progress } from "radix-ui";
import { formatBytes } from "../Right/utils";
import { useAppDispatch, useAppSelector } from "@/app/Hook";
import { fetchStorageUsage } from "@/slice/FetchStorageUsage";


const StorageUsage = ()=>{
    const [storageUsagePercent, setstorageUsagePercent] = useState("")
    const [totalStorage, setTotalStorage] = useState(0)
    const [usedStorage, setUsedStorage] = useState(0)
    const dispatch = useAppDispatch()
    const json = useAppSelector((state)=> state.storageUsage)

    useEffect(()=>{
        dispatch(fetchStorageUsage())
    }, [])
    
    useEffect(()=>{
        if (json && typeof json.usedSpace === 'number' && typeof json.totalSpace === 'number') {
            const usedSpace = json.usedSpace
            const totalSpace = json.totalSpace
            const percent = totalSpace > 0 ? ((usedSpace/totalSpace) * 100).toFixed(2) : "0"
            setstorageUsagePercent(percent)
            setTotalStorage(totalSpace)
            setUsedStorage(usedSpace)
        }
    }, [json])
    
    return (
        <div className="w-full flex flex-col gap-3">
            <div className=" w-full flex text-text-secondary items-center gap-2">
                <GrStorage size={18}/>
                <div>
                    {`Storage (${storageUsagePercent}% used)`}
                </div>
            </div>
            <div className="flex flex-col w-full gap-2">
            <Progress.Root max={100} value={Number(storageUsagePercent)} className="relative w-full h-2 bg-primary-background rounded overflow-hidden">
                <Progress.Indicator style={{ width: `${storageUsagePercent}%` }} className="h-full bg-accent-primary duration-1000"/>
            </Progress.Root>
            <div className="flex text-text-secondary">
                {/* Modify this obviously */}
                {`${formatBytes(usedStorage)} used out of ${formatBytes(totalStorage)}`}
            </div>
            </div>
        </div>
    )
}

export default StorageUsage;