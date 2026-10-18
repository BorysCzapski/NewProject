# Komputery, które nie są odbiorcą niczyich pakietów.
odbiorcy = [int(x) for x in open("odbiorcy.txt")]
print(len(odbiorcy) - len(set(odbiorcy)))
