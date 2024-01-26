import React, { useState } from "react";
import { HiMenu } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { SiSimilarweb } from "react-icons/si";
import Button from "./Button";

const Navbar = () => {
    const Links = [
        { text: "Inicio", ref: "#" },
        { text: "Sobre Nosotros", ref: "#" },
        { text: "Servicios", ref: "#" },
        { text: "Proyectos", ref: "#" },
    ];

    const [isOpen, setIsOpen] = useState(true);

    const handlerMenuClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="shadow-md py-5" style={{color: "black"}} >
            <div className="container flex items-center justify-between flex-wrap">
                <div className="flex items-center text-blue-800 hover:opacity-60 duration-200">
                    <SiSimilarweb size={32} />
                    <a href="#" className="font-bold text-3xl ml-2">
                        Dev
                    </a>
                </div>
                <div
                    onClick={handlerMenuClick}
                    className="lg:hidden cursor-pointer text-blue-800 border border-blue-800 p-1.5 rounded-md hover:bg-blue-800 hover:text-white duration-200"
                >
                    {isOpen ? <HiMenu size={24} /> : <AiOutlineClose size={24} />}
                </div>
                <div className={`${!isOpen ? "w-full flex flex-col mt-4" : "hidden"} lg:flex lg:items-center`}>
                    {Links.map((link) => (
                        <a href={link.ref} key={link.text} className="underline-offset-4 hover:underline duration-200 mb-4 lg:ml-7 lg:mb-0">
                            {link.text}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
