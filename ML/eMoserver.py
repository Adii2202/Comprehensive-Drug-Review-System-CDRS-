from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer

nltk.download('vader_lexicon')

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
        text = data['text']
        compound_score = sid.polarity_scores(text)['compound']
        if(-1 <= compound_score <= -0.6 ):
            return 1
        elif (-0.6 <= compound_score <= -0.2):
            return 2
        elif (-0.2 <= compound_score <= 0.2):
            return 3
        elif (0.2 <= compound_score <= 0.6):
            return 4
        else:
            return 5
    except KeyError:
        raise HTTPException(status_code=400, detail='Invalid input format. Please provide a "text" field in the request body.')