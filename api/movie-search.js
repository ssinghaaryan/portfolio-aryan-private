export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const { q, type = "movie" } = req.query;

    if (!q) return res.status(400).json({ error: "Query required" });

    const endpoint = type === "tv" ? "tv" : "movie";

    const url = `https://api.themoviedb.org/3/search/${endpoint}?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(q)}`;

    const response = await fetch(url);
    const data = await response.json();

    const results = (data.results || []).map((item) => ({
      tmdbId: item.id,
      title: item.title || item.name,
      posterPath: item.poster_path
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : null,
      releaseDate: item.release_date || item.first_air_date || "",
      overview: item.overview
    }));

    res.status(200).json(results);
  } catch (error) {
    console.error("Error searching TMDB:", error);
    res.status(500).json({ message: "Error searching" });
  }
}