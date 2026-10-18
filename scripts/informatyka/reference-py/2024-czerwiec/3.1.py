# Słowa zawierające fragment "k?t" (k, dowolna litera, t).
import re

print(sum(1 for linia in open("slowa.txt") if re.search(r"k.t", linia.strip())))
