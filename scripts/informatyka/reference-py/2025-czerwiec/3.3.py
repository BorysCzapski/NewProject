# Numer telefonu = dokładnie 9 cyfr, bez cyfry bezpośrednio przed i po.
import re

napis = open("dane.txt").read()
for numer in re.findall(r"(?<!\d)\d{9}(?!\d)", napis):
    if numer.startswith("5"):
        print(numer)
