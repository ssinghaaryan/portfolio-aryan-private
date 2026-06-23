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
      path,
      content
    } = req.body;

    const token =
      process.env.GITHUB_TOKEN;

    const owner =
      "ssinghaaryan";

    const repo =
      "betabase-vault";

    const fileResponse =
      await fetch(

        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,

        {
          headers: {
            Authorization:
              `token ${token}`
          }
        }

      );

    const fileData =
      await fileResponse.json();

    const updateResponse =
      await fetch(

        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,

        {

          method: "PUT",

          headers: {

            Authorization:
              `token ${token}`,

            "Content-Type":
              "application/json"

          },

          body: JSON.stringify({

            message:
              `Update ${path}`,

            content:
              Buffer
                .from(content)
                .toString(
                  "base64"
                ),

            sha:
              fileData.sha

          })

        }

      );

    const updateData =
      await updateResponse.json();

    res.status(200).json(
      updateData
    );

  } catch (err) {

    console.error(err);

    res.status(500).json({

      error:
        "Failed saving note"

    });

  }

}