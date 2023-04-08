import Route from "@ioc:Adonis/Core/Route";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ShopController from "App/Controllers/Http/ShopController";

Route.group(async () => {
  Route.post("/", (ctx: HttpContextContract) => {
    return new ShopController().create(ctx);
  });
  Route.put("/:shopId", (ctx: HttpContextContract) => {
    return new ShopController().create(ctx);
  });
  Route.delete("/:shopId", (ctx: HttpContextContract) => {
    return new ShopController().delete(ctx);
  });

  Route.get("/", (ctx: HttpContextContract) => {
    return new ShopController().index(ctx);
  });
  Route.get("/:id", (ctx: HttpContextContract) => {
    return new ShopController().show(ctx);
  });
})
  // .middleware(["auth:api"])
  .prefix("/v1/shops");
