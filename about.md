# Thanh Nguyen (Albert)

Software engineer. I build systems at work and small, self-contained tools everywhere else. I like understanding things from the ground up and then making something that runs.

- The home page is an interactive portrait. This file is the text version; the question bank behind the chat is qa.json
- GitHub: https://github.com/traceformula

## What I am thinking about

### Tensor algebra as a hardware question
Matrix algebra has a natural chip: the multiply-accumulate array. I have been assembling the t-product "cube algebra" of 3-tensors into one textbook-style development, with the thesis that its natural accelerator is a transform followed by a batch of ordinary matrix multiplies. Every matrix theorem lifts, and the reason why is the same reason the hardware is simple.
Write-up: cube.html (source: cube_algebra_theory.md)

### How do we educate the next generation in the age of AI?
This is a tough question I have been thinking about, and I have no concrete answer yet.

### A web that agents can read
A page should say the same thing to a person in a browser and to a model fetching raw text. This site ships this Markdown twin and an llms.txt, and I am interested in what else a site should expose once agents, not just people, are the visitors.

### Learning should be fun and include struggle
I built Sophia & Ethan's Math Quest, a free math game for kids aged 10 to 15 and up, in Vietnamese and English. The fun brings a kid back, and the struggle is where the learning happens: a hint costs a star, and the full solution stays hidden until you have tried and missed twice. It has 1,677 problems, including 600 original contest-style puzzles in four levels, from Kangaroo style through MATHCOUNTS, AMC 8, AMC 10, AMC 12, AIME and olympiad style.
Play: https://sophiaethan.fun

### Practice tools that adapt to the learner
I am learning piano as an adult and built my own drills: ear training, note reading, fingering, and playing tunes by ear. The drills track what you miss and bring it back more often. Plain HTML, no build step, works offline on a phone.
Tools: piano/

### Reading as a graph, not a list
I keep the books and courses I have skimmed through as a force-directed graph of a couple thousand topics. Clusters: distributed systems, linear algebra for machine learning, quantitative finance, LLM agents.
Map: knowledge/

## Interests
I want to keep exploring distributed systems, AI and math. In my free time I love learning physics and neuroscience. Chess is my hobby. Sometimes I play badminton, and I love exploring any kind of sport.

## What I can build
- Backend systems: server-side services in Java, Go, C++, Python and Scala at large scale. Replication and recovery for distributed storage, data pipelines, API design, safe rollouts across regions.
- Browser-first tools: complete applications in plain HTML, CSS and JavaScript (Canvas, Web Audio, service workers, local persistence). No framework, no build step, works offline on a phone.
- Interpreters and visualizations: a Python interpreter in JavaScript, physics and cellular-automaton simulations, a LaTeX renderer, force-directed graphs.
- Mathematical writing: assembling a research literature into a single coherent exposition with textbook-level proofs and the computational primitive made explicit.
- Solo shipping: from idea to a live URL, including data curation, mobile audio quirks, offline caching and in-place updates.

## Things I have made
- Sophia & Ethan's Math Quest (learning game): https://sophiaethan.fun
- Piano Practice Tools (learning tool): piano/
- Cube Algebra (writing): cube.html
- Knowledge Map (visualization): knowledge/
- JPython (interpreter): jpython
- Solar System (simulation): solar
- Constellations (simulation): constellations
- Game of Life (simulation): gameoflife
- LaTeX Visualizer (tool): latex
- SRS (tool): srs
- Mai Hoa Dịch Số (curiosity): maihoa
