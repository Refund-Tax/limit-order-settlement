// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
pragma abicoder v1;

import "../PowerPod.sol";
import "../interfaces/ISt1inch.sol";

contract PowerPodMock is PowerPod {
    constructor(string memory name, string memory symbol, ISt1inch st1inch) PowerPod(name, symbol, st1inch) {}

    function mint(address account, uint256 amount) external {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) external {
        _burn(account, amount);
    }

    function votingPowerOf(address account) external view override returns (uint256) {
        return balanceOf(account) / 2;
    }
}
