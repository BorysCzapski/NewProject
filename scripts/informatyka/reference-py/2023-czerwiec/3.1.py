# Liczby zrównoważone (tyle samo zer i jedynek) oraz prawie zrównoważone (różnica o 1).
zrownowazone = prawie = 0
for linia in open("anagram.txt"):
    liczba = linia.strip()
    roznica = abs(liczba.count("1") - liczba.count("0"))
    if roznica == 0:
        zrownowazone += 1
    elif roznica == 1:
        prawie += 1
print(zrownowazone)
print(prawie)
