"use server";
import encryption from "@/classes/encryption";
import { getCookies } from "./api";
import Encryption from "@/classes/encryption";

/**
 * AES key generation -> Data encryption (Symmetric Encryption) -> AES encrypt + Upload to IPFS
 * @param {string} publicKey - Abhi pata nhi
 * @param {} file - File to be uploaded
 * @returns 
 */
export const uploadToIPFS = async (publicKey, file) => {
  try {
    // console.log("Public Key:", publicKey);
    const cookie = await getCookies();

    // 1. AES key + File Encryption
    const key =  encryption.generateAES();
    // console.log("Key:", key);
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const { encryptedData } = encryption.encryptWithAES(fileBuffer, key);
  
    const encryptedFile = new File([encryptedData], file.name, {type: "application/octet-stream"});
   
    const formData = new FormData();
    formData.append("doc", encryptedFile); // Symmetric Encryption

    // 2. Upload encryptedFile to IPFS
    const result = await fetch(`${process.env.BACKEND_URL}/api/web3/ipfs`, {
      method: "POST",
      headers: {
        Cookie: `backend_token=${cookie}`,
      },
      body: formData,
    });
    const data = await result.json();
    if (!result.ok) throw new Error(result.error);

    // 2. AES key encrypt with metamask key + CID
    const cid = result.headers.get("IPFS-CID");
    // const encryptedAES = await encryption.encryptAesKey(key, publicKey); // Asymmetric Encryption
    // console.log("Encrypted AES:", encryptedAES);

    return {
      success: true,
      metaInfo :data.uploadedFile,
      message: data?.message,
    };
  } catch (err) {
    console.error("Error while uploading file:", err);
    throw new Error(err?.message || "Failed to upload the file");
  }
};

/**
 * Store file metadata information in DB
 * @returns {[]} Array of fileData - File Metadata
 */
export const uploadedFileInfo = async()=>{
  try{
      const cookie=await getCookies();
      const result = await fetch(`${process.env.BACKEND_URL}/api/web3/file-info`, {
        headers: {Cookie: `backend_token=${cookie}`}
      });
      if(result.status===204) return [];
      const data=await result.json();
    
      return data.files;
  }
  catch(err)
  {
     console.error("Error while getting file info:", err);
     throw new Error(err?.message || "Failed to get file info");
  }
} 

/**
 * Delete File MetaData from DB and ipfs
 * @param {Object} metaData - File meta information
 * @returns {void}
 */
export const deleteFileData=async(metaData)=>{
  try{
      const cookie=await getCookies();
      const result = await fetch(`${process.env.BACKEND_URL}/api/web3/delete-file`, {
        method:'DELETE',
        headers: {
          "Content-Type": "application/json",
          Cookie: `backend_token=${cookie}`
        },
        body:JSON.stringify(metaData)
      });
      const data=await result.json();
      console.log(data);
      if(!result.ok) throw new Error(data.error);

      return{
        success:true,
        message:data.message
      }
  }
  catch(err)
  {
    console.log(err);
     throw new Error(err?.message || "Failed to delete file info");
  }
}