import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/permissions", "PermissionsController.index");
  Route.get("/permissions/:permissionId", "PermissionsController.show");
  Route.post("/permissions", "PermissionsController.create");
  Route.patch("/permissions/:permissionId", "PermissionsController.create");
  Route.delete("/permissions/:permissionId", "PermissionsController.delete");
}).prefix("/v1");
