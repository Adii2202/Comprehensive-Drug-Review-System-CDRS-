import React, { useState } from "react";
import Navbar from "../components/Navbar";
import ShuffleHero from "../components/Hero";
import DrugInformationForm from "../components/DrugInformationForm";
// import Option from "../components/Option"

const Homepage = () => {
  const [inputText, setInputText] = useState("");

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  return (
    <div> 
      <div style={{ backgroundColor: "rgb(198,231,201)" }}> <Navbar /> </div>
      <div style={{ backgroundColor: "rgb(135,198,236)" }}> <ShuffleHero/>  </div>
      {/* <div style={{ backgroundColor: "rgb(135,198,236)" }} > <Option/> </div> */}
      <div style={{ backgroundColor: "rgb(135,198,236)" }}> <DrugInformationForm/>  </div>
      
    </div>
  );
};

export default Homepage;
