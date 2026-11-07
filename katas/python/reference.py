"""Atelier 4 · Bonus : la même règle métier en Python.

Écrivez d'abord .github/instructions/python.instructions.md (applyTo: "**/*.py"),
puis demandez à Copilot d'écrire formater_reference.
Tests : python -m unittest discover -s katas/python -v
"""


class ErreurParafo(ValueError):
    """Erreur métier : porte un code stable."""

    def __init__(self, code: str, message: str = "") -> None:
        super().__init__(message or code)
        self.code = code


def formater_reference(numero: int, annee: int) -> str:
    """formater_reference(42, 2026) → 'PAR-2026-0042'. Voir src/format.js pour les règles."""
    raise NotImplementedError("À générer pendant le bonus de l'Atelier 4")
