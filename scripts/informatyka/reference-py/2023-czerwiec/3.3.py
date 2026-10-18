# Największa różnica (wartość bezwzględna) sąsiednich liczb, zapisana binarnie.
liczby = [int(linia, 2) for linia in open("anagram.txt")]
print(bin(max(abs(a - b) for a, b in zip(liczby, liczby[1:])))[2:])
