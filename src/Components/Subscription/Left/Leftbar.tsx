import { useNavigate } from "react-router-dom";
import UserInfo from "./UserInfoKartik";
import ControlPanel from "./ControlPanel";
import Button from "./Button";


const Leftbar = () => {

    const navigate = useNavigate();
    const signout_handler = () => {
        localStorage.removeItem('token');
        navigate('/signin');
    }

    return (
        <div className="h-[94%] w-11/12 flex flex-col justify-between items-center">
            <UserInfo/>
            <ControlPanel/>
            <Button onClickHandler={signout_handler} buttonContent={"Signout"}/>
        </div>
    )
}

export default Leftbar;
