const express = require("express");
const axios = require("axios"); // Make sure axios is installed
const router = express.Router();
const apiKey = process.env.GOOGLE_API_KEY;

// this is the proxy
router.get("/search-location", async (req, res) => {
  console.log("search-location route code start");
  const { query } = req.query;
  console.log("query");
  if (!query)
    return res.status(400).json({ message: "Query parameter is required" });

  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
    query
  )}&inputtype=textquery&fields=formatted_address,name,geometry&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    console.log(response);
    if (response.data.status !== "OK") {
      return res
        .status(404)
        .json({ message: "No results found", details: response.data.status });
    }

    if (response.data.candidates.length === 0) {
      console.log("No results found for:", query);
      return res.status(404).json({ message: "No results found" });
    }

    const location = response.data.candidates[0].geometry.location;
    const mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=15&size=600x300&maptype=roadmap&markers=color:red|${location.lat},${location.lng}&key=${apiKey}`;

    console.log("Generated mapImageUrl:", mapImageUrl);

    res.json({
      formatted_address: response.data.candidates[0].formatted_address,
      name: response.data.candidates[0].name,
      location: response.data.candidates[0].geometry.location,
      mapImageUrl: mapImageUrl,
    });
  } catch (error) {
    console.error("Failed to fetch location for:", query, error);
    res.status(500).json({
      message: "Failed to fetch location",
      error: error.response ? error.response.data : error.message,
    });
  }
});

module.exports = router;
