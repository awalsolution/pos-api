import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Shop from "App/Models/Shop";

export default class ShopController {
  public async index({ response }: HttpContextContract) {
    const shops = await Shop.all();
    return response.ok({
      result: shops,
      message: "Shops Find Successfully",
    });
  }

  public async create(ctx: HttpContextContract) {
    let newshop: any;
    if (ctx.params.shopId) {
      newshop = await Shop.find(ctx.params.shopId);
    } else {
      const check_shop = await Shop.findBy(
        "shop_name",
        ctx.request.body().shop_name
      );
      if (check_shop) {
        return ctx.response.conflict({ message: "Shop Already Exist" });
      }
      newshop = new Shop();
    }

    const shopSchema = schema.create({
      shop_name: schema.string([rules.required()]),
      shop_phone: schema.string.optional(),
      address: schema.string.optional(),
      city: schema.string.optional(),
      state: schema.string.optional(),
      country: schema.string.optional(),
      logo: schema.string.optional(),
    });

    const payload: any = await ctx.request.validate({ schema: shopSchema });

    newshop.shop_name = payload.shop_name;
    newshop.shop_phone = payload.shop_phone;
    newshop.address = payload.address;
    newshop.city = payload.city;
    newshop.state = payload.state;
    newshop.country = payload.country;
    newshop.logo = payload.logo;

    await newshop.save();

    return ctx.response.ok({
      data: newshop,
      message: "Operation Successfully",
    });
  }
  public async show({ params, response }: HttpContextContract) {
    const shop = await Shop.find(params.shopId);

    if (!shop) {
      return response.notFound({ message: "shop not found" });
    }
    return response.ok({ data: shop, message: "shop Find Successfully" });
  }

  public async delete({ params, response }: HttpContextContract) {
    console.log(params.shopId);
    const shop = await Shop.find(params.shopId);

    if (!shop) {
      return response.notFound({ message: "shop not found" });
    }

    await shop.delete();

    return response.ok({ message: "shop deleted successfully." });
  }
}
