# Najrzadziej i najczęściej występujący fragment dwucyfrowy (przy remisie - mniejszy numerycznie).
cyfry = [linia.strip() for linia in open("pi.txt")]
licznik = {f"{n:02d}": 0 for n in range(100)}
for i in range(len(cyfry) - 1):
    licznik[cyfry[i] + cyfry[i + 1]] += 1

najrzadszy = min(licznik, key=lambda f: (licznik[f], f))
najczestszy = min(licznik, key=lambda f: (-licznik[f], f))
print(najrzadszy, licznik[najrzadszy])
print(najczestszy, licznik[najczestszy])
