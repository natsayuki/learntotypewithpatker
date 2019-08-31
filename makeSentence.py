import markovify
import sys

corpus = "patker.txt"

with open(corpus) as f:
    text = f.read()

model = markovify.Text(text)

print(model.make_sentence())
sys.stdout.flush()
