pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;
import "./GovToken.sol";

contract ProposalContract is GovToken{
    uint public ProposalID = 0;

    struct Proposal {
        string proposal_text;
        string proposal_title;
    }

    mapping(uint => Proposal) public proposals;

    event ProposalCreated(uint ProposalID, string proposal_title);

    function addProposal(string memory proposal_text, string memory proposal_title) public returns (uint){
        proposals[ProposalID] = Proposal(proposal_text, proposal_title);
        emit ProposalCreated(ProposalID, proposal_title);
        ProposalID++;
        return ProposalID;
    }

    function getProposalCount() public view returns (uint){
      return ProposalID;
    }

    function getProposalById(uint id) public view returns (string memory  , string memory ){
      return (proposals[id].proposal_text,proposals[id].proposal_title);
    }

    function getAccountType() public view returns (string memory){
      return account_type[msg.sender];
    }

    function getWalletBalance() public view returns(uint){
      return balances[msg.sender];
    }
    
}