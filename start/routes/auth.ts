import Route from '@ioc:Adonis/Core/Route';

Route.group(async () => {
  Route.post('/register', 'AuthController.register');
  Route.post('/login', 'AuthController.login');
  Route.get('/logout', 'AuthController.logout').middleware(['auth:api']);

  // Route.post('/verify-otp', (ctx: HttpContextContract) => {
  //   return new AuthController().verifyOtp(ctx)
  // })

  // Route.post('/resend-otp', (ctx: HttpContextContract) => {
  //   return new AuthController().resendOtp(ctx)
  // })

  // Route.post('/confirm-reset-password', (ctx: HttpContextContract) => {
  //   return new AuthController().resetPasswordUsingOldPassword(ctx)
  // }).middleware(['auth:api'])

  // Route.post('/email-verification', (ctx: HttpContextContract) => {
  //   return new AuthController().emailVerification(ctx)
  // })
}).prefix('/api/v1/auth');
