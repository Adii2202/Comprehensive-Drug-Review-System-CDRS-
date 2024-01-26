import React from "react";

const Button = ({ className, onClick, href, children }) => {
    if (href) {
        return (
            <a className={className} href={href}>
                {children}
            </a>
        );
    }

    return (
        <button className={"border-blue-700 border-2 bg-blue-700 rounded-md text-white hover:bg-white hover:text-blue-600 duration-200 " + className} onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;
