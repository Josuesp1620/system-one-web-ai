"""Kev (github.com/jaredpalmer/kev, Apache 2.0): Qwen3.5 + LoRA + cabeza de puntero. En CPU funciona, pero es lento."""
from system_one.models.base import DecisionModel


class KevModel(DecisionModel):
    def __init__(self, checkpoint: str = "jaredpalmer/kev-0.8b", device: str = "cpu"):
        super().__init__()
        from kev.checkpoint import Checkpoint
        self.name = checkpoint.split("/")[-1]
        self.device = device
        self.tokenizer, self.model = Checkpoint(checkpoint).load(device)

    def answer_batch(self, texts: list[str], questions: dict) -> list[dict]:
        from kev.api import SystemOneRequest, to_answers, to_record
        answers = []
        for text in texts:
            record, metadata = to_record(SystemOneRequest(state=text, questions=questions))
            probabilities = self.model.probs(self.model.encode(self.tokenizer, record))
            answers.append(to_answers([row.tolist() for row in probabilities], metadata))
        return answers
