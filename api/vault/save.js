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

    const token =
      process.env.GITHUB_TOKEN;

    const owner =
      "ssinghaaryan";

    const repo =
      "betabase-vault";

    const {
      action
    } = req.body;

    /*
    ======================
    SAVE NOTE
    ======================
    */

    if (
      action === "save"
      ||
      !action
    ) {

      const {
        path,
        content
      } = req.body;

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

      return res
        .status(200)
        .json(updateData);

    }

    /*
    ======================
    RENAME NOTE
    ======================
    */

    if (
      action === "rename"
    ) {

      const {
        oldPath,
        newName
      } = req.body;

      const fileResponse =
        await fetch(

          `https://api.github.com/repos/${owner}/${repo}/contents/${oldPath}`,

          {
            headers: {
              Authorization:
                `token ${token}`
            }
          }

        );

      const fileData =
        await fileResponse.json();

      const content =
        Buffer
          .from(
            fileData.content,
            "base64"
          )
          .toString(
            "utf8"
          );

      const folder =
        oldPath.substring(
          0,
          oldPath.lastIndexOf("/")
        );

      const newPath =
        `${folder}/${newName}.md`;

      await fetch(

        `https://api.github.com/repos/${owner}/${repo}/contents/${newPath}`,

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
              `Rename ${oldPath}`,

            content:
              Buffer
                .from(content)
                .toString(
                  "base64"
                )

          })

        }

      );

      await fetch(

        `https://api.github.com/repos/${owner}/${repo}/contents/${oldPath}`,

        {

          method: "DELETE",

          headers: {

            Authorization:
              `token ${token}`,

            "Content-Type":
              "application/json"

          },

          body: JSON.stringify({

            message:
              `Delete old file`,

            sha:
              fileData.sha

          })

        }

      );

      return res
        .status(200)
        .json({
          success: true
        });

    }

    return res
      .status(400)
      .json({
        error:
          "Unknown action"
      });

  } catch (err) {

    console.error(err);

    res.status(500).json({

      error:
        "Failed saving note"

    });

  }

}