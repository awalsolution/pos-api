import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Product from "App/Models/Product";

export default class ProductsController {
  public async index({ response }: HttpContextContract) {
    const products = await Product.all();
    return response.ok({
      result: products,
      message: "Products Find Successfully",
    });
  }

  public async create(ctx: HttpContextContract) {
    let newproduct: any;
    if (ctx.params.productId) {
      newproduct = await Product.find(ctx.params.productId);
    } else {
      const check_product = await Product.findBy(
        "product_sku",
        ctx.request.body().product_sku
        );
        if (check_product) {
          return ctx.response.conflict({ message: "Product Already Exist" });
        }
        newproduct = new Product();
      }
      
      const productSchema = schema.create({
        title: schema.string([rules.required()]),
        product_sku: schema.string.optional(),
        slug: schema.string.optional(),
        short_description: schema.string.optional(),
        description: schema.string.optional(),
        price: schema.number.optional(),
        sale_price: schema.number.optional(),
        is_active: schema.boolean.optional(),
        product_images: schema.string.optional(),
      });
      
      const payload: any = await ctx.request.validate({ schema: productSchema });
      
      newproduct.title = payload.title;
      newproduct.product_sku = payload.product_sku;
      newproduct.slug = payload.slug;
      newproduct.short_description = payload.short_description;
      newproduct.description = payload.description;
      newproduct.price = payload.price;
      newproduct.sale_price = payload.sale_price;
      newproduct.is_active = payload.is_active;
      newproduct.product_images = payload.product_images;
      
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
      console.log(params.productId)
      const product = await Product.find(params.productId);
      
      if (!product) {
        return response.notFound({ message: "Product not found" });
      }
      
      await product.delete();
      
      return response.ok({ message: "Product deleted successfully." });
    }
  }
  