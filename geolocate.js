let street, city, state;

function loadAddress() {
    address = document.getElementById("street").value;
    city = document.getElementById("city").value;
    state = document.getElementById("state").value;
}

function getElevation(latitude,longitude){
        const elevator = new google.maps.ElevationService();
        loc = {lat: latitude, lng: longitude};
        elevator.getElevationForLocations(

            {
                locations: [loc],
            },
            (results,status) =>{
                document.writeln(results[0].elevation);
            }
        )

}

function performQuery(street, city, state) {
    let base = "https://maps.googleapis.com/maps/api/geocode/json?address="
    let url = base + street + "," + city + "," + state + "&key=" + config.token; 
    let lat, lng;
    $.getJSON(url, function(result) {
        lat = result["results"][0]["geometry"]["location"]["lat"]; 
        lng = result["results"][0]["geometry"]["location"]["lng"]; 
        getElevation(lat,lng);
    });
    
}
    

function addressToGeoCoords() {
    loadAddress();
    document.writeln("<h1>Query Result</h1>");
    performQuery(street, city, state); 
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
        
        let latitude = mapsMouseEvent.latLng.lat();
        let longitude = mapsMouseEvent.latLng.lng();

        infoWindow = new google.maps.InfoWindow({
            position: mapsMouseEvent.latLng,  
        });
        infoWindow.setContent(
            JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
        );
        infoWindow.open(map);

        window.location.href="mapResult.html"
    });
}
