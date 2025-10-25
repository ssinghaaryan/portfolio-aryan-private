const express = require("express");
const ImageKit = require("imagekit");
const cors = require("cors");

const app = express();
app.use(cors());

// Create ImageKit instance
const imagekit = new ImageKit({
  publicKey: "public_L9euM/Nfb6sl8cb4UeImo4bCsik=",
  privateKey: "private_eGJgGcbMV5WWuZpPR/fDa1QSqRg=",
  urlEndpoint: "https://ik.imagekit.io/aryans",
});

// Auth endpoint
app.get("/auth", (req, res) => {
  const authParams = imagekit.getAuthenticationParameters();
  res.json(authParams); // <--- send JSON, not plain text
});

app.get("/list", async (req, res) => {
  try {
    const files = await imagekit.listFiles({
      path: "/photos", // folder path in your ImageKit
      limit: 20, // number of files to fetch
    });
    res.json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).send("Error fetching images");
  }
});

app.listen(8080, () => console.log("Server running on port 8080"));
