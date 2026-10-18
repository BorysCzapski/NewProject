# Różne np-pary, których suma kodów ASCII jest liczbą pierwszą.
def pierwsza(n):
    return n > 1 and all(n % d for d in range(2, int(n ** 0.5) + 1))

napis = open("dane.txt").read().strip()
pary = [napis[i:i + 2] for i in range(0, len(napis), 2)]
wynik = []
for para in pary:
    if para not in wynik and pierwsza(sum(map(ord, para))):
        wynik.append(para)
print(*wynik)
