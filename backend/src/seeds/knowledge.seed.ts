import { prisma } from "../prisma/prisma";

async function seed() {
  await prisma.knowledgeBase.createMany({
    data: [
      {
        title: "Shipping Policy",
        content:
          "We ship worldwide. Orders are processed within 1-2 business days and delivered within 5-10 business days."
      },
      {
        title: "Return Policy",
        content:
          "Returns are accepted within 30 days of delivery. Products must be unused and in original condition."
      },
      {
        title: "Support Hours",
        content:
          "Customer support is available Monday to Friday from 9 AM to 6 PM IST."
      }
    ]
  });

  console.log("Knowledge base seeded");
}

seed()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });