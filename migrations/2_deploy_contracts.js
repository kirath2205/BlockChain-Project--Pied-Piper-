var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var ProposalContract = artifacts.require("./ProposalContract.sol");
var GovToken = artifacts.require("./GovToken.sol");
var Auth = artifacts.require("./Auth.sol");
var Vote = artifacts.require("./Vote.sol");
module.exports = function(deployer) {
  const name = 'Gov Token';
  const symbol = "GT";
  const supply = 10000000;
  deployer.deploy(SimpleStorage);
  deployer.deploy(ProposalContract);
  deployer.deploy(GovToken, name, symbol, supply);
  deployer.deploy(Auth);
  deployer.deploy(Vote);
};
