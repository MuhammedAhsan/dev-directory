import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@techpakistan.local";
  const password = process.env.ADMIN_PASSWORD ?? "Admin123!";
  const passwordHash = await hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: "admin",
      name: "Platform Admin",
    },
    create: {
      email,
      passwordHash,
      role: "admin",
      name: "Platform Admin",
    },
  });

  const existingCount = await prisma.company.count();
  if (existingCount === 0) {
    await prisma.company.createMany({
      data: [
        {
          name: "Systems Limited",
          website: "https://www.systemsltd.com",
          linkedinUrl: "https://www.linkedin.com/company/systems-limited/",
          cities: ["Lahore", "Karachi", "Islamabad"],
          recruiters: [{ name: "N/A", linkedinUrl: "#" }],
        },
        {
          name: "NETSOL Technologies",
          website: "https://www.netsoltech.com",
          linkedinUrl: "https://www.linkedin.com/company/netsol-technologies-inc-/",
          cities: ["Lahore"],
          recruiters: [{ name: "N/A", linkedinUrl: "#" }],
        },
        {
          name: "10Pearls",
          website: "https://10pearls.com",
          linkedinUrl: "https://www.linkedin.com/company/10pearls/",
          cities: ["Karachi", "Islamabad"],
          recruiters: [{ name: "N/A", linkedinUrl: "#" }],
        },
      ],
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
