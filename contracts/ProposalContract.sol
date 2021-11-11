pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;
import "./GovToken.sol";

contract ProposalContract {
    uint public ProposalID = 0;

    struct Proposal {
        string proposal_text;
        string proposal_title;
        bool completed;
        uint epoch;
        uint votes;
    }

    mapping(uint => Proposal) public proposals;

    Proposal [] approved_proposals;
    uint public approved_proposals_count = 0;
    uint [] approved_proposals_votes;

    event ProposalCreated(uint ProposalID, string proposal_title);

    // constructor() GovToken() public {
    // }

    function addProposal(string memory proposal_text, string memory proposal_title, uint current_epoch) public returns (uint){
        proposals[ProposalID] = Proposal(proposal_text, proposal_title , false , current_epoch,0);
        emit ProposalCreated(ProposalID, proposal_title);
        ProposalID++;
        return ProposalID;
    }

    function getProposalCount() public view returns (uint){
      return ProposalID;
    }

    function getProposalById(uint id) public view returns (string memory  , string memory ,uint ){
      return (proposals[id].proposal_text,proposals[id].proposal_title,proposals[id].votes);
    }

    

    


}