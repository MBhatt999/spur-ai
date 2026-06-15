import { prisma } from "../prisma/prisma";

async function seed() {
  await prisma.knowledgeBase.createMany({
    data: [
      {
        title: "Shipping Policy",
        content:
          "We ship worldwide. Orders are processed within 1-2 business days and delivered within 5-10 business days.",
      },
      {
        title: "Return Policy",
        content:
          "Returns are accepted within 30 days of delivery. Products must be unused and in original condition.",
      },
      {
        title: "Support Hours",
        content:
          "Customer support is available Monday to Friday from 9 AM to 6 PM IST.",
      },
      {
        title: "Payment Methods",
        content:
          "We accept Visa, Mastercard, American Express, UPI, PayPal and net banking.",
      },
      {
        title: "Order Tracking",
        content:
          "Customers receive a tracking link by email once their order has been shipped.",
      },
      {
        title: "Order Cancellation",
        content:
          "Orders can be cancelled within 24 hours of placement if they have not yet been shipped.",
      },
    ],
  });

  console.log("Knowledge base seeded");
}

seed()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });