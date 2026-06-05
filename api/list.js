import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.REACT_APP_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT,
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  
  try {
    const { skip = 0, limit = 5 } = req.query;

    const files = await imagekit.listFiles({
      path: "/photos", // same as before
      skip: Number(skip),
      limit: Number(limit),
    });
    res.status(200).json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ message: "Error fetching images" });
  }
}
