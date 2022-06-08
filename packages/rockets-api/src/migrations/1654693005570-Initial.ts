import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1654693005570 implements MigrationInterface {
  name = 'Initial1654693005570';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "username" character varying NOT NULL, "passwordHash" character varying, "passwordSalt" character varying, "auditDatecreated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "auditDateupdated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "auditDatedeleted" TIMESTAMP WITH TIME ZONE, "auditVersion" integer NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "org" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "active" boolean NOT NULL DEFAULT true, "ownerId" uuid, "auditDatecreated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "auditDateupdated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "auditDatedeleted" TIMESTAMP WITH TIME ZONE, "auditVersion" integer NOT NULL, CONSTRAINT "PK_703783130f152a752cadf7aa751" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "federated_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "provider" character varying NOT NULL, "subject" character varying NOT NULL, "userId" character varying NOT NULL, "auditDatecreated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "auditDateupdated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "auditDatedeleted" TIMESTAMP WITH TIME ZONE, "auditVersion" integer NOT NULL, CONSTRAINT "PK_7dbcba1be5cac5f3bcad4c41212" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "org" ADD CONSTRAINT "FK_695b37d1cff3d535ded8707b889" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "org" DROP CONSTRAINT "FK_695b37d1cff3d535ded8707b889"`,
    );
    await queryRunner.query(`DROP TABLE "federated_entity"`);
    await queryRunner.query(`DROP TABLE "org"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
