"""Línea de comandos: un comando por paso del proceso.

  prepare    paso 2 · descarga Bitext, limpia y separa entrenamiento y prueba
  evaluate   paso 3 · mide un modelo en el conjunto de prueba (en este equipo)
  export     datos de la web: mensajes inspeccionados en Laya y el resumen del caso de estudio
"""
import argparse

from system_one.settings import Paths, SamplingSettings


class Cli:
    MODELS = ("laya", "kev")

    def __init__(self, paths: Paths | None = None):
        self.paths = paths or Paths()

    def run(self, arguments: list[str] | None = None) -> None:
        options = self.parser().parse_args(arguments)
        options.handler(options)

    def parser(self) -> argparse.ArgumentParser:
        parser = argparse.ArgumentParser(prog="python -m system_one", description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
        commands = parser.add_subparsers(required=True, metavar="comando")

        prepare = commands.add_parser("prepare", help="paso 2: preparar los datos")
        prepare.set_defaults(handler=self.prepare)

        evaluate = commands.add_parser("evaluate", help="paso 3: medir un modelo en este equipo")
        evaluate.add_argument("model", choices=self.MODELS)
        evaluate.add_argument("--limit", type=int, help="solo los primeros N mensajes de prueba (para una prueba rápida)")
        evaluate.set_defaults(handler=self.evaluate)

        export = commands.add_parser("export", help="datos de la web (web/public/data)")
        export.add_argument("--examples-from", default="laya-multilingual-cpu", help="medición de la que salen los ejemplos")
        export.set_defaults(handler=self.export)
        return parser

    def prepare(self, options: argparse.Namespace) -> None:
        from system_one.datasets.preparation import DataPreparation
        report = DataPreparation(self.paths.prepared, SamplingSettings()).run()
        print(f"cargados {report['loaded']} · descartados sin traducir {report['cleaning']['dropped_untranslated']} · "
              f"entrenamiento {report['train']} · prueba {report['test']}")

    def evaluate(self, options: argparse.Namespace) -> None:
        from system_one.datasets.preparation import DataPreparation
        from system_one.evaluation.evaluator import Evaluator
        from system_one.storage import JsonStore
        from system_one.tasks.customer_support import CustomerSupportTasks
        from system_one.datasets.splitting import EvenSampler
        messages = EvenSampler().take(DataPreparation(self.paths.prepared, SamplingSettings()).load_split("test"), options.limit)
        model = self.build_model(options.model)
        report = Evaluator(model, CustomerSupportTasks().all()).run(messages)
        suffix = f"-sample{options.limit}" if options.limit else ""
        JsonStore(compact=False).save(self.paths.evaluations / f"{model.name}-{model.device}{suffix}.json", report.to_dict())
        for decision_id, summary in report.decisions.items():
            print(f"{decision_id}: acierto {summary['accuracy']:.1%} · ECE {summary['expected_calibration_error']:.3f}")
        print(f"{report.milliseconds_per_message:.0f} ms por mensaje · {report.messages} mensajes")

    def export(self, options: argparse.Namespace) -> None:
        from system_one.datasets.preparation import DataPreparation
        from system_one.export.showcase import ShowcaseExporter, ShowcaseSelector
        from system_one.export.study import StudyExporter
        from system_one.inspection.inspector import LayaInspector
        from system_one.storage import JsonStore
        from system_one.tasks.customer_support import CustomerSupportTasks
        test_messages = DataPreparation(self.paths.prepared, SamplingSettings()).load_split("test")
        inspector = LayaInspector()
        JsonStore().save(self.paths.web_data / "model.json", inspector.model_card())
        ShowcaseExporter(inspector, CustomerSupportTasks().all(), self.paths.web_data / "showcase").export(ShowcaseSelector().select(test_messages))
        StudyExporter(self.paths.evaluations, self.paths.prepared / "report.json", self.paths.web_data).export(test_messages, options.examples_from)
        print("listo:", self.paths.web_data)

    def build_model(self, name: str):
        if name == "laya":
            from system_one.models.laya import LayaModel
            return LayaModel()
        from system_one.models.kev import KevModel
        return KevModel()
