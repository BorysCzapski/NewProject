# Napisy będące palindromami, w kolejności z pliku.
for linia in open("symbole.txt"):
    napis = linia.strip()
    if napis == napis[::-1]:
        print(napis)
