# Po każdej rundzie pakiet z komputera x trafia do odbiorcy[x]. Szukamy pierwszej rundy, w której
# jakiś pakiet wraca do komputera o swoim numerze.
odbiorcy = [0] + [int(x) for x in open("odbiorcy.txt")]   # numeracja od 1
n = len(odbiorcy) - 1
gdzie = list(range(n + 1))                                  # gdzie[p] = komputer, w którym jest pakiet p

runda = 0
while True:
    runda += 1
    gdzie = [odbiorcy[g] for g in gdzie]
    powroty = [p for p in range(1, n + 1) if gdzie[p] == p]
    if powroty:
        print(runda, min(powroty))
        break
