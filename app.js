let requests = [];

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
document.getElementById("distanceInfo").innerText = "Calculating distance...";
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

function displayRequests() {
  const list = document.getElementById("requestsList");
  list.innerHTML = "";

  requests.forEach(req => {
    const li = document.createElement("li");

    li.innerHTML = `
  ${req.pickup} → ${req.dropoff} <br>
  Distance: ${req.distance} KM <br>
  Weight: ${req.weight} kg <br>
  Price: ${req.price} Birr <br>
  Status: ${req.status}
  <br>
  <button onclick="acceptDelivery(${req.id})">Accept</button>
`;

    list.appendChild(li);
  });
}

function acceptDelivery(id) {
  const request = requests.find(r => r.id === id);
  if (request) {
    request.status = "In Progress";
    displayRequests();
  }
}

function calculatePrice(distanceKM, weight, tip, promo) {
  let base = 50;
  let distanceCost = distanceKM * 10;
  let weightCost = weight * 5;

  let total = base + distanceCost + weightCost;

  // Apply promo
  if (promo === "SAVE10") {
    total *= 0.9;
  }

  total += Number(tip || 0);

  return Math.round(total);
}

function getDistance() {
  const manualDistance = Number(document.getElementById("distance").value);

  // If user entered distance → use it
  if (manualDistance && manualDistance > 0) {
    document.getElementById("distanceInfo").innerText =
      "Distance (Manual): " + manualDistance + " KM";
    return manualDistance;
  }

  // Otherwise fallback to fake/map
  const autoDistance = getFakeDistance();

  document.getElementById("distanceInfo").innerText =
    "Distance (Estimated): " + autoDistance + " KM";

  return autoDistance;


  function calculateDistanceFromMap(pickup, dropoff) {
  const service = new google.maps.DirectionsService();

  service.route({
    origin: pickup,
    destination: dropoff,
    travelMode: 'DRIVING'
  }, function(result, status) {

    if (status === 'OK') {
      const distanceMeters = result.routes[0].legs[0].distance.value;
      const distanceKM = (distanceMeters / 1000).toFixed(1);

      // Fill input
      document.getElementById("distance").value = distanceKM;

      // Show distance
      document.getElementById("distanceInfo").innerText =
        "Distance (Map): " + distanceKM + " KM";

      // 🔥 UPDATE PRICE IMMEDIATELY
      updatePrice();

    } else {
      console.log("Map error:", status);
    }

  });
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
    
}
}

// Auto calculate distance when locations change
document.getElementById("dropoff").addEventListener("change", () => {
  const pickup = document.getElementById("pickup").value;
  const dropoff = document.getElementById("dropoff").value;

  if (pickup && dropoff) {
    calculateDistanceFromMap(pickup, dropoff);
  }
});

// Live price updates
document.getElementById("distance").addEventListener("input", updatePrice);
document.getElementById("weight").addEventListener("input", updatePrice);
document.getElementById("Tip").addEventListener("input", updatePrice);
document.getElementById("Discount").addEventListener("input", updatePrice);
