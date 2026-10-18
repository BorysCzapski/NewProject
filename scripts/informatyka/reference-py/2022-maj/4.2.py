# Rozkład na czynniki pierwsze: najwięcej czynników (z powtórzeniami) i najwięcej różnych czynników.
def czynniki(n):
    wynik = []
    d = 2
    while d * d <= n:
        while n % d == 0:
            wynik.append(d)
            n //= d
        d += 1
    if n > 1:
        wynik.append(n)
    return wynik

liczby = [int(linia) for linia in open("liczby.txt")]
najwiecej = max(liczby, key=lambda n: len(czynniki(n)))
najwiecej_roznych = max(liczby, key=lambda n: len(set(czynniki(n))))
print(najwiecej, len(czynniki(najwiecej)))
print(najwiecej_roznych, len(set(czynniki(najwiecej_roznych))))
