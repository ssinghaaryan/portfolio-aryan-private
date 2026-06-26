// import ImageKit from "imagekit";

// const imagekit = new ImageKit({
//   publicKey: process.env.REACT_APP_IMAGEKIT_PUBLIC_KEY,
//   privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
//   urlEndpoint: process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT,
// });

// export default function handler(req, res) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   try {
//     const authParams = imagekit.getAuthenticationParameters();
//     res.status(200).json(authParams);
//   } catch (error) {
//     console.error("Error generating auth parameters:", error);
//     res.status(500).json({ error: "Failed to generate authentication parameters" });
//   }
// }

import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.REACT_APP_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT,
});

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  // POST → login
  if (req.method === "POST") {
    const { username, password } = req.body;
    const validUsername = process.env.LOGIN_USERNAME;
    const validPassword = process.env.TRACK_PASSWORD;

    if (username === validUsername && password === validPassword) {
      return res.status(200).json({ success: true, token: process.env.TRACK_PASSWORD });
    }
    return res.status(401).json({ success: false, error: "Invalid credentials" });
  }

  // GET → ImageKit auth
  try {
    const authParams = imagekit.getAuthenticationParameters();
    return res.status(200).json(authParams);
  } catch (error) {
    console.error("Error generating auth parameters:", error);
    return res.status(500).json({ error: "Failed to generate authentication parameters" });
  }
}