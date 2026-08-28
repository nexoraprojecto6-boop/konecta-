-- CreateTable
CREATE TABLE "user_locations" (
    "userId" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "geoLocation" geometry(Point, 4326),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_locations_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex (espacial, GiST — padrão PostGIS)
CREATE INDEX "user_locations_geoLocation_idx" ON "user_locations" USING GIST ("geoLocation");

-- AddForeignKey
ALTER TABLE "user_locations" ADD CONSTRAINT "user_locations_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
