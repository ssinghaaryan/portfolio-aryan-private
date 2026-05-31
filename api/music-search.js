export default async function handler(req, res) {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        message: "Search query required"
      });
    }

    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(
        q
      )}&entity=song&limit=10`
    );

    const data = await response.json();

    res.status(200).json(data.results);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Search failed"
    });
  }
}