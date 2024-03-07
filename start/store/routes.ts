import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const ProductController = () => import('#controllers/store/product_controller')
const CategoryController = () => import('#controllers/category_controller')
const CustomerController = () => import('#controllers/customer_controller')
const OrderController = () => import('#controllers/order_controller')
const PaymentMethodController = () => import('#controllers/payment_method_controller')
const ShipmentAddressController = () => import('#controllers/shipment_address_controller')

router
  .group(() => {
    // order
    router
      .group(() => {
        router.get('/', [OrderController, 'findAllRecords'])
        router.post('/', [OrderController, 'create'])
        router.delete('/:id', [OrderController, 'destroy'])
      })
      .prefix('/order')

    // customer
    router
      .group(() => {
        router.get('/:id', [CustomerController, 'findSingleRecord'])
        router.put('/:id', [CustomerController, 'update'])
        router.put('/profile/:id', [CustomerController, 'profileUpdate'])
      })
      .use(
        middleware.auth({
          guards: ['customer'],
        })
      )
      .prefix('/customer')
    // payment method
    router
      .group(() => {
        router.get('/', [PaymentMethodController, 'findAllRecords'])
        router.get('/:id', [PaymentMethodController, 'findSingleRecord'])
      })
      .prefix('/payment-method')
    // shipment address
    router
      .group(() => {
        router.get('/', [ShipmentAddressController, 'findAllRecords'])
        router.post('/', [ShipmentAddressController, 'create'])
        router.get('/:id', [ShipmentAddressController, 'findSingleRecord'])
        router.put('/:id', [ShipmentAddressController, 'update'])
        router.delete('/:id', [ShipmentAddressController, 'destroy'])
      })
      .use(
        middleware.auth({
          guards: ['customer'],
        })
      )
      .prefix('/api/v1/shipment-address')
    // product
    router
      .group(() => {
        router.get('/', [ProductController, 'findAllRecords'])
        router.get('/:product_id', [ProductController, 'findSingleRecord'])
      })
      .prefix('/product')
    // category
    router
      .group(() => {
        router.get('/', [CategoryController, 'findAllRecords'])
        router.get('/:category_id', [CategoryController, 'findSingleRecord'])
      })
      .prefix('/category')
  })
  .prefix('/api/v1/store')
