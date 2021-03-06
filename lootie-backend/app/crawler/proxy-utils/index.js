const promiseReq = require("request-promise-native");
const UserAgent = require('user-agents');

const baseUrl = "https://api.proxybonanza.com/v1";
const authHeaders = { Authorization: process.env.PROXY_API_KEY };
let currentPack = null;
let proxyList = [];

const proxyOrder = {};
const agentOrder = {};
const availableAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:53.0) Gecko/20100101 Firefox/53.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393',
  'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1)',
  'Mozilla/5.0 (Windows; U; MSIE 7.0; Windows NT 6.0; en-US)',
  'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; .NET CLR 1.1.4322; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729)',
  'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0; MDDCJS)',
  'Mozilla/5.0 (compatible, MSIE 11, Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko',
  'Mozilla/5.0 (iPad; CPU OS 8_4_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12H321 Safari/600.1.4',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
  // 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  // 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
  'Mozilla/5.0 (Linux; Android 6.0.1; SAMSUNG SM-G570Y Build/MMB29K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/4.0 Chrome/44.0.2403.133 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 5.0; SAMSUNG SM-N900 Build/LRX21V) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/2.1 Chrome/34.0.1847.76 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 6.0.1; SAMSUNG SM-N910F Build/MMB29M) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/4.0 Chrome/44.0.2403.133 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; U; Android-4.0.3; en-us; Galaxy Nexus Build/IML74K) AppleWebKit/535.7 (KHTML, like Gecko) CrMo/16.0.912.75 Mobile Safari/535.7',
  'Mozilla/5.0 (Linux; Android 7.0; HTC 10 Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.83 Mobile Safari/537.36',
  // 'curl/7.35.0',
  // 'Wget/1.15 (linux-gnu)'
];

const getProxy = async (source = "default") => {
  const proxies = await getProxyList();
  let pOrder = proxyOrder[source];

  if (pOrder === void 0) {
    pOrder = 0;
  } else {
    pOrder += 1;
  }

  if (pOrder === proxies.length) {
    pOrder = 0;
  }

  proxyOrder[source] = pOrder;

  return proxies[pOrder];
};

const getAgents = (source = "default") => {
  let aOrder = agentOrder[source];
  if (aOrder === void 0) {
    aOrder = 0;
  } else {
    aOrder += 1;
  }

  if (aOrder === availableAgents.length) {
    aOrder = 0;
  }
  agentOrder[source] = aOrder;

  return availableAgents[aOrder];
};

const getProxyList = async () => {
  // check if currentPack expired 
  if (currentPack && new Date(currentPack.expires).getTime() - Date.now() > 0) {
    return proxyList;
  }

  const packs = await promiseReq({
    uri: `${baseUrl}/userpackages.json`,
    headers: authHeaders,
    json: true
  });

  currentPack = packs.data.find(v => v.bandwidth_gb > 0);

  if (!currentPack) {
    return [];
  }

  const packDetail = await promiseReq({
    uri: `${baseUrl}/userpackages/${currentPack.id}.json`,
    headers: authHeaders,
    json: true
  });

  proxyList = packDetail.data.ippacks.map(
    v =>
      `http://${currentPack.login}:${currentPack.password}@${v.ip}:${v.port_http}`
  );

  return proxyList;
};

const getProxyHeaders = (source = "default") => {
  return {
    "User-Agent": new UserAgent().toString(),
    Accept: "*/*",
    "Accept-Language": "en-US,en;q=0.5",
    "X-Requested-With": "XMLHttpRequest",
    appVersion: "0.1",
    appOS: "web",
    "X-Anonymous-ID": "undefined"
  };
}

module.exports = {
  getProxy,
  getProxyHeaders,
  getProxyList,
};
