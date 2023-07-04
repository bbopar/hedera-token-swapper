// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BarrageERC20 is ERC20 {
    constructor(string memory name, string memory symbol, uint256 amount) ERC20(name, symbol) {
      require(amount > 0);
      _mint(address(this), amount);
    }
}
