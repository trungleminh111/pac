export type BuilderPlan = "core" | "pro" | "vip";

export type BuilderFieldType =
  | "text"
  | "textarea"
  | "select"
  | "color"
  | "number"
  | "image"
  | "url"
  | "switch"
  | "repeater";

export type BuilderFieldTab = "content" | "style" | "advanced";

export type BuilderFieldOption = {
  label: string;
  value: string;
};

export type BuilderField = {
  name: string;
  label: string;
  type: BuilderFieldType;
  tab?: BuilderFieldTab;
  placeholder?: string;
  options?: BuilderFieldOption[];
  fields?: BuilderField[];
};

export type BuilderBlockType =
  | "section"
  | "container"
  | "columns"
  | "heading"
  | "text"
  | "image"
  | "button"
  | "spacer"
  | "divider"
  | "gallery"
  | "slider"
  | "faq"
  | "tabs"
  | "accordion"
  | "video"
  | "iconBox"
  | "testimonial"
  | "form"
  | "map"
  | "html"
  | "productGrid"
  | "postGrid"
  | "customCss";

export type BuilderSpacing = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

export type BuilderStyle = {
  display?: "block" | "flex" | "grid";
  flexDirection?: "row" | "column";
  justifyContent?:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around";
  alignItems?: "flex-start" | "center" | "flex-end" | "stretch";
  gap?: number;

  width?: string;
  maxWidth?: string;
  minHeight?: number;

  margin?: BuilderSpacing;
  padding?: BuilderSpacing;

  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: "cover" | "contain" | "auto";
  backgroundPosition?: string;
  overlayColor?: string;
  overlayOpacity?: number;

  borderWidth?: number;
  borderColor?: string;
  borderStyle?: "solid" | "dashed" | "dotted" | "none";
  radius?: number;

  shadow?: "none" | "sm" | "md" | "lg" | "xl";

  opacity?: number;
  zIndex?: number;

  textAlign?: "left" | "center" | "right";
  color?: string;
  fontSize?: number;
  fontWeight?: "400" | "500" | "600" | "700" | "800";
  lineHeight?: number;
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";

  hideDesktop?: boolean;
  hideTablet?: boolean;
  hideMobile?: boolean;

  customClass?: string;
};

export type BuilderBlock = {
  id: string;
  type: BuilderBlockType;
  props: Record<string, unknown>;
  style?: BuilderStyle;
  children?: BuilderBlock[];
};

export type BuilderDocument = {
  version: 2;
  blocks: BuilderBlock[];
};

export type BuilderBlockDefinition = {
  type: BuilderBlockType;
  label: string;
  description: string;
  plan: BuilderPlan;
  category:
    | "layout"
    | "basic"
    | "media"
    | "marketing"
    | "dynamic"
    | "advanced";
  defaultProps: Record<string, unknown>;
  defaultStyle?: BuilderStyle;
  fields: BuilderField[];
  acceptsChildren?: boolean;
};

export type CurrentPlan = BuilderPlan;