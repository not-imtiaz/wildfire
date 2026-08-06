const state = {
    map: null,
    userMarker: null,
    radiusCircle: null,
    firmsLayerGroup: null,
    userLocation: { lat: 40.5865, lng: -122.3917 },
    rawDetections: [],
    filteredDetections: [],
    alertRadiusMiles: 25,
    selectedTimeHours: 24,
    firmsMapKey: "DEMO_KEY"
};

// --- Helper Functions ---
function milesToMeters(miles) {
    return miles * 1609.34;
}

function parseAcquisitionTimestamp(dateStr, timeStr) {
    if (!dateStr || !timeStr) return new Date();
    const paddedTime = timeStr.toString().padStart(4, "0");
    const hours = paddedTime.substring(0, 2);
    const minutes = paddedTime.substring(2, 4);
    return new Date(`${dateStr}T${hours}:${minutes}:00Z`);
}

function initMap() {
    state.map = L.map("map").setView([state.userLocation.lat, state.userLocation.lng], 9);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: 'Made by Imtiaz Ahmed',
        maxZoom: 18,
        subdomains: "abcd"
    }).addTo(state.map);

    state.firmsLayerGroup = L.layerGroup().addTo(state.map);

    updateUserLocationOnMap(state.userLocation.lat, state.userLocation.lng);
}

function updateUserLocationOnMap(lat, lng) {
    state.userLocation = { lat, lng };

    if (state.userMarker) state.map.removeLayer(state.userMarker);
    if (state.radiusCircle) state.map.removeLayer(state.radiusCircle);

    state.userMarker = L.marker([lat, lng], {
        title: "Saved Location"
    }).addTo(state.map);

    state.userMarker.bindPopup(`<b>Saved Location</b><br>Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);

    state.radiusCircle = L.circle([lat, lng], {
        color: "#ff7800",
        fillColor: "#ff7800",
        fillOpacity: 0.1,
        weight: 2,
        dashArray: "4, 6",
        radius: milesToMeters(state.alertRadiusMiles)
    }).addTo(state.map);

    state.map.flyTo([lat, lng], 9, { duration: 1.5 });
}

async function geocodeAddress(query) {
    if (!query) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url, {
            headers: { "User-Agent": "WildfireSentinelApp/1.0" }
        });
        const data = await response.json();

        if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            updateUserLocationOnMap(lat, lon);
            await loadThermalData();
        } else {
            alert("Location not found. Please try a different address or city.");
        }
    } catch (error) {
        console.error("Geocoding failed:", error);
        alert("Geocoding service unavailable right now.");
    }
}

async function loadThermalData() {
    const { lat, lng } = state.userLocation;
    const south = (lat - 2.0).toFixed(4);
    const north = (lat + 2.0).toFixed(4);
    const west = (lng - 2.0).toFixed(4);
    const east = (lng + 2.0).toFixed(4);

    document.getElementById("scoreDisplay").innerText = "...";

    state.rawDetections = await fetchFirmsDetections(south, west, north, east, state.firmsMapKey);

    const now = new Date();
    state.rawDetections = state.rawDetections.map(d => {
        const timestamp = parseAcquisitionTimestamp(d.acq_date, d.acq_time);
        const ageHours = Math.max(0, (now - timestamp) / (1000 * 60 * 60));
        return { ...d, ageHours, timestamp };
    });

    applyTimelineFilter();
}

function applyTimelineFilter() {
    state.filteredDetections = state.rawDetections.filter(d => d.ageHours <= state.selectedTimeHours);

    renderDetectionsOnMap();
    recalculateRiskScore();
}

function renderDetectionsOnMap() {
    state.firmsLayerGroup.clearLayers();

    state.filteredDetections.forEach(d => {
        let markerColor = "#ffcc00";
        if (d.frp > 50) markerColor = "#ff6600";
        if (d.frp > 150) markerColor = "#ff0000";
        const markerRadius = Math.min(16, Math.max(4, Math.sqrt(d.frp) * 1.2));

        const circleMarker = L.circleMarker([d.latitude, d.longitude], {
            radius: markerRadius,
            fillColor: markerColor,
            color: "#ffffff",
            weight: 0.8,
            opacity: 0.9,
            fillOpacity: 0.75
        });

        const popupContent = `
      <div style="font-family: sans-serif; font-size: 12px;">
        <strong style="color: ${markerColor};">Thermal Anomaly Detected</strong><br>
        <b>Intensity (FRP):</b> ${d.frp} MW<br>
        <b>Confidence:</b> ${d.confidence}<br>
        <b>Acquisition Time:</b> ${d.timestamp.toUTCString()}<br>
        <b>Distance to Saved Point:</b> ${getDistanceMiles(state.userLocation.lat, state.userLocation.lng, d.latitude, d.longitude).toFixed(1)} miles
      </div>
    `;

        circleMarker.bindPopup(popupContent);
        state.firmsLayerGroup.addLayer(circleMarker);
    });
}

function recalculateRiskScore() {
    const resultCard = document.getElementById("riskCard");
    const scoreDisplay = document.getElementById("scoreDisplay");
    const scoreReasonsUI = document.getElementById("scoreReasons");

    resultCard.classList.remove("hidden");

    const { score, reasons } = calculateScore(
        state.filteredDetections,
        state.userLocation.lat,
        state.userLocation.lng,
        state.alertRadiusMiles
    );

    scoreDisplay.innerText = score;

    if (score > 70) scoreDisplay.style.color = "#ff4d4d";
    else if (score > 30) scoreDisplay.style.color = "#ffa64d";
    else scoreDisplay.style.color = "#2ecc71";

    scoreReasonsUI.innerHTML = "";
    reasons.forEach(reason => {
        const li = document.createElement("li");
        li.innerText = reason;
        scoreReasonsUI.appendChild(li);
    });
}

function setupEventListeners() {
    document.getElementById("searchBtn").addEventListener("click", () => {
        const query = document.getElementById("addressInput").value;
        geocodeAddress(query);
    });

    document.getElementById("addressInput").addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            const query = document.getElementById("addressInput").value;
            geocodeAddress(query);
        }
    });

    document.getElementById("radiusSelect").addEventListener("change", (e) => {
        state.alertRadiusMiles = parseFloat(e.target.value);
        updateUserLocationOnMap(state.userLocation.lat, state.userLocation.lng);
        recalculateRiskScore();
    });

    const timeSlider = document.getElementById("timeSlider");
    const timeLabel = document.getElementById("timeLabel");

    timeSlider.addEventListener("input", (e) => {
        const hours = parseInt(e.target.value, 10);
        state.selectedTimeHours = hours;
        timeLabel.innerText = hours === 24 ? "Showing all (Last 24 Hours)" : `Last ${hours} Hour(s)`;
        applyTimelineFilter();
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    initMap();
    setupEventListeners();
    await loadThermalData();
});