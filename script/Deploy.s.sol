// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../contracts/VeilTrader.sol";

contract DeployScript is Script {
    function run() external {
        string memory privateKeyStr = vm.envString("PRIVATE_KEY");
        if (bytes(privateKeyStr).length == 64) {
            privateKeyStr = string(abi.encodePacked("0x", privateKeyStr));
        }
        uint256 deployerPrivateKey = vm.parseUint(privateKeyStr);
        
        vm.startBroadcast(deployerPrivateKey);
        
        string memory agentIdStr = vm.envString("AGENT_ID");
        bytes32 agentId = keccak256(abi.encodePacked(agentIdStr));
        
        VeilTrader veilTrader = new VeilTrader(agentId);
        
        console.log("VeilTrader deployed at:", address(veilTrader));
        
        vm.stopBroadcast();
    }
}