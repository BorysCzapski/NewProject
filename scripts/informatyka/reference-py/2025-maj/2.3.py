# Napisy jako liczby trójkowe: o = 0, + = 1, * = 2. Największa liczba (dziesiętnie) i jej napis.
cyfry = {"o": 0, "+": 1, "*": 2}

def wartosc(napis):
    liczba = 0
    for znak in napis:
        liczba = liczba * 3 + cyfry[znak]
    return liczba

napisy = [linia.strip() for linia in open("symbole.txt")]
najwiekszy = max(napisy, key=wartosc)
print(wartosc(najwiekszy), najwiekszy)
