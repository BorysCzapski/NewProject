# Liczby zamienione na dziesiętne: a) ile nie zawiera cyfry 0, b) liczba z największą sumą RÓŻNYCH cyfr (pierwsza w pliku).
liczby = [int(linia, 2) for linia in open("anagram.txt")]

bez_zera = sum(1 for n in liczby if "0" not in str(n))
najlepsza = max(liczby, key=lambda n: sum(int(c) for c in set(str(n))))   # max zwraca pierwszą z równych
print(bez_zera)
print(najlepsza)
