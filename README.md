Which is better:

1. Concatenate files and then minify them
2. Minify files and then concatenate them

This will answer that question.

Design decisions
----------------

* Webpack: it's what everybody seems to use in 2017.
* UglifyJS: again, it's the de facto minifier in 2017.
* Source maps: produce source maps: they're essential.
* Files we're minifying:
    * lodash: lots of tiny files, which is typical in web develoipment
    * jQuery: it's huge and non-modular ... but lots of web developers use it
    * D3: it's lots of normal-sized files

Running
-------

`npm install`
`npm run benchmark`

Results
-------

(Node v8.0.0 on Linux with a i5-6600K CPU @ 3.50GHz with 32GB RAM)

* Uglify-after-minify: 5074ms, producing 379434 bytes
* Uglify-before-minify: 3917ms, producing 382147 bytes

Uglify-before-minify takes 77% as long -- a 23% speed improvement.
Uglify-before-minify increases file size by 0.7%.
