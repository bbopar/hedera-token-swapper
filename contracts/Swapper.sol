// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "./Hedera/SafeHederaTokenService.sol";

contract Swapper is SafeHederaTokenService {
    IERC20 public usdc;
    IERC20 public barrage;
    address public admin;

    constructor(address _usdc, address _barrage) {
        usdc = IERC20(_usdc);
        barrage = IERC20(_barrage);
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only the admin can call this function");
        _;
    }

    function associateToken(address token) public onlyAdmin {
        safeAssociateToken(address(this), token);
    }

    function deposit(address token, int64 amount) public {
        safeTransferToken(token, msg.sender, address(this), amount);
    }

    function grantTokenKyc(address token) public onlyAdmin {
        safeGrantTokenKyc(address(this), token);
    }

    function swap(address barrageAddr, address usdcAddr, int64 amount) public {
        safeTransferToken(barrageAddr, msg.sender, address(this), amount);
        safeTransferToken(usdcAddr, address(this), msg.sender, amount);
    }

    function tokenAllowance(address token) public onlyAdmin {
        safeTokenAllowance(token, msg.sender, address(this));
    }

    function usdcBalanceOf(address account) public view returns (uint256) {
        return usdc.balanceOf(account);
    }

    function barrageBalanceOf(address account) public view returns (uint256) {
        return barrage.balanceOf(account);
    }
}
