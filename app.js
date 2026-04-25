
let map;
let pickupMarker = null;
let dropoffMarker = null;
let directionsService;
let directionsRenderer;
let selectMode = "pickup";

let requests = [];

// 🚀 INIT MAP
function initMap() {

  console.log("initMap running");

  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 9.03, lng: 38.74 },
    zoom: 12
  });

}
window.initMap = initMap;
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  map.addListener("click", function (event) {

    const pos = event.latLng;

    if (selectMode === "pickup") {

      if (pickupMarker) pickupMarker.setMap(null);

      pickupMarker = new google.maps.Marker({
        position: pos,
        map: map,
        label: "P"
      });

      document.getElementById("pickup").value =
        pos.lat().toFixed(5) + "," + pos.lng().toFixed(5);

    } else {

      if (dropoffMarker) dropoffMarker.setMap(null);

      dropoffMarker = new google.maps.Marker({
        position: pos,
        map: map,
        label: "D"
      });

      document.getElementById("dropoff").value =
        pos.lat().toFixed(5) + "," + pos.lng().toFixed(5);
    }

    if (pickupMarker && dropoffMarker) {
      drawRoute();
    }
  });
}

// 📍 GPS LOCATION
function useMyLocation() {

  navigator.geolocation.getCurrentPosition(function (pos) {

    const user = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
    };

    map.setCenter(user);
    map.setZoom(15);

    new google.maps.Marker({
      position: user,
      map: map
    });

  });
}

// 🟢 MODE SWITCH
function setPickupMode() {
  selectMode = "pickup";
  alert("Click map for PICKUP");
}

function setDropoffMode() {
  selectMode = "dropoff";
  alert("Click map for DROPOFF");
}

// 🛣️ ROUTE + DISTANCE
function drawRoute() {

  directionsService.route({
    origin: pickupMarker.getPosition(),
    destination: dropoffMarker.getPosition(),
    travelMode: "DRIVING"
  }, function (result, status) {

    if (status === "OK") {

      directionsRenderer.setDirections(result);

      let distanceKM =
        (result.routes[0].legs[0].distance.value / 1000).toFixed(1);

      document.getElementById("distance").value = distanceKM;

      updatePrice();

    }
  });
}

// 💰 PRICE
function calculatePrice(distance, weight, tip, promo) {

  let price = 50 + (distance * 10) + (weight * 5);

  if (promo === "SAVE10") price *= 0.9;

  price += Number(tip || 0);

  return Math.round(price);
}

// ⚡ UPDATE PRICE
function updatePrice() {

  let d = Number(document.getElementById("distance").value || 0);
  let w = Number(document.getElementById("weight").value || 0);
  let t = Number(document.getElementById("Tip").value || 0);
  let p = document.getElementById("Discount").value;

  document.getElementById("priceDisplay").innerText =
    "Estimated Price: " + calculatePrice(d, w, t, p) + " Birr";
}

// 🚚 REQUEST DELIVERY
function requestDelivery() {

  let req = {
    id: Date.now(),
    pickup: document.getElementById("pickup").value,
    dropoff: document.getElementById("dropoff").value,
    distance: document.getElementById("distance").value,
    price: document.getElementById("priceDisplay").innerText,
    status: "Pending"
  };

  requests.push(req);
  displayRequests();
}

// 📦 SHOW REQUESTS
function displayRequests() {

  let list = document.getElementById("requestsList");
  list.innerHTML = "";

  requests.forEach(r => {

    let li = document.createElement("li");

    li.innerHTML =
      r.pickup + " → " + r.dropoff + "<br>" +
      "Distance: " + r.distance + " KM<br>" +
      r.price + "<br>" +
      "Status: " + r.status;

    list.appendChild(li);
  });
}

// expose
window.initMap = initMap;
window.useMyLocation = useMyLocation;
window.setPickupMode = setPickupMode;
window.setDropoffMode = setDropoffMode;
window.requestDelivery = requestDelivery;
