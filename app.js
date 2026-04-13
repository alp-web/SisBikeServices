let requests = [];

function requestDelivery() {
  const pickup = document.getElementById("pickup").value;
  const dropoff = document.getElementById("dropoff").value;
  const weight = Number(document.getElementById("weight").value);
  const tip = Number(document.getElementById("Tip").value);
  const promo = document.getElementById("Discount").value;

  if (!pickup || !dropoff) {
    alert("Enter locations");
    return;
  }

  const distance = getDistance();
  const price = calculatePrice(distance, weight, tip, promo);

  document.getElementById("priceDisplay").innerText =
    "Estimated Price: " + price + " Birr";

  const request = {
    id: Date.now(),
    pickup,
    dropoff,
    weight,
    distance,
    price,
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
}
