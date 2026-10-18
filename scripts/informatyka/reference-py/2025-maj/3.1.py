# Dla ilu przesunięć [A, B] NWD(|A|, |B|) > 1 (przyjmujemy NWD(A, 0) = A).
from math import gcd

licznik = 0
for linia in open("dron.txt"):
    a, b = map(int, linia.split())
    if gcd(abs(a), abs(b)) > 1:
        licznik += 1
print(licznik)
