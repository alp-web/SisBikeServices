let map;
let requests = [];

// 🚀 INIT MAP
function initMap() {

  const mapDiv = document.getElementById("map");

  map = new google.maps.Map(mapDiv, {
    center: { lat: 9.03, lng: 38.74 },
    zoom: 12
  });
}

window.onload = initMap;

// 📍 USE MY LOCATION
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

      map.setCenter(userLocation);
      map.setZoom(15);

      new google.maps.Marker({
        position: userLocation,
        map: map,
        title: "You are here"
      });

      // Convert location to address
      const geocoder = new google.maps.Geocoder();

      geocoder.geocode({ location: userLocation }, function (results, status) {
        if (status === "OK" && results[0]) {
          document.getElementById("pickup").value =
            results[0].formatted_address;
        }
      });

    },
    function (error) {
      alert("Location error: " + error.message);

      map.setCenter({ lat: 9.03, lng: 38.74 });
    }
  );
}

window.useMyLocation = useMyLocation;

// 🗺️ DISTANCE CALCULATION
function calculateDistanceFromMap(pickup, dropoff) {

  const service = new google.maps.DirectionsService();

  service.route(
    {
      origin: pickup,
      destination: dropoff,
      travelMode: "DRIVING"
    },
    function (result, status) {

      if (status === "OK") {

        const km = result.routes[0].legs[0].distance.value / 1000;

        document.getElementById("distance").value = km.toFixed(1);

        document.getElementById("distanceInfo").innerText =
          "Distance: " + km.toFixed(1) + " KM";

        updatePrice();
      }
    }
  );
}

// 💰 PRICE CALCULATION
function calculatePrice(distance, weight, tip, promo) {

  let total = 50 + distance * 10 + weight * 5;

  if (promo === "SAVE10") {
    total *= 0.9;
  }

  total += Number(tip || 0);

  return Math.round(total);
}

// ⚡ UPDATE PRICE
function updatePrice() {

  const distance = Number(document.getElementById("distance").value) || 0;
  const weight = Number(document.getElementById("weight").value) || 0;
  const tip = Number(document.getElementById("Tip").value) || 0;
  const promo = document.getElementById("Discount").value;

  if (distance <= 0) return;

  const price = calculatePrice(distance, weight, tip, promo);

  document.getElementById("priceDisplay").innerText =
    "Estimated Price: " + price + " Birr";
}

// 🚀 REQUEST DELIVERY
function requestDelivery() {

  const pickup = document.getElementById("pickup").value;
  const dropoff = document.getElementById("dropoff").value;
  const distance = Number(document.getElementById("distance").value);
  const weight = Number(document.getElementById("weight").value);

  if (!pickup || !dropoff || !distance) {
    alert("Please fill all fields");
    return;
  }

  requests.push({
    id: Date.now(),
    pickup,
    dropoff,
    distance,
    weight,
    status: "Pending"
  });

  displayRequests();
}

// 📦 DISPLAY REQUESTS
function displayRequests() {

  const list = document.getElementById("requestsList");
  list.innerHTML = "";

  requests.forEach(req => {

    const li = document.createElement("li");

    li.innerHTML = `
      ${req.pickup} → ${req.dropoff}<br>
      Distance: ${req.distance} KM<br>
      Weight: ${req.weight} kg<br>
      Status: ${req.status}
    `;

    list.appendChild(li);
  });
}

// 📍 AUTO DISTANCE ON DROP-OFF CHANGE
document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("dropoff").addEventListener("change", () => {

    const pickup = document.getElementById("pickup").value;
    const dropoff = document.getElementById("dropoff").value;

    if (pickup && dropoff) {
      calculateDistanceFromMap(pickup, dropoff);
    }
  });

  document.getElementById("distance").addEventListener("input", updatePrice);
  document.getElementById("weight").addEventListener("input", updatePrice);
  document.getElementById("Tip").addEventListener("input", updatePrice);
  document.getElementById("Discount").addEventListener("input", updatePrice);
});
