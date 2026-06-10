import "dotenv/config";
import bcrypt from "bcryptjs";
import {
  PrismaClient,
  Locale,
  PublishStatus,
  ContentType,
  OrderStatus,
  PaymentStatus,
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

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name: "Admin",
      password: hashedPassword,
      role: "ADMIN",
      image: "/assets/images/users/user-1.jpg",
    },
    create: {
      name: "Admin",
      email,
      password: hashedPassword,
      role: "ADMIN",
      image: "/assets/images/users/user-1.jpg",
    },
  });

  const existingProject = await prisma.projectTranslation.findUnique({
    where: {
      locale_slug: {
        locale: Locale.vi,
        slug: "thi-cong-da-marble-biet-thu-ven-song",
      },
    },
  });

  if (!existingProject) {
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
  }

  await prisma.address.upsert({
    where: {
      id: "seed-address-default",
    },
    update: {
      userId: user.id,
      fullName: "Nguyễn Văn A",
      phone: "0901234567",
      city: "TP. Hồ Chí Minh",
      district: "Quận 1",
      ward: "Phường Bến Nghé",
      street: "25 Nguyễn Huệ",
      isDefault: true,
    },
    create: {
      id: "seed-address-default",
      userId: user.id,
      fullName: "Nguyễn Văn A",
      phone: "0901234567",
      city: "TP. Hồ Chí Minh",
      district: "Quận 1",
      ward: "Phường Bến Nghé",
      street: "25 Nguyễn Huệ",
      isDefault: true,
    },
  });

  const category = await prisma.category.upsert({
    where: {
      type_slug: {
        type: ContentType.PRODUCT,
        slug: "da-marble",
      },
    },
    update: {
      nameVi: "Đá Marble",
      nameEn: "Marble Stone",
      sortOrder: 1,
    },
    create: {
      type: ContentType.PRODUCT,
      slug: "da-marble",
      nameVi: "Đá Marble",
      nameEn: "Marble Stone",
      sortOrder: 1,
    },
  });

  const existingProductTranslation =
    await prisma.productTranslation.findUnique({
      where: {
        locale_slug: {
          locale: Locale.vi,
          slug: "da-marble-trang-van-may",
        },
      },
      include: {
        product: true,
      },
    });

  let product = existingProductTranslation?.product;

  if (!product) {
    product = await prisma.product.create({
      data: {
        status: PublishStatus.PUBLISHED,
        sku: "MARBLE-WHITE-01",
        price: "1250000",
        thumbnail: "/assets/images/products/product-1-1.png",
        categoryId: category.id,
        isFeatured: true,
        allowIndex: true,
        publishedAt: new Date(),
        translations: {
          create: [
            {
              locale: Locale.vi,
              title: "Đá Marble trắng vân mây",
              slug: "da-marble-trang-van-may",
              excerpt: "Mẫu đá Marble trắng vân mây cao cấp cho nội thất.",
              content: {
                blocks: [],
              },
              seoTitle: "Đá Marble trắng vân mây | PAC Stone",
              seoDescription: "Đá Marble trắng vân mây cao cấp.",
            },
          ],
        },
      },
    });
  } else {
    product = await prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        status: PublishStatus.PUBLISHED,
        sku: "MARBLE-WHITE-01",
        price: "1250000",
        thumbnail: "/assets/images/products/product-1-1.png",
        categoryId: category.id,
        isFeatured: true,
        allowIndex: true,
        publishedAt: new Date(),
      },
    });
  }

  const cart = await prisma.cart.upsert({
    where: {
      id: "seed-cart-active",
    },
    update: {
      userId: user.id,
      status: "ACTIVE",
    },
    create: {
      id: "seed-cart-active",
      userId: user.id,
      status: "ACTIVE",
    },
  });

  await prisma.cartItem.upsert({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId: product.id,
      },
    },
    update: {
      quantity: 2,
      price: "1250000",
      snapshot: {
        title: "Đá Marble trắng vân mây",
        image: "/assets/images/products/product-1-1.png",
      },
    },
    create: {
      cartId: cart.id,
      productId: product.id,
      quantity: 2,
      price: "1250000",
      snapshot: {
        title: "Đá Marble trắng vân mây",
        image: "/assets/images/products/product-1-1.png",
      },
    },
  });

  await prisma.wishlist.upsert({
    where: {
      userId_productId: {
        userId: user.id,
        productId: product.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      productId: product.id,
    },
  });

  const existingOrder = await prisma.order.findUnique({
    where: {
      code: "PAC-ORDER-0001",
    },
  });

  if (!existingOrder) {
    await prisma.order.create({
      data: {
        userId: user.id,
        code: "PAC-ORDER-0001",
        status: OrderStatus.PROCESSING,
        paymentStatus: PaymentStatus.UNPAID,
        paymentMethod: "COD",
        shippingFee: "0",
        subtotal: "2500000",
        total: "2500000",
        receiverName: "Nguyễn Văn A",
        receiverPhone: "0901234567",
        city: "TP. Hồ Chí Minh",
        district: "Quận 1",
        ward: "Phường Bến Nghé",
        street: "25 Nguyễn Huệ",
        items: {
          create: [
            {
              productId: product.id,
              title: "Đá Marble trắng vân mây",
              image: "/assets/images/products/product-1-1.png",
              quantity: 2,
              price: "1250000",
              subtotal: "2500000",
              snapshot: {
                sku: "MARBLE-WHITE-01",
              },
            },
          ],
        },
      },
    });
  } else {
    await prisma.order.update({
      where: {
        code: "PAC-ORDER-0001",
      },
      data: {
        userId: user.id,
        status: OrderStatus.PROCESSING,
        paymentStatus: PaymentStatus.UNPAID,
        paymentMethod: "COD",
        shippingFee: "0",
        subtotal: "2500000",
        total: "2500000",
        receiverName: "Nguyễn Văn A",
        receiverPhone: "0901234567",
        city: "TP. Hồ Chí Minh",
        district: "Quận 1",
        ward: "Phường Bến Nghé",
        street: "25 Nguyễn Huệ",
      },
    });
  }

  console.log("Seed done");
  console.log("Admin:", email, password);
  console.log("Account page: /vi/account");
  console.log(
    "Project page: /vi/cong-trinh/thi-cong-da-marble-biet-thu-ven-song"
  );
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });