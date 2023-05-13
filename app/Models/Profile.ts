import { DateTime } from 'luxon';
import {
  BaseModel,
  column,
  afterFind,
  afterFetch,
} from '@ioc:Adonis/Lucid/Orm';
// import Upload from "App/Models/Upload";
import { STANDARD_DATE_TIME_FORMAT } from 'App/Helpers/utils';

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public userId: number;

  @column()
  public first_name: string | null;

  @column()
  public last_name: string | null;

  @column()
  public phone_number: string | null;

  @column()
  public address: string | null;

  @column()
  public city: string | null;

  @column()
  public state: string | null;

  @column()
  public country: string | null;

  @column()
  public profile_picture: string | null;

  @column({
    prepare: () => undefined,
  })
  public profile_picture_url: string | null;

  @column.dateTime({
    autoCreate: true,
    serialize(value: DateTime) {
      return value ? value.toFormat(STANDARD_DATE_TIME_FORMAT) : '';
    },
  })
  public createdAt: DateTime;

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize(value: DateTime) {
      return value ? value.toFormat(STANDARD_DATE_TIME_FORMAT) : '';
    },
  })
  public updatedAt: DateTime;

  @afterFind()
  public static profilePictureUrl(profile: Profile) {
    if (profile.profile_picture) {
      profile.profile_picture_url = `${process.env.APP_URL}/${profile.profile_picture}`;
    }
  }

  @afterFetch()
  public static profilePictureUrlFetch(profiles: Profile[]) {
    profiles.map((profile) => {
      if (profile.profile_picture) {
        profile.profile_picture_url = `${process.env.AWS_URL}/${profile.profile_picture}`;
      }
      return profile;
    });
  }
}
