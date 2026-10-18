# p XOR (p div 2) dla każdej liczby, wynik w systemie binarnym (jeden w wierszu).
for linia in open("bin.txt"):
    p = int(linia, 2)
    print(bin(p ^ (p // 2))[2:])
