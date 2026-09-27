"""Qué palabras pesaron en una decisión, con dos mediciones complementarias (todo sale de respuestas reales de Laya):

- sin la palabra: se quita cada palabra del mensaje y se mide la seguridad en la alternativa que había ganado. Si baja
  mucho, la palabra es imprescindible.
- solo la palabra: se le da a Laya cada palabra sola y se mide la seguridad en esa misma alternativa. Si ya es alta, la
  palabra es una pista suficiente. Sirve cuando hay varias pistas: quitar una no cambia nada porque las otras bastan.
"""


class WordImportance:
    def __init__(self, agent, language: str = "es"):
        self.agent = agent
        self.language = language

    def measure(self, text: str, api_questions: dict, winners: dict[str, int]) -> dict[str, dict]:
        """Por decisión: la seguridad original en su alternativa ganadora y la seguridad sin cada palabra."""
        words = text.split()
        baseline = self.probabilities(text, api_questions)
        without = [self.probabilities(self.remove(words, position), api_questions) for position in range(len(words))]
        alone = [self.probabilities(word, api_questions) for word in words]
        return {
            decision_id: {
                "option": winner,
                "baseline": round(baseline[decision_id][winner], 4),
                "top": self.top_alternatives(baseline[decision_id]),
                "words": [{"text": word, "without": round(result_without[decision_id][winner], 4), "alone": round(result_alone[decision_id][winner], 4)}
                          for word, result_without, result_alone in zip(words, without, alone)],
            }
            for decision_id, winner in winners.items()
        }

    def top_alternatives(self, probabilities: list[float], count: int = 3) -> list[dict]:
        ranking = sorted(range(len(probabilities)), key=lambda index: probabilities[index], reverse=True)[:count]
        return [{"option": index, "probability": round(probabilities[index], 4)} for index in ranking]

    def remove(self, words: list[str], position: int) -> str:
        return " ".join(word for index, word in enumerate(words) if index != position)

    def probabilities(self, text: str, api_questions: dict) -> dict[str, list[float]]:
        answers = self.agent.system_one(text, api_questions, lang=self.language)["answers"]
        return {decision_id: self.as_list(answer) for decision_id, answer in answers.items()}

    def as_list(self, answer: dict) -> list[float]:
        if "probabilities" in answer:
            return list(answer["probabilities"].values())
        return [1 - answer["noul"], answer["noul"]]
