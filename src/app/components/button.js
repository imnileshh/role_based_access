function ButtonComponent({ buttonText }) {
    return (
        <button className="relative inline-block p-px font-semibold leading-6 text-white bg-neutral-900 shadow-2xl cursor-pointer rounded-2xl shadow-emerald-900 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-emerald-600">
            {/* <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-600 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span> */}
            <span className="relative z-10 block px-4 py-2 rounded-2xl bg-neutral-950">
                <span className="transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-emerald-300">
                    {buttonText}
                </span>
            </span>
        </button>
    );
}
export default ButtonComponent;
