export default async function handler(
  req,
  res
) {

  try {

    const { path } = req.query;

    const response =
      await fetch(

        `https://api.github.com/repos/ssinghaaryan/betabase-vault/contents/${path}`,

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

// export default async function handler(
//   req,
//   res
// ) {

//   try {

//     const {
//       folder,
//       noteName
//     } = req.body;

//     const path =
//       `vault/${folder}/${noteName}.md`;

//       const content =
// `# ${noteName}

// Created:
// ${new Date()
//   .toLocaleDateString()}

// `;

// //     const content =

// // `# ${noteName}

// // Created from BetaBase Vault.
// // `;

//     const response =
//       await fetch(

//         `https://api.github.com/repos/ssinghaaryan/betabase-vault/contents/${path}`,

//         {
//           method: "PUT",

//           headers: {

//             Authorization:
//               `token ${process.env.GITHUB_TOKEN}`,

//             "Content-Type":
//               "application/json"
//           },

//           body: JSON.stringify({

//             message:
//               `Create ${noteName}`,

//             content:
//               Buffer
//                 .from(content)
//                 .toString(
//                   "base64"
//                 )

//           })

//         }

//       );

//     const data =
//       await response.json();

//     res.status(200).json(
//       data
//     );

//   } catch (err) {

//     console.error(err);

//     res.status(500).json({

//       error:
//         "Failed creating note"

//     });

//   }

// }