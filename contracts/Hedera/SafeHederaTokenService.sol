// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.7;

import "./HederaTokenService.sol";

abstract contract SafeHederaTokenService is HederaTokenService {
    function safeAssociateToken(address account, address token) internal {
        int256 responseCode;
        (responseCode) = HederaTokenService.associateToken(account, token);
        require(responseCode == HederaResponseCodes.SUCCESS, "Safe single association failed!");
    }

    function safeGrantTokenKyc(address account, address token) internal {
        int256 responseCode;
        (responseCode) = HederaTokenService.grantTokenKyc(token, account);
        require(responseCode == HederaResponseCodes.SUCCESS, "Safe single grant KYC failed!");
    }

    function safeTransferToken(address token, address sender, address receiver, int64 amount) internal {
        int256 responseCode;
        (responseCode) = HederaTokenService.transferToken(token, sender, receiver, amount);
        require(responseCode == HederaResponseCodes.SUCCESS, "Safe token transfer failed!");
    }

    function safeTokenAllowance(address token, address owner, address spender) internal {
        int256 responseCode;
        uint256 amount;
        (responseCode, amount) = HederaTokenService.allowance(token, owner, spender);
        require(responseCode == HederaResponseCodes.SUCCESS, "Safe single association failed!");
    }
}
