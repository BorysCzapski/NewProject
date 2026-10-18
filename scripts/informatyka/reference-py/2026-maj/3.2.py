# Para słów z największą sumą wspólnych wystąpień liter: suma po literach z min(d(x, s1), d(x, s2)).
from collections import Counter

najlepsza = None
for linia in open("pary.txt"):
    s1, s2 = linia.split()
    c1, c2 = Counter(s1), Counter(s2)
    suma = sum(min(c1[litera], c2[litera]) for litera in c1)
    if najlepsza is None or suma > najlepsza[0]:
        najlepsza = (suma, s1, s2)

print(najlepsza[1], najlepsza[2], najlepsza[0])
