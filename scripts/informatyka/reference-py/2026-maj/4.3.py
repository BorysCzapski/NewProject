# Pracownik z największą liczbą bezpośrednich podwładnych.
from collections import Counter

przelozeni = [int(x) for x in open("korpo.txt")]
podwladni = Counter(przelozeni[1:])
numer, ilu = podwladni.most_common(1)[0]
print(numer, ilu)
