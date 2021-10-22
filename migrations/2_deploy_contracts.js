var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var ProposalContract = artifacts.require("./ProposalContract.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(ProposalContract);
};
