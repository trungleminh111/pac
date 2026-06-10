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

  await prisma.project.create({
    data: {
      status: PublishStatus.PUBLISHED,
      thumbnail: "/assets/images/works/slidechinh.jpg",
      clientName: "Anh Nguyễn Văn A",
      projectType: "Thi công đá Marble",
      startedAt: new Date("2023-06-10"),
      completedAt: new Date("2023-08-30"),
      budget: "3.5 tỷ VNĐ",
      allowIndex: true,
      publishedAt: new Date(),
      translations: {
        create: [
          {
            locale: Locale.vi,
            title: "Thi công đá Marble biệt thự ven sông",
            slug: "thi-cong-da-marble-biet-thu-ven-song",
            excerpt:
              "PAC Stone thi công hạng mục đá Marble tự nhiên cho biệt thự cao cấp, bao gồm sảnh chính, phòng khách, cầu thang và khu vệ sinh.",
            content: {
              blocks: [
                {
                  type: "titleTextImageText",
                  title: "Không gian sang trọng với đá Marble tự nhiên",
                  textTop:
                    "Đội ngũ PAC Stone khảo sát hiện trạng, tư vấn phối màu và lựa chọn chủng loại đá phù hợp với phong cách kiến trúc của biệt thự. Toàn bộ vật liệu được kiểm tra kỹ về vân đá, độ dày và bề mặt trước khi đưa vào thi công.",
                  image: "/assets/images/works/project-13.png",
                  textBottom:
                    "Quá trình thi công được triển khai theo từng khu vực nhằm đảm bảo tiến độ và hạn chế ảnh hưởng đến các hạng mục nội thất khác. Các chi tiết bo cạnh, ghép mí và xử lý ron được hoàn thiện tỉ mỉ để giữ được vẻ liền mạch cho không gian.",
                },
                {
                  type: "twoImagesContent",
                  image1: "/assets/images/works/project-9.jpg",
                  image2: "/assets/images/works/project-10.jpg",
                  content:
                    "Sau khi hoàn thiện, bề mặt đá được vệ sinh, đánh bóng và phủ bảo vệ nhằm tăng độ bền trong quá trình sử dụng. Công trình mang lại cảm giác sang trọng, sáng thoáng và đồng bộ với tổng thể kiến trúc biệt thự.",
                },
              ],
            },
            structuredData: {
              blocks: [
                {
                  type: "titleTextImageText",
                  title: "Không gian sang trọng với đá Marble tự nhiên",
                  textTop:
                    "Đội ngũ PAC Stone khảo sát hiện trạng, tư vấn phối màu và lựa chọn chủng loại đá phù hợp với phong cách kiến trúc của biệt thự. Toàn bộ vật liệu được kiểm tra kỹ về vân đá, độ dày và bề mặt trước khi đưa vào thi công.",
                  image: "/assets/images/works/project-13.png",
                  textBottom:
                    "Quá trình thi công được triển khai theo từng khu vực nhằm đảm bảo tiến độ và hạn chế ảnh hưởng đến các hạng mục nội thất khác. Các chi tiết bo cạnh, ghép mí và xử lý ron được hoàn thiện tỉ mỉ để giữ được vẻ liền mạch cho không gian.",
                },
                {
                  type: "twoImagesContent",
                  image1: "/assets/images/works/project-9.jpg",
                  image2: "/assets/images/works/project-10.jpg",
                  content:
                    "Sau khi hoàn thiện, bề mặt đá được vệ sinh, đánh bóng và phủ bảo vệ nhằm tăng độ bền trong quá trình sử dụng. Công trình mang lại cảm giác sang trọng, sáng thoáng và đồng bộ với tổng thể kiến trúc biệt thự.",
                },
              ],
            },
            seoTitle: "Thi công đá Marble biệt thự ven sông | PAC Stone",
            seoDescription:
              "Dự án thi công đá Marble tự nhiên cho biệt thự ven sông bởi PAC Stone.",
          },
        ],
      },
    },
  });

  console.log("Admin created:", email, password);
  console.log("Policy page created: /vi/policies/privacy-policy");
  console.log(
    "Project created: /vi/cong-trinh/thi-cong-da-marble-biet-thu-ven-song"
  );
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });