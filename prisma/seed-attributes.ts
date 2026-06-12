import "dotenv/config";
import { PrismaClient, AttributeInputType, Locale } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

type SeedAttributeValue = {
  code: string;
  vi: string;
  en: string;
  colorHex?: string;
  image?: string;
};

type SeedAttribute = {
  code: string;
  type: AttributeInputType;
  isFilter: boolean;
  isVariantOption: boolean;
  sortOrder: number;
  name: {
    vi: string;
    en: string;
  };
  values?: SeedAttributeValue[];
};

const attributes: SeedAttribute[] = [
  {
    code: "color",
    type: AttributeInputType.COLOR,
    isFilter: true,
    isVariantOption: true,
    sortOrder: 10,
    name: {
      vi: "Tông màu",
      en: "Color tone",
    },
    values: [
      { code: "white", vi: "Trắng", en: "White", colorHex: "#FFFFFF" },
      { code: "black", vi: "Đen", en: "Black", colorHex: "#111111" },
      { code: "gray", vi: "Xám", en: "Gray", colorHex: "#808080" },
      {
        code: "light-gray",
        vi: "Xám nhạt",
        en: "Light gray",
        colorHex: "#D9D9D9",
      },
      {
        code: "dark-gray",
        vi: "Xám đậm",
        en: "Dark gray",
        colorHex: "#4A4A4A",
      },
      { code: "beige", vi: "Be", en: "Beige", colorHex: "#D8C3A5" },
      { code: "cream", vi: "Kem", en: "Cream", colorHex: "#F5E6C8" },
      { code: "brown", vi: "Nâu", en: "Brown", colorHex: "#8B5A2B" },
      { code: "gold", vi: "Vàng đồng", en: "Gold", colorHex: "#D4AF37" },
      { code: "yellow", vi: "Vàng", en: "Yellow", colorHex: "#F2C94C" },
      { code: "red", vi: "Đỏ", en: "Red", colorHex: "#D64545" },
      { code: "green", vi: "Xanh lá", en: "Green", colorHex: "#3F8F46" },
      { code: "blue", vi: "Xanh dương", en: "Blue", colorHex: "#2F80ED" },
      { code: "silver", vi: "Bạc", en: "Silver", colorHex: "#C0C0C0" },
      {
        code: "multi-color",
        vi: "Đa sắc",
        en: "Multi color",
        colorHex: "#B8A47E",
      },
    ],
  },
  {
    code: "material",
    type: AttributeInputType.SELECT,
    isFilter: true,
    isVariantOption: false,
    sortOrder: 20,
    name: {
      vi: "Chất liệu",
      en: "Material",
    },
    values: [
      { code: "marble", vi: "Đá Marble", en: "Marble" },
      { code: "granite", vi: "Đá Granite", en: "Granite" },
      { code: "quartz", vi: "Đá Quartz", en: "Quartz" },
      { code: "porcelain", vi: "Porcelain", en: "Porcelain" },
      { code: "sintered-stone", vi: "Đá nung kết", en: "Sintered stone" },
      { code: "travertine", vi: "Travertine", en: "Travertine" },
      { code: "limestone", vi: "Đá Limestone", en: "Limestone" },
      { code: "onyx", vi: "Đá Onyx", en: "Onyx" },
      { code: "basalt", vi: "Đá Bazan", en: "Basalt" },
      { code: "terrazzo", vi: "Terrazzo", en: "Terrazzo" },
      { code: "artificial-stone", vi: "Đá nhân tạo", en: "Artificial stone" },
      { code: "ceramic-tile", vi: "Gạch Ceramic", en: "Ceramic tile" },
    ],
  },
  {
    code: "stone_pattern",
    type: AttributeInputType.MULTI_SELECT,
    isFilter: true,
    isVariantOption: false,
    sortOrder: 30,
    name: {
      vi: "Kiểu vân",
      en: "Pattern",
    },
    values: [
      { code: "plain", vi: "Trơn", en: "Plain" },
      { code: "cloud-vein", vi: "Vân mây", en: "Cloud vein" },
      { code: "linear-vein", vi: "Vân tia", en: "Linear vein" },
      { code: "wood-vein", vi: "Vân gỗ", en: "Wood vein" },
      { code: "grain", vi: "Vân hạt", en: "Grain" },
      { code: "natural-stone", vi: "Vân đá tự nhiên", en: "Natural stone" },
      { code: "terrazzo-pattern", vi: "Vân Terrazzo", en: "Terrazzo pattern" },
      { code: "bookmatch", vi: "Vân đối xứng", en: "Bookmatch" },
      { code: "calacatta", vi: "Calacatta", en: "Calacatta" },
      { code: "carrara", vi: "Carrara", en: "Carrara" },
      { code: "statuario", vi: "Statuario", en: "Statuario" },
      { code: "arabescato", vi: "Arabescato", en: "Arabescato" },
    ],
  },
  {
    code: "surface",
    type: AttributeInputType.SELECT,
    isFilter: true,
    isVariantOption: true,
    sortOrder: 40,
    name: {
      vi: "Bề mặt",
      en: "Surface finish",
    },
    values: [
      { code: "polished", vi: "Bóng", en: "Polished" },
      { code: "honed", vi: "Mài mờ", en: "Honed" },
      { code: "matte", vi: "Mờ", en: "Matte" },
      { code: "rough", vi: "Nhám", en: "Rough" },
      { code: "flamed", vi: "Khò lửa", en: "Flamed" },
      { code: "brushed", vi: "Chải xước", en: "Brushed" },
      { code: "leathered", vi: "Da thuộc", en: "Leathered" },
      { code: "sandblasted", vi: "Phun cát", en: "Sandblasted" },
      { code: "bush-hammered", vi: "Băm mặt", en: "Bush hammered" },
      { code: "anti-slip", vi: "Chống trơn", en: "Anti-slip" },
    ],
  },
  {
    code: "thickness",
    type: AttributeInputType.SELECT,
    isFilter: true,
    isVariantOption: true,
    sortOrder: 50,
    name: {
      vi: "Độ dày",
      en: "Thickness",
    },
    values: [
      { code: "6mm", vi: "6mm", en: "6mm" },
      { code: "9mm", vi: "9mm", en: "9mm" },
      { code: "12mm", vi: "12mm", en: "12mm" },
      { code: "15mm", vi: "15mm", en: "15mm" },
      { code: "18mm", vi: "18mm", en: "18mm" },
      { code: "20mm", vi: "20mm", en: "20mm" },
      { code: "25mm", vi: "25mm", en: "25mm" },
      { code: "30mm", vi: "30mm", en: "30mm" },
    ],
  },
  {
    code: "size",
    type: AttributeInputType.SELECT,
    isFilter: true,
    isVariantOption: true,
    sortOrder: 60,
    name: {
      vi: "Kích thước",
      en: "Size",
    },
    values: [
      { code: "300x600", vi: "300 x 600mm", en: "300 x 600mm" },
      { code: "600x600", vi: "600 x 600mm", en: "600 x 600mm" },
      { code: "800x800", vi: "800 x 800mm", en: "800 x 800mm" },
      { code: "600x1200", vi: "600 x 1200mm", en: "600 x 1200mm" },
      { code: "750x1500", vi: "750 x 1500mm", en: "750 x 1500mm" },
      { code: "800x1600", vi: "800 x 1600mm", en: "800 x 1600mm" },
      { code: "1200x2400", vi: "1200 x 2400mm", en: "1200 x 2400mm" },
      { code: "slab", vi: "Tấm lớn", en: "Slab" },
      { code: "custom-cut", vi: "Cắt theo yêu cầu", en: "Custom cut" },
    ],
  },
  {
    code: "application",
    type: AttributeInputType.MULTI_SELECT,
    isFilter: true,
    isVariantOption: false,
    sortOrder: 70,
    name: {
      vi: "Ứng dụng",
      en: "Application",
    },
    values: [
      { code: "wall-cladding", vi: "Ốp tường", en: "Wall cladding" },
      { code: "flooring", vi: "Lát sàn", en: "Flooring" },
      { code: "countertop", vi: "Mặt bếp", en: "Countertop" },
      { code: "stairs", vi: "Cầu thang", en: "Stairs" },
      { code: "facade", vi: "Mặt tiền", en: "Facade" },
      { code: "bathroom", vi: "Phòng tắm", en: "Bathroom" },
      { code: "kitchen", vi: "Phòng bếp", en: "Kitchen" },
      { code: "table-top", vi: "Mặt bàn", en: "Table top" },
      { code: "outdoor", vi: "Ngoài trời", en: "Outdoor" },
      { code: "indoor", vi: "Trong nhà", en: "Indoor" },
      { code: "landscape", vi: "Sân vườn", en: "Landscape" },
      { code: "elevator", vi: "Thang máy", en: "Elevator" },
    ],
  },
  {
    code: "origin",
    type: AttributeInputType.SELECT,
    isFilter: true,
    isVariantOption: false,
    sortOrder: 80,
    name: {
      vi: "Xuất xứ",
      en: "Origin",
    },
    values: [
      { code: "vietnam", vi: "Việt Nam", en: "Vietnam" },
      { code: "italy", vi: "Ý", en: "Italy" },
      { code: "spain", vi: "Tây Ban Nha", en: "Spain" },
      { code: "china", vi: "Trung Quốc", en: "China" },
      { code: "india", vi: "Ấn Độ", en: "India" },
      { code: "turkey", vi: "Thổ Nhĩ Kỳ", en: "Turkey" },
      { code: "brazil", vi: "Brazil", en: "Brazil" },
      { code: "iran", vi: "Iran", en: "Iran" },
      { code: "egypt", vi: "Ai Cập", en: "Egypt" },
    ],
  },
  {
    code: "slip_rating",
    type: AttributeInputType.SELECT,
    isFilter: true,
    isVariantOption: false,
    sortOrder: 90,
    name: {
      vi: "Cấp chống trơn",
      en: "Slip rating",
    },
    values: [
      { code: "r9", vi: "R9", en: "R9" },
      { code: "r10", vi: "R10", en: "R10" },
      { code: "r11", vi: "R11", en: "R11" },
      { code: "r12", vi: "R12", en: "R12" },
      { code: "r13", vi: "R13", en: "R13" },
    ],
  },
  {
    code: "water_absorption",
    type: AttributeInputType.NUMBER,
    isFilter: false,
    isVariantOption: false,
    sortOrder: 100,
    name: {
      vi: "Độ hút nước",
      en: "Water absorption",
    },
  },
  {
    code: "hardness",
    type: AttributeInputType.NUMBER,
    isFilter: false,
    isVariantOption: false,
    sortOrder: 110,
    name: {
      vi: "Độ cứng",
      en: "Hardness",
    },
  },
  {
    code: "density",
    type: AttributeInputType.NUMBER,
    isFilter: false,
    isVariantOption: false,
    sortOrder: 120,
    name: {
      vi: "Tỷ trọng",
      en: "Density",
    },
  },
  {
    code: "anti_slip",
    type: AttributeInputType.BOOLEAN,
    isFilter: true,
    isVariantOption: false,
    sortOrder: 130,
    name: {
      vi: "Chống trơn",
      en: "Anti-slip",
    },
  },
  {
    code: "translucent",
    type: AttributeInputType.BOOLEAN,
    isFilter: true,
    isVariantOption: false,
    sortOrder: 140,
    name: {
      vi: "Xuyên sáng",
      en: "Translucent",
    },
  },
  {
    code: "outdoor_suitable",
    type: AttributeInputType.BOOLEAN,
    isFilter: true,
    isVariantOption: false,
    sortOrder: 150,
    name: {
      vi: "Phù hợp ngoài trời",
      en: "Outdoor suitable",
    },
  },
  {
    code: "equipment_type",
    type: AttributeInputType.SELECT,
    isFilter: true,
    isVariantOption: false,
    sortOrder: 160,
    name: {
      vi: "Loại vật tư / thiết bị",
      en: "Equipment type",
    },
    values: [
      { code: "stone-adhesive", vi: "Keo dán đá", en: "Stone adhesive" },
      { code: "tile-adhesive", vi: "Keo dán gạch", en: "Tile adhesive" },
      { code: "grout", vi: "Keo chà ron", en: "Grout" },
      { code: "sealer", vi: "Chống thấm / phủ bảo vệ", en: "Sealer" },
      { code: "cleaner", vi: "Dung dịch vệ sinh", en: "Cleaner" },
      { code: "diamond-blade", vi: "Lưỡi cắt kim cương", en: "Diamond blade" },
      { code: "polishing-pad", vi: "Pad đánh bóng", en: "Polishing pad" },
      { code: "grinding-wheel", vi: "Đá mài", en: "Grinding wheel" },
      { code: "leveling-system", vi: "Ke cân bằng gạch", en: "Leveling system" },
      { code: "spacer", vi: "Ke chữ thập", en: "Tile spacer" },
    ],
  },
  {
    code: "tool_diameter",
    type: AttributeInputType.SELECT,
    isFilter: true,
    isVariantOption: true,
    sortOrder: 170,
    name: {
      vi: "Đường kính dụng cụ",
      en: "Tool diameter",
    },
    values: [
      { code: "100mm", vi: "100mm", en: "100mm" },
      { code: "115mm", vi: "115mm", en: "115mm" },
      { code: "125mm", vi: "125mm", en: "125mm" },
      { code: "150mm", vi: "150mm", en: "150mm" },
      { code: "180mm", vi: "180mm", en: "180mm" },
      { code: "230mm", vi: "230mm", en: "230mm" },
      { code: "300mm", vi: "300mm", en: "300mm" },
      { code: "350mm", vi: "350mm", en: "350mm" },
    ],
  },
  {
    code: "compatible_machine",
    type: AttributeInputType.MULTI_SELECT,
    isFilter: true,
    isVariantOption: false,
    sortOrder: 180,
    name: {
      vi: "Máy tương thích",
      en: "Compatible machine",
    },
    values: [
      { code: "angle-grinder", vi: "Máy mài góc", en: "Angle grinder" },
      { code: "stone-cutter", vi: "Máy cắt đá", en: "Stone cutter" },
      { code: "tile-cutter", vi: "Máy cắt gạch", en: "Tile cutter" },
      { code: "polishing-machine", vi: "Máy đánh bóng", en: "Polishing machine" },
      { code: "drill", vi: "Máy khoan", en: "Drill" },
      { code: "cnc-machine", vi: "Máy CNC", en: "CNC machine" },
      { code: "bridge-saw", vi: "Máy cắt cầu", en: "Bridge saw" },
    ],
  },
];

async function resetAttributes() {
  console.log("Resetting attributes...");

  await prisma.$transaction([
    prisma.productVariantAttributeValue.deleteMany(),
    prisma.productAttributeValue.deleteMany(),
    prisma.categoryAttribute.deleteMany(),

    prisma.attributeValueTranslation.deleteMany(),
    prisma.attributeValue.deleteMany(),

    prisma.attributeTranslation.deleteMany(),
    prisma.attribute.deleteMany(),
  ]);

  console.log("Reset attributes done.");
}

async function seedAttributes() {
  console.log("Seeding attributes...");

  for (const attribute of attributes) {
    const createdAttribute = await prisma.attribute.create({
      data: {
        code: attribute.code,
        type: attribute.type,
        isFilter: attribute.isFilter,
        isVariantOption: attribute.isVariantOption,
        sortOrder: attribute.sortOrder,
      },
    });

    await prisma.attributeTranslation.createMany({
      data: [
        {
          attributeId: createdAttribute.id,
          locale: Locale.vi,
          name: attribute.name.vi,
        },
        {
          attributeId: createdAttribute.id,
          locale: Locale.en,
          name: attribute.name.en,
        },
      ],
    });

    for (const [index, value] of (attribute.values || []).entries()) {
      const createdValue = await prisma.attributeValue.create({
        data: {
          attributeId: createdAttribute.id,
          code: value.code,
          colorHex: value.colorHex || null,
          image: value.image || null,
          sortOrder: index + 1,
        },
      });

      await prisma.attributeValueTranslation.createMany({
        data: [
          {
            attributeValueId: createdValue.id,
            locale: Locale.vi,
            name: value.vi,
          },
          {
            attributeValueId: createdValue.id,
            locale: Locale.en,
            name: value.en,
          },
        ],
      });
    }

    console.log(`Seeded attribute: ${attribute.code}`);
  }

  const attributeCount = await prisma.attribute.count();
  const valueCount = await prisma.attributeValue.count();

  console.log("Seed attributes done.");
  console.log(`Attributes: ${attributeCount}`);
  console.log(`Attribute values: ${valueCount}`);
}

async function main() {
  await resetAttributes();
  await seedAttributes();
}

main()
  .catch((error) => {
    console.error("Seed attributes failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });