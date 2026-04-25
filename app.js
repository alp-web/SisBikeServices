let requests = [];
let map;

// 🚀 INIT MAP
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 0, lng: 0 },
    zoom: 2
  });

  useMyLocation(); // optional auto locate
}

// 📍 USE MY LOCATION (FIXED)
function useMyLocation() {
  alert("BUTTON CLICKED");

  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    function (position) {
      alert("LOCATION SUCCESS");

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      const userLocation = { lat, lng };

      map.setCenter(userLocation);
      map.setZoom(15);

      new google.maps.Marker({
        position: userLocation,
        map: map,
        title: "Your Location"
      });

      // Convert to address
      const geocoder = new google.maps.Geocoder();

      geocoder.geocode({ location: userLocation }, function (results, status) {
        if (status === "OK" && results[0]) {
          document.getElementById("pickup").value =
            results[0].formatted_address;
        }
      });
    },
    function (error) {
      alert("GPS ERROR: " + error.message);

      map.setCenter({ lat: 9.03, lng: 38.74 });
      map.setZoom(12);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000
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
        const distanceMeters = result.routes[0].legs[0].distance.value;
        const distanceKM = (distanceMeters / 1000).toFixed(1);

        document.getElementById("distance").value = distanceKM;
        document.getElementById("distanceInfo").innerText =
          "Distance: " + distanceKM + " KM";

        updatePrice();
      } else {
        document.getElementById("distanceInfo").innerText =
          "Could not calculate distance";
      }
    }
  );
}

// 💰 PRICE
function calculatePrice(distanceKM, weight, tip, promo) {
  let base = 50;
  let total = base + distanceKM * 10 + weight * 5;

  if (promo === "SAVE10") total *= 0.9;

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
  const priceText = document.getElementById("priceDisplay").innerText;

  if (!pickup || !dropoff || !distance) {
    alert("Complete all fields");
    return;
  }

  requests.push({
    id: Date.now(),
    pickup,
    dropoff,
    distance,
    weight,
    price: priceText,
    status: "Pending"
  });

  displayRequests();
}

// 📦 DISPLAY
function displayRequests() {
  const list = document.getElementById("requestsList");
  list.innerHTML = "";

  requests.forEach(req => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${req.pickup} → ${req.dropoff} <br>
      Distance: ${req.distance} KM <br>
      Weight: ${req.weight} kg <br>
      ${req.price} <br>
      Status: ${req.status}
    `;

    list.appendChild(li);
  });
}

// 🚴 ACCEPT
function acceptDelivery(id) {
  const req = requests.find(r => r.id === id);
  if (req) req.status = "In Progress";
  displayRequests();
}

// EVENTS
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
