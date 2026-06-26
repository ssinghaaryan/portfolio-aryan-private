// export default async function handler(
//   req,
//   res
// ) {

//   if (
//     req.method !== "POST"
//   ) {

//     return res
//       .status(405)
//       .json({
//         error:
//           "Method not allowed"
//       });

//   }

//   try {

//     const {
//       path
//     } = req.body;

//     const token =
//       process.env.GITHUB_TOKEN;

//     const owner =
//       "ssinghaaryan";

//     const repo =
//       "betabase-vault";

//     const fileResponse =
//       await fetch(

//         `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,

//         {
//           headers: {
//             Authorization:
//               `token ${token}`
//           }
//         }

//       );

//     const fileData =
//       await fileResponse.json();

//     const deleteResponse =
//       await fetch(

//         `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,

//         {

//           method: "DELETE",

//           headers: {

//             Authorization:
//               `token ${token}`,

//             "Content-Type":
//               "application/json"

//           },

//           body: JSON.stringify({

//             message:
//               `Delete ${path}`,

//             sha:
//               fileData.sha

//           })

//         }

//       );

//     const deleteData =
//       await deleteResponse.json();

//     res.status(200).json(
//       deleteData
//     );

//   } catch (err) {

//     console.error(err);

//     res.status(500).json({

//       error:
//         "Failed deleting note"

//     });

//   }

// }