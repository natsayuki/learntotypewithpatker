import json

text = ""
with open("wikiraw.txt") as f:
    text = f.read()

misspellings = {}
lines = text.split("\n")
for line in lines:
    words = line.split('->')
    print(words)
    if len(words) == 2:
        misspellings[words[1]] = words[0]

with open("misspellings.json", "w") as f:
    json.dump(misspellings, f)
