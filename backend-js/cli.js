const { ApiPromise } = require('@polkadot/api');

async function main() {
  const params = process.argv.slice(2);
  const api = await ApiPromise.create();
  let blockInfo

  switch (params.length) {
    case 0:
      blockInfo = await api.rpc.chain.getHeader();
      console.log('Latest block information:');
      displayBlockInfo(blockInfo);
      break
    case 2:
      const blockHash = params[0] == '-n' || params[0] == '--number' ? await api.query.system.blockHash(params[1]) : params[1];
      blockInfo = await api.rpc.chain.getHeader(blockHash);
      console.log('Block information:');
      displayBlockInfo(blockInfo);
      break
    default:
      blockInfo = await api.rpc.chain.getHeader();
      console.log('Latest block information:');
      displayBlockInfo(blockInfo);
      break
  }
}

function displayBlockInfo(blockInfo) {
  const blockNumber = blockInfo && blockInfo.number && blockInfo.number.toNumber() || '';
  const blockAuthor = blockInfo && blockInfo.author && blockInfo.author.toHuman() || '';
  const blockHash = blockInfo && blockInfo.hash && blockInfo.hash.toHuman() || '';
  const blockParentHash = blockInfo && blockInfo.parentHash && blockInfo.parentHash.toHuman() || '';
  const blockStateRoot = blockInfo && blockInfo.stateRoot && blockInfo.stateRoot.toHuman() || '';
  const blockExtrinsicsRoot = blockInfo && blockInfo.extrinsicsRoot && blockInfo.extrinsicsRoot.toHuman() || '';
  console.log(`Number: ${blockNumber}`);
  console.log(`Author: ${blockAuthor}`);
  console.log(`Hash: ${blockHash}`);
  console.log(`ParentHash: ${blockParentHash}`);
  console.log(`StateRoot: ${blockStateRoot}`);
  console.log(`ExtrinsicsRoot: ${blockExtrinsicsRoot}`);
}

main().catch(console.error).then(() => process.exit(0));
