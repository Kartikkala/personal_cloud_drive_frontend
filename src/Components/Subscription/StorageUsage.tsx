import { GrStorage } from "react-icons/gr";

const StorageUsage = ()=>{
    return (
        <div>
            {/* progress bar */}
            <div className="bg-cyan-700 rounded-lg text-lg] ">

                <div className="3xl:p-2 xl:p-1 p-2 flex flex-col items-center space-y-1">
                    <div className="flex justify-center items-center text-black rounded-lg 3xl:p-2 p-1 w-full">
                        <GrStorage className="font-bold mr-2 rounded text-text-primary" />
                        <div className="text-center font-bold xl:text-2xl text-xl">Your Storage</div>
                    </div>

                    <div className="w-28 h-28 relative border-[2px] border-black rounded-full">
                        {/* <IoAdd className="absolute -left-[2.85rem] -top-[2.80rem] z-30 h-48 w-48 text-white" /> */}
                        <div className="absolute z-40 text-xl left-[1.85rem] top-9 font-bold">75%</div>
                        <div className="w-[88%] h-[88%] bg-blue-500 rounded-full absolute z-10 left-[0.35rem] top-[0.37rem] box-border border-[2px] border-black"></div>
                        <progress className="rounded-full custom-progress bg-gray-200 w-full h-full overflow-hidden  box-border" value="75" max="100">
                        </progress>
                    </div>

                    <p className="pt-1 ml-2 font-medium xl:text-lg lg:text-base text-sm"><span className="text-white">75gb</span> is used out of <span className="text-white">100gb</span></p>
                </div>
            </div>
        </div>
    )
}

export default StorageUsage;