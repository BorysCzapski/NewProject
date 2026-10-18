# Najmniejsza odległość (miejska: |x1-x2| + |y1-y2|) i wszystkie pary miast w takiej odległości.
miasta = [tuple(map(int, linia.split())) for linia in open("mapa.txt")]
n = len(miasta)

najmniejsza = None
pary = []
for i in range(n):
    for j in range(i + 1, n):
        d = abs(miasta[i][0] - miasta[j][0]) + abs(miasta[i][1] - miasta[j][1])
        if najmniejsza is None or d < najmniejsza:
            najmniejsza, pary = d, [(i + 1, j + 1)]
        elif d == najmniejsza:
            pary.append((i + 1, j + 1))

print(najmniejsza)
for a, b in pary:
    print(a, b)
