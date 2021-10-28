pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;

contract Auth{
    
    struct Profile {
        string username;
        string password;
        string secret_phrase;
    }
    
    mapping(address => Profile[]) public profiles;
    mapping(address => uint) public number_of_profiles;
    
    event ProfileCreated(string username , address wallet_address);
    event PasswordUpdated(string username);
    
    function addProfile(string memory username , string memory password , string memory secret_phrase) public {
        profiles[msg.sender].push(Profile(username , password , secret_phrase));
        number_of_profiles[msg.sender]++;
        emit ProfileCreated(username , msg.sender);
    }
    
    //function viewProfile(string memory username) public view;
    
    function updatePassword(string memory username , string memory secret_phrase , string memory new_password) public returns (bool){
        
        uint loop_end = number_of_profiles[msg.sender];
        for(uint i=0 ; i<loop_end ; i=i+1){
            if(keccak256(abi.encodePacked(profiles[msg.sender][i].username)) == keccak256(abi.encodePacked(username)) && keccak256(abi.encodePacked(profiles[msg.sender][i].secret_phrase)) == keccak256(abi.encodePacked(secret_phrase))){
                profiles[msg.sender][i].password = new_password;
                emit PasswordUpdated(username);
                return true;
            }
        }
        return false;
    }
    
}