let requests = [];

function requestDelivery() {
  const pickup = document.getElementById("pickup").value;
  const dropoff = document.getElementById("dropoff").value;

  if (!pickup || !dropoff) {
    alert("Enter both locations");
    return;
  }

  const request = {
    id: Date.now(),
    pickup: pickup,
    dropoff: dropoff,
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
