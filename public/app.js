var selection = [];
var l = 0;
var layout = $("<div>", {id: "layout"+l, class: "t8-column"});
$('.all').draggable();


function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function invert(rgbOriginal) {
    rgb = [
      Number.parseInt(rgbOriginal.substring(1,3), 16),
      Number.parseInt(rgbOriginal.substring(3,5), 16),
      Number.parseInt(rgbOriginal.substring(5,7), 16),
      ];

    for (var i = 0; i < rgb.length; i++) rgb[i] = (i === 3 ? 1 : 255) - rgb[i];
    return rgbToHex(rgb[0], rgb[1], rgb[2]);
}

var zIndex = 3;
var createColor = function(data, vars, i){
  var d1 = pad((
      Number.parseInt(data[i][0]
    )).toString(16), 2);
  var d2 = pad((
      Number.parseInt(data[i][1]
    )).toString(16), 2);
  var d3 = pad((
      Number.parseInt(data[i][2]
    )).toString(16), 2);

  var rdmColor = "#"+d1+d2+d3;

  var div = $("<div>", {id: "parent-color"+i, style: "background-color: "+rdmColor, class: "t8-colorPicker t8-center"});
  var clr = $("<input>", {id: "color"+i});
  var dsc = $("<div>", {id: "description"+i, class: "t8-label"});
  var variable = $("<div>", {id: "variable"+i, class: "t8-label"});
  var triangle = $("<div>", {id: "triangle"+i, class: "arrow-top"});

  if(i % 16 == 0){
    l++;
    layout = $("<div>", {id: "layout"+l, class: "t8-column"});
    $("#container").append(layout);
  }

  $("#layout"+l).append(div);

  $("#parent-color"+i).draggable({
    grid: [20, 20],
    snap: true,
    start: function(event, ui) { $(this).css("z-index", zIndex++); }
  });

  $("#parent-color"+i).dblclick(function(){
    var data = $(this).data('clicked');
    var all = $('.all');

    if(data == undefined || data == false){
        selection.push(this);
        $(this).data('clicked', true);
        this.style.border = '3px solid white';
        $(this).draggable('disable');

        $('.all').append($(this));
    }
    else {

        $(this).data('clicked', false);
        this.style.border = '3px solid black';
        $(this).draggable('enable');

        console.dir(selection);

        var len = selection.length;
        var reverse = [];
        for (var i=0; i < len; i++){
          reverse.push(selection.pop());
        }

        for (var i=0; i < len; i++){
            var child = reverse.pop();
            $(child).detach();
            $('#layout'+l).append(child);
        }
      }
  });

  $("#parent-color"+i).append(triangle);
  $("#parent-color"+i).append(clr);
  $("#parent-color"+i).append(dsc);
  $("#parent-color"+i).append(variable);

  $("#description"+i).text("Color: "+rdmColor);
  $("#variable"+i).text(vars[i]);

  $("#description"+i).css({'color': invert(rdmColor)});
  $("#variable"+i).css({'color': invert(rdmColor)});

  $("#triangle"+i).css({'border-top': '30px solid '+rdmColor});
  $("#triangle"+i).click(function(){
      var myColor = $("#triangle"+i).css("border-top-color");
      $("#parent-color"+i).css({'background-color': myColor});
  });

  $('#color'+i).spectrum({
    move: function(color){
      var index = i;
      var clr = '#'+Math.floor(color._r).toString(16)+Math.floor(color._g).toString(16)+Math.floor(color._b).toString(16);
      console.log(clr);
      console.log('#parent-color'+index);
      $('#parent-color'+index).css({'background-color': clr});
      $("#description"+i).css({'color': invert(clr)});
      $("#variable"+i).css({'color': invert(clr)});
    },

    preferredFormat: "rgb",
    showInput: true,
    color: rdmColor
  });
};

function getRandomColor() {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++ ) {
          color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

$( document ).ready( function() {

  $.get( "/colors", function( data ){
    $.get( "/vars", function( vars ){

      for(var i = 0; i < data.length; i++){
          createColor(data, vars, i);
      }

      $('.sp-replacer').css('display','none');

    })
  })
});
