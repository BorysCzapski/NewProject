# Liczby 8-cyfrowe z największą liczbą anagramów (bez zera na początku).
# Anagram zaczyna się od 1, więc pozostałe j-1 jedynek rozmieszczamy na n-1 miejscach: C(n-1, j-1).
from math import comb

liczby = [linia.strip() for linia in open("anagram.txt") if len(linia.strip()) == 8]
def anagramy(liczba):
    return comb(len(liczba) - 1, liczba.count("1") - 1)

najwiecej = max(anagramy(l) for l in liczby)
for liczba in liczby:
    if anagramy(liczba) == najwiecej:
        print(liczba)
