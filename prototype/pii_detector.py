from presidio_analyzer import AnalyzerEngine
from typing import List

# Initialize once
analyzer = AnalyzerEngine()


def detect_pii(text: str) -> List[dict]:
    """Detects PII spans and returns list of dicts with entity & positions."""
    results = analyzer.analyze(text=text, language='en')
    return [
        {"entity": r.entity_type, "start": r.start, "end": r.end, "score": r.score}
        for r in results
    ]