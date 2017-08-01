
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

var getNum = function(num1, num2, index, count) {
  var num = ((num2 - num1) / (count-1)) * index  + num1
  return num
}

////// Normal Text Info
// var app = [NSApplication sharedApplication];
// [app displayDialog:"This is an alert box!" withTitle:"Alert Box Title"];
var doc = context.document;

// alert.addAccessoryView(view);

var result = new Array(selectedCount-1)
var doc = context.document;
//var result = [doc askForUserInput:"How many copies do you want?" initialValue:"10"];
for(var i = 0; i< selectedCount-1; i++){
  result[i] = [doc askForUserInput:"For the"+ (i+1) +"blend" initialValue:"5"];
}
// for(var t = 0; t < selectedCount ; t++){
//   result[t] = NSTextField.alloc().initWithFrame(NSMakeRect(0, t * 40 + 75, 130, 20));
//   view.addSubview(result[t]);
//   result[t].setStringValue('5'); // default value
//   log("????")
// }

// // Show the dialog
// return [alert]

//var result = [doc askForUserInput:"How many layers between them?" initialValue:"5"];

if (selectedCount == 0) {
  log('No layers are selected.');
} else {
  log('Selected layers:');

  var selected_layer_color = new Array(selectedCount)
  var selected_border_color = new Array(selectedCount)
  var selected_layer_pos_x = new Array(selectedCount)
  var selected_layer_pos_y = new Array(selectedCount)
  var selected_layer_w = new Array(selectedCount)
  var selected_layer_h = new Array(selectedCount)
  var selected_radius = new Array(selectedCount)
  var selected_layer_opacity = new Array(selectedCount)
  var copied_layers = new Array(selectedCount-1);
  for(var id = 0; id < selectedCount; id++){
    

    // init array
    selected_layer_color[id] = getColor("fill", selectedLayers[id])
    selected_border_color[id] = getColor("border", selectedLayers[id])
    selected_layer_pos_x[id] = selectedLayers[id].rect().origin.x
    selected_layer_pos_y[id] = selectedLayers[id].rect().origin.y
    selected_layer_w[id] = selectedLayers[id].rect().size.width
    selected_layer_h[id] = selectedLayers[id].rect().size.height
    selected_layer_opacity[id] = selectedLayers[id].style().contextSettings().opacity()
    //console.log("shape"+selectedLayers[0].layers().firstObject().shape())
    var shape = selectedLayers[id].layers().firstObject();
    if(shape && shape.isKindOfClass(MSRectangleShape)){
      selected_radius[id] = selectedLayers[id].layers().firstObject().cornerRadiusFloat();
      log("yes"+selected_radius)
    }

    
    //var last_layer_opacity = selectedLayers[selectedCount-1].style().contextSettings().opacity()
  }

  // duplicate layers
  for(var id = 0; id < selectedCount-1; id++){
    //log("test" + first_layer_pos_x + " " + last_layer_pos_x)
    copied_layers[id] = []
    copied_layers[id].push(selectedLayers[id])
    copied_layers[id].push(selectedLayers[id+1])
    var layer_rec = selectedLayers[id]

    for (var k = 0; k < parseInt(result[id]) ; k++) {
      //var layer = selectedLayers[0].duplicate();
      var new_layer = layer_rec.duplicate()
      new_layer.select_byExpandingSelection(true, true);
      new_layer.setName(k.toString())
      copied_layers[id].splice(k+1, 0, new_layer )
      layer_rec = new_layer
    }
  }

  for(var id = 0; id < selectedCount-1; id++){
    // change their styles
    //selectedCount = copied_layers.length;
    for (var i = 0; i < parseInt(result[id])+2; i++) {
      var layer = copied_layers[id][i];

      // color
      var r, g, b;

      var r = Math.round(getNum(selected_layer_color[id].red(), selected_layer_color[id+1].red(), i, parseInt(result[id])+2 ) * 255)
      //log(selected_layer_color[id].red()*255+", "+selected_layer_color[id+1].red()*255)
      var g = Math.round(getNum(selected_layer_color[id].green(), selected_layer_color[id+1].green(), i, parseInt(result[id])+2 ) * 255)
      var b = Math.round(getNum(selected_layer_color[id].blue(), selected_layer_color[id+1].blue(), i, parseInt(result[id])+2 ) * 255)

      var br = Math.round(getNum(selected_border_color[id].red(), selected_border_color[id+1].red(), i, parseInt(result[id])+2 ) * 255)
      var bg = Math.round(getNum(selected_border_color[id].green(), selected_border_color[id+1].green(), i, parseInt(result[id])+2 ) * 255)
      var bb = Math.round(getNum(selected_border_color[id].blue(), selected_border_color[id+1].blue(), i, parseInt(result[id])+2 ) * 255)
      //var red = Math.round(selectedColor.red() * 255)
      
      // set fill gradient
      var fill = layer.style().fills().firstObject();
      fill.color = MSColor.colorWithRed_green_blue_alpha( r / 255, g / 255, b / 255, 1.0);

      // set border gradient
      var border = layer.style().borders().firstObject();
      border.color = MSColor.colorWithRed_green_blue_alpha( br / 255, bg / 255, bb / 255, 1.0);

      // position
      var x = Math.round(getNum(selected_layer_pos_x[id], selected_layer_pos_x[id+1], i, parseInt(result[id])+2 ))
      var y = Math.round(getNum(selected_layer_pos_y[id], selected_layer_pos_y[id+1], i, parseInt(result[id])+2 ))

      // width & height
      var w = Math.round(getNum(selected_layer_w[id], selected_layer_w[id+1], i, parseInt(result[id])+2 ))
      var h = Math.round(getNum(selected_layer_h[id], selected_layer_h[id+1], i, parseInt(result[id])+2 ))

      //opacity 
      var op = getNum(selected_layer_opacity[id], selected_layer_opacity[id+1], i, parseInt(result[id])+2 )

      // set position and width height
      layer.rect = NSMakeRect(x, y, w, h);
      layer.style().contextSettings().setOpacity(op)
      var shape = selectedLayers[id].layers().firstObject();
      if(shape && shape.isKindOfClass(MSRectangleShape)){
        layer.layers().firstObject().cornerRadiusFloat = Math.round(getNum(parseInt(selected_radius[id]), parseInt(selected_radius[id+1]), i, parseInt(result[id])+2 ))
        log(selected_radius[id])
      }
      //log("op" + op)
      //log(Math.round(getColorNum(first_layer_pos, last_layer_pos, i )))
    }
  }

};
