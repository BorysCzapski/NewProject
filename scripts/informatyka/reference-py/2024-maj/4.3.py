# Liczby z drugiego wiersza, które są iloczynem liczb z pierwszego wiersza
# (każdy czynnik użyty najwyżej tyle razy, ile razy występuje w pierwszym wierszu).
from collections import Counter

wiersze = open("liczby.txt").read().splitlines()
dostepne = Counter(map(int, wiersze[0].split()))
drugi = list(map(int, wiersze[1].split()))

def da_sie(n):
    potrzebne = Counter()
    for p in dostepne:                 # liczby pierwsze z pierwszego wiersza
        while n % p == 0:
            n //= p
            potrzebne[p] += 1
    return n == 1 and all(potrzebne[p] <= dostepne[p] for p in potrzebne)

print(*[n for n in drugi if da_sie(n)])
