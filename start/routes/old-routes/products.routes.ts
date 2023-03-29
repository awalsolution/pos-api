import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/products", "ProductsController.index");
  Route.get("/products/:productId", "ProductsController.show");
  Route.post("/products", "ProductsController.create");
  Route.patch("/products/:productId", "ProductsController.create");
  Route.delete("/products/:productId", "ProductsController.delete");
}).prefix("/v1");
