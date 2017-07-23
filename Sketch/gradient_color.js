
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
  var first_layer_pos_x = selectedLayers[0].rect().origin.x
  var last_layer_pos_x = selectedLayers[selectedCount-1].rect().origin.x
  var first_layer_pos_y = selectedLayers[0].rect().origin.y
  var last_layer_pos_y = selectedLayers[selectedCount-1].rect().origin.y

  log("test" + first_layer_pos_x + " " + last_layer_pos_x)
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
    //var red = Math.round(selectedColor.red() * 255)
    var fill = layer.style().fills().firstObject();
    fill.color = MSColor.colorWithRed_green_blue_alpha( r / 255, g / 255, b / 255, 1.0);

    // position
    var rect = layer.rect()
    var x = Math.round(getNum(first_layer_pos_x, last_layer_pos_x, i ))
    var y = Math.round(getNum(first_layer_pos_y, last_layer_pos_y, i ))
    layer.rect = NSMakeRect(x, y, rect.size.width, rect.size.height);
    //log(Math.round(getColorNum(first_layer_pos, last_layer_pos, i )))
  }
};