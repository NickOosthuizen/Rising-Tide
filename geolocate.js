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
    if (!place.geometry || !place.geometry.location) {
        console.log("Invalid Location for marker")
        return;
    }
    const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
    };
    const marker = new google.maps.Marker({
        map,
        icon,
        title: place.name,
        position: place.geometry.location,
    });
    markers.push(marker);
    google.maps.event.addListener(marker, "click", () => {
        presentPrompt(place.geometry.location, place.name);
    });
}
function drawWater(level){
    var canvas = document.getElementById("water");
    var ctx = canvas.getContext("2d");
    var pos =0;
    var width = 50;
    var pos2 =width*4;

    var y = canvas.height;
   var id = setInterval(rise,level*15);
   setInterval(waves,level*15);
    var deepblue="#0f6afc"; 
    var blue="#479dff"; 
    var space="#FFFFFF"; 
    function waves(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        threeWaves(ctx,pos2,y-10,width,space,deepblue);

        threeWaves(ctx,pos,y,width,deepblue,blue);
        ctx.fillStyle = blue;
        pos++;
        pos2-=.7;
        if(pos2 <= 0)
            pos2 = width*4 ;
        if(pos == width*4)
            pos=0;
    }
 
    function rise(){
        waves();
        y--;
        if(y < level*50){
            clearInterval(id);
            console.log(id);
        }   
    }

    
}

function threeWaves(ctx,pos,y,width,space,color){
        ctx.fillStyle = color;

        ctx.fillRect(0,y,1000,100);
        singleWave(ctx,pos-width*4,y,width,space ,color );
        singleWave(ctx,pos,y,width,space ,color );
        singleWave(ctx,pos+width*4,y,width,space,color  );

}

function singleWave(ctx,start,posH,width,space,color){
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.ellipse(start, posH+1, width-1, 15, 0, 0, Math.PI,true);
    ctx.fill();
    ctx.fillStyle = space;
    ctx.beginPath();
    ctx.ellipse(start+width*2, posH, width, 10, 0, 0, Math.PI,false);
    ctx.fill();


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
        content: "Click anywhere on the map to get a location or use the search bar at the top",
        position: US,
    });

    const input = document.getElementById("search-input");
    const searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

    map.addListener("bounds_changed", function() {
        searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener("places_changed", function() {
        const places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        clearMarkers();

        const bouunds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry || !place.geometry.location) {
                console.log("Invalid location returned");
                return;
            }
            createMarker(place);
            if (place.geometry.viewport) {
                bouunds.union(place.geometry.viewport);
            }
            else {
                bouunds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
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

    displayLat = Math.round(latitude.toPrecision(6)*100)/100;
    displayLng = Math.round(longitude.toPrecision(6)*100)/100;

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
    document.getElementById("loc").innerHTML = Math.round(storage.getItem("latitude")*100)/100 + ", " + Math.round(storage.getItem("longitude")*100)/100;
    elev = Math.round(storage.getItem("elevation")*10)/10;
    document.getElementById("elev").innerHTML = elev;
    if(elev <.5){
        document.getElementById("chance").innerHTML = "Extremely High ";
        document.getElementById("message").innerHTML= "If carbon dioxide emissions stay constant your house will be flooded by 2050 and even earlier if emissions increase."
        drawWater(.5);
 
    }
    else if(elev <1){
        document.getElementById("chance").innerHTML = "High";
        document.getElementById("message").innerHTML= "If emissions stay the same your house will be flooded by 2100 and if emissions increase it will be flooded by 2050.";
        drawWater(.7);
 
    }
    else if(elev <1.5){
        document.getElementById("chance").innerHTML = "Medium High";
        document.getElementById("message").innerHTML= "If emissions stay constant your house will not flood by 2100 but if they increase it will flood by 2100.";
        drawWater(.9);
 
    }
    else if (elev < 2) {
        document.getElementById("chance").innerHTML = "Meduim";
        document.getElementById("message").innerHTML= "If emissions don't increase moderately your house will not be flooded by 2100. ";
        drawWater(1);
    }
    else if (elev < 2.5) {
        document.getElementById("chance").innerHTML = "Meduim Low";
        document.getElementById("message").innerHTML= "If emissions don't increase drastically your house is safe until at least 2100.";
        drawWater(1.5);
    }
    else if (elev < 10) {
        document.getElementById("chance").innerHTML = "low";
        document.getElementById("message").innerHTML= "Your house is unlikely to flood by 2100 but in the worst case scenario could still flood in the future.";
        drawWater(2);
    }
    else {
        document.getElementById("chance").innerHTML = "very low"; 
        document.getElementById("message").innerHTML= "Your house is not predicted to flood but this is still a dire issue that will cost billions in damage.";

        drawWater(2.2);
    }
}
