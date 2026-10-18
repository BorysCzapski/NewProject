# 101. liczba w kolejności od największej (po uporządkowaniu całego wiersza, z powtórzeniami).
pierwszy = list(map(int, open("liczby.txt").read().splitlines()[0].split()))
print(sorted(pierwszy, reverse=True)[100])
