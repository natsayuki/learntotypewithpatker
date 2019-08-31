import markovify
import sys

corpus = "corpus/patker.txt"

with open(corpus) as f:
    text = f.read()

model = markovify.Text(text)

print(model.make_short_sentence(45))
sys.stdout.flush()
