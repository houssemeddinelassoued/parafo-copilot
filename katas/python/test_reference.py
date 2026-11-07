import unittest

from reference import ErreurParafo, formater_reference


class TestFormaterReference(unittest.TestCase):
    def test_complete_sur_quatre_chiffres(self):
        self.assertEqual(formater_reference(42, 2026), "PAR-2026-0042")
        self.assertEqual(formater_reference(9999, 2099), "PAR-2099-9999")

    def test_refuse_un_numero_hors_bornes(self):
        for numero in (0, 10000, 4.5, "42", True):
            with self.subTest(numero=numero):
                with self.assertRaises(ErreurParafo) as ctx:
                    formater_reference(numero, 2026)
                self.assertEqual(ctx.exception.code, "NUMERO_INVALIDE")

    def test_refuse_une_annee_hors_bornes(self):
        with self.assertRaises(ErreurParafo) as ctx:
            formater_reference(1, 1999)
        self.assertEqual(ctx.exception.code, "ANNEE_INVALIDE")


if __name__ == "__main__":
    unittest.main()
