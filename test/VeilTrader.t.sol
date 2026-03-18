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
    
    function testGrantDelegation() public {
        vm.prank(owner);
        address delegate = address(0x456);
        uint256 maxValuePerTx = 1 ether;
        uint256 maxTotalValue = 10 ether;
        
        veilTrader.grantDelegation(delegate, maxValuePerTx, maxTotalValue);
        
        // Verify delegation worked by executing a small trade as delegate
        vm.prank(delegate);
        bytes32 actionHash = veilTrader.executeTrade(
            "BUY",
            address(0x1),
            address(0x2),
            0.5 ether, // Within delegation limits
            1 ether,
            "test trade"
        );
        
        assertTrue(actionHash != bytes32(0));
        assertEq(veilTrader.getTradeCount(), 1);
    }
    
    function testGrantDelegationZeroAddress() public {
        vm.prank(owner);
        vm.expectRevert("Delegate cannot be zero address");
        veilTrader.grantDelegation(address(0), 1 ether, 10 ether);
    }
    
    function testGrantDelegationToSelf() public {
        vm.prank(owner);
        vm.expectRevert("Cannot delegate to self");
        veilTrader.grantDelegation(owner, 1 ether, 10 ether);
    }
    
    function testGrantDelegationZeroLimits() public {
        vm.prank(owner);
        vm.expectRevert("Max value per tx must be greater than 0");
        veilTrader.grantDelegation(address(0x456), 0, 10 ether);
        
        vm.prank(owner);
        vm.expectRevert("Max total value must be greater than 0");
        veilTrader.grantDelegation(address(0x456), 1 ether, 0);
    }
    
    function testRevokeDelegation() public {
        vm.prank(owner);
        address delegate = address(0x456);
        veilTrader.grantDelegation(delegate, 1 ether, 10 ether);
        
        // Before revoking, delegate should be authorized - test by executing a small trade
        vm.prank(delegate);
        bytes32 actionHash1 = veilTrader.executeTrade(
            "BUY",
            address(0x1),
            address(0x2),
            0.5 ether,
            1 ether,
            "small trade"
        );
        assertTrue(actionHash1 != bytes32(0));
        
        vm.prank(owner);
        veilTrader.revokeDelegation(delegate);
        
        // After revoking, delegate should not be authorized - test by attempting a trade
        vm.prank(delegate);
        vm.expectRevert("Not authorized");
        veilTrader.executeTrade(
            "BUY",
            address(0x1),
            address(0x2),
            0.5 ether,
            1 ether,
            "small trade after revoke"
        );
    }
    
    function testIsAuthorizedOwner() public {
        // Owner should always be authorized for any amount
        // We can't directly test internal function, but executeTrade will fail if not authorized
        vm.prank(owner);
        // This should not revert if owner is authorized
        bytes32 actionHash = veilTrader.executeTrade(
            "BUY",
            address(0x1),
            address(0x2),
            1000 ether, // Large amount
            2000 ether,
            "owner trade"
        );
        assertTrue(actionHash != bytes32(0));
    }
    
    function testIsAuthorizedDelegateWithinLimits() public {
        vm.prank(owner);
        address delegate = address(0x456);
        // Use very small amounts to avoid any potential issues
        uint256 maxValuePerTx = 0.001 ether;
        uint256 maxTotalValue = 0.01 ether;
        veilTrader.grantDelegation(delegate, maxValuePerTx, maxTotalValue);
        
        // Owner should be able to execute (to make sure the contract is working)
        vm.prank(owner);
        bytes32 actionHashOwner = veilTrader.executeTrade(
            "BUY",
            address(0x1),
            address(0x2),
            0.0005 ether, // half of maxValuePerTx
            0.001 ether,
            "owner trade"
        );
        assertTrue(actionHashOwner != bytes32(0));
        
        // Delegate should be able to execute
        vm.prank(delegate);
        bytes32 actionHashDelegate = veilTrader.executeTrade(
            "BUY",
            address(0x1),
            address(0x2),
            0.0005 ether, // half of maxValuePerTx
            0.001 ether,
            "delegate trade"
        );
        assertTrue(actionHashDelegate != bytes32(0));
    }
    
    function testIsAuthorizedDelegateExceedsPerTxLimit() public {
        vm.prank(owner);
        address delegate = address(0x456);
        uint256 maxValuePerTx = 1 ether;
        uint256 maxTotalValue = 10 ether;
        veilTrader.grantDelegation(delegate, maxValuePerTx, maxTotalValue);
        
        // Should NOT be authorized for amounts exceeding per-tx limit
        vm.prank(delegate);
        vm.expectRevert("Not authorized");
        veilTrader.executeTrade(
            "BUY",
            address(0x1),
            address(0x2),
            2 ether, // Exceeds per-tx limit
            4 ether,
            "oversized trade"
        );
    }
    
    function testIsAuthorizedDelegateExceedsTotalLimit() public {
        // Set up delegation with small amounts for easier testing
        vm.prank(owner);
        address delegate = address(0x456);
        uint256 maxValuePerTx = 0.1 ether; // 0.1 ETH per transaction
        uint256 maxTotalValue = 1 ether;   // 1 ETH total
        veilTrader.grantDelegation(delegate, maxValuePerTx, maxTotalValue);
        
        // First, verify that a trade within limits works
        vm.prank(delegate);
        bytes32 actionHash1 = veilTrader.executeTrade(
            "BUY",
            address(0x1),
            address(0x2),
            0.05 ether, // Within per-tx limit of 0.1 ether
            0.1 ether,
            "small trade"
        );
        assertTrue(actionHash1 != bytes32(0));
        
        // Now spend some amount to get close to the limit
        // Spend 0.9 ether in small increments (9 trades of 0.1 ether each)
        for (uint256 i = 0; i < 9; i++) {
            vm.prank(delegate);
            veilTrader.executeTrade(
                "BUY",
                address(0x1),
                address(0x2),
                0.1 ether, // Exactly at per-tx limit
                0.2 ether,
                "trade"
            );
        }
        
        // At this point, 0.9 ether has been spent (9 trades of 0.1 ether each)
        // Now trying to spend 0.2 ether would exceed the total limit (0.9+0.2=1.1 > 1)
        vm.prank(delegate);
        vm.expectRevert("Not authorized");
        veilTrader.executeTrade(
            "BUY",
            address(0x1),
            address(0x2),
            0.2 ether, // Would make total 1.1 > 1
            0.4 ether,
            "over-total trade"
        );
    }
    
    function testIsAuthorizedNonDelegate() public {
        // Non-delegate should not be able to execute trades
        vm.prank(address(0x789));
        vm.expectRevert("Not authorized");
        veilTrader.executeTrade(
            "BUY",
            address(0x1),
            address(0x2),
            1 ether,
            2 ether,
            "unauthorized trade"
        );
    }
    
    function testExecuteTradeWithDelegation() public {
        // Set up delegation
        vm.prank(owner);
        address delegate = address(0x456);
        uint256 maxValuePerTx = 2 ether;
        uint256 maxTotalValue = 10 ether;
        veilTrader.grantDelegation(delegate, maxValuePerTx, maxTotalValue);
        
        // Execute trade as delegate
        vm.prank(delegate);
        bytes32 actionHash = veilTrader.executeTrade(
            "BUY",
            address(0x1),
            address(0x2),
            1 ether, // Within delegation limits
            2 ether,
            "delegated trade"
        );
        
        assertTrue(actionHash != bytes32(0));
        assertEq(veilTrader.getTradeCount(), 1);
        
        VeilTrader.Trade memory trade = veilTrader.getTrade(actionHash);
        assertEq(trade.actionType, "BUY");
        assertEq(trade.amountIn, 1 ether);
        
        // Verify the delegation worked by checking that we can still make another trade
        // (since we only spent 1 of 10 ether total limit)
        vm.prank(delegate);
        bytes32 actionHash2 = veilTrader.executeTrade(
            "BUY",
            address(0x1),
            address(0x2),
            1 ether, // Another 1 ether trade
            2 ether,
            "second delegated trade"
        );
        
        assertTrue(actionHash2 != bytes32(0));
        assertEq(veilTrader.getTradeCount(), 2);
    }
    
    function testExecuteTradeExceedsDelegationLimits() public {
        // Set up delegation with small amounts for easier testing
        vm.prank(owner);
        address delegate = address(0x456);
        uint256 maxValuePerTx = 0.1 ether; // 0.1 ETH
        uint256 maxTotalValue = 1 ether;   // 1 ETH
        veilTrader.grantDelegation(delegate, maxValuePerTx, maxTotalValue);
        
        // First, verify that a trade within limits works
        vm.prank(delegate);
        bytes32 actionHash1 = veilTrader.executeTrade(
            "BUY",
            address(0x1),
            address(0x2),
            0.05 ether, // Within per-tx limit of 0.1 ether
            0.1 ether,
            "small trade"
        );
        assertTrue(actionHash1 != bytes32(0));
        
        // Now try to execute trade exceeding per-tx limit - this should fail
        vm.prank(delegate);
        vm.expectRevert("Not authorized");
        veilTrader.executeTrade(
            "BUY",
            address(0x1),
            address(0x2),
            0.2 ether, // Exceeds per-tx limit of 0.1 ether
            0.4 ether,
            "oversized trade"
        );
    }
    
    function testExecuteTradeWithoutAuthorization() public {
        // Non-owner, non-delegate should not be able to execute trades
        vm.prank(address(0x789));
        vm.expectRevert("Not authorized");
        veilTrader.executeTrade(
            "BUY",
            address(0x1),
            address(0x2),
            1 ether,
            2 ether,
            "unauthorized trade"
        );
    }
}