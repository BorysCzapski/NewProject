# Punkty, w których dron był po kolejnych ruchach.
punkty = []
x = y = 0
for linia in open("dron.txt"):
    a, b = map(int, linia.split())
    x, y = x + a, y + b
    punkty.append((x, y))

# a) punkty ściśle wewnątrz kwadratu (0,0)-(5000,5000)
print("a)", sum(1 for x, y in punkty if 0 < x < 5000 and 0 < y < 5000))

# b) trzy różne punkty, z których jeden jest środkiem odcinka między dwoma pozostałymi
zbior = set(punkty)
for i in range(len(punkty)):
    for j in range(i + 1, len(punkty)):
        (x1, y1), (x2, y2) = punkty[i], punkty[j]
        if (x1 + x2) % 2 == 0 and (y1 + y2) % 2 == 0:
            srodek = ((x1 + x2) // 2, (y1 + y2) // 2)
            if srodek in zbior and srodek != punkty[i] and srodek != punkty[j]:
                print("b)", punkty[i], srodek, punkty[j])
