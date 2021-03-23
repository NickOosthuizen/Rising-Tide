let street, city, state,map;

function loadAddress() {
    street= document.getElementById("street").value;
    city = document.getElementById("city").value;
    state = document.getElementById("state").value;
}

function getElevation(location){
        const elevator = new google.maps.ElevationService();
        document.writeln("Elevation");
        elevator.getElevationForLocations(
            {
                locations: [location],
            },
            (results,status) =>{
                document.writeln(results[0].elevation);
            }
        )

}

function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;
  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });
  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(place.name || "");
    infowindow.open(map);
  });
}


function performQuery(street, city, state,map) {
    let name =street+" "+city+", "+state; 
    console.log(name);
   let requests= {
       query: name, 
       fields: ["name","geometry"],
   } 
   let service = new google.maps.places.PlacesService(map);
   service.findPlaceFromQuery(requests,(results,status) =>{
         if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      for (let i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
      map.setCenter(results[0].geometry.location);
    }
   });
}
    

function addressToGeoCoords() {
    loadAddress();
    performQuery(street, city, state,map); 
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function initMap() {
    // Place center of map over US
    const US = { lat: 39.6394, lng: -101.2988 }
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: US,
    });
    let infoWindow = new google.maps.InfoWindow({
        content: "Click anywhere on map to get latitude and longitude",
        position: US,
    });
    infoWindow.open(map);

    
    map.addListener("click", function(mapsMouseEvent) {
        infoWindow.close();
        let location = mapsMouseEvent.latLng;
        let latitude = mapsMouseEvent.latLng.lat();
        let longitude = mapsMouseEvent.latLng.lng();

        let displayLat = latitude.toPrecision(6);
        let displayLng = longitude.toPrecision(6);

        displayString = "You've selected a latitude of " + displayLat + " and a longitude of "  + displayLng + ".";
        promptString = "How likely is it that these coordinates will be affected?"

        let displayElement = document.createElement("p");
        displayElement.innerHTML = displayString;

        let promptElement = document.createElement("input");
        promptElement.type = "button";
        promptElement.value = promptString;
        promptElement.addEventListener('click', function() {
            loadResultPage(location);
        });

        let contentElement = document.createElement("div");
        contentElement.append(displayElement);
        contentElement.append(promptElement)

        infoWindow = new google.maps.InfoWindow({
            position: mapsMouseEvent.latLng,  
        });
        infoWindow.setContent(
             contentElement
        );
        infoWindow.open(map);
    });
}


function loadResultPage(location) {
    window.location.href="mapResult.html"
    getElevation(location);
}
