# backend/tests.py
from django.test import SimpleTestCase

class SimpleTest(SimpleTestCase):
    def test_addition(self):
        self.assertEqual(2 + 3, 5)
