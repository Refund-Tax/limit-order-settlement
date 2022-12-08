const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const TOKENS_API_LINK = 'https://tokens.1inch.io/v1.1/1';

const fetchTokens = async (apiLink) => {
    return fetch(apiLink, {
        method: 'GET',
    }).then(res => res.json()).then(res => {
        const tokensMap = new Map(Object.entries(JSON.parse(JSON.stringify(res))));
        return tokensMap;
    }).catch(err => {
        console.error(err);
        return new Map();
    });
};

module.exports = {
    TOKENS_API_LINK,
    fetchTokens,
};
