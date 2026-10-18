# Najczęściej występująca cyfra w całym pliku.
from collections import Counter

napis = open("dane.txt").read()
cyfra, ile = Counter(znak for znak in napis if znak.isdigit()).most_common(1)[0]
print(cyfra, ile)
