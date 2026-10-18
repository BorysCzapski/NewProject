# Para słów z największą różnicą sum kodów ASCII.
def f(s):
    return sum(ord(znak) for znak in s)

najlepsza = None
for linia in open("pary.txt"):
    s1, s2 = linia.split()
    roznica = abs(f(s1) - f(s2))
    if najlepsza is None or roznica > najlepsza[0]:
        najlepsza = (roznica, s1, s2)

print(najlepsza[1], najlepsza[2], najlepsza[0])
