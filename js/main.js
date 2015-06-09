// Sample collection of image sizes
var images =
    [{ height: 360, width: 1000 },
     { height: 600, width: 200 },
     { height: 400, width: 600 },
     { height: 400, width: 600 },
     { height: 200, width: 100 },
     { height: 200, width: 1000 },
     { height: 200, width: 1000 },
     { height: 400, width: 300 },
     { height: 400, width: 200 }];

// UI Render function
/**
 * @param {Array<Object>} array of frame objects with height/width properties
 * @param {number} width of the containing element, in pixels
 * @param {number} maximum height of each row of images, in pixels
 * @param {number} spacing between images in a row, in pixels
 * @returns {Object} HTML element of container
 */
function render (images, containerWidth, maxHeight, spacing) {

  var container = document.getElementById('container');
  container.style.width = containerWidth + 'px';

  var layedOutFrames = layoutFrames(images, containerWidth, maxHeight, spacing);

  // Gather all elements in a document fragment
  var frag = document.createDocumentFragment();

  // Create each photo row
  for (var i = 0; i < layedOutFrames.length; i++) {
    var newRow = document.createElement('div');
    newRow.className = 'row';

    // Create each photo image
    for (var j = 0; j < layedOutFrames[i].length; j++) {

      // Create and style image element
      var newImage = document.createElement('div');
      newImage.className = 'tiled-image';
      newImage.style.backgroundImage = 'url(' + 'http://placekitten.com/'
        + parseInt(layedOutFrames[i][j].width) + '/'
        + parseInt(layedOutFrames[i][j].height) + ')';
      newImage.setAttribute('aria-label', 'I\'m a cat - meow!');
      newImage.style.width = layedOutFrames[i][j].width + 'px';
      newImage.style.height = layedOutFrames[i][j].height + 'px';
      if (j > 0) {newImage.style.marginLeft = spacing + 'px';}

      // Create and style image caption
      var imageCaption = document.createElement('div');
      imageCaption.className = 'caption';
      imageCaption.textContent = 'Meow!';

      newImage.appendChild(imageCaption);
      newRow.appendChild(newImage);
    };
    frag.appendChild(newRow);
  };

  return container.appendChild(frag);
}

// Calculates rows of images to fit gallery specs
/**
 * @param {Array<Object>} array of frame objects with height/width properties
 * @param {number} width of the containing element, in pixels
 * @param {number} maximum height of each row of images, in pixels
 * @param {number} spacing between images in a row, in pixels
 * @returns {Array<Array<Object>>} array of rows of resized frames
 */
function layoutFrames (images, containerWidth, maxRowHeight, spacing) {
  var layout = [],
    currRow,
    maxAspectRatio = containerWidth / maxRowHeight;
  while (images.length) {
    currRow = [images.shift()];
    // Keep adding images into row until the aspect ratio is greater than the max row size
    // NB: This is a bit ineffecient because it recalculates the AR each time 
    while (images.length && getAspectRatio(currRow) < maxAspectRatio) {
      currRow.push(images.shift());
    }
    layout.push(
      // Size the row and add it to the layout
      sizeFramesToRow(currRow, containerWidth, maxRowHeight, spacing)
    );
  }
  return layout;
}

/**
 * @param {Array<Object>} array of frame objects with height/width properties
 * @returns {float} aspect ratio of row
 */
function getAspectRatio(row) {
  var currRatio = 0;
  for (var i = 0; i < row.length; i++) {
    var rowWidth = row[i].width;
    var rowHeight = row[i].height;
    currRatio += rowWidth / rowHeight;
  };
  return currRatio;
}

// Sizes a single row of frames
/**
 * @param {Array<Object>} array of frame objects with height/width properties
 * @param {number} width of the containing element, in pixels
 * @param {number} maximum height of each row of images, in pixels
 * @param {number} spacing between images in a row, in pixels
 * @returns {Array<Object>} array of resized frames
 */

function sizeFramesToRow(row, containerWidth, maxRowHeight, spacing) {
  // To size we beed to find the height of our row rectangle 
  // when the width fills the container
  var rowRatio = getAspectRatio(row);
  var rowHeight;
  // Track row width as we go to correct for rounding issues
  // Adjust the width to account for spacing on rows with images
  var widthWithSpacing = containerWidth - (row.length - 1) * spacing;

  // If the rectangle is longer than the row set it by maxing out the width
  if (getAspectRatio(row) >= widthWithSpacing / maxRowHeight) {
    rowHeight = widthWithSpacing / rowRatio;
  // Otherwise set it to the max height
  } else {
    rowHeight = maxRowHeight;
  }

  // Iterate through each image in the row and size it to match the correct height
  for (var i = 0; i < row.length; i++) {
    // Track spacing in current width
    var newWidth = row[i].width * (rowHeight / row[i].height);
    // Update elements and width tracking var
    row[i].width = newWidth;
    row[i].height = rowHeight;
  }
  return row;
}

render(images, 800, 360, 10);