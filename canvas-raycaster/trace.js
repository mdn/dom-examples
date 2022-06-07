var MAX_LINES = 12;
var begin = '<ul><li>';
var middle = '</li><li>';
var end = '</li></ul>';

function trace(msg) {
  var output_window = document.getElementById("trace");
  var lines = output_window.innerHTML.toLowerCase();
  var lineList;

  if (lines.length > 0) {
    lineList = lines.substring(begin.length, lines.length - end.length).split(middle);
    while (lineList.length >= MAX_LINES) { lineList.shift(); }
    lineList.push(msg);
  }
  else {
    lineList = [ msg ];
  }

  output_window.innerHTML = begin +lineList.join(middle) +end;
}