pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;
import "./GovToken.sol";
import "./ProposalContract.sol";

contract Vote  {
    // change deployment addresses after deployment
    address govToken_addr  = address(0);
    GovToken gt = GovToken(govToken_addr);
    address proposal_contract_address = address(0);
    ProposalContract p = ProposalContract(proposal_contract_address);

    struct CastedVote{
        address wallet_address;
        uint votes;
    }

    event VoteCasted(uint ProposalID, uint votes);

    mapping(uint => CastedVote[]) proposal_casted_votes;

    function can_vote(uint vote_count) public view returns (uint){
        // create a function in govtoken to access this
        if(gt.balanceOf(msg.sender) < vote_count){
            return 0;
        }
        return 1;
    }

    function caste_vote(uint vote_count , uint proposal_id) public returns (uint){
        
        if(can_vote(vote_count) == 1){
            if(gt.deductToken(msg.sender , vote_count)==0){
                return 0;
            }
            proposal_casted_votes[proposal_id].push(CastedVote(msg.sender , vote_count));
            p.addVotes(proposal_id , vote_count);
            emit VoteCasted(proposal_id, vote_count);
            return 1;
        }
        return 0;
    }

    function get_casted_votes_array_length(uint proposal_id) public view returns (uint){
        return proposal_casted_votes[proposal_id].length;
    }

    function get_token_and_address_for_a_cast(uint proposal_id , uint index) public view returns(uint , address){
        return (proposal_casted_votes[proposal_id][index].votes , proposal_casted_votes[proposal_id][index].wallet_address);
    }

    function clear_casted_votes_after_epoch_ends()public{
        uint end = p.getProposalCount();
        for(uint i=0 ; i<end; i++){
            delete proposal_casted_votes[i];
        }
    }

    function reward_most_voted_proposal() public returns (uint){
      uint maximum_votes = 0;
      uint id = 0;
      uint end = p.getProposalCount();
      for(uint i=0;i<end;i++){
        if(p.getVote(i) > maximum_votes){
          maximum_votes = p.getVote(i);
          id = i;
        }
      }
      // Give 25 tokens to id
    return 1;
    }

    
}