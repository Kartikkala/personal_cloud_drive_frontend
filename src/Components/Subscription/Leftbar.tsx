import { useNavigate } from "react-router-dom";
import UserInfo from "./UserInfo";


const Leftbar = () => {

    const navigate = useNavigate();
    const signout_handler = () => {
        localStorage.removeItem('token');
        navigate('/signin');
    }

    return (
        <div className="h-[94%] w-11/12 flex flex-col justify-between items-center">
            <UserInfo/>
            <button onClick={signout_handler} className="bg-accent-primary hover:bg-accent-secondary duration-200 text-text-primary font-Josefin py-3 px-3 rounded-xl mb-2 w-11/12">
                Sign out
            </button>
        </div>
    )
}

export default Leftbar;
