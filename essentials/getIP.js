const superagent = require("superagent");

async function getIP(type) {
  if (type == "ipv4") {
    console.log("IPv4 adress getting...");
    return superagent
      .get("https://api.ipify.org?format=json")
      .then((res) => res.body.ip);
  }
  if (type == 'ipv6'){
    console.log("IPv6 adress getting...");
    return superagent
      .get("https://api64.ipify.org?format=json")
      .then((res) => res.body.ip);
  }
}

module.exports = getIP;
