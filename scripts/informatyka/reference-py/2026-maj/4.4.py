# Głębokość w drzewie: liczba przełożonych = głębokość pracownika. Przełożony ma zawsze mniejszy numer,
# więc głębokości można liczyć w kolejności numerów.
from collections import Counter

przelozeni = [int(x) for x in open("korpo.txt")]
glebokosc = [0] * len(przelozeni)
for i in range(1, len(przelozeni)):
    glebokosc[i] = glebokosc[przelozeni[i] - 1] + 1

maks = max(glebokosc)
print(maks, Counter(glebokosc)[maks])
