// import ImageKit from "imagekit";

// const imagekit = new ImageKit({
//   publicKey: process.env.REACT_APP_IMAGEKIT_PUBLIC_KEY,
//   privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
//   urlEndpoint: process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT,
// });

// export default async function handler(req, res) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
//   if (req.method === "OPTIONS") {
//     return res.status(200).end();
//   }
  
//   try {
//     const { skip = 0, limit = 5 } = req.query;

//     const files = await imagekit.listFiles({
//       path: "/photos", // same as before
//       skip: Number(skip),
//       limit: Number(limit),
//       sort: "DESC_CREATED",
//     });
//     res.status(200).json(files);
//   } catch (error) {
//     console.error("Error fetching files:", error);
//     res.status(500).json({ message: "Error fetching images" });
//   }
// }

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

  const { action, skip = 0, limit = 5 } = req.query;

  try {
    // action=stats → return photo count + storage
    if (action === "stats") {
      let allFiles = [];
      let s = 0;
      const l = 100;
      while (true) {
        const files = await imagekit.listFiles({ path: "/photos", skip: s, limit: l });
        allFiles = [...allFiles, ...files];
        if (files.length < l) break;
        s += l;
      }
      const totalCount = allFiles.length;
      const totalMB = (allFiles.reduce((sum, f) => sum + (f.size || 0), 0) / (1024 * 1024)).toFixed(1);
      return res.status(200).json({ totalCount, totalMB });
    }

    // default → list photos (was api/list)
    const files = await imagekit.listFiles({
      path: "/photos",
      skip: Number(skip),
      limit: Number(limit),
      sort: "DESC_CREATED",
    });
    return res.status(200).json(files);

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Error fetching images" });
  }
}