# bezierMaps

Create editable bezier curves on a Google Map.

## How to use it

Add those files in your html page:
```html
<script src="jquery-1.11.3.min.js"></script>
<script src="bezier.js"></script>
<script src="bezierMaps.js"></script>
```

And add some javascript:
```javascript
var map;
var curve;

function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 18,
    center: {lat: -18.142, lng: 178.432},
    mapTypeId: google.maps.MapTypeId.TERRAIN
  });

  //Default options
  var options = {
    curveColor : "#FF0000",
    controlColor : "#000000",
    curveSize : 2,
    controlSize : 2,
    resolution : 60, //Number of lines creating the curve
    locking : false  //Lock the first point of the curve position
  };

  // new BezierCurve(startingPointCoordinates,map)
  curve = new BezierCurve([-18.142,178.431],map, options);
  curve.init();


  curve.hideControls(); //Hide the controls lines and markers
  curve.showAll(); //Show all the lines and markers
};
```

## Todo

  - ~~Allow custom settings:~~
    * ~~Colors~~
    * ~~Sizes~~
    * ~~Lock the starting point~~
    * ~~Curve resolution~~
  - Allow more control points
  - curve.getCurvePoints();
  - Link the default size with the current map zooming value
  - Change the two $.each() jquery function to some pure javascript functions to avoid the user jquery at all
