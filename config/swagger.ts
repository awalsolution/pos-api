import path from 'node:path'
import url from 'node:url'

export default {
  path: path.dirname(url.fileURLToPath(import.meta.url)) + '/../',
  title: 'InSync CRM REST API Docs',
  version: '1.0.0',
  tagIndex: 3,
  snakeCase: true,
  ignore: ['/swagger', '/docs', '/'],
  preferredPutPatch: 'PUT',
  common: {
    parameters: {
      paginated: [
        {
          in: 'query',
          name: 'page',
          schema: { type: 'integer', example: 1 },
        },
        {
          in: 'query',
          name: 'perPage',
          schema: { type: 'integer', example: 10 },
        },
      ],
    },
    headers: {},
  },
  persistAuthorization: true,
}
