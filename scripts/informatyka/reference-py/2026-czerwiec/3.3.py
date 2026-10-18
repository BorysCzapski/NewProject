# Np-pary uporządkowane rosnąco według liczby wystąpień, sklejone w jeden napis.
from collections import Counter

napis = open("dane.txt").read().strip()
pary = Counter(napis[i:i + 2] for i in range(0, len(napis), 2))
print("".join(para for para, _ in sorted(pary.items(), key=lambda p: p[1])))
