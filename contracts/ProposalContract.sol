pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;
import "./GovToken.sol";

contract ProposalContract {
    uint public ProposalID = 0;
    GovToken gt;
    struct Proposal {
        string proposal_text;
        string proposal_title;
        uint epoch;
        uint votes;
    }

    mapping (uint => mapping(uint => Proposal)) public proposals;
    mapping (uint => uint) public proposal_count_for_epochs;
    mapping (uint => Proposal[]) public approved_proposals_for_epochs;


    event ProposalCreated(uint ProposalID, string proposal_title);

    function addProposal(string memory proposal_text, string memory proposal_title) public returns (uint){
        proposals[gt.get_current_epoch()][proposal_count_for_epochs[gt.get_current_epoch()]] = Proposal(proposal_text, proposal_title , gt.get_current_epoch(),0);
        proposal_count_for_epochs[gt.get_current_epoch()]++;
        emit ProposalCreated(ProposalID, proposal_title);
    }

    function getProposalCount() public view returns (uint){
      return proposal_count_for_epochs[gt.get_current_epoch()];
    }

    function getProposalById(uint id) public view returns (string memory  , string memory ,uint ){
      return (proposals[gt.get_current_epoch()][id].proposal_text ,proposals[gt.get_current_epoch()][id].proposal_title,
      proposals[gt.get_current_epoch()][id].votes );
    }

    function addVotes(uint id , uint votes)public {
      proposals[gt.get_current_epoch()][id].votes += votes;
    }

    function getVote(uint proposal_id)public view returns (uint){
      return proposals[gt.get_current_epoch()][proposal_id].votes;
    }
    
}