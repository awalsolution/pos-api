import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/users", "UsersController.index");
  Route.get("/users/:userId", "UsersController.show");
  Route.post("/users", "UsersController.create");
  Route.patch("/users/:userId", "UsersController.create");
  Route.delete("/users/:userId", "UsersController.delete");
}).prefix("/v1");
