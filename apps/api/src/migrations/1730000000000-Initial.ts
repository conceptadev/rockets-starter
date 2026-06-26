import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1730000000000 implements MigrationInterface {
  name = 'Initial1730000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user_metadata" (
        "id" varchar PRIMARY KEY NOT NULL,
        "userId" varchar(255) NOT NULL,
        "dateCreated" datetime NOT NULL DEFAULT (datetime('now')),
        "dateUpdated" datetime NOT NULL DEFAULT (datetime('now')),
        "dateDeleted" datetime,
        "version" integer NOT NULL DEFAULT 1,
        "firstName" varchar(100),
        "lastName" varchar(100)
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_metadata"`);
  }
}
