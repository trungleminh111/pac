import type { CSSProperties } from "react";
import type { BuilderStyle } from "./types";

function px(value: unknown) {
  if (value === undefined || value === null || value === "") return undefined;
  return typeof value === "number" ? `${value}px` : String(value);
}

function spacing(value: BuilderStyle["padding"] | BuilderStyle["margin"]) {
  if (!value) return undefined;

  return `${value.top ?? 0}px ${value.right ?? 0}px ${value.bottom ?? 0}px ${
    value.left ?? 0
  }px`;
}

export function builderStyleToCss(style?: BuilderStyle): CSSProperties {
  if (!style) return {};

  return {
    display: style.display,
    flexDirection: style.flexDirection,
    justifyContent: style.justifyContent,
    alignItems: style.alignItems,
    gap: px(style.gap),

    width: style.width,
    maxWidth: style.maxWidth,
    minHeight: px(style.minHeight),

    margin: spacing(style.margin),
    padding: spacing(style.padding),

    backgroundColor: style.backgroundColor,
    backgroundImage: style.backgroundImage
      ? `url(${style.backgroundImage})`
      : undefined,
    backgroundSize: style.backgroundSize,
    backgroundPosition: style.backgroundPosition,

    borderWidth: px(style.borderWidth),
    borderColor: style.borderColor,
    borderStyle: style.borderStyle,

    borderRadius: px(style.radius),

    opacity: style.opacity,
    zIndex: style.zIndex,

    textAlign: style.textAlign,
    color: style.color,
    fontSize: px(style.fontSize),
    fontWeight: style.fontWeight,
    lineHeight: style.lineHeight,
    textTransform: style.textTransform,
  };
}

export function shadowClass(value?: BuilderStyle["shadow"]) {
  if (value === "sm") return "shadow-sm";
  if (value === "md") return "shadow-md";
  if (value === "lg") return "shadow-lg";
  if (value === "xl") return "shadow-xl shadow-slate-200";
  return "";
}

export function visibilityClass(style?: BuilderStyle) {
  const classes: string[] = [];

  if (style?.hideDesktop) classes.push("lg:hidden");
  if (style?.hideTablet) classes.push("md:hidden lg:block");
  if (style?.hideMobile) classes.push("hidden md:block");

  return classes.join(" ");
}

export function blockClassName(style?: BuilderStyle) {
  return [
    shadowClass(style?.shadow),
    visibilityClass(style),
    style?.customClass,
  ]
    .filter(Boolean)
    .join(" ");
}

export function mergeStyle(
  base: BuilderStyle | undefined,
  patch: Partial<BuilderStyle>
): BuilderStyle {
  return {
    ...(base ?? {}),
    ...patch,
  };
}