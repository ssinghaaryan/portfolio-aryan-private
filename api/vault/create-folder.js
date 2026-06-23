export default async function handler(
  req,
  res
) {

  if (
    req.method !== "POST"
  ) {

    return res
      .status(405)
      .json({
        error:
          "Method not allowed"
      });

  }

  try {

    const {
      folderName
    } = req.body;

    const path =
      `vault/${folderName}/.gitkeep`;

    const content =
      "";

    const response =
      await fetch(

        `https://api.github.com/repos/ssinghaaryan/betabase-vault/contents/${path}`,

        {

          method: "PUT",

          headers: {

            Authorization:
              `token ${process.env.GITHUB_TOKEN}`,

            Accept:
              "application/vnd.github+json"

          },

          body: JSON.stringify({

            message:
              `Create folder ${folderName}`,

            content:
              Buffer
                .from(content)
                .toString(
                  "base64"
                )

          })

        }

      );

    const data =
      await response.json();

    res.status(200).json(
      data
    );

  } catch (err) {

    console.error(err);

    res.status(500).json({

      error:
        "Failed creating folder"

    });

  }

}