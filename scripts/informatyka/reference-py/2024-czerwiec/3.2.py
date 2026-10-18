# Słowa, które po zakodowaniu ROT13 dają to samo słowo czytane od tyłu.
def rot13(slowo):
    return "".join(chr((ord(z) - ord("a") + 13) % 26 + ord("a")) for z in slowo)

slowa = [linia.strip() for linia in open("slowa.txt")]
pasujace = [s for s in slowa if rot13(s) == s[::-1]]
print(len(pasujace))
print(max(pasujace, key=len))
