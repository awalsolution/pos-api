import { DateTime } from "luxon";
import { column, BaseModel } from "@ioc:Adonis/Lucid/Orm";

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public product_sku: string;

  @column()
  public title: string;

  @column()
  public slug: string;

  @column()
  public description: string;

  @column()
  public short_description: string;

  @column()
  public product_images: string;

  @column()
  public price: number;

  @column()
  public sale_price: number;

  @column()
  public is_active: boolean;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
