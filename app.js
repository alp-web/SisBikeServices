let map;

// 🚀 INIT GOOGLE MAP (called by callback=initMap)
function initMap() {

  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 9.03, lng: 38.74 }, // default: Addis Ababa
    zoom: 12
  });

 directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
directionsRenderer.setMap(map);

// CLICK ON MAP → SET LOCATION
  map.addListener("click", function (event) {

    const clickedLocation = event.latLng;

    if (selectMode === "pickup") {

      if (pickupMarker) pickupMarker.setMap(null);

      pickupMarker = new google.maps.Marker({
        position: clickedLocation,
        map: map,
        label: "P"
      });

      document.getElementById("pickup").value =
        clickedLocation.lat() + ", " + clickedLocation.lng();

    } else {

      if (dropoffMarker) dropoffMarker.setMap(null);

      dropoffMarker = new google.maps.Marker({
        position: clickedLocation,
        map: map,
        label: "D"
      });

      document.getElementById("dropoff").value =
        clickedLocation.lat() + ", " + clickedLocation.lng();
    }

    // If both exist → draw route
    if (pickupMarker && dropoffMarker) {
      drawRoute();
    }
  });
}

function drawRoute() {

  directionsService.route(
    {
      origin: pickupMarker.getPosition(),
      destination: dropoffMarker.getPosition(),
      travelMode: "DRIVING"
    },
    function (result, status) {

      if (status === "OK") {

        directionsRenderer.setDirections(result);

        const distanceMeters = result.routes[0].legs[0].distance.value;
        const distanceKM = (distanceMeters / 1000).toFixed(1);

        document.getElementById("distance").value = distanceKM;

        console.log("Distance:", distanceKM, "KM");

      } else {
        alert("Route failed: " + status);
      }
    }
  );
}
function setPickupMode() {
  selectMode = "pickup";
  alert("Click map to select PICKUP location");
}

function setDropoffMode() {
  selectMode = "dropoff";
  alert("Click map to select DROPOFF location");
}

// 📍 USE MY LOCATION (FIXED + MOBILE READY)
function useMyLocation() {

  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    function (position) {

      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // Move map
      map.setCenter(userLocation);
      map.setZoom(16);

      // Marker
      new google.maps.Marker({
        position: userLocation,
        map: map,
        title: "Your Location"
      });

      console.log("GPS SUCCESS:", userLocation);

    },
    function (error) {

      console.log("GPS ERROR:", error);

      // Better error messages
      switch (error.code) {
        case 1:
          alert("Location permission denied. Please allow location.");
          break;
        case 2:
          alert("Location unavailable.");
          break;
        case 3:
          alert("Location request timed out.");
          break;
        default:
          alert("Unknown GPS error.");
      }

      // fallback map position
      map.setCenter({ lat: 9.03, lng: 38.74 });
      map.setZoom(12);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}

// Make function available to HTML button
window.useMyLocation = useMyLocation;

let map;
let pickupMarker = null;
let dropoffMarker = null;
let directionsService;
let directionsRenderer;
let selectMode = "pickup"; // default mode


