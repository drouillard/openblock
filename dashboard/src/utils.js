
// Get function hashes
// TODO: also extract input parameter types for later decoding

// export function getFunctionHashes(abi) {
//   const hashes = [];
//   for (let i = 0; i < abi.length; i++) {
//     const item = abi[i];
//     if (item.type !== 'function') continue;
//     const signature = `${item.name}(${item.inputs.map(input => input.type).join(',')})`;
//     const hash = web3.sha3(signature);
//     console.log(`${item.name}=${hash}`);
//     hashes.push({ name: item.name, hash });
//   }
//   return hashes;
// }
//
// export function findFunctionByHash(hashes, functionHash) {
//   for (let i = 0; i < hashes.length; i++) {
//     if (hashes[i].hash.substring(0, 10) == functionHash.substring(0, 10)) { return hashes[i].name; }
//   }
//   return null;
// }
