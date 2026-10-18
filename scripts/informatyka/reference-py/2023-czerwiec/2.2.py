# czy_mniejszy(n, s, k1, k2): czy sufiks s[k1..n] jest mniejszy alfabetycznie od s[k2..n] (numeracja od 1).
def czy_mniejszy(n, s, k1, k2):
    i, j = k1, k2
    while i <= n and j <= n:
        if s[i - 1] == s[j - 1]:
            i += 1
            j += 1
        elif s[i - 1] < s[j - 1]:
            return True
        else:
            return False
    # jedno z podsłów skończyło się: krótszy sufiks (ten, któremu skończyły się znaki) jest mniejszy
    return j <= n

for plik in ("slowa1.txt", "slowa2.txt", "slowa3.txt"):
    linie = open(plik).read().split("\n")
    n, s = int(linie[0]), linie[1].strip()
    k1, k2 = map(int, linie[2].split())
    print("TAK" if czy_mniejszy(n, s, k1, k2) else "NIE")
