"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { GripVertical, ImageIcon, Layout, MessageSquare, Plus, Trash2, Type } from "lucide-react";

export type BuilderBlockType = "hero" | "text" | "image" | "cta" | "faq";

export type BuilderBlock = {
  id: string;
  type: BuilderBlockType;
  props: Record<string, any>;
};

const library: {
  type: BuilderBlockType;
  label: string;
  description: string;
  icon: any;
}[] = [
  { type: "hero", label: "Hero", description: "Banner đầu trang", icon: Layout },
  { type: "text", label: "Text", description: "Nội dung văn bản", icon: Type },
  { type: "image", label: "Image", description: "Hình ảnh", icon: ImageIcon },
  { type: "cta", label: "CTA", description: "Kêu gọi hành động", icon: Plus },
  { type: "faq", label: "FAQ", description: "Câu hỏi thường gặp", icon: MessageSquare },
];

function createBlock(type: BuilderBlockType): BuilderBlock {
  const id = crypto.randomUUID();

  if (type === "hero") {
    return {
      id,
      type,
      props: {
        title: "PAC Stone",
        subtitle: "Natural stone supplier",
        buttonText: "Liên hệ ngay",
        buttonUrl: "/vi/contact",
        align: "center",
      },
    };
  }

  if (type === "text") {
    return {
      id,
      type,
      props: {
        title: "Tiêu đề nội dung",
        content: "Nhập nội dung tại đây...",
      },
    };
  }

  if (type === "image") {
    return {
      id,
      type,
      props: {
        src: "",
        alt: "",
        caption: "",
      },
    };
  }

  if (type === "cta") {
    return {
      id,
      type,
      props: {
        title: "Cần tư vấn?",
        description: "Liên hệ PAC Stone để được hỗ trợ.",
        buttonText: "Liên hệ ngay",
        buttonUrl: "/vi/contact",
      },
    };
  }

  return {
    id,
    type,
    props: {
      title: "Câu hỏi thường gặp",
      question: "PAC Stone cung cấp sản phẩm gì?",
      answer: "PAC Stone cung cấp các giải pháp đá tự nhiên và đá nhân tạo.",
    },
  };
}

function LibraryItem({ item }: { item: (typeof library)[number] }) {
  const Icon = item.icon;
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `library-${item.type}`,
    data: {
      from: "library",
      type: item.type,
    },
  });

  return (
    <button
      ref={setNodeRef}
      type="button"
      {...attributes}
      {...listeners}
      className={`flex w-full cursor-grab items-start gap-3 rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:border-[#2271b1] hover:shadow-md active:cursor-grabbing ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2271b1]">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <div className="font-semibold text-slate-950">{item.label}</div>
        <div className="mt-1 text-xs text-slate-500">{item.description}</div>
      </div>
    </button>
  );
}

function CanvasDropZone({ children }: { children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({
    id: "builder-canvas",
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[640px] rounded-3xl border-2 border-dashed bg-slate-50 p-5 transition ${
        isOver ? "border-[#2271b1] bg-blue-50/40" : "border-slate-200"
      }`}
    >
      {children}
    </div>
  );
}

function BlockPreview({
  block,
  selected,
  onSelect,
  onDelete,
}: {
  block: BuilderBlock;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`group relative cursor-pointer rounded-2xl border bg-white p-5 shadow-sm transition ${
        selected ? "border-[#2271b1] ring-2 ring-blue-100" : "hover:border-slate-300"
      }`}
    >
      <div className="absolute right-3 top-3 hidden gap-2 group-hover:flex">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase text-slate-600">
        <GripVertical className="h-3 w-3" />
        {block.type}
      </div>

      {block.type === "hero" && (
        <section
          className={`rounded-2xl bg-slate-900 p-10 text-white ${
            block.props.align === "center" ? "text-center" : "text-left"
          }`}
        >
          <h2 className="text-3xl font-bold">{block.props.title}</h2>
          <p className="mt-3 text-slate-200">{block.props.subtitle}</p>
          {block.props.buttonText ? (
            <div className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900">
              {block.props.buttonText}
            </div>
          ) : null}
        </section>
      )}

      {block.type === "text" && (
        <section>
          <h2 className="text-2xl font-bold text-slate-950">{block.props.title}</h2>
          <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
            {block.props.content}
          </p>
        </section>
      )}

      {block.type === "image" && (
        <section>
          {block.props.src ? (
            <img
              src={block.props.src}
              alt={block.props.alt || ""}
              className="w-full rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-56 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              Image placeholder
            </div>
          )}
          {block.props.caption ? (
            <p className="mt-2 text-center text-sm text-slate-500">
              {block.props.caption}
            </p>
          ) : null}
        </section>
      )}

      {block.type === "cta" && (
        <section className="rounded-2xl border bg-blue-50 p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-950">{block.props.title}</h2>
          <p className="mt-3 text-slate-600">{block.props.description}</p>
          <div className="mt-5 inline-flex rounded-xl bg-[#2271b1] px-5 py-3 text-sm font-semibold text-white">
            {block.props.buttonText}
          </div>
        </section>
      )}

      {block.type === "faq" && (
        <section>
          <h2 className="text-2xl font-bold text-slate-950">{block.props.title}</h2>
          <div className="mt-4 rounded-2xl border p-5">
            <h3 className="font-semibold text-slate-950">{block.props.question}</h3>
            <p className="mt-2 text-slate-600">{block.props.answer}</p>
          </div>
        </section>
      )}
    </div>
  );
}

function Inspector({
  block,
  onChange,
}: {
  block?: BuilderBlock;
  onChange: (props: Record<string, any>) => void;
}) {
  if (!block) {
    return (
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-950">Block settings</h2>
        <p className="mt-2 text-sm text-slate-500">
          Chọn một block trong canvas để chỉnh nội dung.
        </p>
      </div>
    );
  }

  function update(key: string, value: string) {
    onChange({
      ...block.props,
      [key]: value,
    });
  }

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="font-semibold text-slate-950">Block settings</h2>
      <p className="mt-1 text-sm text-slate-500">Đang chỉnh: {block.type}</p>

      <div className="mt-5 space-y-4">
        {"title" in block.props && (
          <input
            value={block.props.title ?? ""}
            onChange={(e) => update("title", e.target.value)}
            placeholder="Title"
            className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
          />
        )}

        {"subtitle" in block.props && (
          <input
            value={block.props.subtitle ?? ""}
            onChange={(e) => update("subtitle", e.target.value)}
            placeholder="Subtitle"
            className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
          />
        )}

        {"content" in block.props && (
          <textarea
            value={block.props.content ?? ""}
            onChange={(e) => update("content", e.target.value)}
            placeholder="Content"
            rows={7}
            className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
          />
        )}

        {"description" in block.props && (
          <textarea
            value={block.props.description ?? ""}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Description"
            rows={4}
            className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
          />
        )}

        {"src" in block.props && (
          <input
            value={block.props.src ?? ""}
            onChange={(e) => update("src", e.target.value)}
            placeholder="Image URL"
            className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
          />
        )}

        {"alt" in block.props && (
          <input
            value={block.props.alt ?? ""}
            onChange={(e) => update("alt", e.target.value)}
            placeholder="Alt text"
            className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
          />
        )}

        {"caption" in block.props && (
          <input
            value={block.props.caption ?? ""}
            onChange={(e) => update("caption", e.target.value)}
            placeholder="Caption"
            className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
          />
        )}

        {"question" in block.props && (
          <input
            value={block.props.question ?? ""}
            onChange={(e) => update("question", e.target.value)}
            placeholder="Question"
            className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
          />
        )}

        {"answer" in block.props && (
          <textarea
            value={block.props.answer ?? ""}
            onChange={(e) => update("answer", e.target.value)}
            placeholder="Answer"
            rows={4}
            className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
          />
        )}

        {"buttonText" in block.props && (
          <input
            value={block.props.buttonText ?? ""}
            onChange={(e) => update("buttonText", e.target.value)}
            placeholder="Button text"
            className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
          />
        )}

        {"buttonUrl" in block.props && (
          <input
            value={block.props.buttonUrl ?? ""}
            onChange={(e) => update("buttonUrl", e.target.value)}
            placeholder="Button URL"
            className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
          />
        )}

        {"align" in block.props && (
          <select
            value={block.props.align ?? "center"}
            onChange={(e) => update("align", e.target.value)}
            className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
          </select>
        )}
      </div>
    </div>
  );
}

export function PageBuilder({
  value,
  onChange,
}: {
  value: BuilderBlock[];
  onChange: (blocks: BuilderBlock[]) => void;
}) {
  const [activeType, setActiveType] = useState<BuilderBlockType | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(
    value[0]?.id ?? null
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  const selectedBlock = useMemo(
    () => value.find((item) => item.id === selectedId),
    [value, selectedId]
  );

  function handleDragStart(event: DragStartEvent) {
    const type = event.active.data.current?.type as BuilderBlockType | undefined;
    setActiveType(type ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const type = event.active.data.current?.type as BuilderBlockType | undefined;

    setActiveType(null);

    if (event.over?.id !== "builder-canvas" || !type) return;

    const block = createBlock(type);
    onChange([...value, block]);
    setSelectedId(block.id);
  }

  function updateBlock(id: string, props: Record<string, any>) {
    onChange(
      value.map((block) => (block.id === id ? { ...block, props } : block))
    );
  }

  function deleteBlock(id: string) {
    const next = value.filter((block) => block.id !== id);
    onChange(next);
    setSelectedId(next[0]?.id ?? null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={undefined}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid gap-6 xl:grid-cols-[280px_1fr_340px]">
        <aside className="space-y-4">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-950">Elements</h2>
            <p className="mt-1 text-sm text-slate-500">
              Kéo element vào canvas để xây dựng page.
            </p>
          </div>

          <div className="space-y-3">
            {library.map((item) => (
              <LibraryItem key={item.type} item={item} />
            ))}
          </div>
        </aside>

        <main>
          <CanvasDropZone>
            {value.length === 0 ? (
              <div className="flex min-h-[560px] items-center justify-center rounded-2xl border border-dashed bg-white text-center">
                <div>
                  <div className="text-lg font-semibold text-slate-950">
                    Kéo element vào đây
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    Bắt đầu với Hero, Text, Image, CTA hoặc FAQ.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {value.map((block) => (
                  <BlockPreview
                    key={block.id}
                    block={block}
                    selected={block.id === selectedId}
                    onSelect={() => setSelectedId(block.id)}
                    onDelete={() => deleteBlock(block.id)}
                  />
                ))}
              </div>
            )}
          </CanvasDropZone>
        </main>

        <aside>
          <Inspector
            block={selectedBlock}
            onChange={(props) => {
              if (!selectedBlock) return;
              updateBlock(selectedBlock.id, props);
            }}
          />
        </aside>
      </div>

      <DragOverlay>
        {activeType ? (
          <div className="rounded-2xl border bg-white px-5 py-4 text-sm font-semibold shadow-xl">
            {activeType}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}