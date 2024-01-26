from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from pydantic import BaseModel
import nltk
import numpy as np
import pickle
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

nltk.download("vader_lexicon")

app = FastAPI()

origins = ["*"]  # You can specify the allowed origins here

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sid = SentimentIntensityAnalyzer()


@app.post("/analyze_sentiment")
async def analyze_sentiment(data: dict):
    try:
        text = data["text"]
        compound_score = sid.polarity_scores(text)["compound"]
        if -1 <= compound_score <= -0.6:
            return 1
        elif -0.6 <= compound_score <= -0.2:
            return 2
        elif -0.2 <= compound_score <= 0.2:
            return 3
        elif 0.2 <= compound_score <= 0.6:
            return 4
        else:
            return 5
    except KeyError:
        raise HTTPException(
            status_code=400,
            detail='Invalid input format. Please provide a "text" field in the request body.',
        )


class Review(BaseModel):
    review: str


# Load the pre-trained model and CountVectorizer
with open("nbayes_model.pkl", "rb") as model_file:
    model = pickle.load(model_file)

with open("count_vectorizer.pkl", "rb") as cv_file:
    cv = pickle.load(cv_file)


@app.post("/predict")
def predict_review(review: Review):
    try:
        # Vectorize the input review
        review_vectorized = cv.transform([review.review])

        # Make the prediction
        prediction = model.predict(review_vectorized)

        # Convert the prediction to "True" or "Deceptive"
        result = "True" if prediction[0] == 1 else "Deceptive"

        return {"prediction": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
