async function fetchFirmsDetections(south, west, north, east, mapKey) {
    const areaString = `${west},${south},${east},${north}`;
    const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${mapKey}/VIIRS_NOAA20_NRT/${areaString}/1`;

    try {
        const response = await fetch(url);
        const csvData = await response.text();
        return parseCSV(csvData);
    } catch (err) {
        console.error("Error fetching FIRMS data:", err);
        return [];
    }
}

function parseCSV(csvText) {
    const lines = csvText.trim().split("\n");
    if (lines.length <= 1) return [];

    const headers = lines[0].split(",");
    return lines.slice(1).map(line => {
        const values = line.split(",");
        return {
            latitude: parseFloat(values[headers.indexOf("latitude")]),
            longitude: parseFloat(values[headers.indexOf("longitude")]),
            frp: parseFloat(values[headers.indexOf("frp")]),
            acq_date: values[headers.indexOf("acq_date")],
            acq_time: values[headers.indexOf("acq_time")],
            confidence: values[headers.indexOf("confidence")]
        };
    });
}