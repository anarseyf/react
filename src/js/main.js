
 requirejs.config({

     baseUrl: './src/lib',
     paths: {
         "react": './react/react',
         "react-vis": './node_modules/react-vis/index'
     }
 });

//var react = require(['react']);
//var reactVis = require(['react-vis']);
//var reactDom = require(['react-dom']);
//var browser = require(['browser']);

window.onload = function () {
    console.warn("loaded");
    var x = 5;
};

