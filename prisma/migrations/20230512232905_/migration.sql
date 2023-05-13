-- CreateEnum
CREATE TYPE "TeamType" AS ENUM ('CLUB', 'NATIONAL');

-- CreateEnum
CREATE TYPE "SquadType" AS ENUM ('SENIOR_MEN', 'SENIOR_WOMEN', 'ACADEMY');

-- CreateEnum
CREATE TYPE "PlayerPosition" AS ENUM ('GK', 'LB', 'CB', 'RB', 'DM', 'CM', 'AM', 'LW', 'RW', 'ST');

-- CreateEnum
CREATE TYPE "PitchType" AS ENUM ('GRASS', 'HYBRID', 'ARTIFICIAL');

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" "TeamType" NOT NULL,
    "website" TEXT NOT NULL,
    "motto" TEXT,
    "description" TEXT,
    "stadiumId" INTEGER,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Squad" (
    "id" SERIAL NOT NULL,
    "teamId" INTEGER NOT NULL,
    "type" "SquadType" NOT NULL,

    CONSTRAINT "Squad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "nickname" TEXT,
    "dob" TIMESTAMP(3) NOT NULL,
    "key" TEXT NOT NULL,
    "position" "PlayerPosition" NOT NULL,
    "squadId" INTEGER,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stadium" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,

    CONSTRAINT "Stadium_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pitch" (
    "id" SERIAL NOT NULL,
    "stadiumId" INTEGER NOT NULL,
    "surfaceType" "PitchType" NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "length" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Pitch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_key_key" ON "Team"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Player_key_key" ON "Player"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Stadium_key_key" ON "Stadium"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Pitch_stadiumId_key" ON "Pitch"("stadiumId");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_stadiumId_fkey" FOREIGN KEY ("stadiumId") REFERENCES "Stadium"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Squad" ADD CONSTRAINT "Squad_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_squadId_fkey" FOREIGN KEY ("squadId") REFERENCES "Squad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pitch" ADD CONSTRAINT "Pitch_stadiumId_fkey" FOREIGN KEY ("stadiumId") REFERENCES "Stadium"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
