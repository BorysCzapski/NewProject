# Liczba, dla której |n - odbicie(n)| jest największa.
def odbicie(n):
    return int(str(n)[::-1])

liczby = [int(linia) for linia in open("liczby.txt")]
najlepsza = max(liczby, key=lambda n: abs(n - odbicie(n)))
print(najlepsza, abs(najlepsza - odbicie(najlepsza)))
