import { createConfig } from "ponder";
import { http } from "viem";
import deployedContracts from "@se-2/nextjs/contracts/deployedContracts";
import { baseSepolia, hardhat } from "viem/chains";

const isDev = process.env.NODE_ENV === "development";

const targetNetwork = isDev ? hardhat : baseSepolia;
const START_BLOCK = isDev ? 0 : 19501634;

const networks = {
  [targetNetwork.name]: {
    chainId: targetNetwork.id,
    transport: http(process.env[`PONDER_RPC_URL_${targetNetwork.id}`]),
  },
};

const { Allocator, Strategy, Registry } = deployedContracts[targetNetwork.id];

export default createConfig({
  networks: networks,
  contracts: {
    Allocator: {
      network: targetNetwork.name,
      abi: Allocator.abi,
      startBlock: START_BLOCK || 0,
    },
    Strategy: {
      network: targetNetwork.name,
      abi: Strategy.abi,
      startBlock: START_BLOCK || 0,
    },
    Registry: {
      network: targetNetwork.name,
      abi: Registry.abi,
      startBlock: START_BLOCK || 0,
    },
  },
});
