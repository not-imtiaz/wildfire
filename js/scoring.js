function getDistanceMiles(lat1, lon1, lat2, lon2) {
    const R = 3958.8;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function calculateScore(detections, userLat, userLon, alertRadius) {
    if (!detections.length) return { score: 0, reasons: ["No thermal detections nearby."] };

    let minDistance = Infinity;
    let maxFrp = 0;

    detections.forEach(d => {
        const dist = getDistanceMiles(userLat, userLon, d.latitude, d.longitude);
        if (dist < minDistance) minDistance = dist;
        if (d.frp > maxFrp) maxFrp = d.frp;
    });

    if (minDistance > alertRadius) {
        return { score: 0, reasons: [`No detections within selected ${alertRadius}-mile radius.`] };
    }

    let baseScore = Math.max(0, 100 * (1 - (minDistance / alertRadius)));

    if (maxFrp > 50) baseScore += 15;

    const finalScore = Math.min(100, Math.round(baseScore));
    const reasons = [
        `Closest detection is ${minDistance.toFixed(1)} miles away.`,
        `Peak Fire Radiative Power (FRP): ${maxFrp} MW.`
    ];

    return { score: finalScore, reasons };
}