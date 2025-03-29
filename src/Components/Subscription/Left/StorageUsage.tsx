import { useEffect, useState } from "react";
import { GrStorage } from "react-icons/gr";
import { Progress } from "radix-ui";


const StorageUsage = ()=>{
    const [storageUsage, setStorageUsage] = useState(0)
    const [absoluteUsage, setAbsoluteUsage] = useState(10)
    const totalStorage = 20

    useEffect(()=>{
        setStorageUsage((absoluteUsage / totalStorage) * 100)  
    })
    return (
        <div className="w-full flex flex-col gap-3">
            <div className=" w-full flex text-text-secondary items-center gap-2">
                <GrStorage size={18}/>
                <div>
                    {`Storage (${storageUsage}% used)`}
                </div>
            </div>
            <div className="flex flex-col w-full gap-2">
            <Progress.Root max={100} value={storageUsage} className="relative w-full h-2 bg-primary-background rounded overflow-hidden">
                <Progress.Indicator style={{ width: `${storageUsage}%` }} className="h-full bg-accent-primary duration-1000"/>
            </Progress.Root>
            <div className="flex text-text-secondary">
                {/* Modify this obviously */}
                {`${absoluteUsage} GB used out of ${totalStorage} GB`}
            </div>
            </div>
        </div>
    )
}

export default StorageUsage;