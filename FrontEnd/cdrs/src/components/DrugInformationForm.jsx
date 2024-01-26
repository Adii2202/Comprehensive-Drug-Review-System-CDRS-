import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DrugInformationForm.css";

function DrugInformationForm() {
  const [keyFeatures, setKeyFeatures] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [selectedDrug, setSelectedDrug] = useState("");
  const [selectedDrugName, setSelectedDrugName] = useState("");
  const [reviews, setReviews] = useState([]);
  const [showOutput, setShowOutput] = useState(false);
  const [drugOptions, setDrugOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selection, setSelection] = useState("");
  const [conditionName, setConditionName] = useState([]);
  const [showDrugNames, setShowDrugNames] = useState(true);
  const [sideEffectName, setSideEffectName] = useState(null);

  const handleSelectionChange = (event) => {
    setSelection(event.target.value);
    setSelectedDrug("");
    setKeyFeatures(null);
  };

  // const drugOptions = ["Drug A", "Drug B", "Drug C"];

  useEffect(() => {
    // Fetch drug names or conditions based on the selected option from the Flask API endpoint
    const fetchData = async () => {
      try {
        let endpoint = "";
        if (selection === "drug") {
          endpoint = "http://127.0.0.1:5000/drug-names";
        } else if (selection === "disease") {
          endpoint = "http://127.0.0.1:5000/drug-condition";
        }
        const response = await axios.get(endpoint);
        if (selection === "disease") {
          // console.log(response);
          setConditionName(response.data.drugCondition);
          console.log(response.data.drugCondition);
        } else if (selection === "drug") {
          setDrugOptions(response.data.drugNames);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selection]);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
    setSelectedDrug("");
    setShowDropdown(true); // Clear the selected drug when user starts typing again
  };

  const handleSelectDrug = async (option) => {
    setSelectedDrug(option);
    setUserInput(option);
    setShowDropdown(false);
    if (selection === "disease") {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/drug-names/${option}`
        );
        setDrugOptions(response.data.drugNames);
        setShowOutput(true); // Display the output section
      } catch (error) {
        console.error("Error fetching drug names:", error);
      }
    }
  };

  const handleDrugNameClick = async (drug) => {
    try {
      // Fetch key features for the selected drug
      // const response = await axios.get(
      //   `http://127.0.0.1:5000/getKeyfeatures/${drug}`
      // );
      // const data = response.data;

      // setKeyFeatures(data.keyFeatures);

      // // Fetch side effects for the selected drug
      // const result = await axios.get(
      //   `http://127.0.0.1:5000/getsideeffect/${drug}`
      // );
      // const df = result.data;

      // setSideEffectName(df.sideEffects); // <-- Check this line
      // console.log(df.sideEffects);

      const result1 = await axios.get(
        `http://127.0.0.1:5000/getdrugreview/${drug}`
      );
      const df1 = result1.data;

      setReviews(df1.reviews);
      console.log(df1.reviews[0]);

      setShowDrugNames(false);
      setSelectedDrugName(drug);
      setShowOutput(true);
    } catch (error) {
      console.error("Error fetching key features:", error);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setShowOutput(true);
    setUserInput("");
    setShowDropdown(false); // Clear the user input after form submission
    // Fetch drug information
    // You can implement API calls here to fetch real drug information
  };

  const addReview = (review) => {
    if (review.trim() !== "") {
      setReviews([...reviews, `Review ${reviews.length + 1}: ${review}`]);
    }
  };

  const uniqueDrugOptions = [...new Set(drugOptions)];
  const uniqueCondition = [...new Set(conditionName)];

  return (
    <>
      <div>
        <h2>Choose an Option</h2>
        <form>
          <label>
            <input
              type="radio"
              value="disease"
              checked={selection === "disease"}
              onChange={handleSelectionChange}
            />
            Disease
          </label>
          <br />
          <label>
            <input
              type="radio"
              value="drug"
              checked={selection === "drug"}
              onChange={handleSelectionChange}
            />
            Drug Name
          </label>
        </form>
        {selection && (
          <div>
            You selected: {selection === "disease" ? "Disease" : "Drug Name"}
          </div>
        )}
      </div>
      <div>
        <h2>Drug Information Form</h2>
        <form onSubmit={handleFormSubmit}>
          <label htmlFor="drugName">Enter or Select Drug Name:</label>
          <div className="input-container">
            <input
              type="text"
              id="drugName"
              name="drugName"
              value={userInput}
              onChange={handleInputChange}
            />
            {userInput && showDropdown && (
              <div className="dropdown">
                {(selection === "drug"
                  ? uniqueDrugOptions
                  : selection === "disease"
                  ? uniqueCondition
                  : []
                )
                  .filter((option) =>
                    option.toLowerCase().includes(userInput.toLowerCase())
                  )
                  .map((option, index) => (
                    <div
                      key={index}
                      className="dropdown-option"
                      onClick={() => handleSelectDrug(option)}
                    >
                      {option}
                    </div>
                  ))}
              </div>
            )}
          </div>
          <button type="submit">Submit</button>
        </form>

        <div>
          {showDrugNames && selection === "disease" && (
            <div className="card-2">
              <h3>Selected Condition's Drug Names</h3>
              <div className="condition-drug-names-container">
                {uniqueDrugOptions.map((option, index) => (
                  <button
                    style={{
                      border: "black solid 1px",
                      padding: "1px",
                      margin: "2px",
                    }}
                    key={index}
                    onClick={() => handleDrugNameClick(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {showOutput && (
          <div className="output-container">
            {/* Display drug information cards */}
            {/* ... */}

            <div className="card">
              <h3>Key features</h3>
              <div className="side-effects-container">
                {keyFeatures && <p>{keyFeatures}</p>}
              </div>
            </div>
            <div className="card">
              <h3>Side Effects</h3>
              <div className="side-effects-container">
                {sideEffectName && <p>{sideEffectName}</p>}
              </div>
            </div>
            <div className="card reviews-card">
              <h3>Reviews</h3>
              <div className="reviews-container">
                {Array.isArray(reviews) &&
                  reviews.map((review, index) => <p key={index}>{review}</p>)}
              </div>
            </div>
            <div className="card">
              <h3>Rating</h3>
              <p>Rating: 4.5/5</p>
            </div>
          </div>
        )}

        {showOutput && (
          <div>
            <h3>Add Review</h3>
            <input
              type="text"
              id="reviewInput"
              placeholder="Add your review..."
            />
            <button
              onClick={() =>
                addReview(document.getElementById("reviewInput").value)
              }
            >
              Submit Review
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default DrugInformationForm;
