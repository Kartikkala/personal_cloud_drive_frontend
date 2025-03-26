import { useAppDispatch, useAppSelector } from '@/app/Hook';
import { nullset } from '@/slice/Streamslice';
import { useEffect, useRef } from 'react'
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import FileList from './FileList';
import axios from 'axios'


const Streamfile = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const videofilename = useAppSelector((state) => state.Stream_slice);
    const videofiles = useAppSelector((state) => state.Video_file);
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaSourceRef = useRef<MediaSource | null>(null);
    const sourceBufferRef = useRef<SourceBuffer | null>(null);

    const backarrowclick = () => {
        navigate("/");
        dispatch(nullset());
    }

    useEffect(() => {

        
        mediaSourceRef.current = new MediaSource();
        const mediaSource = mediaSourceRef.current;

        if (videoRef.current  && !videoRef.current.src) {
            videoRef.current.src = URL.createObjectURL(mediaSource)
        }
            let start = 0;

            const fetchSegment = async (sourceBuffer : SourceBuffer)=>
            {
                console.log("Fetch segment called!")
                console.log("Ready state: ", mediaSource.readyState)
                try{
                    const token = localStorage.getItem('token');
                    const response = await axios.post(
                        'http://localhost:5000/api/fs/stream',
                        { filepath: videofilename },
                        {
                            headers: { Range: `bytes=${start}-${start + 1_000_000 - 1}`,
                            "Authorization": token }, // Set Range headers
                            responseType: 'arraybuffer', // Get binary data
                        }
                    );

                    console.log(response)
                    
                    const data = response.data;
                    // const contentRange = response.headers["content-range"]; // Get total size from response
                    // const totalSize = contentRange ? parseInt(contentRange.split('/')[1]) : null;
                    if(!sourceBuffer.updating && mediaSource.readyState === 'open')
                    {
                        sourceBuffer.appendBuffer(data);
                        start += 1_000_000;
                    }
                }
                catch(e)
                {
                    console.error("Axios error", e)
                }
            }

            mediaSource.addEventListener('sourceopen', ()=>{
                const mimeCodec = 'video/mp4; codecs="avc1.640034"';
                const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec)
                sourceBufferRef.current = sourceBuffer;
                sourceBuffer.mode = 'segments'
                sourceBuffer.addEventListener('updateend',()=>{
                    fetchSegment(sourceBuffer)
                })
                fetchSegment(sourceBuffer);
                sourceBuffer.addEventListener('error', (e)=>{
                    console.error("Source buffer error: ", e)
                })
            })

    }, [videofilename])

    return (
        <div className="h-[97%] w-full box-border border-b-2 border-white flex flex-col items-center overflow-y-auto">
            <div className='h-12 w-8/12 bg-white rounded-lg flex items-center'>
                <IoArrowBackCircleSharp onClick={backarrowclick} className='text-5xl mr-8' />
                <div className="text-xl font-bold">Video Streaming</div>
            </div>

            <video ref={videoRef} className='my-7 w-10/12 h-auto' controls preload='auto'>
                Video tag is not supported by the your browser
            </video>


            {videofiles.length !== 0 && (

                <div className="w-full">
                    <div className="w-full flex justify-between lg:px-4 px-2 pb-2 border-b-[1.5px] border-black font-semibold md:text-base text-sm">
                        <div className="w-[45%]">Name</div>
                        <div className="w-[26%]">Size</div>
                        <div className="w-[26%]">Date</div>
                        <div className="w-[3%]"></div>
                    </div>
                    {videofiles.map((file, index) => (
                        <FileList key={index} fileobj={file} file_type="Videos" />
                    ))}
                </div>


            )}

        </div>

    )
}

export default Streamfile;
