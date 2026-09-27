"""Las decisiones de atención al cliente que se miden con Bitext: área, intención exacta y si es un reclamo."""
from system_one.tasks.decision import Decision, Option


class CustomerSupportTasks:
    # Área que atiende el mensaje: las 11 categorías de Bitext, con su texto y una descripción breve en español.
    AREAS = (
        Option("ACCOUNT", "cuenta", "crear, editar, eliminar o cambiar de cuenta, o recuperar la contraseña"),
        Option("CANCEL", "cancelación", "costos o condiciones por cancelar"),
        Option("CONTACT", "contacto", "hablar con atención al cliente o con una persona"),
        Option("DELIVERY", "entrega", "opciones y plazos de entrega"),
        Option("FEEDBACK", "opinión o queja", "quejas y opiniones sobre el servicio"),
        Option("INVOICE", "factura", "consultar u obtener facturas"),
        Option("ORDER", "pedido", "hacer, cambiar, cancelar o seguir un pedido"),
        Option("PAYMENT", "pago", "medios de pago y problemas al pagar"),
        Option("REFUND", "reembolso", "política, solicitud y seguimiento de reembolsos"),
        Option("SHIPPING", "dirección de envío", "registrar o cambiar la dirección de envío"),
        Option("SUBSCRIPTION", "boletín", "suscribirse al boletín"),
    )
    # Intención exacta: las 27 de Bitext, solo con un texto corto (27 descripciones no caben en la cabecera de Laya).
    INTENTS = (
        Option("cancel_order", "cancelar pedido"), Option("change_order", "cambiar pedido"),
        Option("place_order", "hacer un pedido"), Option("track_order", "seguir pedido"),
        Option("check_cancellation_fee", "costo de cancelación"),
        Option("change_shipping_address", "cambiar dirección de envío"), Option("set_up_shipping_address", "registrar dirección de envío"),
        Option("delivery_options", "opciones de entrega"), Option("delivery_period", "plazo de entrega"),
        Option("check_invoice", "consultar factura"), Option("get_invoice", "obtener factura"),
        Option("check_payment_methods", "medios de pago"), Option("payment_issue", "problema con el pago"),
        Option("check_refund_policy", "política de reembolso"), Option("get_refund", "pedir reembolso"),
        Option("track_refund", "seguir reembolso"),
        Option("complaint", "presentar una queja"), Option("review", "dejar una opinión"),
        Option("contact_customer_service", "contactar atención al cliente"), Option("contact_human_agent", "hablar con una persona"),
        Option("create_account", "crear cuenta"), Option("delete_account", "eliminar cuenta"), Option("edit_account", "editar cuenta"),
        Option("recover_password", "recuperar contraseña"), Option("registration_problems", "problemas de registro"),
        Option("switch_account", "cambiar de cuenta"), Option("newsletter_subscription", "suscribirse al boletín"),
    )
    YES_NO = (Option("false", "no"), Option("true", "sí"))

    def all(self) -> list[Decision]:
        return [self.area(), self.intent(), self.complaint()]

    def area(self) -> Decision:
        return Decision("area", "¿Qué área debe atender este mensaje?", "choice", self.AREAS,
                        lambda message: message.labels["category"])

    def intent(self) -> Decision:
        return Decision("intent", "¿Qué quiere hacer exactamente el cliente?", "choice", self.INTENTS,
                        lambda message: message.labels["intent"])

    def complaint(self) -> Decision:
        return Decision("complaint", "¿El cliente está presentando una queja o un reclamo?", "noul", self.YES_NO,
                        lambda message: "true" if message.labels["intent"] == "complaint" else "false")
