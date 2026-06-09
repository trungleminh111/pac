import "dotenv/config";
import bcrypt from "bcryptjs";
import {
  PrismaClient,
  Locale,
  PageTemplate,
  PageType,
  PublishStatus,
} from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const email = "admin@admin.com";
  const password = "admin123456";

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: "ADMIN",
    },
    create: {
      name: "Admin",
      email,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  await prisma.page.create({
    data: {
      type: PageType.POLICY,
      template: PageTemplate.POLICY,
      status: PublishStatus.PUBLISHED,
      publishedAt: new Date(),
      sections: [
        {
          type: "hero",
          title: "Chính sách bảo mật",
          subtitle: "PAC Stone cam kết bảo vệ thông tin khách hàng.",
        },
      ],
      settings: {
        layout: "default",
      },
      translations: {
        create: [
          {
            locale: Locale.vi,
            title: "Chính sách bảo mật",
            slug: "privacy-policy",
            excerpt: "Trang chính sách bảo mật của PAC Stone.",
            content: {
              type: "doc",
              blocks: [
                {
                  type: "paragraph",
                  text: "Đây là nội dung chính sách bảo mật mẫu.",
                },
              ],
            },
            seoTitle: "Chính sách bảo mật | PAC Stone",
            seoDescription: "Chính sách bảo mật của PAC Stone.",
          },
        ],
      },
    },
  });

  console.log("Admin created:", email, password);
  console.log("Policy page created: /vi/policies/privacy-policy");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });