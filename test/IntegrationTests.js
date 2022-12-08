const { expect, ether } = require('@1inch/solidity-utils');
const { network, ethers } = require('hardhat');
const { getContractByAddress } = require('./helpers/utils.js');

const ADDRESSES = {
    Weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
};

async function getContractForSigner (contractName, contractAddress, signer) {
    return (
        await ethers.getContractAt(contractName, contractAddress)
    ).connect(signer);
}

describe('Integration tests', function () {
    let addr0, addr1, addr2;

    before(async () => {
        await network.provider.request({
            method: 'hardhat_reset',
            params: [
                {
                    forking: {
                        jsonRpcUrl: process.env.MAINNET_RPC_URL,
                    },
                },
            ],
        });

        [addr0, addr1, addr2] = await ethers.getSigners();
    });

    it('test', async () => {
        const weth = await getContractForSigner('IWETH', ADDRESSES.Weth, addr0);

        expect(await weth.balanceOf(addr0.address)).to.be.equal(0n);

        await weth.deposit({ value: ether('10') });

        expect(await weth.balanceOf(addr0.address)).to.be.equal(ether('10'));
    });

    after(async () => {
        await network.provider.request({ // reset back to mainnet fork
            method: 'hardhat_reset',
            params: [],
        });
    });
});
