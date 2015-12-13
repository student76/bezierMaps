# bezierMaps

Made for Teo, because I can't sleep.

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
  // new BezierCurve(startingPointCoordinates,map)
  curve = new BezierCurve([-18.142,178.431],map);
  curve.init();


  curve.hideCurve(); //Hide all the lines
  curve.showCurve(); //Show all the lines
};
```

## Todo

  - Allow custom settings:
    * Colors
    * Sizes
    * Lock the starting point
    * Curve resolution
  - Link the default size with the current map zooming value
  - Change the two $.each() jquery function to some pure javascript functions to avoid the user jquery at all
