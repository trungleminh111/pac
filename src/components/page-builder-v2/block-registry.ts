import type {
  BuilderBlockDefinition,
  BuilderBlockType,
  BuilderField,
  BuilderPlan,
} from "./types";

const layoutStyleFields: BuilderField[] = [
  {
    name: "style.display",
    label: "Display",
    type: "select",
    tab: "style",
    options: [
      { label: "Block", value: "block" },
      { label: "Flex", value: "flex" },
      { label: "Grid", value: "grid" },
    ],
  },
  {
    name: "style.flexDirection",
    label: "Flex direction",
    type: "select",
    tab: "style",
    options: [
      { label: "Row", value: "row" },
      { label: "Column", value: "column" },
    ],
  },
  {
    name: "style.justifyContent",
    label: "Justify content",
    type: "select",
    tab: "style",
    options: [
      { label: "Start", value: "flex-start" },
      { label: "Center", value: "center" },
      { label: "End", value: "flex-end" },
      { label: "Between", value: "space-between" },
      { label: "Around", value: "space-around" },
    ],
  },
  {
    name: "style.alignItems",
    label: "Align items",
    type: "select",
    tab: "style",
    options: [
      { label: "Start", value: "flex-start" },
      { label: "Center", value: "center" },
      { label: "End", value: "flex-end" },
      { label: "Stretch", value: "stretch" },
    ],
  },
  {
    name: "style.gap",
    label: "Gap",
    type: "number",
    tab: "style",
  },
];

const sizeStyleFields: BuilderField[] = [
  {
    name: "style.width",
    label: "Width",
    type: "text",
    tab: "style",
    placeholder: "100%, 500px, auto",
  },
  {
    name: "style.maxWidth",
    label: "Max width",
    type: "text",
    tab: "style",
    placeholder: "1200px, 100%, none",
  },
  {
    name: "style.minHeight",
    label: "Min height",
    type: "number",
    tab: "style",
  },
];

const spacingStyleFields: BuilderField[] = [
  { name: "style.margin.top", label: "Margin top", type: "number", tab: "style" },
  { name: "style.margin.right", label: "Margin right", type: "number", tab: "style" },
  { name: "style.margin.bottom", label: "Margin bottom", type: "number", tab: "style" },
  { name: "style.margin.left", label: "Margin left", type: "number", tab: "style" },
  { name: "style.padding.top", label: "Padding top", type: "number", tab: "style" },
  { name: "style.padding.right", label: "Padding right", type: "number", tab: "style" },
  { name: "style.padding.bottom", label: "Padding bottom", type: "number", tab: "style" },
  { name: "style.padding.left", label: "Padding left", type: "number", tab: "style" },
];

const backgroundStyleFields: BuilderField[] = [
  {
    name: "style.backgroundColor",
    label: "Background color",
    type: "color",
    tab: "style",
  },
  {
    name: "style.backgroundImage",
    label: "Background image URL",
    type: "image",
    tab: "style",
  },
  {
    name: "style.backgroundSize",
    label: "Background size",
    type: "select",
    tab: "style",
    options: [
      { label: "Cover", value: "cover" },
      { label: "Contain", value: "contain" },
      { label: "Auto", value: "auto" },
    ],
  },
  {
    name: "style.backgroundPosition",
    label: "Background position",
    type: "text",
    tab: "style",
    placeholder: "center center",
  },
];

const borderStyleFields: BuilderField[] = [
  {
    name: "style.borderStyle",
    label: "Border style",
    type: "select",
    tab: "style",
    options: [
      { label: "None", value: "none" },
      { label: "Solid", value: "solid" },
      { label: "Dashed", value: "dashed" },
      { label: "Dotted", value: "dotted" },
    ],
  },
  {
    name: "style.borderWidth",
    label: "Border width",
    type: "number",
    tab: "style",
  },
  {
    name: "style.borderColor",
    label: "Border color",
    type: "color",
    tab: "style",
  },
  {
    name: "style.radius",
    label: "Border radius",
    type: "number",
    tab: "style",
  },
  {
    name: "style.shadow",
    label: "Shadow",
    type: "select",
    tab: "style",
    options: [
      { label: "None", value: "none" },
      { label: "Small", value: "sm" },
      { label: "Medium", value: "md" },
      { label: "Large", value: "lg" },
      { label: "XL", value: "xl" },
    ],
  },
];

const typographyStyleFields: BuilderField[] = [
  {
    name: "style.textAlign",
    label: "Text align",
    type: "select",
    tab: "style",
    options: [
      { label: "Left", value: "left" },
      { label: "Center", value: "center" },
      { label: "Right", value: "right" },
    ],
  },
  {
    name: "style.color",
    label: "Text color",
    type: "color",
    tab: "style",
  },
  {
    name: "style.fontSize",
    label: "Font size",
    type: "number",
    tab: "style",
  },
  {
    name: "style.fontWeight",
    label: "Font weight",
    type: "select",
    tab: "style",
    options: [
      { label: "Regular", value: "400" },
      { label: "Medium", value: "500" },
      { label: "Semibold", value: "600" },
      { label: "Bold", value: "700" },
      { label: "Extra bold", value: "800" },
    ],
  },
  {
    name: "style.lineHeight",
    label: "Line height",
    type: "number",
    tab: "style",
  },
  {
    name: "style.textTransform",
    label: "Text transform",
    type: "select",
    tab: "style",
    options: [
      { label: "None", value: "none" },
      { label: "Uppercase", value: "uppercase" },
      { label: "Lowercase", value: "lowercase" },
      { label: "Capitalize", value: "capitalize" },
    ],
  },
];

const advancedFields: BuilderField[] = [
  {
    name: "style.opacity",
    label: "Opacity",
    type: "number",
    tab: "advanced",
  },
  {
    name: "style.zIndex",
    label: "Z-index",
    type: "number",
    tab: "advanced",
  },
  {
    name: "style.hideDesktop",
    label: "Hide desktop",
    type: "switch",
    tab: "advanced",
  },
  {
    name: "style.hideTablet",
    label: "Hide tablet",
    type: "switch",
    tab: "advanced",
  },
  {
    name: "style.hideMobile",
    label: "Hide mobile",
    type: "switch",
    tab: "advanced",
  },
  {
    name: "style.customClass",
    label: "Custom class",
    type: "text",
    tab: "advanced",
  },
];

const boxStyleFields = [
  ...layoutStyleFields,
  ...sizeStyleFields,
  ...spacingStyleFields,
  ...backgroundStyleFields,
  ...borderStyleFields,
  ...advancedFields,
];

const contentBoxStyleFields = [
  ...sizeStyleFields,
  ...spacingStyleFields,
  ...backgroundStyleFields,
  ...borderStyleFields,
  ...advancedFields,
];

const textStyleFields = [
  ...spacingStyleFields,
  ...typographyStyleFields,
  ...advancedFields,
];

export const blockRegistry: BuilderBlockDefinition[] = [
  {
    type: "section",
    label: "Section",
    description: "Khu vực lớn chứa container/elements",
    plan: "core",
    category: "layout",
    acceptsChildren: true,
    defaultProps: {},
    defaultStyle: {
      width: "100%",
      maxWidth: "none",
      padding: { top: 80, right: 0, bottom: 80, left: 0 },
      backgroundColor: "#ffffff",
      display: "block",
    },
    fields: [...boxStyleFields],
  },
  {
    type: "container",
    label: "Container",
    description: "Container con để gom element",
    plan: "core",
    category: "layout",
    acceptsChildren: true,
    defaultProps: {},
    defaultStyle: {
      maxWidth: "1200px",
      width: "100%",
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      padding: { top: 32, right: 32, bottom: 32, left: 32 },
      backgroundColor: "#ffffff",
      display: "flex",
      flexDirection: "column",
      gap: 24,
    },
    fields: [...boxStyleFields],
  },
  {
    type: "columns",
    label: "Columns",
    description: "Bố cục nhiều cột",
    plan: "core",
    category: "layout",
    acceptsChildren: true,
    defaultProps: {
      columns: 2,
    },
    defaultStyle: {
      width: "100%",
      display: "grid",
      gap: 24,
    },
    fields: [
      { name: "columns", label: "Columns", type: "number", tab: "content" },
      ...boxStyleFields,
    ],
  },

  {
    type: "heading",
    label: "Heading",
    description: "Tiêu đề H1/H2/H3",
    plan: "core",
    category: "basic",
    defaultProps: {
      text: "Heading text",
      level: "h2",
    },
    defaultStyle: {
      color: "#0f172a",
      textAlign: "left",
      fontWeight: "700",
      lineHeight: 1.15,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    fields: [
      { name: "text", label: "Text", type: "text", tab: "content" },
      {
        name: "level",
        label: "Level",
        type: "select",
        tab: "content",
        options: [
          { label: "H1", value: "h1" },
          { label: "H2", value: "h2" },
          { label: "H3", value: "h3" },
          { label: "H4", value: "h4" },
        ],
      },
      ...textStyleFields,
    ],
  },
  {
    type: "text",
    label: "Text",
    description: "Đoạn văn bản",
    plan: "core",
    category: "basic",
    defaultProps: {
      content: "Nhập nội dung...",
    },
    defaultStyle: {
      color: "#475569",
      textAlign: "left",
      fontSize: 18,
      lineHeight: 1.8,
    },
    fields: [
      { name: "content", label: "Content", type: "textarea", tab: "content" },
      ...textStyleFields,
    ],
  },
  {
    type: "image",
    label: "Image",
    description: "Hình ảnh đơn",
    plan: "core",
    category: "media",
    defaultProps: {
      src: "",
      alt: "",
      caption: "",
    },
    defaultStyle: {
      width: "100%",
      radius: 0,
    },
    fields: [
      { name: "src", label: "Image URL", type: "image", tab: "content" },
      { name: "alt", label: "Alt text", type: "text", tab: "content" },
      { name: "caption", label: "Caption", type: "text", tab: "content" },
      ...contentBoxStyleFields,
    ],
  },
  {
    type: "button",
    label: "Button",
    description: "Nút điều hướng",
    plan: "core",
    category: "basic",
    defaultProps: {
      label: "Click here",
      url: "#",
      variant: "primary",
      size: "md",
      openNewTab: false,
    },
    defaultStyle: {
      textAlign: "left",
      radius: 0,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    fields: [
      { name: "label", label: "Label", type: "text", tab: "content" },
      { name: "url", label: "URL", type: "url", tab: "content" },
      {
        name: "variant",
        label: "Variant",
        type: "select",
        tab: "content",
        options: [
          { label: "Primary", value: "primary" },
          { label: "Dark", value: "dark" },
          { label: "Outline", value: "outline" },
        ],
      },
      {
        name: "size",
        label: "Size",
        type: "select",
        tab: "content",
        options: [
          { label: "Small", value: "sm" },
          { label: "Medium", value: "md" },
          { label: "Large", value: "lg" },
        ],
      },
      { name: "openNewTab", label: "Open new tab", type: "switch", tab: "content" },
      ...textStyleFields,
      ...borderStyleFields,
    ],
  },
  {
    type: "spacer",
    label: "Spacer",
    description: "Khoảng cách",
    plan: "core",
    category: "layout",
    defaultProps: {
      height: 48,
    },
    fields: [
      { name: "height", label: "Height", type: "number", tab: "content" },
      ...advancedFields,
    ],
  },
  {
    type: "divider",
    label: "Divider",
    description: "Đường phân cách",
    plan: "core",
    category: "layout",
    defaultProps: {},
    defaultStyle: {
      borderColor: "#e2e8f0",
      borderWidth: 1,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    fields: [...borderStyleFields, ...spacingStyleFields, ...advancedFields],
  },

  {
    type: "gallery",
    label: "Gallery",
    description: "Bộ sưu tập ảnh",
    plan: "pro",
    category: "media",
    defaultProps: {
      images: [
        { image: "", alt: "" },
        { image: "", alt: "" },
      ],
      columns: 3,
    },
    defaultStyle: {
      gap: 16,
      radius: 0,
    },
    fields: [
      {
        name: "images",
        label: "Images",
        type: "repeater",
        tab: "content",
        fields: [
          { name: "image", label: "Image URL", type: "image" },
          { name: "alt", label: "Alt", type: "text" },
        ],
      },
      { name: "columns", label: "Columns", type: "number", tab: "content" },
      ...contentBoxStyleFields,
    ],
  },
  {
    type: "slider",
    label: "Slider",
    description: "Slider gồm nhiều slide",
    plan: "pro",
    category: "media",
    defaultProps: {
      slides: [
        {
          image: "",
          title: "Slide title",
          description: "Slide description",
          buttonText: "Learn more",
          buttonUrl: "#",
        },
      ],
      height: 480,
      showText: true,
    },
    defaultStyle: {
      radius: 0,
      width: "100%",
    },
    fields: [
      {
        name: "slides",
        label: "Slides",
        type: "repeater",
        tab: "content",
        fields: [
          { name: "image", label: "Image URL", type: "image" },
          { name: "title", label: "Title", type: "text" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "buttonText", label: "Button text", type: "text" },
          { name: "buttonUrl", label: "Button URL", type: "url" },
        ],
      },
      { name: "height", label: "Height", type: "number", tab: "content" },
      { name: "showText", label: "Show text overlay", type: "switch", tab: "content" },
      ...contentBoxStyleFields,
    ],
  },
  {
    type: "faq",
    label: "FAQ",
    description: "Danh sách câu hỏi",
    plan: "pro",
    category: "marketing",
    defaultProps: {
      title: "Câu hỏi thường gặp",
      items: [{ question: "Câu hỏi?", answer: "Câu trả lời..." }],
    },
    defaultStyle: {
      width: "100%",
    },
    fields: [
      { name: "title", label: "Title", type: "text", tab: "content" },
      {
        name: "items",
        label: "Questions",
        type: "repeater",
        tab: "content",
        fields: [
          { name: "question", label: "Question", type: "text" },
          { name: "answer", label: "Answer", type: "textarea" },
        ],
      },
      ...contentBoxStyleFields,
    ],
  },
  {
    type: "tabs",
    label: "Tabs",
    description: "Nội dung dạng tab",
    plan: "pro",
    category: "marketing",
    defaultProps: {
      items: [
        { label: "Tab 1", content: "Nội dung tab 1" },
        { label: "Tab 2", content: "Nội dung tab 2" },
      ],
    },
    fields: [
      {
        name: "items",
        label: "Tabs",
        type: "repeater",
        tab: "content",
        fields: [
          { name: "label", label: "Label", type: "text" },
          { name: "content", label: "Content", type: "textarea" },
        ],
      },
      ...contentBoxStyleFields,
    ],
  },
  {
    type: "accordion",
    label: "Accordion",
    description: "Accordion nội dung",
    plan: "pro",
    category: "marketing",
    defaultProps: {
      items: [{ title: "Accordion title", content: "Accordion content" }],
    },
    fields: [
      {
        name: "items",
        label: "Items",
        type: "repeater",
        tab: "content",
        fields: [
          { name: "title", label: "Title", type: "text" },
          { name: "content", label: "Content", type: "textarea" },
        ],
      },
      ...contentBoxStyleFields,
    ],
  },
  {
    type: "video",
    label: "Video",
    description: "YouTube/Vimeo iframe",
    plan: "pro",
    category: "media",
    defaultProps: {
      url: "",
    },
    defaultStyle: {
      radius: 0,
    },
    fields: [
      { name: "url", label: "Embed URL", type: "url", tab: "content" },
      ...contentBoxStyleFields,
    ],
  },
  {
    type: "iconBox",
    label: "Icon Box",
    description: "Icon + tiêu đề + mô tả",
    plan: "pro",
    category: "marketing",
    defaultProps: {
      icon: "⭐",
      title: "Feature title",
      description: "Feature description",
    },
    defaultStyle: {
      textAlign: "left",
      padding: { top: 24, right: 24, bottom: 24, left: 24 },
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#e2e8f0",
    },
    fields: [
      { name: "icon", label: "Icon", type: "text", tab: "content" },
      { name: "title", label: "Title", type: "text", tab: "content" },
      { name: "description", label: "Description", type: "textarea", tab: "content" },
      ...contentBoxStyleFields,
      ...typographyStyleFields,
    ],
  },
  {
    type: "testimonial",
    label: "Testimonial",
    description: "Đánh giá khách hàng",
    plan: "pro",
    category: "marketing",
    defaultProps: {
      quote: "PAC Stone làm việc rất chuyên nghiệp.",
      name: "Customer name",
      role: "Customer",
      avatar: "",
    },
    defaultStyle: {
      padding: { top: 32, right: 32, bottom: 32, left: 32 },
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#e2e8f0",
    },
    fields: [
      { name: "quote", label: "Quote", type: "textarea", tab: "content" },
      { name: "name", label: "Name", type: "text", tab: "content" },
      { name: "role", label: "Role", type: "text", tab: "content" },
      { name: "avatar", label: "Avatar URL", type: "image", tab: "content" },
      ...contentBoxStyleFields,
    ],
  },
  {
    type: "form",
    label: "Form",
    description: "Form tuỳ chỉnh field",
    plan: "pro",
    category: "marketing",
    defaultProps: {
      title: "Liên hệ với chúng tôi",
      fields: [
        { label: "Họ tên", name: "name", type: "text", required: true },
        { label: "Email", name: "email", type: "email", required: true },
        { label: "Nội dung", name: "message", type: "textarea", required: false },
      ],
      submitText: "Gửi thông tin",
      successMessage: "Cảm ơn bạn đã liên hệ.",
    },
    defaultStyle: {
      padding: { top: 24, right: 24, bottom: 24, left: 24 },
      backgroundColor: "#ffffff",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#e2e8f0",
    },
    fields: [
      { name: "title", label: "Title", type: "text", tab: "content" },
      {
        name: "fields",
        label: "Fields",
        type: "repeater",
        tab: "content",
        fields: [
          { name: "label", label: "Label", type: "text" },
          { name: "name", label: "Name", type: "text" },
          {
            name: "type",
            label: "Type",
            type: "select",
            options: [
              { label: "Text", value: "text" },
              { label: "Email", value: "email" },
              { label: "Phone", value: "tel" },
              { label: "Textarea", value: "textarea" },
            ],
          },
          { name: "required", label: "Required", type: "switch" },
        ],
      },
      { name: "submitText", label: "Submit text", type: "text", tab: "content" },
      { name: "successMessage", label: "Success message", type: "text", tab: "content" },
      ...contentBoxStyleFields,
    ],
  },
  {
    type: "map",
    label: "Map",
    description: "Google Map embed",
    plan: "pro",
    category: "media",
    defaultProps: {
      embedUrl: "",
      height: 420,
    },
    defaultStyle: {
      radius: 0,
    },
    fields: [
      { name: "embedUrl", label: "Embed URL", type: "url", tab: "content" },
      { name: "height", label: "Height", type: "number", tab: "content" },
      ...contentBoxStyleFields,
    ],
  },
  {
    type: "html",
    label: "HTML",
    description: "Custom HTML embed",
    plan: "pro",
    category: "advanced",
    defaultProps: {
      html: "<div>Custom HTML</div>",
    },
    fields: [
      { name: "html", label: "HTML", type: "textarea", tab: "content" },
      ...advancedFields,
    ],
  },

  {
    type: "productGrid",
    label: "Product Grid",
    description: "Danh sách sản phẩm động",
    plan: "vip",
    category: "dynamic",
    defaultProps: {
      title: "Sản phẩm nổi bật",
      limit: 8,
    },
    fields: [
      { name: "title", label: "Title", type: "text", tab: "content" },
      { name: "limit", label: "Limit", type: "number", tab: "content" },
      ...contentBoxStyleFields,
    ],
  },
  {
    type: "postGrid",
    label: "Post Grid",
    description: "Danh sách bài viết động",
    plan: "vip",
    category: "dynamic",
    defaultProps: {
      title: "Bài viết mới nhất",
      limit: 6,
    },
    fields: [
      { name: "title", label: "Title", type: "text", tab: "content" },
      { name: "limit", label: "Limit", type: "number", tab: "content" },
      ...contentBoxStyleFields,
    ],
  },
  {
    type: "customCss",
    label: "Custom CSS",
    description: "CSS tùy chỉnh",
    plan: "vip",
    category: "advanced",
    defaultProps: {
      css: "",
    },
    fields: [
      { name: "css", label: "CSS", type: "textarea", tab: "content" },
      ...advancedFields,
    ],
  },
];

export function getBlockDefinition(type: BuilderBlockType) {
  return blockRegistry.find((block) => block.type === type);
}

export function isPlanAllowed(currentPlan: BuilderPlan, requiredPlan: BuilderPlan) {
  const rank = {
    core: 1,
    pro: 2,
    vip: 3,
  };

  return rank[currentPlan] >= rank[requiredPlan];
}