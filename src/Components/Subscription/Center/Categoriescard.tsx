

import { Link } from "react-router-dom";

interface propinterface {
    item: {
        tag: string;
        img: React.ComponentType<{ className?: string }>;
        size: number;
        file_no: number
    }
}
const Categoriescard = (props: propinterface) => {
    const { item } = props;

    return (
        <Link to={`/category/${item.tag}`} >
            <div className="flex px-3 py-2 border rounded-3xl border-primary-border-color shadow-lg bg-secondary-background gap-1 items-center">
                <div className="bg-secondary-background flex justify-center items-center">
                    <item.img className=" text-text-secondary" />
                </div>
                <div className=" text-text-secondary">
                    {item.tag}
                </div>
            </div>
        </Link>
    )
}

export default Categoriescard;
