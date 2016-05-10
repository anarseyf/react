
browserify index.js \
    -t [ babelify --presets [ es2015 react ] ] \
    -t uglifyify \
    -d -p [minifyify --map bundle.min.js.map --output bundle.min.js.map] \
    > bundle.min.js