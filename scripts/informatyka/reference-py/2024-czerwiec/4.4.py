# Największa liczba pakietów w jednym komputerze po rundach 1, 2, 4 i 8.
from collections import Counter

odbiorcy = [0] + [int(x) for x in open("odbiorcy.txt")]
n = len(odbiorcy) - 1
gdzie = list(range(n + 1))

wynik = []
for runda in range(1, 9):
    gdzie = [odbiorcy[g] for g in gdzie]
    if runda in (1, 2, 4, 8):
        wynik.append(max(Counter(gdzie[1:]).values()))
print(*wynik)
