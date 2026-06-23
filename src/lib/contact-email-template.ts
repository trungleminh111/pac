type ContactEmailTemplateParams = {
  name: string;
  email: string;
  phone: string;
  message: string;

  productTitle?: string;
  productSku?: string;
  productUrl?: string;

  fileName?: string;
  fileSizeKb?: number;

  sourceUrl?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function buildContactEmailHtml(data: ContactEmailTemplateParams) {
  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safePhone = escapeHtml(data.phone);
  const safeMessage = escapeHtml(data.message).replaceAll("\n", "<br />");

  const safeProductTitle = escapeHtml(data.productTitle || "");
  const safeProductSku = escapeHtml(data.productSku || "");
  const safeProductUrl = escapeHtml(data.productUrl || "");

  const safeFileName = escapeHtml(data.fileName || "");
  const safeSourceUrl = escapeHtml(data.sourceUrl || "");

  return `
<!DOCTYPE html>
<html lang="vi">
<body style="margin:0; padding:0; background:#f4f4f4; font-family:Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f4; padding:24px 12px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:720px; background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e8e8e8;">
          <tr>
            <td style="background:#1f1f1f; padding:24px 28px;">
              <div style="font-size:20px; line-height:1.4; color:#ffffff; font-weight:700;">
                P.A.C STONE
              </div>
              <div style="font-size:13px; line-height:1.5; color:#d6d6d6; margin-top:4px;">
                Thông báo liên hệ mới từ website
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:28px;">
              <h2 style="margin:0 0 18px; font-size:22px; line-height:1.35; color:#222222;">
                Khách hàng gửi liên hệ mới
              </h2>

              <p style="margin:0 0 22px; font-size:15px; line-height:1.7; color:#555555;">
                Có khách hàng vừa gửi thông tin tư vấn từ form liên hệ trên website.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; font-size:15px; color:#222222;">
                <tr>
                  <td style="width:160px; padding:12px; border:1px solid #eeeeee; background:#fafafa; font-weight:700;">Họ tên</td>
                  <td style="padding:12px; border:1px solid #eeeeee;">${safeName}</td>
                </tr>

                <tr>
                  <td style="width:160px; padding:12px; border:1px solid #eeeeee; background:#fafafa; font-weight:700;">Email</td>
                  <td style="padding:12px; border:1px solid #eeeeee;">
                    <a href="mailto:${safeEmail}" style="color:#b8894d; text-decoration:none;">${safeEmail}</a>
                  </td>
                </tr>

                <tr>
                  <td style="width:160px; padding:12px; border:1px solid #eeeeee; background:#fafafa; font-weight:700;">Điện thoại</td>
                  <td style="padding:12px; border:1px solid #eeeeee;">
                    <a href="tel:${safePhone}" style="color:#b8894d; text-decoration:none;">${safePhone}</a>
                  </td>
                </tr>

                <tr>
                  <td style="width:160px; padding:12px; border:1px solid #eeeeee; background:#fafafa; font-weight:700; vertical-align:top;">Nội dung</td>
                  <td style="padding:12px; border:1px solid #eeeeee; line-height:1.7;">${safeMessage}</td>
                </tr>

                ${
                  data.productTitle
                    ? `
                <tr>
                  <td style="width:160px; padding:12px; border:1px solid #eeeeee; background:#fafafa; font-weight:700; vertical-align:top;">Sản phẩm</td>
                  <td style="padding:12px; border:1px solid #eeeeee; line-height:1.7;">
                    <div style="font-weight:700; color:#222222;">${safeProductTitle}</div>
                    ${
                      safeProductSku
                        ? `<div style="color:#555555;">Mã sản phẩm: ${safeProductSku}</div>`
                        : ""
                    }
                    ${
                      safeProductUrl
                        ? `<div><a href="${safeProductUrl}" target="_blank" style="color:#b8894d; text-decoration:none;">Xem sản phẩm trên website</a></div>`
                        : ""
                    }
                  </td>
                </tr>
                `
                    : ""
                }

                ${
                  data.fileName
                    ? `
                <tr>
                  <td style="width:160px; padding:12px; border:1px solid #eeeeee; background:#fafafa; font-weight:700;">File đính kèm</td>
                  <td style="padding:12px; border:1px solid #eeeeee;">
                    ${safeFileName}
                    ${
                      data.fileSizeKb
                        ? `<span style="color:#777777;">(${data.fileSizeKb} KB)</span>`
                        : ""
                    }
                  </td>
                </tr>
                `
                    : ""
                }

                ${
                  safeSourceUrl
                    ? `
                <tr>
                  <td style="width:160px; padding:12px; border:1px solid #eeeeee; background:#fafafa; font-weight:700;">Nguồn</td>
                  <td style="padding:12px; border:1px solid #eeeeee;">
                    <a href="${safeSourceUrl}" target="_blank" style="color:#b8894d; text-decoration:none;">${safeSourceUrl}</a>
                  </td>
                </tr>
                `
                    : ""
                }
              </table>

              <div style="margin-top:24px; padding:16px; background:#faf7f2; border:1px solid #eadfce; border-radius:8px;">
                <div style="font-size:14px; line-height:1.7; color:#5b4630;">
                  <strong>Gợi ý xử lý:</strong> Bấm trả lời email này để phản hồi trực tiếp cho khách hàng.
                </div>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:18px 28px; background:#fafafa; border-top:1px solid #eeeeee;">
              <div style="font-size:12px; line-height:1.6; color:#777777;">
                Email này được gửi tự động từ website P.A.C STONE. Vui lòng không chia sẻ thông tin khách hàng ra bên ngoài.
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

export function buildContactEmailText(data: ContactEmailTemplateParams) {
  return `
Khách hàng gửi liên hệ mới

Họ tên: ${data.name}
Email: ${data.email}
Điện thoại: ${data.phone}
Nội dung: ${data.message}

${
  data.productTitle
    ? `Sản phẩm khách quan tâm:
Tên: ${data.productTitle}
Mã: ${data.productSku || ""}
Link: ${data.productUrl || ""}
`
    : ""
}

${data.fileName ? `File đính kèm: ${data.fileName}` : ""}

Nguồn: ${data.sourceUrl || ""}
`.trim();
}