import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1657650612024 implements MigrationInterface {
  name = 'Initial1657650612024';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "auditDatecreated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "auditDateupdated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "auditDatedeleted" TIMESTAMP WITH TIME ZONE, "auditVersion" integer NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "roleId" uuid, "assigneeId" uuid, "auditDatecreated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "auditDateupdated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "auditDatedeleted" TIMESTAMP WITH TIME ZONE, "auditVersion" integer NOT NULL, CONSTRAINT "UQ_0aba75700a541379ebff645c8da" UNIQUE ("roleId", "assigneeId"), CONSTRAINT "PK_fb2e442d14add3cefbdf33c4561" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_otp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "category" character varying NOT NULL, "type" character varying, "passcode" character varying NOT NULL, "expirationDate" TIMESTAMP WITH TIME ZONE NOT NULL, "assigneeId" uuid, "auditDatecreated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "auditDateupdated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "auditDatedeleted" TIMESTAMP WITH TIME ZONE, "auditVersion" integer NOT NULL, CONSTRAINT "PK_494c022ed33e6ee19a2bbb11b22" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "username" character varying NOT NULL, "passwordHash" text, "passwordSalt" text, "auditDatecreated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "auditDateupdated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "auditDatedeleted" TIMESTAMP WITH TIME ZONE, "auditVersion" integer NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "org" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "active" boolean NOT NULL DEFAULT true, "ownerId" uuid, "auditDatecreated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "auditDateupdated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "auditDatedeleted" TIMESTAMP WITH TIME ZONE, "auditVersion" integer NOT NULL, CONSTRAINT "PK_703783130f152a752cadf7aa751" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "federated" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "provider" character varying NOT NULL, "subject" character varying NOT NULL, "auditDatecreated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "auditDateupdated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "auditDatedeleted" TIMESTAMP WITH TIME ZONE, "auditVersion" integer NOT NULL, CONSTRAINT "PK_6037a20d155c89a0dec47ead84e" PRIMARY KEY ("id"))`,
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
      `ALTER TABLE "org" ADD CONSTRAINT "FK_695b37d1cff3d535ded8707b889" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "org" DROP CONSTRAINT "FK_695b37d1cff3d535ded8707b889"`,
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
    await queryRunner.query(`DROP TABLE "org"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "user_otp"`);
    await queryRunner.query(`DROP TABLE "user_role"`);
    await queryRunner.query(`DROP TABLE "role"`);
  }
}
