from flask import Flask, jsonify, request
import google.generativeai as genai
from flask_cors import CORS
import pandas as pd
import requests

app = Flask(__name__)

CORS(app, origins=["http://localhost:5173"])
# Load CSV file
df = pd.read_csv("list.csv")

# Extract drug names from the CSV file
drug_names = df["drugName"].tolist()
drug_condition = df["condition"].tolist()
data = pd.read_csv("combined_dataset.csv")
drug_review = data["review"].tolist()
drug_review_count = df["num_reviews"]
drug_cat = data["average_category"].tolist()


# @app.route("/add-review", methods=["POST"])
# def add_review():
#     try:
#         data = request.json
#         drug = data.get("drug")
#         review = data.get("review")

#         # Find the index of the drug in the dataset
#         row_indices = [i for i, name in enumerate(drug_names) if name == drug]

#         if row_indices:
#             # Iterate over all matching rows and update the reviews
#             for row_index in row_indices:
#                 drug_review[row_index].append(review)

#             # Save the updated data back to the CSV file
#             df["review"] = pd.Series(drug_review)
#             df.to_csv("combined_dataset.csv", index=False)

#             return jsonify({"message": "Review added successfully"})
#         else:
#             return jsonify({"message": "Drug not found in the dataset"})
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


def gemini(name, feature="keyfeature"):
    print("Gemini called")
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
    print(f"function call : {response.text}")
    return response.text


def gemini1(name, feature="sideeffect"):
    print("Gemini called")
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
    print(f"function call : {response.text}")
    return response.text


@app.route("/getKeyfeatures/<drug>", methods=["GET"])
def getKeyfeatures(drug):
    res = gemini(drug, "keyfeature")
    return jsonify({"keyFeatures": res})


@app.route("/getsideeffect/<drug>", methods=["GET"])
def getsideeffect(drug):
    print("parent fc")
    res = gemini1(drug, "sideeffect")
    # print(res)
    return jsonify({"sideEffects": res})


@app.route("/getdrugreview/<drug>", methods=["GET"])
def getdrugreview(drug):
    print("review")

    drug_indices = [index for index, name in enumerate(drug_names) if name == drug]

    reviews = [drug_review[index] for index in drug_indices]
    print(reviews)
    return jsonify({"reviews": reviews})

@app.route("/getdrugreview2/<drug>", methods=["GET"])
def getdrugreview2(drug):
    print("review")

    drug_indices = [index for index, name in enumerate(drug_names) if name == drug]

    reviews = ""
    for index in drug_indices:
        if len(reviews) < 5:
            reviews ="\n"+ reviews + drug_review[index]
    print(reviews)
    return jsonify({"reviews": reviews})


@app.route("/getdrugcat/<drug>", methods=["GET"])
def getdrugcat(drug):
    print("cat")

    drug_indices = [index for index, name in enumerate(drug_names) if name == drug]

    ratings = [float(drug_cat[index]) for index in drug_indices]
    avg_rating = round(sum(ratings) / len(ratings), 1) if len(ratings) > 0 else 0

    return jsonify({"Rating": avg_rating})


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
    app.run(host="0.0.0.0", port=5000)
