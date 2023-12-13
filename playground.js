var viewer = OpenSeadragon({
    id: "osd",
    prefixUrl: "/openseadragon/images/",
    showNavigationControl: false,
    defaultZoomLevel:2,
    tileSources: {
        type: 'image',
        url:  './picsum-sample.jpg'
    }
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

function getClientToOverlayCoords(viewer, clientX, clientY, width, height) {
    const imagePoint = new OpenSeadragon.Point(clientX, clientY);
    // const imagePoint = viewer.viewport.viewerElementToImageCoordinates(viewportPoint);

    const viewportRect = new OpenSeadragon.Rect(
        imagePoint.x,
        imagePoint.y,
        width / viewer.viewport.getZoom(true),
        height / viewer.viewport.getZoom(true)
    );

    const overlayRect = viewer.viewport.imageToViewportRectangle(viewportRect);
    console.log(overlayRect)
    return {
        x: overlayRect.x,
        y: overlayRect.y,
        width: overlayRect.width,
        height: overlayRect.height
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
    viewer.removeOverlay("runtime-overlay");
    const overlayCoords = getClientToOverlayCoords(viewer, x, y, 100, 100);
    var elt = document.createElement("div");
    elt.id = "runtime-overlay";
    elt.className = "highlight";
    viewer.addOverlay({
        element: elt,
        location: new OpenSeadragon.Rect(x - height / 2, y + width / 2 + 16, height, width)
    });;

    // Create an image element to display the extracted region
    const imageElement = new Image();
    imageElement.src = extractedCanvas.toDataURL('image/jpeg');

    document.body.appendChild(imageElement);
}