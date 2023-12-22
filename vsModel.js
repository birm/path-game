var viewer = OpenSeadragon({
    id: "osd",
    prefixUrl: "/openseadragon/images/",
    showNavigationControl: false,
    defaultZoomLevel:2,
    tileSources: "./slides/LuadCPTAC.dzi",
});

viewer.addHandler('canvas-double-click', function (e) {
    // Handle the double-click event
    console.log(e.position.x);
    getImageRegion(viewer, e.position.x, e.position.y, 400, 400)
})

function createOverlayElement(x, y, height, width, text) {
    const overlayElement = document.createElement('div');
    overlayElement.style.position = 'absolute';
    overlayElement.style.left = `${x - width / 2}px`;
    overlayElement.style.top = `${y + height / 2 + 16}px`;
    overlayElement.style.fontSize = '14px';
    overlayElement.textContent = text;
    return overlayElement;
}

function getPixelToViewportCoords(viewer, x, y, width, height) {
    const topLeft = viewer.viewport.pointFromPixel(new OpenSeadragon.Point(x - (width/2), y - (height/2)));
    const bottomRight = viewer.viewport.pointFromPixel(new OpenSeadragon.Point(x + (width/2), y + (height/2)));

    const viewportX = topLeft.x;
    const viewportY = topLeft.y;
    const viewportWidth = bottomRight.x - topLeft.x;
    const viewportHeight = bottomRight.y - topLeft.y;

    return {
        x: viewportX,
        y: viewportY,
        width: viewportWidth,
        height: viewportHeight
    };
}

function getImageRegion(viewer, x, y, width, height) {
    context = viewer.drawer.canvas.getContext("2d")
    // Get the pixel data for the specified region
    const imageData = context.getImageData(x - width/2, y - height/2, width, height); 

    // Create a new canvas to draw the extracted region
    const extractedCanvas = document.createElement('canvas');
    const extractedContext = extractedCanvas.getContext('2d');
    extractedCanvas.width = imageData.width;
    extractedCanvas.height = imageData.height;

    // Draw the extracted region onto the new canvas
    extractedContext.putImageData(imageData, 0, 0);

    // draw overlay on osd
    let viewportCoords = getPixelToViewportCoords(viewer, x, y, width, height)
    viewer.removeOverlay("runtime-overlay");
    var overlayBox = new OpenSeadragon.Rect(viewportCoords.x, viewportCoords.y, viewportCoords.width, viewportCoords.height)
    console.log(overlayBox)
    var elt = document.createElement("div");
    elt.id = "runtime-overlay";
    elt.className = "highlight";
    let label = document.createElement("p")
    label.innerText = "Long Text for LABEL | 75% Confidence"
    label.classList.add('overlay-label')
    elt.appendChild(label)
    viewer.addOverlay({
        element: elt,
        location: overlayBox
    });;

    // Create an image element to display the extracted region
    const imageElement = new Image();
    imageElement.src = extractedCanvas.toDataURL('image/jpeg');

    document.body.appendChild(imageElement);
}


var myModal = new bootstrap.Modal(document.getElementById('modelModal'), {})
myModal.show()