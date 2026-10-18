# Liczby ukryte w napisie = maksymalne ciągi cyfr.
import re

napis = open("dane.txt").read()
liczby = re.findall(r"\d+", napis)
print(sum(1 for liczba in liczby if liczba.startswith("50")))
