const ConvertLib = artifacts.require('./ConvertLib.sol');
const SolarUnit = artifacts.require('./SolarUnit.sol');

module.exports = function (deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, SolarUnit);
  deployer.deploy(SolarUnit);
};
