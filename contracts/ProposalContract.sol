pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;
import "./GovToken.sol";

contract ProposalContract {
  // change deployment addresses after deployment
    address govToken_addr  = address(0x0);
    GovToken gt = GovToken(govToken_addr);
    struct Proposal {
        string proposal_text;
        string proposal_title;
        uint epoch;
        uint votes;
        address proposer;
    }
    
    mapping (uint => mapping(uint => Proposal)) public proposals;
    mapping (uint => uint) public proposal_count_for_epochs;
    mapping (uint => Proposal[]) public approved_proposals_for_epochs;


    event ProposalCreated(uint ProposalID, string proposal_title);

    function addProposal(string memory proposal_text, string memory proposal_title) public returns (uint){
      uint current_e = gt.get_current_epoch();
      proposals[current_e][proposal_count_for_epochs[current_e]] = Proposal(proposal_text, proposal_title , current_e,0, msg.sender);
      proposal_count_for_epochs[current_e]++;
      emit ProposalCreated(proposal_count_for_epochs[current_e], proposal_title);
      return proposal_count_for_epochs[current_e];
    }

    function getProposalCount() public view returns (uint){
      uint current_e = gt.get_current_epoch();
      return proposal_count_for_epochs[current_e];
    }

    function getProposalById(uint id) public view returns (string memory  , string memory ,uint, address ){
      uint current_e = gt.get_current_epoch();
      Proposal memory proposal = proposals[current_e][id];
      return (proposal.proposal_text, proposal.proposal_title, proposal.votes, proposal.proposer);
    }
    
    function getProposer(uint id) public view returns (address){
      uint current_e = gt.get_current_epoch();
      Proposal memory proposal = proposals[current_e][id];
      return proposal.proposer;
    }

    function addVotes(uint id , uint votes)public {
      proposals[gt.get_current_epoch()][id].votes += votes;
    }

    function getVote(uint proposal_id)public view returns (uint){
      return proposals[gt.get_current_epoch()][proposal_id].votes;
    }

    function getPastProposal(uint id , uint epoch) public view returns(string memory , string memory , uint , address){
      return (proposals[epoch][id].proposal_title , proposals[epoch][id].proposal_text , proposals[epoch][id].votes , proposals[epoch][id].proposer);
    }
    
}