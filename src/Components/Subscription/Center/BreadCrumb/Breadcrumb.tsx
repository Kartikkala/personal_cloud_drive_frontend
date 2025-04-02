import Item from "./Item";
import { useAppSelector, useAppDispatch } from "@/app/Hook";
import { removeDirectory } from "@/slice/CurrentPath";
import { fetch_files_fun } from "@/slice/Fetchfiles";
const Breadcrumb = ()=>{

    const currentPath = useAppSelector((state)=> state.currentPath)
    const dispatch = useAppDispatch()
    const removePath = (upto)=>{
        dispatch(removeDirectory(upto))
        if(currentPath[currentPath.length-1] === "/")
        {
            dispatch(fetch_files_fun("/"))
        }
        else{
            let path = currentPath.join("/")
            path = path.slice(1)
            dispatch(fetch_files_fun(path))
        }
    }
    return (<div className="flex h-fit rounded-md">
        {
            currentPath.map((value, index, array)=>{
                return <Item key={index} name={value} onClick={()=>{
                    removePath(index)
                }}/>
            })
        }
    </div>)
}

export default Breadcrumb;