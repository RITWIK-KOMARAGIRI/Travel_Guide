const express = require("express");
const cors = require("cors");
const { loginModel, profileModel, topratedModel, aboutModel, placeModel, hotelsModel, homestaysModel, tovisitModel, hospitalModel } = require('./table/schema');
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://Ritwik:Ritwik123@cluster0.3leb3ro.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",              // local dev
    "https://ritwik-komaragiri.github.io" // GitHub Pages frontend
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use(express.json());
app.get("", (req,res)=>{

});
app.get("/details", async (req, res) => {
  try {
    const { name, type, stayName } = req.query;

    if (!name || !type) {
      return res.status(400).json({ message: "Name and type are required" });
    }

    const normalizedType = type.toLowerCase();
    let data;

    // 🏡 Homestay
    if (normalizedType === "homestay" || normalizedType === "homestays") {
      if (!stayName) {
        return res.status(400).json({ message: "stayName is required for homestay type" });
      }

      const placeData = await homestaysModel.findOne(
        { place: new RegExp(`^${name}$`, "i") },
        { stays: 1 }
      );

      if (!placeData || !placeData.stays) {
        return res.status(404).json({ message: "Place not found or has no stays" });
      }

      const stay = placeData.stays.find(
        (s) => s.name.toLowerCase() === stayName.toLowerCase()
      );

      if (!stay) {
        return res.status(404).json({ message: "Stay not found" });
      }

      data = stay;
    }

    // 🏨 Hotel
    else if (normalizedType === "hotel" || normalizedType === "hotels") {
      if (!stayName) {
        return res.status(400).json({ message: "stayName is required for hotel type" });
      }

      const placeData = await hotelsModel.findOne(
        { place: new RegExp(`^${name}$`, "i") },
        { hotels: 1 }
      );
      if (!placeData) {
        return res.status(404).json({ message: "Place not found" });
      }

      const hotel = placeData.hotels.find(
        (h) => h.name.toLowerCase() === stayName.toLowerCase()
      );
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      data = hotel;
    }

    // 🗺️ ToVisit
    else if (normalizedType === "tovisit" || normalizedType === "to-visit") {
      const placeData = await tovisitModel.findOne(
        { place: new RegExp(`^${name}$`, "i") }
      );
      if (!placeData) {
        return res.status(404).json({ message: "Place to visit not found" });
      }

      // return only the places array if that’s how your schema is structured
      data = placeData.places || placeData;
    }

    // ❌ Invalid type
    else {
      return res.status(400).json({ message: "Invalid type" });
    }

    res.json(data);
  } catch (err) {
    console.error("Error in /details:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});




 

app.post("/login", async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await loginModel.findOne({ userName, password });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/register", async (req, res) => {
  const { id, name, userName, email, password } = req.body;

  try {
    const existingUser = await loginModel.findOne({
      $or: [{ email }, { userName }],
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = new loginModel({ id, name, userName, email, password });
    await newUser.save();

    const details = new profileModel({
      name,
      personalInfo: {
        username: userName,
        email
      }
    });
    await details.save();

    res.status(201).json({ user: newUser, profile: details });

  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/search/place", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is missing" });
  }

  try {
    const result = await placeModel.findOne({ placename: { $regex: new RegExp(query, "i") } });

    if (!result) {
      return res.status(404).json({ message: "Place not found" });
    }

    return res.json(result);
  } catch (err) {
    console.error("Search error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/toprated", async (req, res) => {
  try {
    const topPlaces = await topratedModel.find({});
    res.json(topPlaces);
  } catch (err) {
    console.error("❌ Error in /toprated:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/image", async (req, res) => {
  try {
    const { place } = req.query;
    const topPlaces = await topratedModel.find({ place });
    res.json(topPlaces);
  } catch (err) {
    console.error("❌ Error in /image:", err); // Changed console.error message
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/searched", async (req, res) => {
  const { place } = req.query;

  if (!place) {
    return res.status(400).json({ error: "Missing place in query" });
  }

  try {
    const [hotels, homestays, tovisit, about, emergency] = await Promise.all([
      hotelsModel.findOne({ place }),
      homestaysModel.findOne({ place }),
      tovisitModel.findOne({ place }),
placeModel.findOne({ placename: { $regex: new RegExp(place, 'i') }}),
      hospitalModel.findOne({ place })
    ]);

    // If none found
    if (!hotels && !homestays && !tovisit && !about && !emergency) {
      return res.status(404).json({ message: "No data found for this place" });
    }

    res.json({
      place: place,
      hotels: hotels?.hotels || [],
      homestays: homestays?.stays || [],
      tovisit: tovisit?.tovisit || [],
      about: about?.about || null,
      emergency: emergency?.hospitals || []
    });

  } catch (error) {
    console.error("Error in /searched API:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/homeStays", async (req, res) => {
  try {
    const { place } = req.query;
    if (!place) {
      return res.status(400).json({ error: "Missing place in query" });
    }

    const placeHomeStays = await homestaysModel.findOne({ place });

    if (!placeHomeStays) {
      return res.json([]); // Return empty array if no home stays found
    }

    res.json(placeHomeStays.stays);

  } catch (err) {
    console.error("❌ Error fetching home stays:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/nearBY", async (req, res) => {
  try {
    const { place } = req.query;
    if (!place) {
      // 400 is more appropriate for missing query parameter than 500
      return res.status(400).json({ message: "Missing place in query" });
    }

    const near = await tovisitModel.findOne({ place });

    if (!near) {
      // Return an empty array if no tovisit document is found for the place
      console.log(`No places to visit found for ${place}.`);
      return res.json([]);
    }

    // Ensure we send only the 'tovisit' array
    res.json(near.tovisit);

  } catch (err) {
    // Log the actual error for debugging, and send 500 for internal errors
    console.error("❌ Error fetching nearby places:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/about", async (req, res) => {
    const { place } = req.query;

    if (!place) {
        return res.status(400).json({ message: "Missing 'place' parameter in query" });
    }

    try {
        // Await the result of the findOne operation
        const aboutplace = await placeModel.find({ placename: place }); // Assuming your 'place' field in the DB is actually 'placename'

        if (!aboutplace) {
            // Handle case where no document is found for the given place
            console.log(`No 'about' details found for place: ${place}`);
            return res.status(404).json({ message: `No 'about' details found for ${place}` });
        }

        // Send the entire 'aboutplace' document as JSON
        // The frontend can then access aboutplace.about, aboutplace.placename, etc.
        res.json(aboutplace);

    } catch (err) {
        console.error("❌ Error fetching 'about' details:", err);
        // Send a 500 status code for internal server errors
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get("/emergency", async (req, res) => {
    const { place } = req.query;

    if (!place) {
        return res.status(400).json({ message: "Missing 'place' parameter in query" });
    }

    try {
        // Use 'place' for the query field to match your DB structure
        const emergencyData = await hospitalModel.findOne({ place: place });

        if (!emergencyData) {
            console.log(`No emergency details (hospitals) found for place: ${place}`);
            // Return an empty array if no data is found for clarity on the frontend
            return res.json([]);
        }

        // Send the hospitals array (which now contains strings)
        res.json(emergencyData.hospitals);

    } catch (err) {
        console.error("❌ Error fetching emergency details:", err);
        res.status(500).json({ message: "Internal server error" });
    }
  });
  app.get("/profile",async(req,res)=>{
    const {name} =req.query
    if(!name){
      console.error("No name sent from frontend")
    }    const profile = await profileModel.findOne({name});
    res.json(profile)

  })
  app.post("/add/profile",async(req,res)=>{
    const {name,userName,email} = req.body;
    const profile = new profileModel({name,username:userName,email});
     await profile.save();
  })
  const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:5000`);
});