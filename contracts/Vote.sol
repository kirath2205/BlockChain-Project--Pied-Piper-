pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;
import "./GovToken.sol";
import "./ProposalContract.sol";

contract Vote is GovToken, ProposalContract{

    struct CastedVote{
        address wallet_address;
        uint votes;
    }

    event VoteCasted(uint ProposalID, uint votes);

    mapping(uint => CastedVote[]) proposal_casted_votes;

    function can_vote(uint vote_count) public view returns (uint){
        if(balances[msg.sender] < vote_count){
            return 0;
        }
        return 1;
    }

    function caste_vote(uint vote_count , uint proposal_id) public returns (uint){
        
        if(can_vote(vote_count) == 1){
            balances[msg.sender] -= vote_count;
            proposal_casted_votes[proposal_id].push(CastedVote(msg.sender , vote_count));
            proposals[proposal_id].votes += vote_count;
            emit VoteCasted(proposal_id, vote_count);
            return 1;
        }
        return 0;
    }

    function revert_casted_votes_after_epoch_ends() internal {
        for(uint i=0;i<ProposalID;i++){
            uint casted_votes = proposal_casted_votes[i].length;
            for(uint k=0;k<casted_votes;k++){
                // give these tokens back to the corresponding wallets
            }
        }
    }

    function clear_casted_votes_after_epoch_ends()internal{
        for(uint i=0 ; i<ProposalID ; i++){
            delete proposal_casted_votes[i];
        }
    }

    function reward_most_voted_proposal() public returns (uint){
      uint maximum_votes = 0;
      uint id = 0;
      for(uint i=0;i<ProposalID;i++){
        if(proposals[i].votes > maximum_votes){
          maximum_votes = proposals[i].votes;
          id = i;
        }
      }
      // Give 25 tokens to id
    return 1;
    }

    function start_new_epoch() public  returns (uint){
        address user = msg.sender;
        if(user == _driver || _councilMembers[user]==1) {
            clear_casted_votes_after_epoch_ends();
            current_epoch++;
            ProposalID = 0;
            return 1;
        }
        return 0;
    }
}