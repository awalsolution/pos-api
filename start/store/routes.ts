import router from '@adonisjs/core/services/router'
const ProductController = () => import('#controllers/store/product_controller')
const CategoryController = () => import('#controllers/category_controller')

router
  .group(() => {
    router
      .group(() => {
        router.get('/', [ProductController, 'findAllRecords'])
        router.get('/:product_id', [ProductController, 'findSingleRecord'])
      })
      .prefix('/product')
    router
      .group(() => {
        router.get('/', [CategoryController, 'findAllRecords'])
        router.get('/:category_id', [CategoryController, 'findSingleRecord'])
      })
      .prefix('/category')
  })
  .prefix('/api/v1/store')
