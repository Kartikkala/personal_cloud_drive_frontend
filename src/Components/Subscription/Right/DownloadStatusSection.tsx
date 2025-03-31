import DownloadStatus from "./DownloadManager";

const DownloadStatusSection = ()=>{
    return (
        <div className="flex flex-col h-full w-full gap-2">
            <h1 className="text-lg text-text-primary font-sans font-bold text-center">
                Downloads
            </h1>
            <div className="flex w-full h-full rounded-xl overflow-y-auto  border-primary-border-color border">
                <DownloadStatus/>
            </div>
        </div>
    )
}

export default DownloadStatusSection;