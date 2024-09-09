import { MigrationInterface, QueryRunner } from 'typeorm';

export class FileModule1725479344367 implements MigrationInterface {
  name = 'FileModule1725479344367';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "file" ("dateCreated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "dateDeleted" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "serviceKey" character varying NOT NULL, "fileName" character varying NOT NULL, "contentType" character varying NOT NULL, CONSTRAINT "UQ_23096e644a2465d3c8becae2b5c" UNIQUE ("serviceKey", "fileName"), CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "file"`);
  }
}
