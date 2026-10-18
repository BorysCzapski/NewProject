# Liczby, w których pierwsza i ostatnia cyfra są takie same: ile ich jest i która jest pierwsza w pliku.
liczby = [linia.strip() for linia in open("liczby.txt")]
pasujace = [l for l in liczby if l[0] == l[-1]]
print(len(pasujace), pasujace[0])
