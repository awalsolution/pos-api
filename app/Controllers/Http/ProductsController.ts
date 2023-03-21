import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Product from "App/Models/Product";

export default class ProductsController {
  public async index({ response }: HttpContextContract) {
    const products = await Product.all();
    return response.ok({
      data: products,
      message: "Products Find Successfully",
    });
  }

  public async create(ctx: HttpContextContract) {
    let newproduct: any;
    if (ctx.params.productId) {
      newproduct = await Product.find(ctx.params.productId);
    } else {
      const check_product = await Product.findBy(
        "name",
        ctx.request.body().name
      );
      if (check_product) {
        return ctx.response.conflict({ message: "Product Already Exist" });
      }
      newproduct = new Product();
    }

    const productSchema = schema.create({
      name: schema.string([rules.required()]),
      description: schema.string.optional(),
    });

    const payload: any = await ctx.request.validate({ schema: productSchema });

    newproduct.name = payload.name;
    newproduct.description = payload.description;

    await newproduct.save();

    return ctx.response.ok({
      data: newproduct,
      message: "Operation Successfully",
    });
  }
  public async show({ params, response }: HttpContextContract) {
    const product = await Product.find(params.productId);

    if (!product) {
      return response.notFound({ message: "Product not found" });
    }
    return response.ok({ data: product, message: "Product Find Successfully" });
  }

  public async delete({ params, response }: HttpContextContract) {
    const product = await Product.find(params.productId);

    if (!product) {
      return response.notFound({ message: "Product not found" });
    }

    await product.delete();

    return response.ok({ message: "Product deleted successfully." });
  }
}
