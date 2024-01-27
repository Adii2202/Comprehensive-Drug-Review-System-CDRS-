import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DrugInfo.css";

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
  const [rating, setRating] = useState(0);
  const [reviewInput, setReviewInput] = useState("");
  const [predictionResult, setPredictionResult] = useState("");
  const [sentimentScore, setSentimentScore] = useState(null);

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
        setShowOutput(true);
      } catch (error) {
        console.error("Error fetching drug names:", error);
      }
    } else if (selection === "drug") {
      try {
        // const keyFeaturesResponse = await axios.get(
        //   `http://127.0.0.1:5000/getKeyfeatures/${option}`
        // );
        // const keyFeaturesData = keyFeaturesResponse.data;
        // setKeyFeatures(keyFeaturesData.keyFeatures);

        // const sideEffectResponse = await axios.get(
        //   `http://127.0.0.1:5000/getsideeffect/${option}`
        // );
        // const sideEffectData = sideEffectResponse.data;
        // setSideEffectName(sideEffectData.sideEffects);

        const reviewResponse = await axios.get(
          `http://127.0.0.1:5000/getdrugreview/${option}`
        );
        const reviewData = reviewResponse.data;
        setReviews(reviewData.reviews);

        const ratingResponse = await axios.get(
          `http://127.0.0.1:5000/getdrugcat/${option}`
        );
        const ratingData = ratingResponse.data;
        const ratings = ratingData.Rating;
        setRating(ratings);

        setShowDrugNames(false);
        setSelectedDrugName(option);
        setShowOutput(true);
      } catch (error) {
        console.error("Error fetching drug information:", error);
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
      const result2 = await axios.get(
        `http://127.0.0.1:5000/getdrugcat/${drug}`
      );
      const df2 = result2.data;
      const ratings = df2.Rating;
      setRating(ratings);

      console.log(df2.Rating);

      setShowDrugNames(false);
      setSelectedDrugName(drug);
      setShowOutput(true);
    } catch (error) {
      console.error("Error fetching key features:", error);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setShowOutput(true);
    setUserInput("");
    setShowDropdown(false);
  };

  const handleAddReview = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/predict", {
        review: reviewInput,
      });

      setPredictionResult(response.data.prediction);
      console.log(response.data.prediction);
      if (response.data.prediction === "True") {
        const sentimentResponse = await axios.post(
          "http://127.0.0.1:8000/analyze_sentiment",
          {
            text: reviewInput,
          }
        );

        const sentimentScore = sentimentResponse.data;

        setSentimentScore(sentimentScore);
        console.log(sentimentScore);
        // console.log(selectedDrug);
        // if (sentimentScore > 2) {
        //   await axios.post("http://127.0.0.1:5000/add-review", {
        //     drug: selectedDrug,
        //     review: reviewInput,
        //   });

        //   // Fetch the updated reviews for the selected drug
        //   const reviewResponse = await axios.get(
        //     `http://127.0.0.1:5000/getdrugreview/${selectedDrugName}`
        //   );
        //   const reviewData = reviewResponse.data;
        //   console.log(reviewResponse.data);
        //   setReviews(reviewData.reviews);

        //   // Clear the review input
        //   setReviewInput("");
        // }
      } else {
        alert(
          "Warning: This review is flagged as potentially fake. Please consider providing a genuine review."
        );
      }
    } catch (error) {
      console.error("Error predicting review:", error);
    }
  };

  const uniqueDrugOptions = [...new Set(drugOptions)];
  const uniqueCondition = [...new Set(conditionName)];

  return (
    <>
      <div className=" flex-col items-center justify-center flex p-40 ">
        <div className="form-container">
          <div className="mydict">
            <div className="">
              <h2 className="">Choose an Option</h2>
              <form className="radio-input">
                {/* <label>
                  <input
                    type="radio"
                    value="disease"
                    checked={selection === "disease"}
                    onChange={handleSelectionChange}
                    id="disease"
                    name="value-radio"
                  />
                  <span>Disease</span>
                </label>
                <br />
                <label>
                  <input
                    type="radio"
                    value="drug"
                    checked={selection === "drug"}
                    onChange={handleSelectionChange}
                    id = "drug"
                  />
                  <span className="">Drug Name</span>
                </label> */}
                <div className="radio-input">
                  <label>
                    <input
                      type="radio"
                      id="value-1"
                      name="value-radio"
                      value="disease"
                      checked={selection === "disease"}
                      onChange={handleSelectionChange}
                    />
                    <span>Disease</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      id="value-2"
                      name="value-radio"
                      value="drug"
                      checked={selection === "drug"}
                      onChange={handleSelectionChange}
                    />
                    <span>Drug Name</span>
                  </label>
                  <span className="selection"></span>
                </div>
              </form>
              {selection && (
                <div>
                  You selected:{" "}
                  {selection === "disease" ? "Disease" : "Drug Name"}
                </div>
              )}
            </div>
          </div>
          <div>
            <h2></h2>
            <form onSubmit={handleFormSubmit}>
              <label htmlFor="drugName"></label>
              <div className="inputbox">
                <input
                  type="text"
                  id="drugName"
                  name="drugName"
                  value={userInput}
                  onChange={handleInputChange}
                  required="required"
                />
                <span>Select Drug/Disease:</span>
                <i></i>

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
              <button>
                <span class="span-mother">
                  <span>S</span>
                  <span>u</span>
                  <span>b</span>
                  <span>m</span>
                  <span>i</span>
                  <span>t</span>
                </span>
                <span class="span-mother2">
                  <span>S</span>
                  <span>u</span>
                  <span>b</span>
                  <span>m</span>
                  <span>i</span>
                  <span>t</span>
                </span>
              </button>
            </form>
          </div>
        </div>
        <br/>
        <br/>
        <div className="  " >
          {showDrugNames && selection === "disease" && (
            <div className="card  ">
              <h3 >Selected Condition's Drug Names</h3>
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
          <div className="output-container flex m-12 ">
            {/* Display drug information cards */}
            {/* ... */}

            <div className="card m-12">
              <h3>Key features</h3>
              <div className="side-effects-container ">
                {keyFeatures && <p>{keyFeatures}</p>}
              </div>
            </div>
            <div className="card m-12">
              <h3>Side Effects</h3>
              <div className="side-effects-container">
                {sideEffectName && <p>{sideEffectName}</p>}
              </div>
            </div>
            <div className="card reviews-card m-12">
              <h3>Reviews</h3>
              <div className="reviews-container">
                {Array.isArray(reviews) &&
                  reviews.map((review, index) => (
                    <React.Fragment key={index}>
                      <p>{review}</p>
                      {/* Add partition if not the last review */}
                    </React.Fragment>
                  ))}
              </div>
            </div>
            <div className="card m-12">
              <h3>Rating</h3>
              {rating && <p>{rating}</p>}
            </div>
          </div>
        )}

        {showOutput && (
          <div className="form-container" >
            <h3>Add Review</h3>
            <div className="inputbox">
            <input
              
              type="text"
              id="reviewInput"
              required = "required"
              // placeholder="Add your review..."
              value={reviewInput}
              onChange={(e) => setReviewInput(e.target.value)}
            />
            <span>Add your review...</span>
            <i></i>
            </div>
            <button onClick={handleAddReview}>
                <span class="span-mother">
                  <span>S</span>
                  <span>u</span>
                  <span>b</span>
                  <span>m</span>
                  <span>i</span>
                  <span>t</span>
                </span>
                <span class="span-mother2">
                  <span>S</span>
                  <span>u</span>
                  <span>b</span>
                  <span>m</span>
                  <span>i</span>
                  <span>t</span>
                </span>
            </button>

          </div>
        )}
      </div>
    </>
  );
}

export default DrugInformationForm;
