"use client";

import { useState } from "react";
import type { BuilderBlock } from "./types";
import {
  blockClassName,
  builderStyleToCss,
} from "./style-utils";

type RepeaterItem = Record<string, unknown>;

function getArray(value: unknown): RepeaterItem[] {
  return Array.isArray(value) ? (value as RepeaterItem[]) : [];
}

function getJustify(value: unknown) {
  if (value === "center") return "justify-center";
  if (value === "right") return "justify-end";
  return "justify-start";
}

function buttonClass(variant: unknown, size: unknown) {
  const variantClass =
    variant === "outline"
      ? "border border-slate-300 bg-white text-slate-950 hover:bg-slate-50"
      : variant === "dark"
        ? "bg-slate-950 text-white hover:bg-slate-800"
        : "bg-[#2271b1] text-white hover:bg-[#1b5f95]";

  const sizeClass =
    size === "sm"
      ? "px-4 py-2 text-sm"
      : size === "lg"
        ? "px-8 py-4 text-base"
        : "px-6 py-3 text-sm";

  return `${variantClass} ${sizeClass}`;
}

function SliderRenderer({ block }: { block: BuilderBlock }) {
  const slides = getArray(block.props.slides);
  const [activeIndex, setActiveIndex] = useState(0);

  const height = Number(block.props.height ?? 480);
  const showText = Boolean(block.props.showText ?? true);

  if (!slides.length) return null;

  const activeSlide = slides[activeIndex] ?? slides[0];
  const image = String(activeSlide.image ?? "");

  return (
    <div
      style={builderStyleToCss(block.style)}
      className={`relative w-full overflow-hidden bg-slate-100 ${blockClassName(
        block.style
      )}`}
    >
      {image ? (
        <img
          src={image}
          alt={String(activeSlide.title ?? "")}
          style={{ height }}
          className="w-full object-cover"
        />
      ) : (
        <div
          style={{ height }}
          className="flex w-full items-center justify-center bg-slate-200 text-slate-500"
        >
          Slide image
        </div>
      )}

      {showText ? (
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-8 text-white md:p-12">
          <div className="max-w-2xl">
            {activeSlide.title ? (
              <h2 className="text-3xl font-bold md:text-5xl">
                {String(activeSlide.title)}
              </h2>
            ) : null}

            {activeSlide.description ? (
              <p className="mt-4 text-base leading-7 text-white/85 md:text-lg">
                {String(activeSlide.description)}
              </p>
            ) : null}

            {activeSlide.buttonText ? (
              <a
                href={String(activeSlide.buttonUrl ?? "#")}
                className="mt-6 inline-flex bg-white px-6 py-3 text-sm font-bold text-slate-950"
              >
                {String(activeSlide.buttonText)}
              </a>
            ) : null}
          </div>
        </div>
      ) : null}

      {slides.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() =>
              setActiveIndex((current) =>
                current === 0 ? slides.length - 1 : current - 1
              )
            }
            className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-white/90 text-xl font-bold text-slate-950 shadow"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveIndex((current) =>
                current === slides.length - 1 ? 0 : current + 1
              )
            }
            className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-white/90 text-xl font-bold text-slate-950 shadow"
          >
            ›
          </button>

          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-3 w-3 ${
                  index === activeIndex ? "bg-white" : "bg-white/45"
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

export function BuilderBlockRenderer({
  block,
  renderChildren,
}: {
  block: BuilderBlock;
  renderChildren?: (block: BuilderBlock) => React.ReactNode;
}) {
  if (block.type === "section") {
    return (
      <section
        style={builderStyleToCss(block.style)}
        className={`w-full ${blockClassName(block.style)}`}
      >
        {renderChildren?.(block)}
      </section>
    );
  }

  if (block.type === "container") {
    return (
      <div
        style={builderStyleToCss(block.style)}
        className={`mx-auto w-full ${blockClassName(block.style)}`}
      >
        {renderChildren?.(block)}
      </div>
    );
  }

  if (block.type === "columns") {
    const columns = Number(block.props.columns ?? 2);

    return (
      <div
        style={builderStyleToCss(block.style)}
        className={`grid w-full ${
          columns >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"
        } ${blockClassName(block.style)}`}
      >
        {renderChildren?.(block)}
      </div>
    );
  }

  if (block.type === "heading") {
    const level = String(block.props.level ?? "h2");
    const Tag =
      level === "h1" ? "h1" : level === "h3" ? "h3" : level === "h4" ? "h4" : "h2";

    const sizeClass =
      level === "h1"
        ? "text-4xl md:text-6xl"
        : level === "h3"
          ? "text-2xl md:text-3xl"
          : level === "h4"
            ? "text-xl md:text-2xl"
            : "text-3xl md:text-4xl";

    return (
      <Tag
        style={builderStyleToCss(block.style)}
        className={`${sizeClass} font-bold tracking-tight ${blockClassName(
          block.style
        )}`}
      >
        {String(block.props.text ?? "")}
      </Tag>
    );
  }

  if (block.type === "text") {
    return (
      <div
        style={builderStyleToCss(block.style)}
        className={`whitespace-pre-line ${blockClassName(block.style)}`}
      >
        {String(block.props.content ?? "")}
      </div>
    );
  }

  if (block.type === "image") {
    const src = String(block.props.src ?? "");
    if (!src) return null;

    return (
      <figure style={builderStyleToCss(block.style)} className="w-full">
        <img
          src={src}
          alt={String(block.props.alt ?? "")}
          className="h-auto w-full object-cover"
        />
        {block.props.caption ? (
          <figcaption className="mt-3 text-center text-sm text-slate-500">
            {String(block.props.caption)}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  if (block.type === "button") {
    return (
      <div
        style={builderStyleToCss(block.style)}
        className={`flex ${getJustify(block.style?.textAlign)}`}
      >
        <a
          href={String(block.props.url ?? "#")}
          target={block.props.openNewTab ? "_blank" : undefined}
          rel={block.props.openNewTab ? "noreferrer" : undefined}
          className={`inline-flex font-bold transition hover:-translate-y-0.5 ${buttonClass(
            block.props.variant,
            block.props.size
          )}`}
        >
          {String(block.props.label ?? "Button")}
        </a>
      </div>
    );
  }

  if (block.type === "spacer") {
    return <div style={{ height: Number(block.props.height ?? 48) }} />;
  }

  if (block.type === "divider") {
    return (
      <div
        style={builderStyleToCss(block.style)}
        className={`w-full ${blockClassName(block.style)}`}
      />
    );
  }

  if (block.type === "gallery") {
    const images = getArray(block.props.images);
    const columns = Number(block.props.columns ?? 3);

    return (
      <div
        style={builderStyleToCss(block.style)}
        className={`grid w-full gap-4 ${
          columns === 2
            ? "md:grid-cols-2"
            : columns === 4
              ? "md:grid-cols-4"
              : "md:grid-cols-3"
        } ${blockClassName(block.style)}`}
      >
        {images.map((item, index) => {
          const image = String(item.image ?? "");
          if (!image) return null;

          return (
            <img
              key={index}
              src={image}
              alt={String(item.alt ?? "")}
              className="aspect-[4/3] w-full object-cover"
            />
          );
        })}
      </div>
    );
  }

  if (block.type === "slider") {
    return <SliderRenderer block={block} />;
  }

  if (block.type === "faq") {
    const items = getArray(block.props.items);

    return (
      <div style={builderStyleToCss(block.style)} className="w-full">
        {block.props.title ? (
          <h2 className="text-3xl font-bold text-slate-950 md:text-4xl">
            {String(block.props.title)}
          </h2>
        ) : null}

        <div className="mt-6 space-y-4">
          {items.map((item, index) => (
            <div key={index} className="border bg-white p-6">
              <h3 className="text-xl font-bold text-slate-950">
                {String(item.question ?? "")}
              </h3>
              <p className="mt-3 leading-8 text-slate-600">
                {String(item.answer ?? "")}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (block.type === "form") {
    const fields = getArray(block.props.fields);

    return (
      <div
        style={builderStyleToCss(block.style)}
        className={`border bg-white p-6 ${blockClassName(block.style)}`}
      >
        <h3 className="text-2xl font-bold text-slate-950">
          {String(block.props.title ?? "Liên hệ")}
        </h3>

        <form className="mt-5 grid gap-4">
          {fields.map((field, index) => {
            const type = String(field.type ?? "text");
            const label = String(field.label ?? "");
            const name = String(field.name ?? `field_${index}`);

            if (type === "textarea") {
              return (
                <textarea
                  key={index}
                  name={name}
                  placeholder={label}
                  rows={4}
                  className="border px-4 py-3 outline-none focus:border-[#2271b1]"
                />
              );
            }

            return (
              <input
                key={index}
                type={type}
                name={name}
                placeholder={label}
                className="border px-4 py-3 outline-none focus:border-[#2271b1]"
              />
            );
          })}

          <button type="button" className="bg-[#2271b1] px-5 py-3 font-semibold text-white">
            {String(block.props.submitText ?? "Gửi")}
          </button>
        </form>
      </div>
    );
  }

  if (block.type === "tabs") {
    const items = getArray(block.props.items);
    const first = items[0];
    if (!first) return null;

    return (
      <div style={builderStyleToCss(block.style)} className="border bg-white p-6">
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <div
              key={index}
              className={`px-4 py-2 text-sm font-semibold ${
                index === 0 ? "bg-[#2271b1] text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              {String(item.label ?? `Tab ${index + 1}`)}
            </div>
          ))}
        </div>

        <div className="mt-5 whitespace-pre-line leading-8 text-slate-600">
          {String(first.content ?? "")}
        </div>
      </div>
    );
  }

  if (block.type === "accordion") {
    const items = getArray(block.props.items);

    return (
      <div style={builderStyleToCss(block.style)} className="space-y-4">
        {items.map((item, index) => (
          <details key={index} className="border bg-white p-5" open={index === 0}>
            <summary className="cursor-pointer font-bold text-slate-950">
              {String(item.title ?? `Item ${index + 1}`)}
            </summary>
            <div className="mt-4 whitespace-pre-line leading-8 text-slate-600">
              {String(item.content ?? "")}
            </div>
          </details>
        ))}
      </div>
    );
  }

  if (block.type === "video") {
    const url = String(block.props.url ?? "");
    if (!url) return null;

    return (
      <div
        style={builderStyleToCss(block.style)}
        className="aspect-video overflow-hidden bg-slate-950"
      >
        <iframe src={url} className="h-full w-full" allowFullScreen loading="lazy" />
      </div>
    );
  }

  if (block.type === "iconBox") {
    return (
      <div style={builderStyleToCss(block.style)} className="border bg-white p-6">
        <div className="text-4xl">{String(block.props.icon ?? "⭐")}</div>
        <h3 className="mt-4 text-xl font-bold text-slate-950">
          {String(block.props.title ?? "")}
        </h3>
        <p className="mt-3 leading-7 text-slate-600">
          {String(block.props.description ?? "")}
        </p>
      </div>
    );
  }

  if (block.type === "testimonial") {
    const avatar = String(block.props.avatar ?? "");

    return (
      <div style={builderStyleToCss(block.style)} className="border bg-white p-8">
        <p className="text-xl leading-9 text-slate-700">
          “{String(block.props.quote ?? "")}”
        </p>

        <div className="mt-6 flex items-center gap-4">
          {avatar ? (
            <img
              src={avatar}
              alt={String(block.props.name ?? "")}
              className="h-14 w-14 object-cover"
            />
          ) : (
            <div className="h-14 w-14 bg-slate-100" />
          )}

          <div>
            <div className="font-bold text-slate-950">
              {String(block.props.name ?? "")}
            </div>
            <div className="text-sm text-slate-500">
              {String(block.props.role ?? "")}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (block.type === "map") {
    const embedUrl = String(block.props.embedUrl ?? "");
    const height = Number(block.props.height ?? 420);
    if (!embedUrl) return null;

    return (
      <div style={builderStyleToCss(block.style)} className="overflow-hidden border">
        <iframe
          src={embedUrl}
          style={{ height }}
          className="w-full"
          loading="lazy"
        />
      </div>
    );
  }

  if (block.type === "html") {
    return (
      <div
        style={builderStyleToCss(block.style)}
        dangerouslySetInnerHTML={{ __html: String(block.props.html ?? "") }}
      />
    );
  }

  if (block.type === "productGrid" || block.type === "postGrid") {
    return (
      <div style={builderStyleToCss(block.style)}>
        <h2 className="text-3xl font-bold text-slate-950">
          {String(block.props.title ?? block.type)}
        </h2>
        <div className="mt-6 border border-dashed p-8 text-center text-slate-500">
          Dynamic block sẽ nối data sau.
        </div>
      </div>
    );
  }

  if (block.type === "customCss") {
    return (
      <style
        dangerouslySetInnerHTML={{ __html: String(block.props.css ?? "") }}
      />
    );
  }

  return null;
}