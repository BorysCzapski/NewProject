# Najdłuższy fragment złożony z np-par, którego suma kodów ASCII jest liczbą pierwszą.
napis = open("dane.txt").read().strip()
n = len(napis)

# sumy prefiksowe kodów ASCII: suma fragmentu [a, b) = suma[b] - suma[a]
suma = [0]
for znak in napis:
    suma.append(suma[-1] + ord(znak))

# sito Eratostenesa do największej możliwej sumy
maks = suma[-1]
pierwsza = [True] * (maks + 1)
pierwsza[0:2] = [False, False]
for i in range(2, int(maks ** 0.5) + 1):
    if pierwsza[i]:
        for j in range(i * i, maks + 1, i):
            pierwsza[j] = False

najdluzszy = ""
for a in range(0, n, 2):          # fragment zaczyna się na nieparzystej pozycji (indeks parzysty)
    for b in range(n, a, -2):     # i kończy po pełnej np-parze
        if b - a <= len(najdluzszy):
            break
        if pierwsza[suma[b] - suma[a]]:
            najdluzszy = napis[a:b]
            break

print(najdluzszy, sum(map(ord, najdluzszy)))
