export default async function handler(
  req,
  res
) {

  try {

    const response =
      await fetch(

        "https://api.github.com/repos/ssinghaaryan/betabase-vault/git/trees/main?recursive=1",

        {
          headers: {
            Authorization:
              `token ${process.env.GITHUB_TOKEN}`
          }
        }

      );

    const data =
      await response.json();

    const notes =
      data.tree.filter(

        item =>

          item.path.startsWith(
            "vault/"
          )

          &&

          item.path.endsWith(
            ".md"
          )

      );

    res.status(200).json(
      notes
    );

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error:
        "Failed loading vault"
    });

  }

}