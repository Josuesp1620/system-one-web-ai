"""Qué papel cumple cada token de una fila de Laya: cls, question, separator, marker, option o message."""


class TokenRoles:
    def __init__(self, separator_id: int):
        self.separator_id = separator_id

    def classify(self, token_ids: list[int], markers: list[int]) -> tuple[list[str], list[int]]:
        """Devuelve el papel de cada posición y, para marcadores y opciones, el índice de su opción (-1 si no aplica)."""
        separators = [position for position, token in enumerate(token_ids) if token == self.separator_id]
        roles, options = [], []
        for position in range(len(token_ids)):
            role, option = self.role_at(position, separators, markers)
            roles.append(role)
            options.append(option)
        return roles, options

    def role_at(self, position: int, separators: list[int], markers: list[int]) -> tuple[str, int]:
        if position == 0:
            return "cls", -1
        if position in separators:
            return "separator", -1
        if position < separators[0]:
            return "question", -1
        if position in markers:
            return "marker", markers.index(position)
        if position < separators[1]:
            return "option", max(index for index, marker in enumerate(markers) if marker < position)
        return "message", -1
