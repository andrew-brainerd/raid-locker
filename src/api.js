const axios = require('axios');
const { prop } = require('ramda');

const basicJsonHeader = { 'Content-Type': 'application/json' };

const BASE_API_URL = process.env.API_URL || 'https://raid-locker-server.herokuapp.com/api';

const client = axios.create({
  baseURL: BASE_API_URL,
  headers: basicJsonHeader,
  maxContentLength: Infinity,
  maxBodyLength: Infinity
});

const gameCompleted = async gameData => {
  const response = await client.post('/games', { data: gameData });

  return prop('data', response);
};

module.exports = {
  gameCompleted
};
