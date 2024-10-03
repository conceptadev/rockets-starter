import { MigrationInterface, QueryRunner } from 'typeorm';

export class FileAndReport1726773514539 implements MigrationInterface {
  name = 'FileAndReport1726773514539';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "file" ("dateCreated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "dateDeleted" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "serviceKey" character varying NOT NULL, "fileName" character varying NOT NULL, "contentType" character varying NOT NULL, CONSTRAINT "UQ_23096e644a2465d3c8becae2b5c" UNIQUE ("serviceKey", "fileName"), CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."report_status_enum" AS ENUM('Processing', 'Complete', 'Error')`,
    );
    await queryRunner.query(
      `CREATE TABLE "report" ("dateCreated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "dateDeleted" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "serviceKey" character varying NOT NULL, "name" citext NOT NULL, "status" "public"."report_status_enum" NOT NULL, "errorMessage" text, "fileId" uuid, CONSTRAINT "UQ_16e100d657eaeae84cdbc992bd6" UNIQUE ("serviceKey", "name"), CONSTRAINT "REL_745a0f7c76266d259bcc4ec74e" UNIQUE ("fileId"), CONSTRAINT "PK_99e4d0bea58cba73c57f935a546" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "report" ADD CONSTRAINT "FK_745a0f7c76266d259bcc4ec74e3" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "report" DROP CONSTRAINT "FK_745a0f7c76266d259bcc4ec74e3"`,
    );
    await queryRunner.query(`DROP TABLE "report"`);
    await queryRunner.query(`DROP TYPE "public"."report_status_enum"`);
    await queryRunner.query(`DROP TABLE "file"`);
  }
}
