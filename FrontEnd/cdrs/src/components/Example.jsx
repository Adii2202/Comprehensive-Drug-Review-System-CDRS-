import React from "react";
import "./bubblemodules.css";


const Example = () => {
    return (
      <div className="">
        <BubbleText />
      </div>
    );
  };
  
  const BubbleText = () => {
    return (
      <h2 className="text-5xl font-bold text-black ">
        {"Comprehensive Drug Review System".split("").map((child, idx) => (
          <span className={"hoverText"} key={idx}>
            {child}
          </span>
        ))}
      </h2>
    );
  };
  
  export default Example;