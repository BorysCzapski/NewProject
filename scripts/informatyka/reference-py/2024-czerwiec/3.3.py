# Słowa, w których jedna litera stoi na co najmniej połowie pozycji.
from collections import Counter

for linia in open("slowa.txt"):
    slowo = linia.strip()
    if max(Counter(slowo).values()) * 2 >= len(slowo):
        print(slowo)
