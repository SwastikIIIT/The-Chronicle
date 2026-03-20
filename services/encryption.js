import { chainMap } from "@/lib/mapping";
import { nagaDev } from "@lit-protocol/networks";
import { createLitClient } from "@lit-protocol/lit-client";
import { createAccBuilder } from "@lit-protocol/access-control-conditions";
import { createAuthManager, storagePlugins } from "@lit-protocol/auth";
import crypto from "crypto";
import { bufferToHex } from "ethereumjs-util";
import { createWalletClient, custom, getAddress } from "viem";
import { sepolia } from 'viem/chains'


// Elliptic Curve cryptography

class Encryption {
  static CONFIG = {
    iv_length: 12,
    algorithm: "aes-256-gcm",
    auth_tag_length: 16,
    asym_version: "x25519-xsalsa20-poly1305",
  };

  constructor() {}

   /**
   * Key Generation
   * @returns {Buffer} */
  static generateAES() {
    return crypto.randomBytes(32); // 256 bits or 32 bytes key
  }

   /**
   * Symmetric encryption using AES-256-GCM
   * @param {Buffer} buffer - The file data
   * @param {Buffer} aesKey - key generated from generateAES function
   * */
  static encryptWithAES(buffer, aesKey) {
    try {
      // 1. IV generation
      const iv = crypto.randomBytes(Encryption.CONFIG.iv_length);
      // 2. Cipher creation
      const cipherText = crypto.createCipheriv(
        Encryption.CONFIG.algorithm,
        aesKey,
        iv,
        { authTagLength: Encryption.CONFIG.auth_tag_length },
      );
      // 3. Data encryption
      const encrypted = Buffer.concat([
        cipherText.update(buffer),
        cipherText.final(),
      ]);
      // 4. Get authentication tag
      const authTag = cipherText.getAuthTag();

      return {
        iv: iv.toString("hex"),
        encryptedData: encrypted,
        authTag: authTag.toString("hex"),
      };
    } catch (err) {
      console.log("Encryption error:", err);
      throw new Error(err?.message || "Failed to encrypt file");
    }
  }

   /**
   * Symmetric decryption using AES-256-GCM
   * @param {Buffer|ArrayBuffer} encryptedBuffer - The encrypted data buffer
   * @param {string} ivHex - The IV (Hex)
   * @param {string} authTagHex - The Auth Tag (Hex)
   * @param {string} aesKeyHex - The AES Key (Hex)
   * */
  static async decryptWithAES(encryptedBuffer, ivHex, authTagHex, aesKeyHex) {
    try {
      //1. Get key buffer ,iv buffer,and authTag buffer
      const key = Buffer.from(aesKeyHex, "hex");
      const iv = Buffer.from(ivHex, "hex");
      const authTag = Buffer.from(authTagHex, "hex");

      const payloadBuffer = Buffer.isBuffer(encryptedBuffer)?encryptedBuffer:Buffer.from(encryptedBuffer);
      //2. Create cipher
      const decipher = crypto.createDecipheriv(
        Encryption.CONFIG.algorithm,
        key,
        iv,
        { authTagLength: Encryption.CONFIG.auth_tag_length },
      );
      decipher.setAuthTag(authTag);
      //3. Decrypt data
      const decrypted = Buffer.concat([
        decipher.update(payloadBuffer),
        decipher.final(),
      ]);

      return decrypted;
    } catch (err) {
      console.log("Decryption error:", err);
      throw new Error(err?.message || "Failed to decrypt");
    }
  }

   /**
   * Decrypts the AES Key using LIT.
   * @param {string} cipher - The encrypted string
   * @param {string} digest - dataToEncrypt Hash string
   * @param {string} chainId - The lit hash
   * @param {string} userAddress - The user's account address
   */
   static async decryptAESKeyWithLit(cipher,digest,chainId,userAddress) {
    try {
      const litChain=chainMap[chainId.toString()];
      if (!litChain) throw new Error(`Unsupported chain ID for Lit Protocol:${chainId}`);
      console.log("Lit Chain in decryption phase:",litChain);
      
      const client=await createLitClient({network: nagaDev});
      const builder=createAccBuilder();
      const accessControlConditions=builder
                .requireWalletOwnership(userAddress)
                .on(litChain)
                .build();

      const authManager = createAuthManager({
        storage: storagePlugins.localStorage({
          appName: "decentralized-vault",
          networkName: "naga-local",
        }),
      });

      const checksummedAddress=getAddress(userAddress);

      const walletClient=createWalletClient({
        transport:custom(window.ethereum),
        account:checksummedAddress,
      });

      const authContext=await authManager.createEoaAuthContext({
        config:{account:walletClient},
        authConfig:{
          domain: window.location.hostname || "localhost",
          statement: "I authorize decrypting my AES key.",
          expiration: new Date(Date.now() + 1000 * 60 * 15).toISOString(), // 15 mins expiry
          resources: [
            ["access-control-condition-decryption", "*"],
            ["lit-action-execution", "*"]
          ],
        },
        litClient:client
      });

      const decryptedResponse = await client.decrypt({
        ciphertext:cipher,
        dataToEncryptHash:digest,
        unifiedAccessControlConditions: accessControlConditions,
        authContext: authContext,
        chain: litChain,
      });
      client.disconnect();
      console.log(decryptedResponse);
      const decoder = new TextDecoder('utf-8');
      const text=decoder.decode(decryptedResponse.decryptedData);
      console.log("Decrypted Text:",text);
      return text;
    } catch (err) {
      console.log("Error:", err);
      throw new Error(err?.message || "Failed to store key securely via LIT ");
    }
   }

   static async test(){
    console.log("Testing...");
   }
}

export default Encryption;
