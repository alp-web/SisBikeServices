let map;

// 🚀 INIT GOOGLE MAP (called by callback=initMap)
function initMap() {

  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 9.03, lng: 38.74 }, // default: Addis Ababa
    zoom: 12
  });
}

// 📍 USE MY LOCATION (FIXED + MOBILE READY)
function useMyLocation() {

  if (!navigator.geolocation) {
    alert("Geolocation not supported on this device/browser");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    function (position) {

      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // Move map to user
      map.setCenter(userLocation);
      map.setZoom(16);

      // Add marker
      new google.maps.Marker({
        position: userLocation,
        map: map,
        title: "Your Location"
      });

      console.log("Location success:", userLocation);

    },
    function (error) {

      console.log("GPS Error:", error);

      switch (error.code) {
        case error.PERMISSION_DENIED:
          alert("Permission denied. Enable location in browser settings.");
          break;
        case error.POSITION_UNAVAILABLE:
          alert("Location unavailable.");
          break;
        case error.TIMEOUT:
          alert("Location request timed out.");
          break;
        default:
          alert("Unknown GPS error.");
      }

      // fallback center
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
