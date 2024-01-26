from flask import Flask, jsonify
import google.generativeai as genai
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load CSV file
df = pd.read_csv("list.csv")

# Extract drug names from the CSV file
drug_names = df["drugName"].tolist()
drug_condition = df["condition"].tolist()


def gemini(name, feature="keyfeature"):
    genai.configure(api_key="AIzaSyB_IMxgMDJacYvnYulmf59Xd1JR3IXzMHw")
    generation_config = {
        "temperature": 0.9,
        "top_p": 1,
        "top_k": 1,
        "max_output_tokens": 2048,
        "stop_sequences": [
            # "and story ends here.",
        ],
    }

    safety_settings = [
        {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        {
            "category": "HARM_CATEGORY_HATE_SPEECH",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
            "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
            "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE",
        },
    ]

    model = genai.GenerativeModel(
        model_name="gemini-pro",
        generation_config=generation_config,
        safety_settings=safety_settings,
    )

    prompt_parts = [f"give me {feature} of this {name} medicine in brief"]
    response = model.generate_content(prompt_parts)
    return jsonify({"res": response.tex})


@app.route("/getKeyfeatures/<drug>", methods=["GET"])
def getKeyfeatures(drug):
    res = gemini(drug)
    print(res)
    return res


@app.route("/getDrawback/<drug>", methods=["GET"])
def getDrawback(drug):
    return gemini(drug, "drawbacks")


@app.route("/drug-names", methods=["GET"])
def get_drug_names():
    return jsonify({"drugNames": drug_names})


@app.route("/drug-condition", methods=["GET"])
def get_drug_condition():
    return jsonify({"drugCondition": drug_condition})


@app.route("/drug-names/<condition>", methods=["GET"])
def get_drug_names_by_condition(condition):
    # Filter drug names based on the selected condition
    condition_drug_names = [
        name for name, cond in zip(drug_names, drug_condition) if cond == condition
    ]
    return jsonify({"drugNames": condition_drug_names})


if __name__ == "__main__":
    app.run(debug=True)
