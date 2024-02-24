export default {
  path: __dirname + '/../',
  title: 'InSync REST Api Dpcs',
  version: '1.0.0',
  tagIndex: 3,
  ignore: ['/swagger', '/docs', '/uploads/*', '/'],
  snakeCase: true,
  preferredPutPatch: 'PUT',
  common: {
    parameters: {
      paginated: [
        {
          in: 'query',
          name: 'page',
          schema: { type: 'number', example: 1 },
        },
        {
          in: 'query',
          name: 'perPage',
          schema: { type: 'number', example: 15 },
        },
      ],
    },
    headers: {},
  },
  persistAuthorization: true,
};
