# Liczby, których zapis składa się wyłącznie z cyfr parzystych (nie mają nieparzystego skrótu).
bez_skrotu = []
for linia in open("skrot.txt"):
    liczba = linia.strip()
    if all(int(cyfra) % 2 == 0 for cyfra in liczba):
        bez_skrotu.append(int(liczba))

print(len(bez_skrotu))
print(max(bez_skrotu))
