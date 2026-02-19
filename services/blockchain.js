import { ethers, formatEther } from "ethers";

class Blockchain {
   provider = null;
   signer = null;
   network = null;
   account = null;

   constructor() {}

  /**
  * Connecting with Blockchain (private or local/public testnet)
  */
  async connectToWeb3(){
      if(typeof window.ethereum==='undefined' || !window.ethereum)
        throw new Error("MetaMask is not installed. Please install it to use the Decentralized Vault");

      try {
          this.provider = new ethers.BrowserProvider(window.ethereum);
          this.signer = await this.provider.getSigner();
          this.network = await this.provider.getNetwork();
        
          // const accounts = await this.web3instance.request({ method: "eth_requestAccounts"});
          const accounts = await this.provider.send("eth_requestAccounts", []);
          this.account = accounts[0];

          let balance = "0";
          try {
            const balanceWei = await this.provider.getBalance(this.account);
            balance = formatEther(balanceWei);
          } catch (balError) {
            console.warn("Balance fetch failed, using 0", balError);
          }

          const history = await this.getHistory(this.account);
          console.log("History:",history);
          return {
            success: true,
            account: this.account,
            balance: parseFloat(balance).toFixed(4),
            networkName: this.network.name === "unknown" ? "Localhost/Private" : this.network.name,
            chainId: this.network.chainId.toString(),
            history,
          };
      } catch (error) {
        console.log(error);
        if(error.code === -32002) throw new Error("Connection request already pending. Please check MetaMask and approve the connection.");
        if (error.code === 4001) throw new Error("Connection rejected by user.");
        throw new Error(error?.message || "Failed to connect to web3");
      }
  } 

  /**
 * Get account information.
 *
 * @param {string} account - Ethereum account address.
 * @returns {Array<{
 *   from: string;
 *   to: string;
 *   transactionHash: string;
 *   blockNumber: number;
 *   blocksAhead:string;
 *   blockHash: string;
 *   nonce: string;
 *   gasUsed: string;
 *   gasPrice: bigint;
 *   fee: string;
 *   type: string;
 *   status: string;
 * }>}
 */
  async getHistory (account){
      if(!this.provider || !this.network) return [];
      try {
          const chainId=this.network.chainId.toString();
          const apiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;

          let baseUrl = "https://api.etherscan.io/v2/api";

          if (chainId !== "1" && chainId !== "11155111") {
            console.warn("History fetch not supported for this network");
            return [];
          }

          const apiUrl =
            `${baseUrl}` +
            `?chainid=${chainId}` +
            `&module=account` +
            `&action=txlist` +
            `&address=${account}` +
            `&startblock=0` +
            `&endblock=99999999` +
            `&sort=desc` +
            `&apikey=${apiKey}`;

          const res=await fetch(apiUrl);
          const data=await res.json();
          console.log("Data:",data);
          console.log(data.result);
          if(data.status==='1')
          {
            return data.result.map(tx=>({
              from:tx.from,
              to:tx.to,
              transactionHash:tx.hash,
              blockNumber:tx.blockNumber,
              blocksAhead:tx.confirmations,
              blockHash:tx.blockHash,
              nonce:tx.nonce,
              gasUsed:tx.gasUsed,
              gasPrice:ethers.formatUnits(tx.gasPrice,'gwei'),
              fee:ethers.formatEther(BigInt(tx.gasPrice)*BigInt(tx.gasUsed)),
              type: tx.from.toLowerCase() === account.toLowerCase() ? "Sent" : "Received",
              status: tx.isError === "0" ? "Success" : "Failed",
            }))
          }
          return [];
      } catch (err) {
          console.error("Ganache Fetch Error:", err);
          throw new Error(err?.message || "Failed to fetch Ganache history");
      }
  };
}

const blockchain=new Blockchain();
export default blockchain; 