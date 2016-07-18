#!/usr/bin/env bash

bin/markpress.js examples/3d-push.md examples/html/3d-push.html -a -l 3d-push
bin/markpress.js examples/dark.md examples/html/dark.html -a -t dark
bin/markpress.js examples/custom-layout.md examples/html/custom-layout.html
bin/markpress.js examples/grid.md examples/html/grid.html -a -l grid
bin/markpress.js examples/horizontal.md examples/html/horizontal.html -a -l horizontal
bin/markpress.js examples/vertical.md examples/html/vertical.html -a -l vertical
bin/markpress.js examples/random.md examples/html/random.html -a -l random
bin/markpress.js examples/random-7d.md examples/html/random-7d.html -a -l random-7d
bin/markpress.js examples/light-serif.md examples/html/light-serif.html -a -t light-serif
