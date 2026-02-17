import { ethers, formatEther } from "ethers";

class Blockchain {
   provider = null;
   signer = null;
   network = null;
   account = null;

   constructor() {}

  // Detect metamask -> Request permission -> Select the account,network and funds
  async connectToWeb3(){
      if(typeof window.ethereum === "undefined" || !window.ethereum) {
          throw new Error("MetaMask is not installed. Please install it to use the Decentralized Vault");
      }

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

        // const history = await this.getHistory(this.account);
        // console.log("History:",history);
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
   *  Get account information
   * @param {string} account - The account address 
   */
  async getHistory (account){
    if(!this.provider) return [];
      try {
          const latestBlock = await this.provider.getBlockNumber();
          const history = [];
          const startBlock=Math.max(0,latestBlock-50);
          const blockPromises=[];
          for (let i = latestBlock; i >= startBlock; i--) {
              blockPromises.push(this.provider.getBlock(i, true));
          }
              
          const blocks=await Promise.all(blockPromises);
          for (const block of blocks) {
              if (!block || !block.transactions || block.transactions.length === 0) return;

              for (const tx of block.transactions) 
              {
                  const receipt = await this.provider.getTransactionReceipt(tx);
      
                  if (receipt.from?.toLowerCase() === account?.toLowerCase() || receipt.to?.toLowerCase() === account?.toLowerCase()) 
                  {   
                      const gasUsed = receipt.gasUsed;
                      const gasPriceinGWEI = (receipt.gasPrice || 0n)/1_000_000_000n;
              
                      const obj = {
                          from: receipt.from,
                          to: receipt.to,
                          transactionHash: receipt?.hash,
                          baseFeePerGas: formatEther(block?.baseFeePerGas),
                          blockNumber: receipt?.blockNumber,
                          gasLimit: block?.gasLimit,
                          gasUsed: formatEther(gasUsed),
                          gasPrice: gasPriceinGWEI,
                          fee: formatEther(receipt.fee),// gasUsed * gasPrice 
                          type: receipt?.from.toLowerCase() === account.toLowerCase() ? "Sent" : "Received",
                          status: receipt.status === 1 ? "Success" : "Failed",
                      };
                      
                      // console.log("Found:", obj);
                      history.push(obj);
                  }
              }
         }
          
        return history;
      } catch (err) {
          console.error("Ganache Fetch Error:", err);
          throw new Error(err?.message || "Failed to fetch Ganache history");
      }
  };
}

const blockchain=new Blockchain();
export default blockchain; 