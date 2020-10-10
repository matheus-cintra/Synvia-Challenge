import axios from 'axios';

const URI = 'https://extreme-ip-lookup.com/json/';

async function retrieveIpInfo() {
  const result = await axios.get(URI);
  return result.data;
}

export default retrieveIpInfo;
