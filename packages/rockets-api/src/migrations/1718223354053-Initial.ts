import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1718223354053 implements MigrationInterface {
  name = 'Initial1718223354053';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "role" ("dateCreated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "dateDeleted" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_role" ("dateCreated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "dateDeleted" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "roleId" uuid, "assigneeId" uuid, CONSTRAINT "UQ_0aba75700a541379ebff645c8da" UNIQUE ("roleId", "assigneeId"), CONSTRAINT "PK_fb2e442d14add3cefbdf33c4561" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_otp" ("dateCreated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "dateDeleted" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "category" character varying NOT NULL, "type" character varying, "passcode" character varying NOT NULL, "expirationDate" TIMESTAMP WITH TIME ZONE NOT NULL, "assigneeId" uuid, CONSTRAINT "PK_494c022ed33e6ee19a2bbb11b22" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "invitation" ("dateCreated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "dateDeleted" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "active" boolean NOT NULL DEFAULT true, "email" character varying NOT NULL, "code" character varying NOT NULL, "category" character varying NOT NULL, "constraints" jsonb NOT NULL, "userId" uuid, CONSTRAINT "PK_beb994737756c0f18a1c1f8669c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "org" ("dateCreated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "dateDeleted" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "active" boolean NOT NULL DEFAULT true, "ownerId" uuid, CONSTRAINT "PK_703783130f152a752cadf7aa751" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "org_member" ("dateCreated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "dateDeleted" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "active" boolean NOT NULL DEFAULT true, "userId" uuid NOT NULL, "orgId" uuid NOT NULL, CONSTRAINT "UQ_4d21eb48396e3c7bf2ef37c062f" UNIQUE ("userId", "orgId"), CONSTRAINT "PK_572a1b79344c45cba61e93eb34c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_cache" ("dateCreated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "dateDeleted" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "key" character varying NOT NULL, "data" jsonb, "expirationDate" TIMESTAMP WITH TIME ZONE, "assigneeId" uuid, CONSTRAINT "PK_2fa0390640bd72a834b5464055e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "key_unique_index" ON "user_cache" ("key", "type", "assigneeId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("dateCreated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "dateDeleted" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "username" character varying NOT NULL, "active" boolean NOT NULL DEFAULT true, "passwordHash" text, "passwordSalt" text, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "federated" ("dateCreated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "dateDeleted" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "provider" character varying NOT NULL, "subject" character varying NOT NULL, CONSTRAINT "PK_6037a20d155c89a0dec47ead84e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role" ADD CONSTRAINT "FK_dba55ed826ef26b5b22bd39409b" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role" ADD CONSTRAINT "FK_5de24d2b69d7e7cc8cbb731f053" FOREIGN KEY ("assigneeId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_otp" ADD CONSTRAINT "FK_beffb5a47aeba564f383d642ea9" FOREIGN KEY ("assigneeId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation" ADD CONSTRAINT "FK_05191060fae5b5485327709be7f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "org" ADD CONSTRAINT "FK_695b37d1cff3d535ded8707b889" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "org_member" ADD CONSTRAINT "FK_0994de574a3dd40608e7dc7e3d7" FOREIGN KEY ("orgId") REFERENCES "org"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "org_member" ADD CONSTRAINT "FK_e51b569198779321f3d818d8f24" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_cache" ADD CONSTRAINT "FK_b46638e3657328bb85d1eff1b0f" FOREIGN KEY ("assigneeId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_cache" DROP CONSTRAINT "FK_b46638e3657328bb85d1eff1b0f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "org_member" DROP CONSTRAINT "FK_e51b569198779321f3d818d8f24"`,
    );
    await queryRunner.query(
      `ALTER TABLE "org_member" DROP CONSTRAINT "FK_0994de574a3dd40608e7dc7e3d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "org" DROP CONSTRAINT "FK_695b37d1cff3d535ded8707b889"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation" DROP CONSTRAINT "FK_05191060fae5b5485327709be7f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_otp" DROP CONSTRAINT "FK_beffb5a47aeba564f383d642ea9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role" DROP CONSTRAINT "FK_5de24d2b69d7e7cc8cbb731f053"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role" DROP CONSTRAINT "FK_dba55ed826ef26b5b22bd39409b"`,
    );
    await queryRunner.query(`DROP TABLE "federated"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP INDEX "public"."key_unique_index"`);
    await queryRunner.query(`DROP TABLE "user_cache"`);
    await queryRunner.query(`DROP TABLE "org_member"`);
    await queryRunner.query(`DROP TABLE "org"`);
    await queryRunner.query(`DROP TABLE "invitation"`);
    await queryRunner.query(`DROP TABLE "user_otp"`);
    await queryRunner.query(`DROP TABLE "user_role"`);
    await queryRunner.query(`DROP TABLE "role"`);
  }
}
