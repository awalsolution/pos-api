import path from 'node:path'
import url from 'node:url'

export default {
  path: path.dirname(url.fileURLToPath(import.meta.url)) + '/../',
  title: 'POS Api docs',
  version: '1.0.0',
  description: 'POS api documentation',
  tagIndex: 3,
  snakeCase: true,
  debug: false,
  ignore: ['/swagger', '/docs', '/', '/pos_storage/*'],
  preferredPutPatch: 'PUT',
  common: {
    parameters: {},
    headers: {},
  },
  securitySchemes: {},
  authMiddlewares: ['auth', 'auth:api'],
  defaultSecurityScheme: 'BearerAuth',
  persistAuthorization: true,
  showFullPath: false,
}

// export default {
//   path: __dirname + '../',
//   title: 'YourProject',
//   version: '1.0.0',
//   tagIndex: 2,
//   ignore: ['/swagger', '/docs', '/v1', '/', '/something/*', '*/something'],
//   common: {
//     parameters: {
//       sortable: [
//         {
//           in: 'query',
//           name: 'sortBy',
//           schema: { type: 'string', example: 'foo' },
//         },
//         {
//           in: 'query',
//           name: 'sortType',
//           schema: { type: 'string', example: 'ASC' },
//         },
//       ],
//     },
//     headers: {
//       paginated: {
//         'X-Total-Pages': {
//           description: 'Total amount of pages',
//           schema: { type: 'integer', example: 5 },
//         },
//         'X-Total': {
//           description: 'Total amount of results',
//           schema: { type: 'integer', example: 100 },
//         },
//         'X-Per-Page': {
//           description: 'Results per page',
//           schema: { type: 'integer', example: 20 },
//         },
//       },
//     },
//   },
// }
