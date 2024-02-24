export default {
  path: __dirname + '/../',
  title: 'InSync REST Api Dpcs',
  version: '1.0.0',
  tagIndex: 3,
  ignore: ['/swagger', '/docs', '/uploads/*', '/'],
  snakeCase: true,
  preferredPutPatch: 'PUT',
  common: {
    parameters: {},
    headers: {},
  },
  persistAuthorization: true,
};
