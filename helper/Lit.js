'use server'
import { chainMap } from "@/lib/mapping";
import { nagaDev } from "@lit-protocol/networks";
import { createLitClient } from "@lit-protocol/lit-client";
import { createAccBuilder } from "@lit-protocol/access-control-conditions";
import { createAuthManager, storagePlugins } from "@lit-protocol/auth";

// Lit Protocol
   
    /**
    * Setup of Lit Client
    * @param {string} userAddress 
    * @param {string} chainId 
    * @returns {Promise<
    *           client,
    *           litChain,
    *           accs>} 
    */
   async function init(userAddress,chainId){
     const litChain=chainMap[chainId.toString()];
     if (!litChain) throw new Error(`Unsupported chain ID for Lit Protocol:${chainId}`);
     console.log("Lit Chain in encryption phase:",litChain);
      
     const litClient=await createLitClient({network: nagaDev});
     const builder=createAccBuilder();
     const accs=builder
                .requireWalletOwnership(userAddress)
                .on(litChain)
                  // .and()
                  // .requireEthBalance("0", "=")
                  // .on("yellowstone")
                .build();
     return{
        client:litClient,
        accessControlConditions:accs,
        litChain:litChain
     }
   }

   /**
   * Stores the AES key securely via Lit protocol
   * @param {Buffer<ArrayBufferLike>} aesKey - The AES key to protect
   * @param {string} userAddress - The user's account address
   * @param {string} chainId - Network ki chainId
   * @returns {Promise<{
   *            litResponse:{
   *             ciphertext:string,
   *             dataToEncryptHash:string,
   *             metadata:Object  
   *           }
   *          }>}
   */
   export async function encryptAesKeywithLit(aesKey,userAddress,chainId) {
    try {
      const aesKeyHex=aesKey.toString("hex");
      console.log("Key in encryption phase:",aesKeyHex);
      
      const {client,accessControlConditions,litChain}=await init(userAddress,chainId);
      
      const data = await client.encrypt({
          unifiedAccessControlConditions:accessControlConditions, //Conditions
          chain:litChain,
          dataToEncrypt:aesKeyHex,  //Plain Text
        }
      );
      client.disconnect();

      console.log("Lit Response encryption:", data);

      return { litResponse:data };
    } catch (err) {
      console.log("Lit Error:", err);
      throw new Error(err?.message || "Failed to store key securely via LIT ");
    }
   }

   /**
   * Decrypts the AES Key using LIT.
   * @param {string} ciphertext - The encrypted string
   * @param {string} litHash - The lit hash
   * @param {string} userAddress - The user's account address
   */
  //  export async function decryptAESKeyWithLit(ciphertext, chainId, userAddress) {
  //   try {
  //     const {client,accessControlConditions,litChain}=await init(userAddress,chainId);

  //     const authManager = createAuthManager({
  //        storage: storagePlugins.localStorageNode({
  //         appName: "Decentralized-vault",
  //         networkName: "naga-dev",
  //         storagePath: "./lit-auth-storage",
  //        }),
  //     });

  //    const authContext=await authManager.createEoaAuthContext({
  //       config: { account: userAddress },
  //       authConfig: {
  //         domain: "localhost",
  //         statement: "I authorize decrypting my AES key.",
  //         expiration: new Date(Date.now() + 1000 * 60 * 15).toISOString(), // 15 mins expiry
  //         resources: [
  //           ["access-control-condition-decryption", "*"],
  //           ["lit-action-execution", "*"]
  //         ],
  //       },
  //       client
  //     });

  //     const decryptedResponse = await client.decrypt({
  //       data: ciphertext,
  //       unifiedAccessControlConditions: accessControlConditions,
  //       authContext: authContext,
  //       chain: litChain,
  //     });
  //     client.disconnect();

  //     const decryptedAESKeyString = new TextDecoder().decode(decryptedResponse);
  //     return decryptedAESKeyString;
  //   } catch (err) {
  //     console.log("Error:", err);
  //     throw new Error(err?.message || "Failed to store key securely via LIT ");
  //   }
  //  }