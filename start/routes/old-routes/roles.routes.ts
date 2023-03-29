import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/roles", "RolesController.index");
  Route.get("/roles/:roleId", "RolesController.show");
  Route.post("/roles", "RolesController.create");
  Route.patch("/roles/:roleId", "RolesController.create");
  Route.delete("/roles/:roleId", "RolesController.delete");
}).prefix("/v1");
