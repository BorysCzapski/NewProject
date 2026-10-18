# Najmniejszy alfabetycznie sufiks każdego słowa.
for linia in open("slowa4.txt"):
    n, slowo = linia.split()
    print(min(slowo[k:] for k in range(len(slowo))))
