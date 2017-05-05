function ethStatsParam(ip) {
  return `enode://34023dbf5fbe45b8a0986bd3a831580f490b09a044ea26fb7e570e772c5a7188ffe00c961aba2a256f9ab594cecc626be90d447737186e8911df3b4ac7a6f6f5@${ip}:30301`;
}

function bootnodeParam(ip, name) {
  return `${name}:d@${ip}:3000`;
}

module.export = {
  ethStatsParam,
  bootnodeParam,
};
