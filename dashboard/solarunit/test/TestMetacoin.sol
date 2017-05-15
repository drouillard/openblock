pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/SolarUnit.sol";

contract TestSolarUnit {

  function testInitialBalanceUsingDeployedContract() {
    SolarUnit solar = SolarUnit(DeployedAddresses.SolarUnit());

    uint expected = 10000;

    Assert.equal(solar.getBalance(tx.origin), expected, "Owner should have 10000 SolarUnit initially");
  }

  function testInitialBalanceWithNewSolarUnit() {
    SolarUnit solar = new SolarUnit();

    uint expected = 10000;

    Assert.equal(solar.getBalance(tx.origin), expected, "Owner should have 10000 SolarUnit initially");
  }

}
