# Miasto o największej liczbie mieszkańców: numer (od 1) i liczba mieszkańców.
miasta = [tuple(map(int, linia.split())) for linia in open("mapa.txt")]
numer = max(range(len(miasta)), key=lambda i: miasta[i][2])
print(numer + 1, miasta[numer][2])
