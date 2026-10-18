# "Kwadraty" 3x3 z dziewięciu identycznych symboli. Wiersze pliku tworzą tablicę o szerokości 12.
wiersze = [linia.strip() for linia in open("symbole.txt")]
srodki = []
for w in range(1, len(wiersze) - 1):
    for k in range(1, 11):
        pole = {wiersze[w + dw][k + dk] for dw in (-1, 0, 1) for dk in (-1, 0, 1)}
        if len(pole) == 1:
            srodki.append((w + 1, k + 1))  # numeracja od 1

print(len(srodki))
for w, k in srodki:
    print(w, k)
