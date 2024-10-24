var map;
var marker;
var selectedLatLng;

// Initialize the map
var map = L.map('map').setView([12.97, 77.59], 9);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 20,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var circles = [];
var marker;

function openModal() {
    document.getElementById("myModal").style.display = "flex";
}

function closeModal(event) {
    if (event.target === document.getElementById("myModal") || event.target.id === 'closeModal') {
        document.getElementById("myModal").style.display = "none";
    }
}

// Submit Request and Send to Server
function submitRequest() {
    var locationName = document.getElementById("locationName").value;
    var emergencyType = document.getElementById("emergencyType").value;
    var lat = parseFloat(document.getElementById("latitude").value);
    var lng = parseFloat(document.getElementById("longitude").value);
    var radius = parseFloat(document.getElementById("radius").value);

    // Create an object to store the form details
    var disasterDetails = {
        locationName: locationName,
        emergencyType: emergencyType,
        lat: lat,
        lng: lng,
        radius: radius,
        status: 'pending' //current status
    };

    localStorage.setItem('disasterRequests', JSON.stringify(disasterDetails));

    alert('Disaster details saved successfully!');
}

// Function to automatically populate lat/lng with user's current location
function fetchLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            document.getElementById("latitude").value = latitude;
            document.getElementById("longitude").value = longitude;

            map.setView([latitude, longitude], 13);
            placeMarker([latitude, longitude]);
        }, error => {
            console.error('Error fetching location:', error);
            alert('Unable to retrieve your location.');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

// Function to place a marker on the map
function placeMarker(location) {
    if (marker) {
        marker.remove();
    }
    marker = L.marker(location).addTo(map);
    selectedLatLng = location;
}
function addCircle(lat, lng, radius, color) {
    // Add a new circle to the map with the specified properties
    console.log('changing colors');
    let emergency=JSON.parse(localStorage.getItem('disasterRequests'));
    if(emergency.status=='approved'&&color){
        /*var circle = L.circle([lat, lng], {
            color: color,           // Border color of the circle
            fillColor: color,       // Fill color of the circle
            fillOpacity: 0.5,       // Opacity of the fill
            radius: radius          // Radius of the circle in meters
        }).addTo(map);*/
        let circleDetails={
            color: color,           // Border color of the circle
            fillColor: color,       // Fill color of the circle
            fillOpacity: 0.5,       // Opacity of the fill
            radius: radius ,
            lat:lat,
            lng:lng
        }
        localStorage.setItem('circleDetails',JSON.stringify(circleDetails));
        // Store the circle in an array if you want to keep track of added circles
        //circles.push(circle);
    }
    else{
        console.log('error');
    }
    }
    

