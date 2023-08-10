import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

dotenv.config({ path: __dirname + '/.env' });
const { RPC_URL, PRIVATE_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.19",
   defaultNetwork: "matic",
   networks: {
      hardhat: {},
      matic: {
        url: RPC_URL,
        accounts: [PRIVATE_KEY!]
      }
   },
};

/*const config: HardhatUserConfig = {
  solidity: "0.8.19",
};*/  

export default config;
