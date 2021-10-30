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
 
    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowed;
 
    constructor(string memory _name , string memory _symbol , uint _supply) public {
        symbol = _symbol;
        name = _name;
        _totalSupply = _supply;
        balances[msg.sender] = _supply;

        emit Transfer(address(0), msg.sender, _supply);
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
        require(balances[from] >= tokens);
        balances[from] = safeSub(balances[from], tokens);
        allowed[from][msg.sender] = safeSub(allowed[from][msg.sender], tokens);
        balances[to] = safeAdd(balances[to], tokens);
        emit Transfer(from, to, tokens);
        return true;
    }
    
    function mint(address driver, uint tokens) public returns (bool success) {
        _totalSupply += tokens;
        balances[driver] += tokens;
        
        emit Transfer(address(0), driver, tokens);
        
    }
 

}