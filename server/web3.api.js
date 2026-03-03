"use server";
import { decryptAESKeyWithLit, encryptAesKeywithLit } from "@/helper/Lit";
import { getCookies } from "./api";
import Encryption from "@/services/encryption";

 /**
 * Flow:
 * 1. Generate AES key
 * 2. Encrypt file using symmetric encryption via (AES)
 * 3. Upload encrypted file to IPFS
 * 4. Encrypt AES key via Lit Protocol (Decentralized key management - Threshold Cryptography)
 *
 * @param {string} address - User's wallet address
 * @param {string} chainId - Chain Id like sepolia 
 * @param {File} file - File to be encrypted and uploaded
 *
 * @returns {Promise<{
 *   success: boolean;
 *   message?: string;
 *   metaInfo: {
 *     type:string,
 *     name:string,
 *     size:string,
 *     fileDBId:string
 *   };
 *   cid:string,
 *   key:string
 * }>}
 */
export const uploadToIPFS=async (address,chainId,file) => {
  try {
    const cookie = await getCookies();
    // 1. Key Generation
    const key=Encryption.generateAES();
    console.log("Key:",key);
    // 2. File Encryption (Symmetric)
    const fileBuffer=Buffer.from(await file.arrayBuffer());
    const { encryptedData }=Encryption.encryptWithAES(fileBuffer, key);
    const encryptedFile=new File([encryptedData], file.name, {type: "application/octet-stream"});

    const formData = new FormData();
    formData.append("doc", encryptedFile); 

    // 3. Upload encryptedFile to IPFS
    const result = await fetch(`${process.env.BACKEND_URL}/api/web3/ipfs`, {
      method: "POST",
      headers: {
        Cookie: `backend_token=${cookie}`,
      },
      body: formData,
    });
    const data = await result.json();
    if (!result.ok) throw new Error(result.error);

    const cid=result.headers.get("IPFS-CID");
    // 4. Encrypt AES key via Lit (Like Shamir-Secret-Sharing)
    const encryptedAES = await encryptAesKeywithLit(key,address,chainId); 

    return {
      success:true,
      message: data?.message,
      metaInfo:data.uploadedFile,
      cid,
      key: encryptedAES?.litResponse?.ciphertext
    };
  } catch (err) {
    console.error("Error while uploading file:", err);
    throw new Error(err?.message || "Failed to upload the file");
  }
};

/**
 * Store file metadata information in DB
 * @returns {Promise<File[]>} Array of fileData - File Metadata
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
 * Delete File MetaData from DB and IPFS
 * @param {{
 *          type:string,
 *          name:string,
 *          size:string,
 *          fileDBId:string
 *         }} metaData - File meta information
 * @returns {Promise<void>}
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