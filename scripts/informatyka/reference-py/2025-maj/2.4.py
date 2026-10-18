# Suma wszystkich liczb: dziesiętnie oraz trójkowo zapisana symbolami o, +, *.
cyfry = {"o": 0, "+": 1, "*": 2}
symbole = "o+*"

suma = 0
for linia in open("symbole.txt"):
    liczba = 0
    for znak in linia.strip():
        liczba = liczba * 3 + cyfry[znak]
    suma += liczba

napis = ""
reszta = suma
while reszta > 0:
    napis = symbole[reszta % 3] + napis
    reszta //= 3

print(suma, napis)
