# Stopień Kaprekara liczby n: w ilu cięciach zapisu n^2 suma obu części jest <= n.
def stopien(n):
    kwadrat = str(n * n)
    return sum(1 for i in range(1, len(kwadrat)) if int(kwadrat[:i]) + int(kwadrat[i:]) <= n)

liczby = [int(linia) for linia in open("liczby2.txt")]
najlepsza = max(liczby, key=stopien)
print(stopien(najlepsza), najlepsza)
