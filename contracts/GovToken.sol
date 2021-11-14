pragma solidity >=0.4.21 <0.7.0;
 import "./Vote.sol";
import "./ProposalContract.sol";
import "./Safemath.sol";

// contract SafeMath {
 
//     function safeAdd(uint a, uint b) public pure returns (uint c) {
//         c = a + b;
//         require(c >= a);
//     }
 
//     function safeSub(uint a, uint b) public pure returns (uint c) {
//         require(b <= a);
//         c = a - b;
//     }
 
//     function safeMul(uint a, uint b) public pure returns (uint c) {
//         c = a * b;
//         require(a == 0 || c / a == b);
//     }
 
//     function safeDiv(uint a, uint b) public pure returns (uint c) {
//         require(b > 0);
//         c = a / b;
//     }
// }
 
 
//ERC Token Standard #20 Interface
contract ERC20Interface {
    function totalSupply() public view returns (uint);
    function balanceOf(address tokenOwner) public view returns (uint balance);
    function transfer(address to, uint tokens) public returns (uint success);
    function transferFrom(address from, address to, uint tokens) public returns (uint success);
    event Transfer(address indexed from, address indexed to, uint tokens);
    
}
 
contract GovToken is ERC20Interface {
    // change deployment addresses after deployment
    address proposal_contract_address = 0x0;
    ProposalContract p = ProposalContract(proposal_contract_address);

    address vote_contract_address = 0x0;
    Vote vote = Vote(vote_contract_address);
    // currently the allocation etc is for council members only, need to extend to other platform users.
    string public symbol;
    string public  name;
    uint public _totalSupply;
    uint current_epoch = 0;
    bool council_meeting = false;
    
    address internal _driver;
    mapping(address => uint8) internal _councilMembers;
    
    uint private MIN_SIGNATURES = 0;
    

    // struct Council{
    //     address root_user;
    //     address council_member_one;
    //     address council_member_two;
    // }
    
    modifier isOwner() {
        require(msg.sender == _driver);
        _;
    }

    modifier validOwner() {
        require(msg.sender == _driver || _councilMembers[msg.sender] == 1);
        _;
    }
    
    using SafeMath for uint256;
    mapping(address => uint256) public balances;
    mapping(address => string) account_type;
    // Council newCouncil = Council(address(0) , address(0) , address(0));
    
    constructor(string memory _name , string memory _symbol , uint _supply) public {
        symbol = _symbol;
        name = _name;
        _totalSupply = _supply;
        balances[msg.sender] = _supply;
        // newCouncil.root_user = msg.sender;
        _driver = msg.sender;
        emit Transfer(address(0), msg.sender, _supply);
    }

    function revert_casted_votes_after_epoch_ends() internal {
        uint end = p.getProposalCount();
        for(uint i=0;i<end;i++){
            uint casted_votes = vote.get_casted_votes_array_length(i);
            for(uint k=0;k<casted_votes;k++){
                (uint votes ,address  wallet_address ) = vote.get_token_and_address_for_a_cast(i,k);
                balances[wallet_address].add(votes);
            }
        }
    }

    function start_new_epoch() public  returns (uint){
        address user = msg.sender;
        if(check_if_council_member(user) == 1) {
            revert_casted_votes_after_epoch_ends();
            vote.clear_casted_votes_after_epoch_ends();
            increment_epoch();
            return 1;
        }
        return 0;
    }

    function getWalletBalance() public view returns(uint){
      return balances[msg.sender];
    }

    function getAccountType() public view returns (string memory){
      return account_type[msg.sender];
    }
    
    function initial_transfer(string memory wallet_type, address receiver_address , uint tokens) isOwner public returns (uint){
        
        if(balances[receiver_address] == 0 && keccak256(abi.encodePacked(account_type[receiver_address])) == keccak256(abi.encodePacked(""))){

            if(keccak256(abi.encodePacked(wallet_type)) == keccak256(abi.encodePacked("council_member"))){

                // if(newCouncil.council_member_one == address(0)){
                //     newCouncil.council_member_one = receiver_address;
                // }
                // else if(newCouncil.council_member_two == address(0)){
                //     newCouncil.council_member_two = receiver_address;
                // }
                // else{
                //     return 0;
                // }
                _councilMembers[receiver_address] =1;
                MIN_SIGNATURES++;
              
            }

            account_type[receiver_address] = wallet_type;
            // balances[newCouncil.root_user] = safeSub(balances[newCouncil.root_user],tokens);
            // balances[_driver] = safeSub(balances[_driver],tokens);
            balances[_driver] = balances[_driver].sub(tokens);
            balances[receiver_address] = balances[receiver_address].add(tokens);
            // balances[receiver_address] = safeAdd(balances[receiver_address],tokens);
            return 1;
        }
        return 0;

        // else{
        //     return 0;
        // }
        
    }
    
    function totalSupply() public view returns (uint) {
        return _totalSupply  - balances[address(0)];
    }
    // is this the supply that has yet to be assigned? we can display this so council knows when thr is a need to mint more?
    // currently the driver initially has all the tokens
    // when registering, r we minting new tokens? need multisig for these mints??
    // else, transfer from driver, but this means driver's power changes constantly.
 
    function balanceOf(address tokenOwner) public view returns (uint) {
        return balances[tokenOwner];
    }
 
    // function transfer(address to, uint tokens) private returns (uint) {
    //     if(tokens < balances[msg.sender]){
    //         return 0;
    //     }
    //     balances[msg.sender] = safeSub(balances[msg.sender], tokens);
    //     balances[to] = safeAdd(balances[to], tokens);
    //     emit Transfer(msg.sender, to, tokens);
    //     return 1;
    // }
    function _transfer(address from, address to, uint tokens) private  {
        require (tokens < balances[from]);
        balances[from] = balances[from].sub(tokens);
        balances[to] = balances[to].add(tokens);
        emit Transfer(from, to, tokens);
        
    }
 

    function _mint(uint tokens) private {
        _totalSupply += tokens;
        balances[_driver] += tokens;
        emit Transfer(_driver, _driver, tokens);
    }
    
   
    function transfer(address to, uint tokens) validOwner public returns (uint success) {
        createTransction(msg.sender, to, tokens, "TRANSFER");
        return 1;
    }
    
    function transferFrom(address from, address to, uint tokens) validOwner public returns (uint success) {
        require(msg.sender == from);
        createTransction(from, to, tokens, "TRANSFER");
        return 1;
    }
    
    // do we need a way for non 
    
    function mintTokens(uint tokens) isOwner public {
        createTransction(msg.sender, msg.sender, tokens, "MINTING");
    }
    
    function receiveTokens(uint tokens) validOwner public {
        createTransction(_driver, msg.sender, tokens, "RECEIVE");
    }
    
    function transferTo(address to, uint tokens) validOwner public  {
        createTransction(msg.sender, to, tokens, "TRANSFER");
    }
    
    function deductToken(address user , uint tokens) public returns (uint){
        if(balances[user]>=tokens){
            balances[user]-=tokens;
            return 1;
        }
        return 0;
    }

    function getDriverAddress() public view returns (address){
        return _driver;
    }
    
    // multisig features
    
    struct Transaction {
      string txnType;
      address from;
      address to;
      uint tokens;
      uint8 signatureCount;
      mapping (address => uint8) signatures;
    }
    
    uint private _transactionIdx;
    mapping (uint => Transaction) private _transactions;
    uint[] private _pendingTransactions;
    
    event TransactionCreated(address from, address to, uint amount, string txnType, uint transactionId);
    event TransactionCompleted(address from, address to, uint amount, string txnType,  uint transactionId);
    event TransactionSigned(address by, string txnType, uint transactionId);
    
    
  
    function createTransction(address from, address to, uint tokens, string memory txnType) validOwner private {
        uint transactionId = _transactionIdx++;
        Transaction memory transaction;
        transaction.txnType = txnType;
        transaction.from = from;
        transaction.to = to;
        transaction.tokens = tokens;
        transaction.signatureCount = 0;
        
        _transactions[transactionId] = transaction;
        _pendingTransactions.push(transactionId);

        emit TransactionCreated(from, to, tokens,txnType, transactionId);
        
    }
    function getPendingTransactions()
      view
      validOwner
      public
      returns (uint[] memory) {
      return _pendingTransactions;
    }
    
    function signTransaction(uint transactionId)
      validOwner
      public {

      Transaction storage transaction = _transactions[transactionId];

      // Transaction must exist
      require(address(0x0) != transaction.from);
      // Creator cannot sign the transaction
      if (keccak256(abi.encodePacked(transaction.txnType)) == keccak256(abi.encodePacked("RECEIVE"))) {
     
          require(msg.sender != transaction.to);
      } else {
          require(msg.sender != transaction.from);
      }
      
      // Cannot sign a transaction more than once
      require(transaction.signatures[msg.sender] != 1);

      transaction.signatures[msg.sender] = 1;
      transaction.signatureCount++;

      emit TransactionSigned(msg.sender, transaction.txnType, transactionId);

      if (transaction.signatureCount >= MIN_SIGNATURES) {
        if (keccak256(abi.encodePacked(transaction.txnType)) == keccak256(abi.encodePacked("MINTING"))) {
      
            // mint(transaction.to, transaction.tokens);
            _mint(transaction.tokens);
            //mint, i.e. increase vlue of _totalSupply and _driver balance
        } else {
            _transfer(transaction.from, transaction.to, transaction.tokens);
            
            //transfer tokens from transaction.from to transaction.to
            // receive, i.e. transfer tokens from _driver to transaction.to
        }
          
          
        // require(address(this).balance >= transaction.amount);
        // transaction.to.transfer(transaction.amount);
        emit TransactionCompleted(transaction.from, transaction.to, transaction.tokens, transaction.txnType, transactionId);
        deleteTransaction(transactionId);
      }
    }
    
    function deleteTransaction(uint transactionId)
      validOwner
      public {
      uint8 replace = 0;
      for(uint i = 0; i < _pendingTransactions.length; i++) {
        if (1 == replace) {
          _pendingTransactions[i-1] = _pendingTransactions[i];
        } else if (transactionId == _pendingTransactions[i]) {
          replace = 1;
        }
      }
      _pendingTransactions.pop();
      delete _transactions[transactionId];
    }

//  
    function start_council_meeting() public returns (uint){
        if(council_meeting){
            council_meeting = false;
            return 0;
        }
        else{
            council_meeting = true;
            return 1;
        }
    }

    function check_if_council_member() public view returns (uint){
        if(msg.sender == _driver || _councilMembers[msg.sender] == 1){
            return 1;
        }
        return 0;
    }

    function increment_epoch() public {
        current_epoch++;
    }

    function get_current_epoch() public view returns (uint){
        return current_epoch;
    }

 
}