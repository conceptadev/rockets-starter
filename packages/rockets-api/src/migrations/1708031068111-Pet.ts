import { MigrationInterface, QueryRunner } from 'typeorm';

export class Pet1708031068111 implements MigrationInterface {
  name = 'Pet1708031068111';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "pet" ("dateCreated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "dateDeleted" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" citext NOT NULL, "age" citext NOT NULL, "breed" citext NOT NULL, "color" citext NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_b1ac2e88e89b9480e0c5b53fa60" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "pet" ADD CONSTRAINT "FK_4eb3b1eeefc7cdeae09f934f479" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pet" DROP CONSTRAINT "FK_4eb3b1eeefc7cdeae09f934f479"`,
    );
    await queryRunner.query(`DROP TABLE "pet"`);
  }
}
