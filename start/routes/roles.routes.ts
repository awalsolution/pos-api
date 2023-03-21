import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.post("/users", "UsersController.create");
  Route.get("/users", "UsersController.index");
  Route.get("/users/:userId", "UsersController.show");
  Route.patch("/users/:userId", "UsersController.update");
  Route.delete("/users/:userId", "UsersController.delete");
}).prefix("/v1");
