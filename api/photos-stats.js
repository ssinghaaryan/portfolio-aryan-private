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

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    let allFiles = [];
    let skip = 0;
    const limit = 100;

    // paginate through all files to get complete stats
    while (true) {
      const files = await imagekit.listFiles({
        path: "/photos",
        skip,
        limit,
      });
      allFiles = [...allFiles, ...files];
      if (files.length < limit) break;
      skip += limit;
    }

    const totalCount = allFiles.length;
    const totalBytes = allFiles.reduce((sum, f) => sum + (f.size || 0), 0);
    const totalMB = (totalBytes / (1024 * 1024)).toFixed(1);

    res.status(200).json({ totalCount, totalMB });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Error fetching stats" });
  }
}