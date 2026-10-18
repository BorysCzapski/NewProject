# Liczba połowicznie względnie pierwsza: NWD obu połówek zapisu dziesiętnego równy 1.
from math import gcd

licznik = 0
for linia in open("liczby1.txt"):
    k = linia.strip()
    polowa = len(k) // 2
    if gcd(int(k[:polowa]), int(k[polowa:])) == 1:
        licznik += 1
print(licznik)
