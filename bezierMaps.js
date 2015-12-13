/**
* BezierMaps
* @author Arnaud Gallardo
* version 1.0
*/

function BezierCurve(start, map) {
    this.map = map;
    this.curvePoints = [start[0],start[1],start[0],start[1]+.002];
    this.controlPoints = [start[0]+.001,start[1]+.001,start[0]-.001,start[1]+.001];
    this.curve = null;
    this.circles = []; //0 : start curve, 1 : stop curve, 2 : first control point, 3 : last control point
    this.lines = [];
    this.lineSymbol = {
      path: 'M 0,-1 0,1',
      strokeOpacity: 1,
      scale: 2
    };
    this.precision = 60;
    this.init = function() {
      //First we create the control points lines
      var lines_settings = {
        path: [coordinateParser(this.curvePoints[0],this.curvePoints[1]),
               coordinateParser(this.controlPoints[0],this.controlPoints[1])],
        strokeOpacity: 0,
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
        path: toBezier(this.curvePoints,this.controlPoints,this.precision),
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
      //Now we can create all the circles representing the points
      //Here is the circle model:
      var circle_settings = {
          strokeColor: '#FF0000',
          strokeOpacity: 1,
          strokeWeight: 1,
          fillColor: '#FF0000',
          fillOpacity: 1,
          map: this.map,
          center: coordinateParser(this.curvePoints[0],this.curvePoints[1]),
          draggable: true,
          radius: 5
      };
      this.circles.push(new google.maps.Circle(circle_settings));
      circle_settings.center = coordinateParser(this.curvePoints[2],this.curvePoints[3]);
      this.circles.push(new google.maps.Circle(circle_settings));
      circle_settings.strokeColor = '#000000';
      circle_settings.fillColor = '#000000';
      circle_settings.center = coordinateParser(this.controlPoints[0],this.controlPoints[1]);
      this.circles.push(new google.maps.Circle(circle_settings));
      circle_settings.center = coordinateParser(this.controlPoints[2],this.controlPoints[3]);
      this.circles.push(new google.maps.Circle(circle_settings));
      //Now we create all the listeners for the points
      var beCu = this;
      $.each(this.circles,function(index, el) {
        el.addListener('center_changed', function() {beCu.refreshCurve(beCu)});
      });
      this.showCurve();
    };
    this.showCurve = function() {
      this.curve.setMap(map);
      this.lines[0].setMap(map);
      this.lines[1].setMap(map);
    };
    this.hideCurve = function() {
      this.curve.setMap(null);
      this.lines[0].setMap(null);
      this.lines[1].setMap(null);
    };
    this.refreshCurve = function(beCu) {
      var tmp = [];
      $.each(beCu.circles, function(index, el) {
        tmp.push(el.getCenter().lat());
        tmp.push(el.getCenter().lng());
      });
      beCu.curvePoints = [tmp[0],tmp[1],tmp[2],tmp[3]];
      beCu.controlPoints = [tmp[4],tmp[5],tmp[6],tmp[7]];
      beCu.curve.setPath(toBezier(beCu.curvePoints,beCu.controlPoints,beCu.precision));
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


function test() {
  console.log('rekt');
}
