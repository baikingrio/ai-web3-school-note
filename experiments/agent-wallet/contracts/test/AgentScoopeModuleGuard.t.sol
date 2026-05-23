// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {AgentScoopeModuleGuard} from "../src/AgentScoopeModuleGuard.sol";
import {Enum} from "@safe/interfaces/Enum.sol";

contract AgentScoopeModuleGuardTest is Test {
    AgentScoopeModuleGuard guard;

    address constant ALLOWANCE_MODULE = 0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134;
    address constant USDC = 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238;
    address constant RECIPIENT = 0x000000000000000000000000000000000000bEEF;
    address constant OTHER = 0x000000000000000000000000000000000000dEaD;

    function setUp() public {
        address[] memory recipients = new address[](1);
        recipients[0] = RECIPIENT;
        guard = new AgentScoopeModuleGuard(
            ALLOWANCE_MODULE,
            USDC,
            recipients,
            block.timestamp + 1 days
        );
    }

    function _transferCalldata(address to, uint256 amount) internal pure returns (bytes memory) {
        return abi.encodeWithSelector(0xa9059cbb, to, amount);
    }

    function test_allowsWhitelistedTransfer() public {
        guard.checkModuleTransaction(
            USDC,
            0,
            _transferCalldata(RECIPIENT, 500_000),
            Enum.Operation.Call,
            ALLOWANCE_MODULE
        );
    }

    function test_revertsNonWhitelistedRecipient() public {
        vm.expectRevert(AgentScoopeModuleGuard.TransferToUnlistedAddress.selector);
        guard.checkModuleTransaction(
            USDC,
            0,
            _transferCalldata(OTHER, 500_000),
            Enum.Operation.Call,
            ALLOWANCE_MODULE
        );
    }

    function test_revertsApprove() public {
        bytes memory approveData = abi.encodeWithSelector(0x095ea7b3, OTHER, type(uint256).max);
        vm.expectRevert(AgentScoopeModuleGuard.MethodNotAllowed.selector);
        guard.checkModuleTransaction(USDC, 0, approveData, Enum.Operation.Call, ALLOWANCE_MODULE);
    }

    function test_revertsWrongToken() public {
        vm.expectRevert(AgentScoopeModuleGuard.TokenNotAllowed.selector);
        guard.checkModuleTransaction(
            OTHER,
            0,
            _transferCalldata(RECIPIENT, 1),
            Enum.Operation.Call,
            ALLOWANCE_MODULE
        );
    }

    function test_revertsWrongModule() public {
        vm.expectRevert(AgentScoopeModuleGuard.OnlyAllowanceModule.selector);
        guard.checkModuleTransaction(
            USDC,
            0,
            _transferCalldata(RECIPIENT, 1),
            Enum.Operation.Call,
            address(0x1234)
        );
    }

    function test_revertsExpired() public {
        vm.warp(block.timestamp + 2 days);
        vm.expectRevert(AgentScoopeModuleGuard.PolicyExpired.selector);
        guard.checkModuleTransaction(
            USDC,
            0,
            _transferCalldata(RECIPIENT, 1),
            Enum.Operation.Call,
            ALLOWANCE_MODULE
        );
    }

    function test_revertsDelegateCall() public {
        vm.expectRevert(AgentScoopeModuleGuard.InvalidOperation.selector);
        guard.checkModuleTransaction(
            USDC,
            0,
            _transferCalldata(RECIPIENT, 1),
            Enum.Operation.DelegateCall,
            ALLOWANCE_MODULE
        );
    }

    function test_ownerCanAddRecipient() public {
        guard.setRecipient(OTHER, true);
        guard.checkModuleTransaction(
            USDC,
            0,
            _transferCalldata(OTHER, 1),
            Enum.Operation.Call,
            ALLOWANCE_MODULE
        );
    }
}
