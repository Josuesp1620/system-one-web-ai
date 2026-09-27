"""Laya (github.com/NandhaKishorM/laya, Apache 2.0): encoder mmBERT + cabeza de decisión. Corre en CPU."""
from system_one.models.base import DecisionModel


class LayaModel(DecisionModel):
    REPOSITORY = "convaiinnovations/laya"

    def __init__(self, checkpoint: str = "multilingual", device: str = "cpu", batch_size: int = 32, language: str = "es"):
        super().__init__()
        import laya
        self.name = f"laya-{checkpoint}"
        self.device = device
        self.batch_size = batch_size
        self.language = language
        self.agent = laya.load(self.REPOSITORY, subfolder=checkpoint, device=device)

    def answer_batch(self, texts: list[str], questions: dict) -> list[dict]:
        answers = []
        for start in range(0, len(texts), self.batch_size):
            outputs = self.agent.predict_batch(texts[start:start + self.batch_size], questions, lang=self.language)
            answers.extend(output["answers"] for output in outputs)
        return answers
