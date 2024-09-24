import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const PlanController = () => import('#controllers/plan_controller')

router
  .group(() => {
    router.get('/', [PlanController, 'index'])
    router.post('/', [PlanController, 'create'])
    router.get('/:id', [PlanController, 'show'])
    router.put('/:id', [PlanController, 'update'])
    router.put('/assign-permission/:id', [PlanController, 'assignPermission'])
    router.delete('/:id', [PlanController, 'destroy'])
  })
  .use([middleware.auth({ guards: ['api'] }), middleware.tenant()])
  .prefix('/api/v1/plans')
