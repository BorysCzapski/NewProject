# Pracownicy, którzy nie są przełożonymi nikogo = numery, których nie ma wśród przełożonych.
przelozeni = [int(x) for x in open("korpo.txt")]
n = len(przelozeni)
print(n - len(set(przelozeni[1:])))
