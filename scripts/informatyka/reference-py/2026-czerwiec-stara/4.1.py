# np-pary: znaki 1-2, 3-4, 5-6, ... Liczymy sąsiednie, identyczne np-pary.
napis = open("dane.txt").read().strip()
pary = [napis[i:i + 2] for i in range(0, len(napis), 2)]
print(sum(1 for i in range(len(pary) - 1) if pary[i] == pary[i + 1]))
