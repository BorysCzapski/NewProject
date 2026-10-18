# Liczby pierwsze z pliku, których odbicia też są pierwsze.
def pierwsza(n):
    return n > 1 and all(n % d for d in range(2, int(n ** 0.5) + 1))

wypisane = []
for linia in open("liczby.txt"):
    n = int(linia)
    if pierwsza(n) and pierwsza(int(str(n)[::-1])) and n not in wypisane:
        wypisane.append(n)
        print(n)
