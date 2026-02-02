const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');

function loadEnvFile(filename) {
  const filePath = path.resolve(process.cwd(), filename);
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

async function main() {
  const fileEnv = {
    ...loadEnvFile('.env.local'),
    ...loadEnvFile('.env'),
  };
  const env = { ...fileEnv, ...process.env };

  const rpcUrl = env.RPC_MAINNET;
  if (!rpcUrl) {
    throw new Error('RPC_MAINNET is missing. Set it in .env.local or Vercel.');
  }

  const rawKey = env.DEPLOYER_PRIVATE_KEY || env.REWARDS_PRIVATE_KEY;
  if (!rawKey) {
    throw new Error(
      'DEPLOYER_PRIVATE_KEY or REWARDS_PRIVATE_KEY is required for deployment.'
    );
  }

  const privateKey = rawKey.startsWith('0x') ? rawKey : `0x${rawKey}`;
  const stakingToken =
    env.STAKING_TOKEN_ADDRESS || '0x2e105875765e46d93A301A9FE0e81d98d070200e';

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const network = await provider.getNetwork();
  const balance = await provider.getBalance(wallet.address);

  console.log(`Network: ${network.name} (${network.chainId})`);
  console.log(`Deployer: ${wallet.address}`);
  console.log(`Balance: ${ethers.formatEther(balance)} ETH`);
  console.log(`Staking token: ${stakingToken}`);

  const artifactPath = path.resolve('src/abi/Staking.json');
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

  const factory = new ethers.ContractFactory(
    artifact.abi,
    artifact.bytecode,
    wallet
  );
  const deployTx = factory.getDeployTransaction(stakingToken);
  const gasEstimate = await provider.estimateGas(deployTx);
  const feeData = await provider.getFeeData();
  const gasPrice = feeData.maxFeePerGas ?? feeData.gasPrice;
  if (!gasPrice) {
    throw new Error('Unable to estimate gas price.');
  }
  const deployCost = gasEstimate * gasPrice;

  if (balance < deployCost) {
    throw new Error(
      `Insufficient ETH. Estimated cost: ${ethers.formatEther(deployCost)} ETH`
    );
  }

  const contract = await factory.deploy(stakingToken);
  const deploymentTx = contract.deploymentTransaction();
  if (deploymentTx?.hash) {
    console.log(`Deploy tx: ${deploymentTx.hash}`);
  }

  await contract.waitForDeployment();
  const address = await contract.getAddress();
  console.log(`Staking contract deployed at: ${address}`);
}

main().catch((error) => {
  console.error('Deployment failed:', error?.message ?? error);
  process.exit(1);
});
