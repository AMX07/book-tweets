"""
Feature extraction for the recommendation algorithm.
Builds TF-IDF vectors from excerpt text so we can compute
content-based similarity to the user's liked excerpts.
"""
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class FeatureExtractor:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            max_features=2000,
            stop_words="english",
            ngram_range=(1, 2),
        )
        self._fitted = False

    def fit(self, texts: list[str]):
        if not texts:
            return
        self.vectorizer.fit(texts)
        self._fitted = True

    def transform(self, texts: list[str]) -> np.ndarray:
        if not self._fitted or not texts:
            return np.zeros((len(texts), 1))
        return self.vectorizer.transform(texts).toarray()

    def user_profile_vector(self, liked_texts: list[str]) -> np.ndarray | None:
        """Returns the mean TF-IDF vector of liked excerpts, or None if no likes."""
        if not self._fitted or not liked_texts:
            return None
        vectors = self.transform(liked_texts)
        return vectors.mean(axis=0)

    def score(self, excerpt_vector: np.ndarray, profile_vector: np.ndarray) -> float:
        """Cosine similarity between excerpt and user's liked-content profile."""
        if excerpt_vector.ndim == 1:
            excerpt_vector = excerpt_vector.reshape(1, -1)
        if profile_vector.ndim == 1:
            profile_vector = profile_vector.reshape(1, -1)
        result = cosine_similarity(excerpt_vector, profile_vector)
        return float(result[0][0])
