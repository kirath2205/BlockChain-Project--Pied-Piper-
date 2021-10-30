pragma solidity >=0.4.21 <0.7.0;
 
contract SafeMath {
 
    function safeAdd(uint a, uint b) public pure returns (uint c) {
        c = a + b;
        require(c >= a);
    }
 
    function safeSub(uint a, uint b) public pure returns (uint c) {
        require(b <= a);
        c = a - b;
    }
 
    function safeMul(uint a, uint b) public pure returns (uint c) {
        c = a * b;
        require(a == 0 || c / a == b);
    }
 
    function safeDiv(uint a, uint b) public pure returns (uint c) {
        require(b > 0);
        c = a / b;
    }
}
 
 
//ERC Token Standard #20 Interface
 
contract ERC20Interface {
    function totalSupply() public view returns (uint);
    function balanceOf(address tokenOwner) public view returns (uint balance);
    function transfer(address to, uint tokens) public returns (bool success);
    function transferFrom(address from, address to, uint tokens) public returns (bool success);
 
    event Transfer(address indexed from, address indexed to, uint tokens);
    
}
 
 
//Contract function to receive approval and execute function in one call
 

 
//Actual token contract
 
contract GovToken is ERC20Interface, SafeMath {
    string public symbol;
    string public  name;
    uint public _totalSupply;
    address root_user;
 
    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowed;
    mapping(string => address[]) accounts;
    mapping(string => uint) accounts_count;
 
    constructor(string memory _name , string memory _symbol , uint _supply) public {
        symbol = _symbol;
        name = _name;
        _totalSupply = _supply;
        balances[msg.sender] = _supply;
        root_user = msg.sender;

        emit Transfer(address(0), msg.sender, _supply);
    }
    
    function initial_transfer(string memory wallet_type, address receiver_address , uint tokens) public returns (bool){
        
        if(balances[receiver_address]!=0){
            return false;
        }
        
        for(uint i=0;i<accounts_count[wallet_type];i++){
            if(accounts[wallet_type][i] == receiver_address){
                return false;
            }
        }
        
        balances[root_user] = safeSub(balances[root_user],tokens);
        balances[receiver_address] = safeAdd(balances[receiver_address],tokens);
        accounts[wallet_type].push(receiver_address);
        accounts_count[wallet_type]++;
        return true;
    }
    
    function totalSupply() public view returns (uint) {
        return _totalSupply  - balances[address(0)];
    }
 
    function balanceOf(address tokenOwner) public view returns (uint balance) {
        return balances[tokenOwner];
    }
 
    function transfer(address to, uint tokens) public returns (bool success) {
        balances[msg.sender] = safeSub(balances[msg.sender], tokens);
        balances[to] = safeAdd(balances[to], tokens);
        emit Transfer(msg.sender, to, tokens);
        return true;
    }
 

    function transferFrom(address from, address to, uint tokens) public returns (bool success) {
        balances[from] = safeSub(balances[from], tokens);
        allowed[from][msg.sender] = safeSub(allowed[from][msg.sender], tokens);
        balances[to] = safeAdd(balances[to], tokens);
        emit Transfer(from, to, tokens);
        return true;
    }
 

}