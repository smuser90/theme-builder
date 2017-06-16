const express = require('express')
const app = express()
const fs = require('fs');

app.use(express.static('public'));

var clrBuf = fs.readFileSync('colors.txt', "utf8");

var clrArr = clrBuf.split("\n");

var vars = [];
var colors = [];

var sortedVars = [];

for(clr in clrArr){
    var pair = clrArr[clr].split(":");
    if(pair[1]){
      colors.push(extractColorFromTag(pair[1]));
	vars.push(pair[0]);
    }
}

var sortedRgbArr = colors.map(function(c, i) {
  return {color: rgbToHsl(c), index: i};
}).sort(function(c1, c2) {
  return ((c2.color[0] - c1.color[0]) + (c2.color[1] - c1.color[1]));
}).map(function(data) {
  sortedVars.push(vars[data.index]);
  return colors[data.index];
});

colors.sort();

app.get('/colors', function (req, res) {
  res.send(sortedRgbArr);
});

app.get('/vars', function(req, res){
    res.send(sortedVars);
});

app.get('/', function (req, res){
    res.send();
});

app.listen(3000, function () {
      console.log('listening {port: 3000}')
});

function rgbToHsl(c) {
  var r = Number.parseInt(c[0])/255, g = Number.parseInt(c[1])/255, b = Number.parseInt(c[2])/255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if(max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch(max){
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return new Array(h * 360, s * 100, l * 100);
}

function getRandomColor() {
      var letters = '0123456789ABCDEF';
      var color = [];
      for (var i = 0; i < 3; i++ ) {
          color.push(letters[Math.floor(Math.random() * 16)] + letters[Math.floor(Math.random() * 16)]);
      }
      return color;
  }

function extractColorFromTag(tag){
  var arr = tag.split(",");
  var red = arr[0].replace("rgba(","").trim();
  var green = arr[1].trim();
  var blue = arr[2].trim();
  return [red, green, blue];
}
