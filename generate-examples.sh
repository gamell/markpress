#!/usr/bin/env bash

bin/markpress.js -i examples/3d-push.md -o examples/html/3d-push.html -a -l 3d-push
bin/markpress.js -i examples/dark.md -o examples/html/dark.html -a -t dark
bin/markpress.js -i examples/custom-layout.md -o examples/html/custom-layout.html
bin/markpress.js -i examples/grid.md -o examples/html/grid.html -a -l grid
bin/markpress.js -i examples/horizontal.md -o examples/html/horizontal.html -a -l horizontal
bin/markpress.js -i examples/vertical.md -o examples/html/vertical.html -a -l vertical
bin/markpress.js -i examples/random.md -o examples/html/random.html -a -l random
bin/markpress.js -i examples/random-7d.md -o examples/html/random-7d.html -a -l random-7d
bin/markpress.js -i examples/light-serif.md -o examples/html/light-serif.html -a -t light-serif
