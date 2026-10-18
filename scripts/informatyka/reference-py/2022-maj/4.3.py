# Dobre trójki (x | y, y | z, wszystkie różne) i dobre piątki liczb z pliku.
liczby = sorted(int(linia) for linia in open("liczby.txt"))

# dzielniki[a] = liczby z pliku, które są wielokrotnościami a (większymi od a)
wielokrotnosci = {a: [b for b in liczby if b > a and b % a == 0] for a in liczby}

trojki = [(x, y, z) for x in liczby for y in wielokrotnosci[x] for z in wielokrotnosci[y]]
piatki = [(u, w, x, y, z)
          for u in liczby for w in wielokrotnosci[u] for x in wielokrotnosci[w]
          for y in wielokrotnosci[x] for z in wielokrotnosci[y]]

# zapis do trojki.txt, każda trójka w osobnym wierszu
with open("trojki.txt", "w") as plik:
    for trojka in trojki:
        plik.write(" ".join(map(str, trojka)) + "\n")

print(len(trojki), len(piatki))
