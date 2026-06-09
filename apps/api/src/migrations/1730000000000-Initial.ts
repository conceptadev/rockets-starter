import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1730000000000 implements MigrationInterface {
  name = 'Initial1730000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" varchar PRIMARY KEY NOT NULL,
        "email" varchar(255) NOT NULL,
        "password" varchar(255) NOT NULL,
        "name" varchar(100),
        "role" varchar(20) NOT NULL DEFAULT 'user',
        "dateCreated" datetime NOT NULL DEFAULT (datetime('now')),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )
    `);

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

    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id" varchar PRIMARY KEY NOT NULL,
        "name" varchar(255) NOT NULL,
        "description" text,
        "userId" varchar(255) NOT NULL,
        "dateCreated" datetime NOT NULL DEFAULT (datetime('now')),
        "dateUpdated" datetime NOT NULL DEFAULT (datetime('now')),
        "dateDeleted" datetime,
        "version" integer NOT NULL DEFAULT 1
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "tasks" (
        "id" varchar PRIMARY KEY NOT NULL,
        "title" varchar(255) NOT NULL,
        "description" text,
        "status" varchar(20) NOT NULL DEFAULT 'todo',
        "categoryId" varchar(255),
        "userId" varchar(255) NOT NULL,
        "dateCreated" datetime NOT NULL DEFAULT (datetime('now')),
        "dateUpdated" datetime NOT NULL DEFAULT (datetime('now')),
        "dateDeleted" datetime,
        "version" integer NOT NULL DEFAULT 1
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tasks"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "user_metadata"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
