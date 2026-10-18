# Najdłuższy prefiksosufiks pary: słowo będące początkiem jednego słowa i końcem drugiego.
def prefiksosufiks(a, b):
    for k in range(min(len(a), len(b)), 0, -1):
        if a[:k] == b[-k:] or b[:k] == a[-k:]:
            return k
    return 0

for linia in open("pary.txt"):
    s1, s2 = linia.split()
    k = prefiksosufiks(s1, s2)
    if k >= 5:
        print(s1, s2, k)
