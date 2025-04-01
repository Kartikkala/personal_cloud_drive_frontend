import { ChevronRight } from "lucide-react";

const Item = ({name,  onClick})=>{

    return (<div className="flex items-center gap">
        <button onClick={onClick} className="bg-none text-text-primary hover:bg-secondary-background duration-200 rounded-md p-2">
            {name}
        </button>
        <ChevronRight color="white"/>
    </div>)
}

export default Item;