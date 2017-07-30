
var selectedLayers = context.selection;
var selectedCount = selectedLayers.count();

var getColor = function(selectionType, layer) {
  var color

  if (selectionType === "fill") {
    if (layer instanceof MSTextLayer) {
      color = layer.textColor()
    } else {
      color = layer.style().fills().firstObject().color()
    }
  } else {
    color = layer.style().borders().firstObject().color()
  }

  return color
}

var getNum = function(num1, num2, index) {
  var num = ((num2 - num1) / (selectedCount-1)) * index  + num1
  return num
}

////// Normal Text Info
// var app = [NSApplication sharedApplication];
// [app displayDialog:"This is an alert box!" withTitle:"Alert Box Title"];
var doc = context.document;
var result = [doc askForUserInput:"How many layers between them?" initialValue:"5"];


var copied_layers = [];

if (selectedCount == 0) {
  log('No layers are selected.');
} else {
  log('Selected layers:');

  var first_layer_color = getColor("fill", selectedLayers[0])
  var last_layer_color = getColor("fill", selectedLayers[selectedCount-1])

  var first_border_color = getColor("border", selectedLayers[0])
  var last_border_color = getColor("border", selectedLayers[selectedCount-1])
  
  var first_layer_pos_x = selectedLayers[0].rect().origin.x
  var last_layer_pos_x = selectedLayers[selectedCount-1].rect().origin.x
  
  var first_layer_pos_y = selectedLayers[0].rect().origin.y
  var last_layer_pos_y = selectedLayers[selectedCount-1].rect().origin.y

  var first_layer_w = selectedLayers[0].rect().size.width
  var last_layer_w = selectedLayers[selectedCount-1].rect().size.width

  var first_layer_h = selectedLayers[0].rect().size.height
  var last_layer_h = selectedLayers[selectedCount-1].rect().size.height

  var first_radius = selectedLayers[0].layers().firstObject().cornerRadiusFloat();
  var last_radius = selectedLayers[selectedCount-1].layers().firstObject().cornerRadiusFloat();

  var first_layer_opacity = selectedLayers[0].style().contextSettings().opacity()
  var last_layer_opacity = selectedLayers[selectedCount-1].style().contextSettings().opacity()

  //log("test" + first_layer_pos_x + " " + last_layer_pos_x)
  copied_layers.push(selectedLayers[0])
  copied_layers.push(selectedLayers[1])

  var layer_rec = selectedLayers[0]
  for (var k = 0; k < parseInt(result) ; k++) {
    //var layer = selectedLayers[0].duplicate();
    var new_layer = layer_rec.duplicate()
    new_layer.select_byExpandingSelection(true, true);
  
    copied_layers.splice(k+1, 0, new_layer )
    layer_rec = new_layer
  }

  selectedCount = copied_layers.length;



  for (var i = 0; i < selectedCount; i++) {
    var layer = copied_layers[i];

    // color
    var selectedColor = getColor("fill", layer)
    
    var r, g, b;

    var r = Math.round(getNum(first_layer_color.red(), last_layer_color.red(), i ) * 255)
    var g = Math.round(getNum(first_layer_color.green(), last_layer_color.green(), i ) * 255)
    var b = Math.round(getNum(first_layer_color.blue(), last_layer_color.blue(), i ) * 255)

    var br = Math.round(getNum(first_border_color.red(), last_border_color.red(), i ) * 255)
    var bg = Math.round(getNum(first_border_color.green(), last_border_color.green(), i ) * 255)
    var bb = Math.round(getNum(first_border_color.blue(), last_border_color.blue(), i ) * 255)
    //var red = Math.round(selectedColor.red() * 255)
    
    // set fill gradient
    var fill = layer.style().fills().firstObject();
    fill.color = MSColor.colorWithRed_green_blue_alpha( r / 255, g / 255, b / 255, 1.0);

    // set border gradient
    var border = layer.style().borders().firstObject();
    border.color = MSColor.colorWithRed_green_blue_alpha( br / 255, bg / 255, bb / 255, 1.0);

    // position
    var x = Math.round(getNum(first_layer_pos_x, last_layer_pos_x, i ))
    var y = Math.round(getNum(first_layer_pos_y, last_layer_pos_y, i ))

    // width & height
    var w = Math.round(getNum(first_layer_w, last_layer_w, i ))
    var h = Math.round(getNum(first_layer_h, last_layer_h, i ))

    //opacity 
    var op = getNum(first_layer_opacity, last_layer_opacity, i )

    // set position and width height
    layer.rect = NSMakeRect(x, y, w, h);
    layer.layers().firstObject().cornerRadiusFloat = Math.round(getNum(first_radius, last_radius, i ))
    layer.style().contextSettings().setOpacity(op)
    log("op" + op)
    //log(Math.round(getColorNum(first_layer_pos, last_layer_pos, i )))
  }
};