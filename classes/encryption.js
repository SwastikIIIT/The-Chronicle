import crypto from "crypto";
import { encrypt } from "@metamask/eth-sig-util";
import { bufferToHex } from "ethereumjs-util";
// Elliptic Curve cryptography 

class Encryption{
    static CONFIG={
        iv_length:12,
        algorithm:"aes-256-gcm",
        auth_tag_length:16,
        asym_version:"x25519-xsalsa20-poly1305"
    }

    constructor(){}
 
    /** 
     * Key Generation 
     * @returns {Buffer} */
     generateAES(){
        return crypto.randomBytes(32); // 256 bits or 32 bytes key
    }

    /** 
     * Symmetric encryption using AES-256-GCM
     * @param {Buffer} buffer -The file data
     * @param {Buffer} aesKey  - key
     * */
     encryptWithAES(buffer,aesKey) {
        try{
            // 1. IV generation
            const iv=crypto.randomBytes(Encryption.CONFIG.iv_length);
            // 2. Cipher creation
            const cipherText=crypto.createCipheriv(
                Encryption.CONFIG.algorithm,
                aesKey,
                iv,
                {authTagLength:Encryption.CONFIG.auth_tag_length}
            );
            // 3. Data encryption
            const encrypted=Buffer.concat([cipherText.update(buffer),cipherText.final()]);
            // 4. Get authentication tag
            const authTag=cipherText.getAuthTag();

            return {
                v: iv.toString("hex"),
                encryptedData: encrypted,
                authTag: authTag.toString("hex"),
            }
        }
        catch(err)
        {
            console.log("Encryption error:",err);
            throw new Error(err?.message || "Failed to encrypt file");
        }

    }

    /** 
     * Symmetric decryption using AES-256-GCM
     * @param {string} encryptedDataHex - The encrypted data (Hex)
     * @param {string} ivHex - The IV (Hex)
     * @param {string} authTagHex - The Auth Tag (Hex)
     * @param {Buffer} aesKey - The AES Key 
     * */
    async decryptWithAES(encryptedDataHex,ivHex,authTagHex,aesKey) {
      try{
        //1. Get encrypted buffer,iv and authTag
        const encryptedData=Buffer.from(encryptedDataHex, "hex");
        const iv=Buffer.from(ivHex, "hex");
        const authTag=Buffer.from(authTagHex, "hex");
        //2. Create cipher
        const decipher=crypto.createDecipheriv(
            Encryption.CONFIG.algorithm, 
            aesKey, 
            Encryption.CONFIG.iv_length,
            { authTagLength: Encryption.CONFIG.auth_tag_length}
        );
        decipher.setAuthTag(authTag)
        //3. Decrypt data
        const decrypted=Buffer.concat([decipher.update(encryptedData),decipher.final()]);
        
        return decrypted; 
      }
      catch(err){
        console.log("Decryption error:",err);
        throw new Error(err?.message || "Failed to decrypt");
      }
    }

    /**
     * Encrypts the AES Key using the user's MetaMask public key.
     * @param {string} aesKey - The AES key to protect
     * @param {string} userPublicKey - The user's MetaMask public key
     */
    async encryptAesKey(aesKey,userPublicKey) {
       try{
            // Encrypt AES key with metamask public key (convert Buffer → hex string)
            const encrypted = encrypt({
                publicKey:userPublicKey ,
                data: bufferToHex(aesKey),
                version: Encryption.CONFIG.asym_version,
            });
    
            return bufferToHex(Buffer.from(JSON.stringify(encrypted)));
        }
        catch(err)
        {
            console.log("Error:",err);
            throw new Error(err?.message || "Failed to asym encrypt ");
        }
    }
    
    /**
     * Decrypts the AES Key using MetaMask (User needs to sign).
     * @param {string} encryptedAesKey - The encrypted key string
     * @param {string} accountAddress - The user's wallet address
     */
     async  decryptAesKey(encryptedAesKey,account) {
        try
        {
            // 1. Get private key and decrypt
            const privateKey = await window.ethereum.request({
                method: "eth_decrypt",
                params: [encryptedAesKey, account],
            });
    
            // 2. decryptedHex is 0x-prefixed hex string
            return Buffer.from(privateKey.replace(/^0x/, ""), "hex");
        }
        catch(err)
        {
            console.log("Error:",err);
            throw new Error(err?.message || "Failed to asym decrypt");
        }
    }
}

const encryption=new Encryption();
export default encryption;