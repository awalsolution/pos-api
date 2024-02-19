const AuthController = () => import('#controllers/auth_controller')
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.post('/register', [AuthController, 'register'])
    router.post('/login', [AuthController, 'login'])
    router.get('/logout', [AuthController, 'logout'])

    // .middleware(["auth:api"]);
    // router.post('/verify-otp', (ctx: HttpContextContract) => {
    //   return new AuthController().verifyOtp(ctx)
    // })

    // router.post('/resend-otp', (ctx: HttpContextContract) => {
    //   return new AuthController().resendOtp(ctx)
    // })

    // router.post('/confirm-reset-password', (ctx: HttpContextContract) => {
    //   return new AuthController().resetPasswordUsingOldPassword(ctx)
    // }).middleware(['auth:api'])

    // router.post('/email-verification', (ctx: HttpContextContract) => {
    //   return new AuthController().emailVerification(ctx)
    // })
  })
  .prefix('/api/v1/auth')
