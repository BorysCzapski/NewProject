# Np-pary uporządkowane rosnąco według liczby wystąpień + największa i najmniejsza liczba wystąpień.
from collections import Counter

napis = open("dane.txt").read().strip()
pary = Counter(napis[i:i + 2] for i in range(0, len(napis), 2))
uporzadkowane = sorted(pary.items(), key=lambda p: p[1])
print("".join(para for para, _ in uporzadkowane), uporzadkowane[-1][1], uporzadkowane[0][1])
