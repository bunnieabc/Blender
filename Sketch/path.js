
var simplifyShapePathLayer_withThreshold = function(shapeLayer, threshold) {
    
    if (!shapeLayer) return

    var paths;
    if(shapeLayer.class() == MSShapeGroup) {
        log("test")
        paths = shapeLayer.layers().array()

    } else if(shapeLayer.class() == MSShapePathLayer) {
        log("test2")
        paths = NSArray.arrayWithObject(shapeLayer)
    } else {
        return
    }
    
    var loopPaths = paths.objectEnumerator(), shapePathLayer;
    while (shapePathLayer = loopPaths.nextObject()) {
        var threshold = (typeof threshold === 'undefined' || threshold == nil) ? 1.2 : threshold,
            shapeFrame = shapePathLayer.frame(),
            shapeWidth = shapeFrame.width(),
            shapeHeight = shapeFrame.height(),
            shapePath = shapePathLayer.path(),
            prevPoint = shapePath.firstPoint(),
            point = prevPoint.point(),
            prevCGPoint = CGPointMake(point.x*shapeWidth, point.y*shapeHeight),
            newPoints = [],
            count = shapePath.numberOfPoints(),
            excludePrev = false,
            i, currPoint, currCGPoint;

        for(i = 1; i < count; ++i) {
            currPoint = shapePath.pointAtIndex(i)
            point = currPoint.point()
            currCGPoint = CGPointMake(point.x*shapeWidth, point.y*shapeHeight)

            if(Math.abs(prevCGPoint.x-currCGPoint.x) <= threshold && Math.abs(prevCGPoint.y-currCGPoint.y) <= threshold) {
                if(!excludePrev) {
                    newPoints.push(prevPoint)
                    excludePrev = true
                }
            } else {
                newPoints.push(prevPoint)
                if(excludePrev) excludePrev = false
            }

            prevPoint = currPoint
            prevCGPoint = currCGPoint
        }

        newPoints.push(shapePath.lastPoint())

        var newShapePath = MSShapePath.pathWithPoints(newPoints)
        newShapePath.setIsClosed(true)
        shapePathLayer.path = newShapePath
    }
}

// Example Usage:
// Select a Shape Layer before running this
var selection = context.selection,
    layer = selection.firstObject()
simplifyShapePathLayer_withThreshold(layer)