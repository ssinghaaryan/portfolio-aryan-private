// export default async function handler(req, res) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");

//    if (req.method === "OPTIONS") return res.status(200).end();

//   try {
//     const { q, type = "movie" } = req.query;

//      if (!q) return res.status(400).json({ error: "Query required" });

//     const endpoint = type === "tv" ? "tv" : "movie";

//     const url = `https://api.themoviedb.org/3/search/${endpoint}?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(q)}`;

//     const response = await fetch(url);
//     const data = await response.json();

//     const results = (data.results || []).map((item) => ({
//       tmdbId: item.id,
//       title: item.title || item.name,
//       posterPath: item.poster_path
//         ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
//         : null,
//       releaseDate: item.release_date || item.first_air_date || "",
//       overview: item.overview
//     }));

//     res.status(200).json(results);
//   } catch (error) {
//     console.error("Error searching TMDB:", error);
//     res.status(500).json({ message: "Error searching" });
//   }
// }

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(200).end();

  const { q, type, mode } = req.query;

    if (!q) return res.status(400).json({ error: "Query required" });

  try {
    // mode=music → iTunes search (was api/music-search)
      if (mode === "music") {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&limit=20`
      );
      const data = await response.json();
      return res.status(200).json(data.results || []);
    }

    // mode=movie → TMDB search (was api/movie-search)
      if (mode === "movie") {
      const endpoint = type === "tv" ? "tv" : "movie";
      const url = `https://api.themoviedb.org/3/search/${endpoint}?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(q)}`;
      const response = await fetch(url);
      const data = await response.json();
      const results = (data.results || []).map(item => ({
        tmdbId: item.id,
        title: item.title || item.name,
        posterPath: item.poster_path
          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
          : null,
        releaseDate: item.release_date || item.first_air_date || "",
        overview: item.overview
      }));
      return res.status(200).json(results);
    }

    // mode=books → Google Books API (no key needed for basic search)
  if (mode === "books") {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=15&fields=key,title,author_name,first_publish_year,isbn,cover_i`;
  const response = await fetch(url);
  const data = await response.json();
  const results = (data.docs || []).map(item => {
    const coverId = item.cover_i;
    return {
      googleId: item.key?.replace("/works/", "") || Math.random().toString(),
      title: item.title || "Unknown Title",
      author: item.author_name?.join(", ") || "Unknown Author",
      year: item.first_publish_year?.toString() || "",
      coverUrl: coverId
        ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
        : null,
      isbn: item.isbn?.[0] || null
    };
  });
  return res.status(200).json(results);
}

    return res.status(400).json({ error: "mode required: music or movie or books" });

  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ message: "Search failed" });
  }
}