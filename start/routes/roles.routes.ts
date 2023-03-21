import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.post("/roles", "RolesController.create");
  Route.get("/roles", "RolesController.index");
  Route.get("/roles/:userId", "RolesController.show");
  Route.patch("/roles/:userId", "RolesController.update");
  Route.delete("/roles/:userId", "RolesController.delete");
}).prefix("/v1");
