# Spójny fragment o długości >= 50 z największą średnią (pierwszy z takich w pliku).
pierwszy = list(map(int, open("liczby.txt").read().splitlines()[0].split()))
prefiks = [0]
for x in pierwszy:
    prefiks.append(prefiks[-1] + x)

najlepsza = None          # (suma, długość, początek)
for a in range(len(pierwszy)):
    for b in range(a + 50, len(pierwszy) + 1):
        suma, dlugosc = prefiks[b] - prefiks[a], b - a
        # porównanie średnich bez dzielenia: suma / dlugosc > najlepsza_suma / najlepsza_dlugosc
        if najlepsza is None or suma * najlepsza[1] > najlepsza[0] * dlugosc:
            najlepsza = (suma, dlugosc, a)

suma, dlugosc, a = najlepsza
print(round(suma / dlugosc, 2), dlugosc, pierwszy[a])
