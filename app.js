let requests = [];

// 🚀 MAIN REQUEST FUNCTION
function requestDelivery() {
  const pickup = document.getElementById("pickup").value;
  const dropoff = document.getElementById("dropoff").value;
  const distance = Number(document.getElementById("distance").value);
  const weight = Number(document.getElementById("weight").value);
  const priceText = document.getElementById("priceDisplay").innerText;

  if (!pickup || !dropoff || !distance) {
    alert("Complete all required fields");
    return;
  }

function useMyLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      const userLocation = { lat, lng };

      // Move map to user
      map.setCenter(userLocation);

      // Add marker
      new google.maps.Marker({
        position: userLocation,
        map: map,
        title: "Your Location"
      });

      // Convert to address
      const geocoder = new google.maps.Geocoder();

      geocoder.geocode({ location: userLocation }, (results, status) => {
        if (status === "OK" && results[0]) {
          document.getElementById("pickup").value = results[0].formatted_address;
        }
      });
    },
    () => {
      alert("Please allow location access");
    }
  );
}

  const dropoff = document.getElementById("dropoff").value;
if (dropoff) {
  calculateDistanceFromMap(results[0].formatted_address, dropoff);
}


  navigator.geolocation.getCurrentPosition(
    position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // Convert coordinates → address
      const geocoder = new google.maps.Geocoder();

      const latlng = { lat, lng };

      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === "OK" && results[0]) {
          document.getElementById("pickup").value = results[0].formatted_address;
        } else {
          alert("Could not get address");
        }
      });

      // Move map to user location
      map.setCenter(latlng);

      new google.maps.Marker({
        position: latlng,
        map: map,
        title: "Your Location"
      });

    },
    error => {
      alert("Location access denied");
    }
  );
}

  
  const request = {
    id: Date.now(),
    pickup,
    dropoff,
    distance,
    weight,
    price: priceText,
    status: "Pending"
  };

  requests.push(request);
  displayRequests();
}

// 📦 DISPLAY REQUESTS
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
      <br>
      <button onclick="acceptDelivery(${req.id})">Accept</button>
    `;

    list.appendChild(li);
  });
}

// 🚴 ACCEPT DELIVERY
function acceptDelivery(id) {
  const request = requests.find(r => r.id === id);
  if (request) {
    request.status = "In Progress";
    displayRequests();
  }
}

// 💰 PRICE CALCULATION
function calculatePrice(distanceKM, weight, tip, promo) {
  let base = 50;
  let distanceCost = distanceKM * 10;
  let weightCost = weight * 5;

  let total = base + distanceCost + weightCost;

  if (promo === "SAVE10") {
    total *= 0.9;
  }

  total += Number(tip || 0);

  return Math.round(total);
}

// 🗺️ CALCULATE DISTANCE FROM MAP
function calculateDistanceFromMap(pickup, dropoff) {
  document.getElementById("distanceInfo").innerText = "Calculating distance...";

  const service = new google.maps.DirectionsService();

  service.route({
    origin: pickup,
    destination: dropoff,
    travelMode: 'DRIVING'
  }, function(result, status) {

    if (status === 'OK') {
      const distanceMeters = result.routes[0].legs[0].distance.value;
      const distanceKM = (distanceMeters / 1000).toFixed(1);

      document.getElementById("distance").value = distanceKM;

      document.getElementById("distanceInfo").innerText =
        "Distance (Map): " + distanceKM + " KM";

      updatePrice();

    } else {
      document.getElementById("distanceInfo").innerText =
        "Map failed. Enter distance manually.";
    }

  });
}

// ⚡ LIVE PRICE UPDATE
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

// 🎯 EVENT LISTENERS

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
