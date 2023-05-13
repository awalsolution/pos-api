import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';

export default class IndexSeeder extends BaseSeeder {
  private async runSeeder(seeder: { default: typeof BaseSeeder }) {
    await new seeder.default(this.client).run();
  }
  public async run() {
    await this.runSeeder(await import('../Role'));
    await this.runSeeder(await import('../Permission'));
    await this.runSeeder(await import('../RoleHasPermission'));
    await this.runSeeder(await import('../User'));
    await this.runSeeder(await import('../UserHasRole'));
    await this.runSeeder(await import('../UserHasPermission'));
    await this.runSeeder(await import('../Shop'));
    await this.runSeeder(await import('../Product'));
    await this.runSeeder(await import('../Profile'));
  }
}
