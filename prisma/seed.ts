import { PrismaClient, Role, UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const defaultPassword = "Password123!";

const offices = [
  {
    name: "Maintenance Office",
    description: "Handles general facility maintenance concerns.",
    officeHours: "Monday-Friday 8:00 AM-5:00 PM",
    officeStartTime: "08:00",
    officeEndTime: "17:00",
    slotDurationMin: 60
  },
  {
    name: "Plumbing Office",
    description: "Handles water, drainage, and plumbing concerns.",
    officeHours: "Monday-Friday 8:00 AM-5:00 PM",
    officeStartTime: "08:00",
    officeEndTime: "17:00",
    slotDurationMin: 60
  },
  {
    name: "Electrical Office",
    description: "Handles electrical repair and safety concerns.",
    officeHours: "Monday-Friday 8:00 AM-5:00 PM",
    officeStartTime: "08:00",
    officeEndTime: "17:00",
    slotDurationMin: 60
  },
  {
    name: "Utility Office",
    description: "Handles utility service coordination.",
    officeHours: "Monday-Friday 8:00 AM-5:00 PM",
    officeStartTime: "08:00",
    officeEndTime: "17:00",
    slotDurationMin: 60
  },
  {
    name: "Administrative Office",
    description: "Handles administrative service requests.",
    officeHours: "Monday-Friday 8:00 AM-5:00 PM",
    officeStartTime: "08:00",
    officeEndTime: "17:00",
    slotDurationMin: 60
  }
];

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "");

async function main() {
  const password = await bcrypt.hash(defaultPassword, 12);

  await prisma.user.upsert({
    where: { email: "admin@deca.com" },
    update: {
      firstName: "System",
      lastName: "Administrator",
      role: Role.ADMIN,
      status: UserStatus.APPROVED
    },
    create: {
      firstName: "System",
      lastName: "Administrator",
      email: "admin@deca.com",
      phoneNumber: "00000000000",
      password,
      role: Role.ADMIN,
      status: UserStatus.APPROVED
    }
  });

  for (const officeData of offices) {
    const office = await prisma.office.upsert({
      where: { name: officeData.name },
      update: {
        description: officeData.description,
        officeHours: officeData.officeHours,
        officeStartTime: officeData.officeStartTime,
        officeEndTime: officeData.officeEndTime,
        slotDurationMin: officeData.slotDurationMin,
        isActive: true
      },
      create: {
        ...officeData,
        isActive: true
      }
    });

    const officeSlug = slugify(office.name);
    const staffUser = await prisma.user.upsert({
      where: { email: `${officeSlug}.head@deca.com` },
      update: {
        firstName: office.name.split(" ")[0],
        lastName: "Head",
        role: Role.STAFF,
        status: UserStatus.APPROVED
      },
      create: {
        firstName: office.name.split(" ")[0],
        lastName: "Head",
        email: `${officeSlug}.head@deca.com`,
        phoneNumber: null,
        password,
        role: Role.STAFF,
        status: UserStatus.APPROVED
      }
    });

    await prisma.staff.upsert({
      where: { userId: staffUser.id },
      update: {
        officeId: office.id,
        position: "Office Head",
        specialization: office.name,
        isOfficeHead: true
      },
      create: {
        userId: staffUser.id,
        officeId: office.id,
        position: "Office Head",
        specialization: office.name,
        isOfficeHead: true
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
