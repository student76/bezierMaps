/**
* BezierMaps
* @author Arnaud Gallardo
* version 1.0
*/

function BezierCurve(start, map, options) {
    this.options = {
      curveColor : "#FF0000",
      controlColor : "#000000",
      curveSize : 2,
      controlSize : 2,
      resolution : 60,
      locking : false,
      hideControls : false
    };
    if (typeof options !== 'undefined') {
      if (typeof options.curveColor !== 'undefined') { this.options.curveColor = options.curveColor; }
      if (typeof options.controlColor !== 'undefined') { this.options.controlColor = options.controlColor; }
      if (typeof options.curveSize !== 'undefined') { this.options.curveSize = options.curveSize; }
      if (typeof options.controlSize !== 'undefined') { this.options.controlSize = options.controlSize; }
      if (typeof options.resolution !== 'undefined') { this.options.resolution = options.resolution; }
      if (typeof options.locking !== 'undefined') { this.options.locking = options.locking; }
    }
    this.map = map;
    this.curvePoints = [start[0],start[1],start[0],start[1]+.002];
    this.controlPoints = [start[0]+.001,start[1]+.001,start[0]-.001,start[1]+.001];
    this.curve = null;
    this.circles = []; //0 : start curve, 1 : stop curve, 2 : first control point, 3 : last control point
    this.lines = [];
    this.lineSymbol = {
      path: 'M 0,-1 0,1',
      strokeOpacity: 1,
      scale: this.options.controlSize
    };

    this.init = function() {
      //First we create the control points lines
      var lines_settings = {
        path: [coordinateParser(this.curvePoints[0],this.curvePoints[1]),
               coordinateParser(this.controlPoints[0],this.controlPoints[1])],
        strokeOpacity: 0,
        strokeColor: this.options.controlColor,
        icons: [{
          icon: this.lineSymbol,
          offset: '0',
          repeat: '10px'
        }],
        map: map
      };
      this.lines.push(new google.maps.Polyline(lines_settings));
      lines_settings.path = [coordinateParser(this.curvePoints[2],this.curvePoints[3]),
             coordinateParser(this.controlPoints[2],this.controlPoints[3])];
      this.lines.push(new google.maps.Polyline(lines_settings));
      //Now we can create the curve
      this.curve = new google.maps.Polyline({
        path: toBezier(this.curvePoints,this.controlPoints,this.options.resolution),
        geodesic: true,
        strokeColor: this.options.curveColor,
        strokeOpacity: 1.0,
        strokeWeight: this.options.curveSize
      });
      //Now we can create all the circles representing the points
      //Here is the circle model:
      var markers_settings = {
        position: coordinateParser(this.curvePoints[0],this.curvePoints[1]),
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          strokeColor: this.options.curveColor,
          scale: 5
        },
        draggable: !this.options.locking,
        map: this.map
      };
      this.circles.push(new google.maps.Marker(markers_settings));
      markers_settings.draggable = true;
      markers_settings.position = coordinateParser(this.curvePoints[2],this.curvePoints[3]);
      this.circles.push(new google.maps.Marker(markers_settings));
      markers_settings.icon.strokeColor = this.options.controlColor;
      markers_settings.position = coordinateParser(this.controlPoints[0],this.controlPoints[1]);
      this.circles.push(new google.maps.Marker(markers_settings));
      markers_settings.position = coordinateParser(this.controlPoints[2],this.controlPoints[3]);
      this.circles.push(new google.maps.Marker(markers_settings));
      //Now we create all the listeners for the points
      var beCu = this;
      $.each(this.circles,function(index, el) {
        el.addListener('position_changed', function() {beCu.refreshCurve(beCu)});
      });
      this.showAll();
    };
    this.showAll = function() {
      this.curve.setMap(this.map);
      this.lines[0].setMap(this.map);
      this.lines[1].setMap(this.map);
      this.circles[2].setMap(this.map);
      this.circles[3].setMap(this.map);
    };
    this.hideControls = function() {
      //this.curve.setMap(null);
      this.lines[0].setMap(null);
      this.lines[1].setMap(null);
      this.circles[2].setMap(null);
      this.circles[3].setMap(null);
    };
    this.refreshCurve = function(beCu) {
      var tmp = [];
      $.each(beCu.circles, function(index, el) {
        tmp.push(el.getPosition().lat());
        tmp.push(el.getPosition().lng());
      });
      beCu.curvePoints = [tmp[0],tmp[1],tmp[2],tmp[3]];
      beCu.controlPoints = [tmp[4],tmp[5],tmp[6],tmp[7]];
      beCu.curve.setPath(toBezier(beCu.curvePoints,beCu.controlPoints,beCu.options.resolution));
      beCu.lines[0].setPath([coordinateParser(tmp[0],tmp[1]), coordinateParser(tmp[4],tmp[5])]);
      beCu.lines[1].setPath([coordinateParser(tmp[2],tmp[3]), coordinateParser(tmp[6],tmp[7])]);
    };
}

function coordinateParser(lat,lng) {
  return {lat:lat,lng:lng};
}

function toBezier(points,controls,precision) {
  var b = bezier(points[0],points[1],controls[0],controls[1],controls[2],controls[3],points[2],points[3]);
  b.curve(precision);
  var c = b.getCurve();
  var result = [];
  $.each(c, function( index, value ) {
    result.push(coordinateParser(value[0],value[1]));
  });
  return result;
};
