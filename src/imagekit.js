import ImageKit from "imagekit";
import { IKUpload } from "imagekitio-react";

const imagekit = new ImageKit({
  publicKey: "public_L9euM/Nfb6sl8cb4UeImo4bCsik=",
  urlEndpoint: "https://ik.imagekit.io/aryans",
  authenticationEndpoint: "https://your-backend.com/auth" // optional for secure uploads
});

export default IKUpload;