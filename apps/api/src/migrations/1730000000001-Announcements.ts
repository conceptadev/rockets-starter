import { MigrationInterface, QueryRunner } from 'typeorm';

export class Announcements1730000000001 implements MigrationInterface {
  name = 'Announcements1730000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "announcements" (
        "id" varchar PRIMARY KEY NOT NULL,
        "title" varchar(255) NOT NULL,
        "body" text NOT NULL,
        "dateCreated" datetime NOT NULL DEFAULT (datetime('now')),
        "dateUpdated" datetime NOT NULL DEFAULT (datetime('now'))
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "announcements"`);
  }
}
