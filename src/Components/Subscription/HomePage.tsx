import Navbar from "./Navbar";
import Leftbar from "./Leftbar";
import Rightbar from "./Rightbar";

import Contentbar from "./Contentbar";
import { useEffect, useState } from "react";
import { Routes, useNavigate, Route } from "react-router-dom";
import Streamfile from "./Streamfile";
import { useAppSelector } from "@/app/Hook";


type UpdateStateFunction = (newState: boolean) => void;

const HomePage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/signin');
    }
  }, [])

  const [downloadhistory, setdownloadhistory] = useState<boolean>(false);

  const streamstate = useAppSelector((state) => state.Stream_slice)

  const changestate: UpdateStateFunction = (value: boolean) => {
    setdownloadhistory(value);
  }
  return (
    <div className='w-[100vw] h-[100vh] flex justify-center items-center'>
      <div className='h-full w-full bg-primary-background flex'>

        <div className="bg-secondary-background rounded-r-xl lg:flex justify-center items-center hidden md:w-1/6">
          <Leftbar />
        </div>
      {/* Alag Component */}
        <div className="bg-primary-background h-full w-full rounded-t-lg flex flex-col">

          
        <Navbar downloadhistory={downloadhistory} changestate={changestate} />
          

          <div className="flex h-full rounded-b-2xl p-5 gap-2">
        {/* One seperate component */}
            <div className="w-full flex justify-center items-center">
              <Routes>
                <Route path="/Streamvideos" element={<Streamfile />}></Route>
              </Routes>
              {!streamstate && <Contentbar downloadhistory={downloadhistory} changestate={changestate} />}
            </div>

            <div className="w-[30%] h-full md:flex items-center justify-center hidden">
              <div className="h-full w-full bg-primary-background rounded-xl flex justify-center items-center border border-primary-border-color">
                <Rightbar />
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default HomePage;
