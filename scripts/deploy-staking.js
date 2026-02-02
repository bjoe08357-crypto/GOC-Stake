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

  const tokenCode = await provider.getCode(stakingToken);
  if (tokenCode === '0x') {
    throw new Error(
      'STAKING_TOKEN_ADDRESS has no contract code on mainnet. Verify the token address.'
    );
  }

  const artifactPath = path.resolve('src/abi/Staking.json');
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

  const factory = new ethers.ContractFactory(
    artifact.abi,
    artifact.bytecode,
    wallet
  );
  const deployTx = await factory.getDeployTransaction(stakingToken);
  const feeData = await provider.getFeeData();

  const gasLimitOverride = env.DEPLOY_GAS_LIMIT
    ? BigInt(env.DEPLOY_GAS_LIMIT)
    : null;
  let gasLimit;
  if (gasLimitOverride) {
    gasLimit = gasLimitOverride;
    console.log(`Using DEPLOY_GAS_LIMIT: ${gasLimit.toString()}`);
  } else {
    try {
      const gasEstimate = await provider.estimateGas({
        ...deployTx,
        from: wallet.address,
      });
      gasLimit = gasEstimate;
      console.log(`Gas estimate: ${gasLimit.toString()}`);
    } catch (error) {
      throw new Error(
        'Gas estimation failed. Set DEPLOY_GAS_LIMIT to proceed.'
      );
    }
  }

  const parseGwei = (value) =>
    value ? ethers.parseUnits(value, 'gwei') : null;
  const maxFeePerGas =
    parseGwei(env.DEPLOY_MAX_FEE_GWEI) ??
    feeData.maxFeePerGas ??
    feeData.gasPrice;
  const maxPriorityFeePerGas =
    parseGwei(env.DEPLOY_PRIORITY_FEE_GWEI) ??
    feeData.maxPriorityFeePerGas ??
    ethers.parseUnits('1.5', 'gwei');
  if (!maxFeePerGas) {
    throw new Error('Unable to determine max fee per gas.');
  }

  if (feeData.lastBaseFeePerGas) {
    console.log(
      `Base fee: ${ethers.formatUnits(feeData.lastBaseFeePerGas, 'gwei')} gwei`
    );
  }
  console.log(
    `Max fee: ${ethers.formatUnits(maxFeePerGas, 'gwei')} gwei`
  );
  console.log(
    `Priority fee: ${ethers.formatUnits(maxPriorityFeePerGas, 'gwei')} gwei`
  );
  const maxCost = gasLimit * maxFeePerGas;
  console.log(`Max cost: ${ethers.formatEther(maxCost)} ETH`);

  if (balance < maxCost) {
    const missing = maxCost - balance;
    throw new Error(
      `Insufficient ETH. Missing ~${ethers.formatEther(missing)} ETH`
    );
  }

  const nonceOverride = env.DEPLOY_NONCE ? Number(env.DEPLOY_NONCE) : null;
  const contract = await factory.deploy(stakingToken, {
    gasLimit,
    maxFeePerGas,
    maxPriorityFeePerGas,
    ...(nonceOverride !== null ? { nonce: nonceOverride } : {}),
  });
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
