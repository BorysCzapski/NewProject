# Liczby binarne złożone z co najwyżej dwóch bloków (maksymalnych ciągów takich samych cyfr).
def bloki(liczba):
    return 1 + sum(1 for a, b in zip(liczba, liczba[1:]) if a != b)

print(sum(1 for linia in open("bin.txt") if bloki(linia.strip()) <= 2))
