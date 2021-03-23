var street, city, state;

function loadAddress() {
    address = document.getElementById("street").value;
    city = document.getElementById("city").value;
    state = document.getElementById("state").value;
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


function performQuery(street, city, state) {
    let urlBase = "https://maps.googleapis.com/maps/api/geocode/json?address="
    var url = urlBase + street + "," + city+ "," + state + "&key=" + config.token; 
    let lat, lng;
    $.getJSON(url, function(result) {
        lat = result["results"][0]["geometry"]["location"]["lat"]; 
        lng = result["results"][0]["geometry"]["location"]["lng"]; 
    });
    
}
    

function addressToGeoCoords() {
    loadAddress();
    document.writeln("<h1>Query Result</h1>");
    performQuery(street, city, state); 
}


function initMap() {
    // Place center of map over US
    const US = { lat: 39.6394, lng: -101.2988 }
    const map = new google.maps.Map(document.getElementById("map"), {
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

        displayLat = latitude.toPrecision(6);
        displayLng = longitude.toPrecision(6);

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
    console.log(elev);
    document.getElementById("elev").innerHTML = elev;
    if (elev < 5) {
        document.getElementById("chance").innerHTML = "high";
    }
    else {
        document.getElementById("chance").innerHTML = "low"; 
    }
}