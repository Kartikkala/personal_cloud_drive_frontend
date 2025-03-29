import { useState } from "react";
import * as Menubar from "@radix-ui/react-menubar";
import { Progress } from "radix-ui";
import { MoreVertical } from "lucide-react";
import socket from "../Socket";
import { useAppSelector } from "@/app/Hook";

const downloadsData = [
  { id: 1, name: "File1.mp4", status: "Downloading", absValue: 20, absTotalValue : 100 },
  { id: 2, name: "Document.pdf", status: "Paused" , absValue: 20, absTotalValue : 100},
  { id: 3, name: "Music.mp3", status: "Downloading" , absValue: 20, absTotalValue : 100},
];

export default function DownloadManager() {
  const [downloads, setDownloads] = useState(downloadsData);
  const user = useAppSelector((state)=>state.user.user)
  if(user !== null){
    socket.on(`statusUpdate_${user.email}`, (downloadStatus)=>{
      console.log("Event fired!", downloadStatus)
    })
  }

  const updateStatus = (id, newStatus) => {
    setDownloads((prev) =>
      prev.map((dl) => (dl.id === id ? { ...dl, status: newStatus } : dl))
    );
  };

  return (
    <div className="space-y-2 w-full p-2">
      {downloads.map((download) => (
        <Menubar.Root key={download.id}>
          <Menubar.Menu>
            <Menubar.Trigger asChild>
              {/* Entire Download panel here */}
              <div className="flex items-center justify-between w-full p-2 rounded-xl border border-primary-border-color hover:bg-secondary-background text-text-primary bg-primary-background cursor-pointer">
                {/* Downlad name and status */}

                <div className="flex flex-col w-full">
                  <p className="text-sm">{download.name}</p>
                  <div className="flex items-center justify-between 2xl:w-[90%] w-full">
                    <p className="text-xs text-text-secondary">{download.status}</p>
                    <div className="flex items-center gap-2 2xl:w-[60%]">
                      {/* All this progress inside 3 dot menu in smaller devices*/}
                      <p className="text-xs text-text-primary">100gb/125gb</p>
                      <Progress.Root max={100} value={(download.absValue/download.absTotalValue) * 100} className="hidden 2xl:block relative w-full h-2 bg-secondary-background rounded overflow-hidden">
                        <Progress.Indicator style={{ width: `${(download.absValue/download.absTotalValue) * 100}%` }} className="h-full bg-accent-primary duration-1000"/>
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
                {download.status === "Downloading" && (
                  <Menubar.Item
                    className="p-2 hover:bg-secondary-background cursor-pointer rounded-xl"
                    onClick={() => updateStatus(download.id, "Paused")}
                  >
                    Pause
                  </Menubar.Item>
                )}
                {download.status === "Paused" && (
                  <Menubar.Item
                    className="p-2 hover:bg-secondary-background cursor-pointer rounded-xl"
                    onClick={() => updateStatus(download.id, "Downloading")}
                  >
                    Resume
                  </Menubar.Item>
                )}
                <Menubar.Item
                  className="p-2 hover:bg-red-600 cursor-pointer rounded-xl"
                  onClick={() => setDownloads((prev) => prev.filter((dl) => dl.id !== download.id))}
                >
                  Cancel
                </Menubar.Item>
              </Menubar.Content>
            </Menubar.Portal>
          </Menubar.Menu>
        </Menubar.Root>
      ))}
    </div>
  );
}