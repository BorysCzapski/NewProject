# Numery telefonów o najmniejszej liczbie różnych cyfr.
import re

napis = open("dane.txt").read()
numery = re.findall(r"(?<!\d)\d{9}(?!\d)", napis)
najmniej = min(len(set(numer)) for numer in numery)
for numer in numery:
    if len(set(numer)) == najmniej:
        print(numer)
