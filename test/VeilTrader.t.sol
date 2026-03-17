// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../contracts/VeilTrader.sol";

contract VeilTraderTest is Test {
    VeilTrader public veilTrader;
    address internal owner = address(0x123);
    address internal user = address(0x456);
    
    bytes32 internal agentId = keccak256("test-agent");
    
    // Event signatures
    event IdentityUpdated(bytes32 indexed agentId, string metadata);
    event TradeExecuted(
        bytes32 indexed actionHash,
        string actionType,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        uint256 timestamp
    );
    event ERC8004Registered(uint256 indexed tokenId, string metadataURI, string domain);
    event ReputationFeedbackGiven(
        uint256 indexed tradeIndex,
        int128 value,
        uint8 decimals,
        string tag1,
        string tag2
    );
    
    function setUp() public {
        vm.prank(owner);
        veilTrader = new VeilTrader(agentId);
    }
    
    function testConstructor() public {
        assertEq(veilTrader.agentId(), agentId);
        assertEq(veilTrader.owner(), owner);
        assertEq(veilTrader.erc8004TokenId(), 0); // Initially not registered
    }
    
    function testExecuteTrade() public {
        vm.prank(owner);
        bytes32 actionHash = veilTrader.executeTrade(
            "BUY",
            address(0x1),
            address(0x2),
            1000,
            2000,
            "test trade"
        );
        
        assertTrue(actionHash != bytes32(0));
        assertEq(veilTrader.getTradeCount(), 1);
        
        VeilTrader.Trade memory trade = veilTrader.getTrade(actionHash);
        assertEq(trade.actionType, "BUY");
        assertEq(trade.amountIn, 1000);
        assertEq(trade.reputationFeedbackGiven, 0); // Initially no feedback given
    }
    
    function testExecuteTradeNotOwner() public {
        vm.prank(user);
        vm.expectRevert("Not authorized");
        veilTrader.executeTrade(
            "BUY",
            address(0x1),
            address(0x2),
            1000,
            2000,
            "test trade"
        );
    }
    
    function testGetAllTrades() public {
        vm.prank(owner);
        veilTrader.executeTrade("BUY", address(0x1), address(0x2), 1000, 2000, "trade1");
        vm.prank(owner);
        veilTrader.executeTrade("SELL", address(0x2), address(0x1), 2000, 1000, "trade2");
        
        VeilTrader.Trade[] memory allTrades = veilTrader.getAllTrades();
        assertEq(allTrades.length, 2);
        
        assertEq(allTrades[0].actionType, "BUY");
        assertEq(allTrades[1].actionType, "SELL");
    }
    
    function testUpdateIdentity() public {
        vm.prank(owner);
        vm.expectEmit(true, true, true, true);
        emit IdentityUpdated(agentId, "updated metadata");
        veilTrader.updateIdentity("updated metadata");
    }
    
    function testTransferOwnership() public {
        vm.prank(owner);
        veilTrader.transferOwnership(user);
        assertEq(veilTrader.owner(), user);
    }
    
    function testTransferOwnershipZeroAddress() public {
        vm.prank(owner);
        vm.expectRevert("Invalid address");
        veilTrader.transferOwnership(address(0));
    }
    
    function testTradeIndexing() public {
        vm.prank(owner);
        bytes32 actionHash1 = veilTrader.executeTrade(
            "BUY",
            address(0x1),
            address(0x2),
            1000,
            2000,
            "trade1"
        );
        
        vm.prank(owner);
        bytes32 actionHash2 = veilTrader.executeTrade(
            "SELL",
            address(0x2),
            address(0x1),
            2000,
            1000,
            "trade2"
        );
        
        // Check that we can retrieve trades by their hash
        VeilTrader.Trade memory trade1 = veilTrader.getTrade(actionHash1);
        assertEq(trade1.actionType, "BUY");
        assertEq(trade1.amountIn, 1000);
        
        VeilTrader.Trade memory trade2 = veilTrader.getTrade(actionHash2);
        assertEq(trade2.actionType, "SELL");
        assertEq(trade2.amountIn, 2000);
        
        // Check that all trades are returned correctly
        VeilTrader.Trade[] memory allTrades = veilTrader.getAllTrades();
        assertEq(allTrades.length, 2);
        assertEq(allTrades[0].actionHash, actionHash1);
        assertEq(allTrades[1].actionHash, actionHash2);
    }
    
    function testReputationFeedbackTracking() public {
        vm.prank(owner);
        bytes32 actionHash = veilTrader.executeTrade(
            "BUY",
            address(0x1),
            address(0x2),
            1000,
            2000,
            "test trade"
        );
        
        // Initially no feedback should be given
        VeilTrader.Trade memory trade = veilTrader.getTrade(actionHash);
        assertEq(trade.reputationFeedbackGiven, 0);
        
        // After we implement the feedback function, we'll test it
        // For now, just verify the field exists and is initialized to 0
    }
    
    function testVerifyDomainRegistration() public {
        // Before registration, should return false
        assertEq(veilTrader.verifyDomainRegistration("veiltrader.xyz"), false);
        
        // After we implement registration with a domain, we'll test it properly
        // For now, just verify the function exists and returns a bool
    }
    
    function testGetCrossChainIdentifier() public {
        // Before registration, should return empty string
        assertEq(veilTrader.getCrossChainIdentifier(8453), ""); // Base Sepolia chain ID
        
        // After we implement registration, we'll test it properly
        // For now, just verify the function exists and returns a string
    }
}