function layoutFrames (frames, containerWidth, maxRowHeight, spacing) {
  var layout = [],
    currRow,
    maxAspectRatio = containerWidth / maxRowHeight;
  while (frames.length) {
    currRow = [frames.shift()];
    // Keep adding frames into row until the aspect ratio is greater than the max row size
    // NB: This is a bit ineffecient because it recalculates the AR each time 
    while (frames.length && getAspectRatio(currRow) < maxAspectRatio) {
      currRow.push(frames.shift());
    }
    layout.push(
      // Size the row and add it to the layout
      sizeFramesToRow(currRow, containerWidth, maxRowHeight, spacing)
    );
  }
  return layout;
}

function getAspectRatio(row) {
  var currRatio = 0;
  for (var i = 0; i < row.length; i++) {
    var rowWidth = row[i].width;
    var rowHeight = row[i].height;
    currRatio += rowWidth / rowHeight;
  };
  return currRatio;
}

function sizeFramesToRow(row, containerWidth, maxRowHeight, spacing) {
  // To size we beed to find the height of our row rectangle 
  // when the width fills the container
  var rowRatio = getAspectRatio(row);
  var rowHeight;
  // Adjust the width to account for spacing on rows with images
  var widthWithSpacing = containerWidth - (row.length - 1) * spacing;

  // If the rectangle is longer than the row set it by maxing out the width
  if (getAspectRatio(row) >= widthWithSpacing / maxRowHeight) {
    rowHeight = widthWithSpacing / rowRatio;
  // Otherwise set it to the max height
  } else {
    rowHeight = maxRowHeight;
  }

  // Go through each image in the row and size it to match the correct height
  for (var i = 0; i < row.length; i++) {
    row[i].width = parseInt(row[i].width * (rowHeight / row[i].height));
    row[i].height = parseInt(rowHeight);
  }
  return row;
}

var container = document.getElementById('container');

var frames =
    [{ height: 360, width: 1000 },
     { height: 600, width: 400 },
     { height: 400, width: 600 },
     { height: 400, width: 600 },
     { height: 200, width: 100 },
     { height: 200, width: 1000 },
     { height: 200, width: 1000 },
     { height: 400, width: 300 },
     { height: 400, width: 200 }];


var layedOutFrames = layoutFrames(frames, 800, 360, 10);

// Gather all elements in a document fragment
var frag = document.createDocumentFragment();

for (var i = 0; i < layedOutFrames.length; i++) {
  var newRow = document.createElement('div')
  newRow.className = 'row';
  for (var j = 0; j < layedOutFrames[i].length; j++) {
    var newImage = document.createElement('div')
    newImage.className = 'tiled-image';
    newImage.style.backgroundImage = 'url(' + 'http://placekitten.com/' + layedOutFrames[i][j].width + '/' + layedOutFrames[i][j].height + ')';
    newImage.style.width = layedOutFrames[i][j].width + 'px';
    newImage.style.height = layedOutFrames[i][j].height + 'px';
    if (j > 0) {newImage.style.marginLeft = 10 + 'px';}
    var imageCaption = document.createElement('div');
    imageCaption.className = 'caption';
    imageCaption.textContent = 'Test Gallery Image';
    newImage.appendChild(imageCaption);
    newRow.appendChild(newImage);;
  };
  frag.appendChild(newRow);
};
// TODO: make dynamic
container.style.width = 800 + 'px';
container.appendChild(frag);
