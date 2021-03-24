var address, map, infoWindow;
var markers = [];


function clearMarkers() {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}


function loadAddress() {
    address = document.getElementById("street").value;
}

function getElevation(location, func){
    const elevator = new google.maps.ElevationService();
    elevator.getElevationForLocations(
        {
            locations: [location],
        },
        function (results, status) {
            func(results[0].elevation);
        }
    )
}


function createMarker(place) {
    if (!place.geometry || !place.geometry.location) return;
    const marker = new google.maps.Marker({
        map,
        position: place.geometry.location,
    });
    markers.push(marker);
    google.maps.event.addListener(marker, "click", () => {
        presentPrompt(place.geometry.location, place.name);
    });
}


function performQuery(street, map) {
    let name = street; 
    console.log(name);
    let requests= {
       query: name, 
       fields: ["name","geometry"],
    } 
    let service = new google.maps.places.PlacesService(map);
    service.findPlaceFromQuery(requests, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            clearMarkers();

            for (let i = 0; i < results.length; i++) {
                createMarker(results[i]);
            }

            map.setCenter(results[0].geometry.location);
            map.setZoom(8);
            
            presentPrompt(results[0].geometry.location, results[0].name);
        }
    });
}
    

function addressToGeoCoords() {
    loadAddress();
    performQuery(address, map);
}


function initMap() {
    // Place center of map over US
    const US = { lat: 39.6394, lng: -101.2988 }
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: US,
        gestureHandling: "greedy",
    });
    infoWindow = new google.maps.InfoWindow({
        content: "Click anywhere on map to get latitude and longitude",
        position: US,
    });
    infoWindow.open(map);

    map.addListener("click", function(mapsMouseEvent) {
        clearMarkers();
        presentPrompt(mapsMouseEvent.latLng, null);
    });
}


function presentPrompt(location, name) {
    infoWindow.close();

    let latitude = location.lat();
    let longitude = location.lng();

    displayLat = latitude.toPrecision(6);
    displayLng = longitude.toPrecision(6);

    if (name === null) {
        displayString = "You've selected a latitude of " + displayLat + " and a longitude of "  + displayLng + ".";
    }
    else {
        displayString = "You've selected " + name + " at a latitude of " + displayLat + " and a longitude of " + displayLng + ".";
    }

    promptString = "How likely is it that these coordinates will be affected?"

    let displayElement = document.createElement("p");
    displayElement.innerHTML = displayString;
    displayElement.className = "text-center"

    let promptElement = document.createElement("input");
    promptElement.type = "button";
    promptElement.className = "btn btn-primary";
    promptElement.value = promptString;
    promptElement.addEventListener('click', function() {
        loadResultPage(location);
    });

    let contentElement = document.createElement("div");
    contentElement.className = "justify-content-center"
    contentElement.append(displayElement);
    contentElement.append(promptElement)

    map.setCenter(location);

    let zoom = map.getZoom();
    console.log(zoom);

    if (zoom < 8) {
        console.log("Changing zoom")
        map.setZoom(8);
    }

    infoWindow = new google.maps.InfoWindow({
        position: location,
    });
    infoWindow.setContent(
        contentElement
    );
    infoWindow.open(map);
}


function loadResultPage(location) {
    getElevation(location, 
        function(elevation)
        {
            let storage = window.sessionStorage;
            storage.setItem("latitude", location.lat());
            storage.setItem("longitude", location.lng());
            storage.setItem("elevation", elevation);
            window.location.href = "mapResult.html"
        }
    );
}


function fillResultData() {
    storage = window.sessionStorage;
    document.getElementById("loc").innerHTML = storage.getItem("latitude") + ", " + storage.getItem("longitude");
    elev = storage.getItem("elevation");
    document.getElementById("elev").innerHTML = elev;
    if (elev < 5) {
        document.getElementById("chance").innerHTML = "high";
    }
    else {
        document.getElementById("chance").innerHTML = "low"; 
    }
}
