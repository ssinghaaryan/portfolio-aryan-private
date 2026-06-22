export default async function handler(
  req,
  res
) {

  try {

    const response =
      await fetch(

        "https://api.github.com/repos/ssinghaaryan/betabase-vault/contents/vault/Personal/Welcome.md",

        {
          headers: {
            Authorization:
              `token ${process.env.GITHUB_TOKEN}`
          }
        }

      );

    const data =
      await response.json();

    const content =
      Buffer.from(
        data.content,
        "base64"
      ).toString("utf8");

    res.status(200).json({
      content
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error:
        "Failed to load note"
    });

  }

}