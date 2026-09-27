/**
 * Tipos de los datos que genera el laboratorio (lab/, comando `python -m system_one export`) en public/data.
 * Nada de lo que muestra la web se inventa: todo sale de estos archivos.
 */

export type TokenRole = 'cls' | 'question' | 'separator' | 'marker' | 'option' | 'message';

export type Token = { text: string; role: TokenRole; option: number };

export type OptionInfo = { key: string; label: string; description: string };

export type DecisionInfo = { id: string; question: string; kind: 'choice' | 'noul'; options: OptionInfo[] };

export type InspectedDecision = {
  decision: DecisionInfo;
  tokens: Token[];
  markers: number[];
  attention: {
    globalAverage: number[][];          // [opción][token del mensaje]
    toMessageByLayer: number[][];       // [opción][capa]
    messageByLayer: number[][][];       // [opción][capa][token del mensaje]
  };
  vectors: number[][];
  logits: number[];
  temperature: number;
  probabilities: number[];
  action: { features: { topProbability: number; margin: number; entropy: number }; actProbability: number };
  importance: WordImportance;
};

/** Seguridad en la alternativa ganadora con el mensaje completo, sin cada palabra y con cada palabra sola (Laya de nuevo). */
export type WordImportance = {
  option: number;
  baseline: number;
  top: { option: number; probability: number }[];
  words: { text: string; without: number; alone: number }[];
};

export type ShowcaseEntry = { id: string; text: string; correct: Record<string, string> };

export type Inspection = { text: string; tokensTotal: number; correct: Record<string, string>; decisions: InspectedDecision[] };

export type ModelCard = {
  name: string; repository: string; license: string; encoder: string; layers: number; globalLayers: number[];
  localWindow: number; heads: number; dimensions: number; vocabulary: number; headLayers: number;
  temperatures: number[]; parameters: number;
};

export type CalibrationBin = { from: number; to: number; count: number; meanConfidence: number; accuracy: number };
export type CoveragePoint = { threshold: number; coverage: number; accuracy: number | null };

export type DecisionSummary = {
  decision: DecisionInfo;
  accuracy: number;
  brierScore: number;
  expectedCalibrationError: number;
  calibration: CalibrationBin[];
  coverageCurve: CoveragePoint[];
  confusionMatrix: number[][];
  keys: string[];
  positiveClass?: { precision: number | null; recall: number | null; actualPositive: number };
};

export type Run = {
  model: string;
  device: string;
  environment: Record<string, string>;
  messages: number;
  millisecondsPerMessage: number;
  decisions: Record<string, DecisionSummary>;
};

export type Example = { messageId: string; text: string; predicted: string; correct: string; confidence: number; isCorrect: boolean };

export type DatasetReport = {
  source: { repository: string; license: string; synthetic: boolean };
  loaded: number;
  cleaning: { kept: number; droppedUntranslated: number; examplesDropped: string[] };
  train: number;
  test: number;
  testPerIntent: number;
};

export type Study = {
  dataset: DatasetReport;
  runs: Record<string, Run>;
  examples: { run: string; area: { right: Example[]; wrong: Example[] }; intent: { right: Example[]; wrong: Example[] } };
};
