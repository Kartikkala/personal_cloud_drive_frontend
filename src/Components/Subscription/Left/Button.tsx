const Button = ({buttonContent ,onClickHandler})=>{
    return (
        <button onClick={onClickHandler} className="bg-accent-primary hover:bg-accent-secondary duration-200 text-text-primary font-Josefin py-3 px-3 rounded-xl mb-2 w-11/12">
                {buttonContent}
        </button>
    )
}

export default Button;