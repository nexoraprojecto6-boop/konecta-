-- CreateEnum
CREATE TYPE "CompanyVerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- AlterTable (flag mínima de administrador da plataforma, não um sistema de roles)
ALTER TABLE "users" ADD COLUMN "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "parentId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professional_profiles" (
    "userId" TEXT NOT NULL,
    "profession" TEXT NOT NULL,
    "bio" TEXT,
    "radiusKm" INTEGER NOT NULL DEFAULT 10,
    "phone" TEXT,
    "whatsapp" TEXT,
    "province" TEXT,
    "city" TEXT,
    "geoLocation" geometry(Point, 4326),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "professional_profiles_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "tradeName" TEXT NOT NULL,
    "legalName" TEXT NOT NULL,
    "taxId" TEXT,
    "categoryId" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "province" TEXT,
    "city" TEXT,
    "geoLocation" geometry(Point, 4326),
    "verificationStatus" "CompanyVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_members" (
    "companyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'owner',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_members_pkey" PRIMARY KEY ("companyId","userId")
);

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" TEXT NOT NULL,
    "professionalProfileId" TEXT,
    "companyId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");
CREATE INDEX "categories_parentId_idx" ON "categories"("parentId");

CREATE INDEX "professional_profiles_geoLocation_idx" ON "professional_profiles" USING GIST ("geoLocation");

CREATE UNIQUE INDEX "companies_taxId_key" ON "companies"("taxId");
CREATE INDEX "companies_geoLocation_idx" ON "companies" USING GIST ("geoLocation");
CREATE INDEX "companies_categoryId_idx" ON "companies"("categoryId");

CREATE INDEX "services_categoryId_idx" ON "services"("categoryId");
CREATE INDEX "services_professionalProfileId_idx" ON "services"("professionalProfileId");
CREATE INDEX "services_companyId_idx" ON "services"("companyId");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_fkey"
    FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "professional_profiles" ADD CONSTRAINT "professional_profiles_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "companies" ADD CONSTRAINT "companies_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "company_members" ADD CONSTRAINT "company_members_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "company_members" ADD CONSTRAINT "company_members_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "services" ADD CONSTRAINT "services_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "services" ADD CONSTRAINT "services_professionalProfileId_fkey"
    FOREIGN KEY ("professionalProfileId") REFERENCES "professional_profiles"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "services" ADD CONSTRAINT "services_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CheckConstraint (regra XOR: exatamente um proprietário por serviço)
ALTER TABLE "services" ADD CONSTRAINT "services_owner_xor_check" CHECK (
    ("professionalProfileId" IS NOT NULL AND "companyId" IS NULL)
    OR
    ("professionalProfileId" IS NULL AND "companyId" IS NOT NULL)
);
