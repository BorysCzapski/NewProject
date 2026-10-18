# NWD liczby i jej nieparzystego skrótu (cyfry parzyste usunięte) ma być równy 7.
from math import gcd

for linia in open("skrot2.txt"):
    liczba = int(linia)
    skrot = int("".join(c for c in str(liczba) if int(c) % 2 == 1))
    if gcd(liczba, skrot) == 7:
        print(liczba)
