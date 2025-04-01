import Item from "./Item";
import { useAppSelector, useAppDispatch } from "@/app/Hook";
const Breadcrumb = ()=>{

    const currentPath = useAppSelector((state)=> state.currentPath)
    const removePath = ()=>{
        
    }
    return (<div className="flex h-fit rounded-md">
        {
            currentPath.map((value, index, array)=>{
                return <Item key={index} name={value} onClick={()=>{

                }}/>
            })
        }
    </div>)
}

export default Breadcrumb;