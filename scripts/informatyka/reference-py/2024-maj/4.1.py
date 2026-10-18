# Ile liczb z pierwszego wiersza (każde wystąpienie) dzieli którąkolwiek liczbę z drugiego wiersza.
wiersze = open("liczby.txt").read().splitlines()
pierwszy = list(map(int, wiersze[0].split()))
drugi = list(map(int, wiersze[1].split()))
print(sum(1 for p in pierwszy if any(d % p == 0 for d in drugi)))
