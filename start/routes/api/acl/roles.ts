import Route from "@ioc:Adonis/Core/Route";
import RolesController from "App/Controllers/Http/Acl/RolesController";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

Route.group(async () => {
  Route.post("/", (ctx: HttpContextContract) => {
    return new RolesController().create(ctx);
  });
  Route.put("/:roleId", (ctx: HttpContextContract) => {
    return new RolesController().update(ctx);
  });
  Route.delete("/:roleId", (ctx: HttpContextContract) => {
    return new RolesController().destroy(ctx);
  });

  Route.get("/", (ctx: HttpContextContract) => {
    return new RolesController().find(ctx);
  });
  Route.get("/:roleId", (ctx: HttpContextContract) => {
    return new RolesController().get(ctx);
  });
  Route.group(async () => {
    Route.put("/:roleId", (ctx: HttpContextContract) => {
      return new RolesController().get(ctx);
    });
  }).prefix("users");
}).prefix("/v1/roles");
