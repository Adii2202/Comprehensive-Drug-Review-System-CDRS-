import React from "react";
import "./bubblemodules.css";


const Example = () => {
    return (
      <div className="grid h-screen place-content-center bg-black">
        <BubbleText />
      </div>
    );
  };
  
  const BubbleText = () => {
    return (
      <h2 className="text-center text-5xl font-thin text-indigo-300">
        {"Bubbbbbbbble text".split("").map((child, idx) => (
          <span className={"hoverText"} key={idx}>
            {child}
          </span>
        ))}
      </h2>
    );
  };
  
  export default Example;