import Route from "@ioc:Adonis/Core/Route";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import UsersController from "App/Controllers/Http/UsersController";

Route.group(async () => {
  Route.get("/authenticated", async (ctx: HttpContextContract) => {
    return new UsersController().authenticated(ctx);
  });
  Route.post("/", (ctx: HttpContextContract) => {
    return new UsersController().create(ctx);
  });
  Route.put("/:userId", (ctx: HttpContextContract) => {
    return new UsersController().update(ctx);
  });
  Route.delete("/:userId", (ctx: HttpContextContract) => {
    return new UsersController().destroy(ctx);
  });

  Route.get("/", (ctx: HttpContextContract) => {
    return new UsersController().find(ctx);
  });
  Route.get("/:userId", (ctx: HttpContextContract) => {
    return new UsersController().get(ctx);
  });
})
  .middleware(["auth:api"])
  .prefix("/v1/users");
