// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "./helpers/VotingPowerCalculator.sol";
import "./St1inch.sol";

contract St1inchPreview is VotingPowerCalculator {
    St1inch public immutable st1INCH;
    uint256 private constant _VOTING_POWER_DIVIDER = 10;

    constructor(St1inch st1INCH_) VotingPowerCalculator(st1INCH_.expBase(), st1INCH_.origin()) {
        st1INCH = st1INCH_;
    }

    function previewBalance(address account, uint256 amount, uint256 duration) external view returns (uint256) {
        (uint40 unlockTime, uint216 balance) = st1INCH.depositors(account);
        // solhint-disable-next-line not-rely-on-time
        uint256 lockedTill = Math.max(unlockTime, block.timestamp) + duration;
        return _balanceAt(balance + amount, lockedTill) / _VOTING_POWER_DIVIDER;
    }
}
