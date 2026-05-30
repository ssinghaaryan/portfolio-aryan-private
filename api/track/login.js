export default function handler(req, res) {
  
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  console.log("TRACK_PASSWORD:", process.env.TRACK_PASSWORD);
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password required" });
  }

  if (password === process.env.TRACK_PASSWORD) {
    return res.status(200).json({ success: true });
    
  }

  return res.status(401).json({ message: "Invalid password" });
}