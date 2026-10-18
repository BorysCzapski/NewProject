# Największa liczba z pliku (zapis binarny): dłuższy zapis = większa liczba, przy tej samej długości liczy się wartość.
liczby = [linia.strip() for linia in open("bin.txt")]
print(max(liczby, key=lambda l: int(l, 2)))
