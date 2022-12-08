const { expect, ether } = require('@1inch/solidity-utils');
const { network, ethers } = require('hardhat');
const { setStorageAt } = require('@nomicfoundation/hardhat-network-helpers');
const { IWETH_ABI, IERC20_ABI } = require('./abi/index.js');
const { fetchTokens, TOKENS_API_LINK } = require('./helpers/getTokens.js');

const ADDRESSES = {
    Weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    OneInchRouterV5: '0x1111111254EEB25477B68fb85Ed929f73A960582',
};
const MAX_UINT_256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

describe('Integration tests', function () {
    let addr0;

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

        [addr0] = await ethers.getSigners();
    });

    it('test', async () => {
        const tokens = await fetchTokens(TOKENS_API_LINK);
        let i = 0;
        const addresses = tokens.keys();
        for (const tokenAddress of addresses) {
            if (tokenAddress === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' ||
                tokenAddress === '0x8eb24319393716668d768dcec29356ae9cffe285' || // на паузе
                tokenAddress === '0xa462d0e6bb788c7807b1b1c96992ce1f7069e195' || // нельзя апрувить больше текущего баланса
                tokenAddress === '0xcca0c9c383076649604ee31b20248bc04fdf61ca' || // на паузе
                tokenAddress === '0x10633216e7e8281e33c86f02bf8e565a635d9770' // нельзя апрувить больше текущего баланса
            ) {
                i++;
                continue;
            }

            console.log(tokenAddress);
            const token = new ethers.Contract(tokenAddress, IERC20_ABI, addr0);
            await token.approve(ADDRESSES.OneInchRouterV5, MAX_UINT_256);
            console.log('approved', i++, 'from', tokens.size);
        }
    });

    after(async () => {
        await network.provider.request({ // reset back to mainnet fork
            method: 'hardhat_reset',
            params: [],
        });
    });
});
