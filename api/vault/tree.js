// export default async function handler(
//   req,
//   res
// ) {

//   try {

//     const response =
//       await fetch(

//         "https://api.github.com/repos/ssinghaaryan/betabase-vault/git/trees/main?recursive=1",

//         {
//           headers: {
//             Authorization:
//               `token ${process.env.GITHUB_TOKEN}`
//           }
//         }

//       );

//     const data =
//       await response.json();

//     console.log(
//       "GITHUB TREE RESPONSE:",
//       data
//     );

//     if (!data.tree) {

//       return res
//         .status(500)
//         .json({
//           error:
//             "GitHub tree not found",
//           github:
//             data
//         });

//     }

//     const notes =
//   data.tree.filter(

//     item =>

//       item.path.startsWith(
//         "vault/"
//       )

//       &&

//       (
//         item.path.endsWith(
//           ".md"
//         )

//         ||

//         item.path.endsWith(
//           ".gitkeep"
//         )
//       )

//   );

//     res.status(200).json(
//       notes
//     );

//   } catch (err) {

//     console.error(
//       "TREE ERROR:",
//       err
//     );

//     res.status(500).json({

//       error:
//         err.message

//     });

//   }

// }