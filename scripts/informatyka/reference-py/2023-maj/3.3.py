# Ciąg jest rosnąco-malejący, gdy da się go podzielić na część rosnącą i malejącą (obie mają >= 2 elementy).
def rosnaco_malejacy(a):
    n = len(a)
    for k in range(2, n - 1):                      # k = długość części rosnącej
        rosnaca = all(a[i] < a[i + 1] for i in range(k - 1))
        malejaca = all(a[i] > a[i + 1] for i in range(k, n - 1))
        if rosnaca and malejaca:
            return True
    return False

cyfry = [int(linia) for linia in open("pi.txt")]
print(sum(1 for i in range(len(cyfry) - 5) if rosnaco_malejacy(cyfry[i:i + 6])))
