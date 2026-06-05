import ExcelJS from "exceljs";

export async function GET() {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Import Products");

  sheet.columns = [
    { header: "locale", key: "locale", width: 14 },
    { header: "title", key: "title", width: 30 },
    { header: "slug", key: "slug", width: 30 },
    { header: "excerpt", key: "excerpt", width: 40 },
    { header: "content", key: "content", width: 50 },
    { header: "sku", key: "sku", width: 18 },
    { header: "price", key: "price", width: 18 },
    { header: "origin", key: "origin", width: 18 },
    { header: "color", key: "color", width: 20 },
    { header: "material", key: "material", width: 24 },
    { header: "size", key: "size", width: 24 },
    { header: "thickness", key: "thickness", width: 16 },
    { header: "density", key: "density", width: 18 },
    { header: "hardness", key: "hardness", width: 18 },
    { header: "seoTitle", key: "seoTitle", width: 35 },
    { header: "seoDescription", key: "seoDescription", width: 45 },
    { header: "status", key: "status", width: 16 },
    { header: "categoryId", key: "categoryId", width: 30 },
    { header: "isFeatured", key: "isFeatured", width: 16 },
    { header: "allowIndex", key: "allowIndex", width: 16 },
  ];

  sheet.addRow({
    locale: "vi",
    title: "Đá Marble Trắng Vân Mây",
    slug: "da-marble-trang-van-may",
    excerpt: "Mô tả ngắn sản phẩm",
    content: "<p>Nội dung chi tiết sản phẩm</p>",
    sku: "PAC-001",
    price: "10500000",
    origin: "Ấn Độ",
    color: "Trắng vân xám",
    material: "Đá Marble tự nhiên",
    size: "Khổ lớn theo yêu cầu",
    thickness: "2cm",
    density: "2.71 g/m3",
    hardness: "4 Mohs",
    seoTitle: "Đá Marble Trắng Vân Mây",
    seoDescription: "Mô tả SEO sản phẩm",
    status: "PUBLISHED",
    categoryId: "",
    isFeatured: "FALSE",
    allowIndex: "TRUE",
  });

  const headerRow = sheet.getRow(1);
  headerRow.height = 26;

  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF2271B1" },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  sheet.getRow(2).eachCell((cell) => {
    cell.alignment = { vertical: "top", wrapText: true };
    cell.border = {
      top: { style: "thin", color: { argb: "FFE5E7EB" } },
      left: { style: "thin", color: { argb: "FFE5E7EB" } },
      bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
      right: { style: "thin", color: { argb: "FFE5E7EB" } },
    };
  });

  sheet.views = [{ state: "frozen", ySplit: 1 }];

  for (let row = 2; row <= 500; row++) {
    sheet.getCell(`A${row}`).dataValidation = {
      type: "list",
      allowBlank: false,
      formulae: ['"vi,en"'],
    };

    sheet.getCell(`Q${row}`).dataValidation = {
      type: "list",
      allowBlank: false,
      formulae: ['"DRAFT,PUBLISHED,ARCHIVED"'],
    };

    sheet.getCell(`S${row}`).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: ['"TRUE,FALSE"'],
    };

    sheet.getCell(`T${row}`).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: ['"TRUE,FALSE"'],
    };
  }

  const buffer = await workbook.xlsx.writeBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="product-import-template.xlsx"`,
    },
  });
}