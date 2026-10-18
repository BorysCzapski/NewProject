# Dwucyfrowe fragmenty (kolejne cyfry) o wartości większej niż 90.
cyfry = [linia.strip() for linia in open("pi.txt")]
print(sum(1 for i in range(len(cyfry) - 1) if int(cyfry[i] + cyfry[i + 1]) > 90))
