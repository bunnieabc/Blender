var selectedLayers = context.selection;
var doc = context.document;

result = [doc askForUserInput:"How many steps would you like to put?" initialValue:"12"];

var copied_layer_w = selectedLayers[1].rect().size.width
var copied_layer_h = selectedLayers[1].rect().size.height
var copied_layer_x = selectedLayers[1].rect().origin.x
var copied_layer_y = selectedLayers[1].rect().origin.y

var radius = selectedLayers[0].rect().size.width / 2
log("radius: " + radius)
var center_pos_x = selectedLayers[0].rect().origin.x + radius
var center_pos_y = selectedLayers[0].rect().origin.y + radius

var center_pos_x2 = selectedLayers[1].rect().origin.x + radius
log("center_pos_x" + center_pos_x)
log("center_pos_x2" + center_pos_x2)

var dis = center_pos_y - copied_layer_y - copied_layer_h
//var radius_all = radius + copied_layer_h / 2 + 


var copied_layers = new Array(parseInt(result))
var result_num = parseInt(result)
var layer_rec = selectedLayers[1]
copied_layers[0] = selectedLayers[1]

for(var i = 1; i < result_num ; i++){
  var new_layer = layer_rec.duplicate()
      new_layer.select_byExpandingSelection(true, true);
      new_layer.setName(i.toString())
      copied_layers[i] = new_layer
      layer_rec = new_layer
}

for(var i = 0; i < result_num; i++){
  //log("test")
  w = copied_layers[i].rect().size.width
  //h = Math.random() * copied_layer_h * (1.2);
  h = copied_layers[i].rect().size.height;
  x = Math.cos(((Math.PI * 2)/result_num) * i) * (dis + h / 2)  + center_pos_x - copied_layer_w / 2
  y = Math.sin(((Math.PI * 2)/result_num) * i) * (dis + h / 2) + center_pos_y - h / 2
  log( x + " , " + y)
  copied_layers[i].rect = NSMakeRect(x, y, w, h);
  copied_layers[i].setRotation(90 - (360 / result_num) * i)
}