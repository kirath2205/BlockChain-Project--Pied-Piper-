pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;
import "./GovToken.sol";

contract ProposalContract {
  // change deployment addresses after deployment
    address govToken_addr  = 0x3D416Cfa03D21155529Dc2aa7f877137B719ca74;
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
    mapping(uint => uint[]) private approved_proposals;
    mapping (uint =>  mapping(uint => uint8)) private approved_proposals_for_epochs;


    event ProposalCreated(uint ProposalID, string proposal_title);
    
    function getApprovalsByEpoch(uint epoch) public view returns (uint[] memory) {
        return approved_proposals[epoch];
    }
    
    function updateApprovalStatus(uint id) public {
        approved_proposals[gt.get_current_epoch()].push(id);
        approved_proposals_for_epochs[gt.get_current_epoch()][id] = 1;
    }

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

    function addVotes(uint id , uint votes) public {
      proposals[gt.get_current_epoch()][id].votes += votes;
    }

    function getVote(uint proposal_id)public view returns (uint){
      return proposals[gt.get_current_epoch()][proposal_id].votes;
    }

    function getPastProposal(uint id , uint epoch) public view returns(string memory , string memory , uint , address, uint8){
      uint8 approval_status = approved_proposals_for_epochs[epoch][id];
      return (proposals[epoch][id].proposal_title , proposals[epoch][id].proposal_text , proposals[epoch][id].votes , proposals[epoch][id].proposer, approval_status);
    }

    function getPastProposalCount(uint epoch) public view returns (uint) {
      return (proposal_count_for_epochs[epoch]);
    }

    function get_current_epoch() public view returns (uint) {
      return gt.get_current_epoch();
    }
    
    function getAddressProposal() public view returns(address){
      return address(this);
    }

    function setContractAddress(address govtoken_add) public {
        gt = GovToken(govtoken_add);
    }
    
}