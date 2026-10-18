# Najdłuższy rosnąco-malejący ciąg kolejnych cyfr i jego pozycja (od 1).
cyfry = [int(linia) for linia in open("pi.txt")]
n = len(cyfry)

# rosnaco[i] / malejaco[i] = długość maksymalnego ściśle rosnącego / malejącego ciągu zaczynającego się w i
rosnaco = [1] * n
malejaco = [1] * n
for i in range(n - 2, -1, -1):
    if cyfry[i] < cyfry[i + 1]:
        rosnaco[i] = rosnaco[i + 1] + 1
    if cyfry[i] > cyfry[i + 1]:
        malejaco[i] = malejaco[i + 1] + 1

najlepszy = (0, 0)                                  # (długość, początek)
for i in range(n):
    for k in range(i + 1, i + rosnaco[i]):          # część rosnąca: cyfry i..k (co najmniej 2)
        if k + 1 < n and malejaco[k + 1] >= 2:      # część malejąca zaczyna się w k+1 (co najmniej 2)
            dlugosc = (k - i + 1) + malejaco[k + 1]
            if dlugosc > najlepszy[0]:
                najlepszy = (dlugosc, i)

dlugosc, start = najlepszy
print(start + 1)
print("".join(map(str, cyfry[start:start + dlugosc])))
