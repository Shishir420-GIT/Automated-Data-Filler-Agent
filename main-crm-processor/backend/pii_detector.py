from presidio_analyzer import AnalyzerEngine
from typing import List, Dict

# Initialize once
analyzer = AnalyzerEngine()

def detect_pii(text: str) -> List[Dict[str, any]]:
    """Detects PII spans and returns list of dicts with entity & positions."""
    try:
        results = analyzer.analyze(text=text, language='en')
        return [
            {
                "entity": r.entity_type, 
                "start": r.start, 
                "end": r.end, 
                "score": r.score
            }
            for r in results
        ]
    except Exception as e:
        print(f"PII detection error: {e}")
        return []