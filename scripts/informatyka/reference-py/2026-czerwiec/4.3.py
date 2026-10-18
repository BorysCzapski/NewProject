# Aglomeracja: kwadrat [0, s] x [0, s]; liczą się miasta ściśle wewnątrz. Szukamy największego s z gęstością > 2.
miasta = [tuple(map(int, linia.split())) for linia in open("mapa.txt")]

wynik = None
for s in range(1, 502):
    ludnosc = sum(w for x, y, w in miasta if 0 < x < s and 0 < y < s)
    if ludnosc / (s * s) > 2:
        wynik = (s, ludnosc)

print(*wynik)
