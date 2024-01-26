from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
import pickle

app = FastAPI()

# Load the pre-trained model and CountVectorizer
with open('nbayes_model.pkl', 'rb') as model_file:
    model = pickle.load(model_file)

with open('count_vectorizer.pkl', 'rb') as cv_file:
    cv = pickle.load(cv_file)

class Review(BaseModel):
    review: str

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
