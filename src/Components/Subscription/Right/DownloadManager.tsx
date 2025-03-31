import * as Menubar from "@radix-ui/react-menubar";
import { Progress } from "radix-ui";
import { MoreVertical } from "lucide-react";
import { useAppSelector } from "@/app/Hook";
import { formatBytes } from "./utils";

export default function DownloadManager() {

  const downloads = useAppSelector((state)=>state.serverDownloads.downloads) || []

  const cancelDownload = async (gid)=>{
    const token: string | null = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/aria/cancelDownload/${gid}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization" : token as string
        }
    })
    const json = await response.json();
    return json;
  }

  const pauseDownload = async (gid)=>{
    const token: string | null = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/aria/pauseDownload/${gid}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization" : token as string
        }
    })
    const json = await response.json();
    return json;
  }
  const resumeDownload = async (gid)=>{
    const token: string | null = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/aria/resumeDownload/${gid}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization" : token as string
        }
    })
    const json = await response.json();
    return json;
  }
  

  return (
    <div className="space-y-2 w-full p-2">
      {downloads.map((download) => {
        if(!download.file)
        {
          return;
        }
        const completedLength = Number(download.completedLength)
        const totalLength = Number(download.totalLength)

        return (
        <Menubar.Root key={download.gid}>
          <Menubar.Menu>
            <Menubar.Trigger asChild>
              {/* Entire Download panel here */}
              <div className="flex items-center justify-between w-full p-2 rounded-xl border border-primary-border-color hover:bg-secondary-background text-text-primary bg-primary-background cursor-pointer">
                {/* Downlad name and status */}

                <div className="flex flex-col w-full">
                  <p className="text-sm">{download.file}</p>
                  <div className="flex items-center justify-between 2xl:w-[90%] w-full">
                    <p className="text-xs text-text-secondary">{download.status}</p>
                    <div className="flex items-center gap-2 2xl:w-[80%]">
                      {/* All this progress inside 3 dot menu in smaller devices*/}
                      <p className="text-xs text-text-primary whitespace-nowrap">{`${formatBytes(completedLength)} / ${formatBytes(totalLength)}`}</p>
                      <Progress.Root max={100} value={totalLength !== 0 ? (Number(completedLength)/Number(totalLength)) * 100 : 0} className="hidden 2xl:block relative w-full h-2 bg-secondary-background rounded overflow-hidden">
                        <Progress.Indicator style={{ width: `${totalLength !== 0 ? (Number(completedLength)/Number(totalLength)) * 100 : 0}%` }} className="h-full bg-accent-primary duration-1000"/>
                      </Progress.Root>
                    </div>
                  </div>
                </div>

                {/* 3 dots */}
                <MoreVertical className="w-4 h-4" />

              </div>
            </Menubar.Trigger>
            <Menubar.Portal>
              <Menubar.Content side="bottom" align="end" className="bg-primary-background text-text-primary rounded-xl shadow-lg p-2 transition-transform duration-200 ease-out data-[state=open]:animate-fade-in-scale">
                {download.status === "active" && (
                  <Menubar.Item
                    className="p-2 hover:bg-secondary-background cursor-pointer rounded-xl"
                    onClick={() => pauseDownload(download.gid)}
                  >
                    Pause
                  </Menubar.Item>
                )}
                {download.status === "paused" && (
                  <Menubar.Item
                    className="p-2 hover:bg-secondary-background cursor-pointer rounded-xl"
                    onClick={() => resumeDownload(download.gid)}
                  >
                    Resume
                  </Menubar.Item>
                )}
                <Menubar.Item
                  className="p-2 hover:bg-red-600 cursor-pointer rounded-xl"
                  onClick={() => {
                    cancelDownload(download.gid)
                    console.log("Cancel clicked!")
                  }}
                >
                  Cancel
                </Menubar.Item>
              </Menubar.Content>
            </Menubar.Portal>
          </Menubar.Menu>
        </Menubar.Root>
  )})}
    </div>
  );
}