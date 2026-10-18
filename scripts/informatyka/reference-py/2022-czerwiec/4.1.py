# Odbicia liczb (cyfry w odwrotnej kolejności) podzielne przez 17.
liczby = [int(linia) for linia in open("liczby.txt")]
for n in liczby:
    odbicie = int(str(n)[::-1])
    if odbicie % 17 == 0:
        print(odbicie)
