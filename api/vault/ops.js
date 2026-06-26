export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const token = process.env.GITHUB_TOKEN;
  const owner = "ssinghaaryan";
  const repo = "betabase-vault";

  try {

    // GET → tree (was api/vault/tree)
    if (req.method === "GET") {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`,
        { headers: { Authorization: `token ${token}` } }
      );
      const data = await response.json();
      if (!data.tree) return res.status(500).json({ error: "GitHub tree not found" });
      const notes = data.tree.filter(
        item => item.path.startsWith("vault/") &&
        (item.path.endsWith(".md") || item.path.endsWith(".gitkeep"))
      );
      return res.status(200).json(notes);
    }

    if (req.method === "POST") {
      const { action } = req.body;

      // ── SAVE NOTE ──
      if (action === "save" || !action) {
        const { path, content } = req.body;
        const fileRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
          { headers: { Authorization: `token ${token}` } }
        );
        const fileData = await fileRes.json();
        const updateRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
          {
            method: "PUT",
            headers: { Authorization: `token ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              message: `Update ${path}`,
              content: Buffer.from(content).toString("base64"),
              sha: fileData.sha
            })
          }
        );
        return res.status(200).json(await updateRes.json());
      }

      // ── CREATE NOTE ──
      if (action === "create") {
        const { folder, noteName } = req.body;
        const path = `vault/${folder}/${noteName}.md`;
        const createRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
          {
            method: "PUT",
            headers: { Authorization: `token ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              message: `Create ${path}`,
              content: Buffer.from(`# ${noteName}\n`).toString("base64")
            })
          }
        );
        return res.status(200).json(await createRes.json());
      }

      // ── CREATE FOLDER ──
      if (action === "create-folder") {
        const { folderName } = req.body;
        const path = `vault/${folderName}/.gitkeep`;
        const createRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
          {
            method: "PUT",
            headers: { Authorization: `token ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              message: `Create folder ${folderName}`,
              content: Buffer.from("").toString("base64")
            })
          }
        );
        return res.status(200).json(await createRes.json());
      }

      // ── DELETE NOTE ──
      if (action === "delete") {
        const { path } = req.body;
        const fileRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
          { headers: { Authorization: `token ${token}` } }
        );
        const fileData = await fileRes.json();
        await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
          {
            method: "DELETE",
            headers: { Authorization: `token ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ message: `Delete ${path}`, sha: fileData.sha })
          }
        );
        return res.status(200).json({ success: true });
      }

      // ── RENAME NOTE ──
      if (action === "rename") {
        const { oldPath, newName } = req.body;
        const fileRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${oldPath}`,
          { headers: { Authorization: `token ${token}` } }
        );
        const fileData = await fileRes.json();
        const fileContent = Buffer.from(fileData.content, "base64").toString("utf8");
        const folder = oldPath.substring(0, oldPath.lastIndexOf("/"));
        const newPath = `${folder}/${newName}.md`;
        await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${newPath}`,
          {
            method: "PUT",
            headers: { Authorization: `token ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              message: `Rename ${oldPath}`,
              content: Buffer.from(fileContent).toString("base64")
            })
          }
        );
        await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${oldPath}`,
          {
            method: "DELETE",
            headers: { Authorization: `token ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ message: `Delete old file after rename`, sha: fileData.sha })
          }
        );
        return res.status(200).json({ success: true });
      }

      // ── RENAME FOLDER ──
      if (action === "rename-folder") {
        const { folderName, newFolderName } = req.body;
        const treeRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`,
          { headers: { Authorization: `token ${token}` } }
        );
        const treeData = await treeRes.json();
        const folderFiles = treeData.tree.filter(
          item => item.type === "blob" && item.path.startsWith(`vault/${folderName}/`)
        );
        for (const file of folderFiles) {
          const fileRes = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`,
            { headers: { Authorization: `token ${token}` } }
          );
          const fileData = await fileRes.json();
          const fileContent = Buffer.from(fileData.content, "base64").toString("utf8");
          const newPath = file.path.replace(`vault/${folderName}/`, `vault/${newFolderName}/`);
          await fetch(
            `https://api.github.com/repos/${owner}/${repo}/contents/${newPath}`,
            {
              method: "PUT",
              headers: { Authorization: `token ${token}`, "Content-Type": "application/json" },
              body: JSON.stringify({
                message: `Rename folder ${folderName} to ${newFolderName}`,
                content: Buffer.from(fileContent).toString("base64")
              })
            }
          );
          await fetch(
            `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`,
            {
              method: "DELETE",
              headers: { Authorization: `token ${token}`, "Content-Type": "application/json" },
              body: JSON.stringify({ message: `Remove old file after folder rename`, sha: fileData.sha })
            }
          );
        }
        return res.status(200).json({ success: true });
      }

      // ── DELETE FOLDER ──
      if (action === "delete-folder") {
        const { folderName } = req.body;
        const treeRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`,
          { headers: { Authorization: `token ${token}` } }
        );
        const treeData = await treeRes.json();
        const folderFiles = treeData.tree.filter(
          item => item.type === "blob" && item.path.startsWith(`vault/${folderName}/`)
        );
        for (const file of folderFiles) {
          const fileRes = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`,
            { headers: { Authorization: `token ${token}` } }
          );
          const fileData = await fileRes.json();
          await fetch(
            `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`,
            {
              method: "DELETE",
              headers: { Authorization: `token ${token}`, "Content-Type": "application/json" },
              body: JSON.stringify({ message: `Delete folder ${folderName}`, sha: fileData.sha })
            }
          );
        }
        return res.status(200).json({ success: true });
      }

      // ── MOVE NOTE (for drag & drop later) ──
      if (action === "move") {
        const { oldPath, newFolder } = req.body;
        const fileName = oldPath.split("/").pop();
        const newPath = `vault/${newFolder}/${fileName}`;
        const fileRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${oldPath}`,
          { headers: { Authorization: `token ${token}` } }
        );
        const fileData = await fileRes.json();
        const fileContent = Buffer.from(fileData.content, "base64").toString("utf8");
        await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${newPath}`,
          {
            method: "PUT",
            headers: { Authorization: `token ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              message: `Move ${oldPath} to ${newPath}`,
              content: Buffer.from(fileContent).toString("base64")
            })
          }
        );
        await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${oldPath}`,
          {
            method: "DELETE",
            headers: { Authorization: `token ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ message: `Remove after move`, sha: fileData.sha })
          }
        );
        return res.status(200).json({ success: true });
      }

      return res.status(400).json({ error: "Unknown action" });
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}