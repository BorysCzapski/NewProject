# Ile jest różnych liczb, ile występuje dokładnie dwa razy, a ile dokładnie trzy razy.
from collections import Counter

licznik = Counter(int(linia) for linia in open("liczby.txt"))
print(len(licznik), sum(1 for c in licznik.values() if c == 2), sum(1 for c in licznik.values() if c == 3))
