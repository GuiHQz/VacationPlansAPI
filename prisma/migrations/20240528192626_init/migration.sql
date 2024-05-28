-- CreateTable
CREATE TABLE "HolidayPlan" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "participants" TEXT[],

    CONSTRAINT "HolidayPlan_pkey" PRIMARY KEY ("id")
);
