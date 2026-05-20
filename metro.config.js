const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const emptyModulePath = path.resolve(__dirname, 'src/lib/empty.js');

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  stream: emptyModulePath,
  zlib: emptyModulePath,
  util: emptyModulePath,
  crypto: emptyModulePath,
  ws: emptyModulePath,
  os: emptyModulePath,
  path: emptyModulePath,
  fs: emptyModulePath,
  http: emptyModulePath,
  https: emptyModulePath,
  net: emptyModulePath,
  tls: emptyModulePath,
  url: emptyModulePath,
  events: emptyModulePath,
  constants: emptyModulePath,
  buffer: emptyModulePath,
  vm: emptyModulePath,
  process: emptyModulePath,
};

module.exports = config;
