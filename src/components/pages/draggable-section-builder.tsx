"use client";

import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2 } from "lucide-react";

export type Section = {
  id: string;
  type: "hero" | "richText" | "faq" | "cta";
  title?: string;
  subtitle?: string;
  content?: string;
  description?: string;
  label?: string;
  url?: string;
};

function newSection(type: Section["type"]): Section {
  const id = crypto.randomUUID();

  if (type === "hero") {
    return {
      id,
      type,
      title: "Tiêu đề Hero",
      subtitle: "Mô tả ngắn...",
    };
  }

  if (type === "richText") {
    return {
      id,
      type,
      title: "Tiêu đề nội dung",
      content: "Nội dung...",
    };
  }

  if (type === "faq") {
    return {
      id,
      type,
      title: "Câu hỏi thường gặp",
      content: "Q: Câu hỏi?\nA: Câu trả lời...",
    };
  }

  return {
    id,
    type,
    title: "Cần tư vấn?",
    description: "Liên hệ PAC Stone để được hỗ trợ.",
    label: "Liên hệ ngay",
    url: "/vi/contact",
  };
}

function SortableSectionCard({
  section,
  index,
  onUpdate,
  onRemove,
}: {
  section: Section;
  index: number;
  onUpdate: (index: number, data: Partial<Section>) => void;
  onRemove: (index: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="rounded-2xl border bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab rounded-lg border bg-slate-50 p-2 text-slate-500 active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4" />
          </button>

          <div>
            <div className="font-semibold text-slate-950">
              {index + 1}. {section.type}
            </div>
            <div className="text-xs text-slate-500">Kéo để đổi vị trí</div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onRemove(index)}
          className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:underline"
        >
          <Trash2 className="h-4 w-4" />
          Xóa
        </button>
      </div>

      <div className="space-y-3">
        <input
          value={section.title ?? ""}
          onChange={(e) => onUpdate(index, { title: e.target.value })}
          placeholder="Title"
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
        />

        {section.type === "hero" ? (
          <input
            value={section.subtitle ?? ""}
            onChange={(e) => onUpdate(index, { subtitle: e.target.value })}
            placeholder="Subtitle"
            className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
          />
        ) : null}

        {section.type === "richText" || section.type === "faq" ? (
          <textarea
            value={section.content ?? ""}
            onChange={(e) => onUpdate(index, { content: e.target.value })}
            placeholder="Content"
            rows={5}
            className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
          />
        ) : null}

        {section.type === "cta" ? (
          <>
            <textarea
              value={section.description ?? ""}
              onChange={(e) => onUpdate(index, { description: e.target.value })}
              placeholder="Description"
              rows={3}
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
            />

            <input
              value={section.label ?? ""}
              onChange={(e) => onUpdate(index, { label: e.target.value })}
              placeholder="Button label"
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
            />

            <input
              value={section.url ?? ""}
              onChange={(e) => onUpdate(index, { url: e.target.value })}
              placeholder="Button URL"
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
            />
          </>
        ) : null}
      </div>
    </div>
  );
}

export function DraggableSectionBuilder({
  sections,
  onChange,
}: {
  sections: Section[];
  onChange: (sections: Section[]) => void;
}) {
  function addSection(type: Section["type"]) {
    onChange([...sections, newSection(type)]);
  }

  function updateSection(index: number, data: Partial<Section>) {
    onChange(
      sections.map((section, currentIndex) =>
        currentIndex === index ? { ...section, ...data } : section
      )
    );
  }

  function removeSection(index: number) {
    onChange(sections.filter((_, currentIndex) => currentIndex !== index));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((item) => item.id === active.id);
    const newIndex = sections.findIndex((item) => item.id === over.id);

    onChange(arrayMove(sections, oldIndex, newIndex));
  }

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-slate-950">Section Builder</h2>
          <p className="mt-1 text-sm text-slate-500">
            Kéo thả để sắp xếp block giống page builder.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(["hero", "richText", "faq", "cta"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => addSection(item)}
              className="inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-xs font-semibold"
            >
              <Plus className="h-3 w-3" />
              {item}
            </button>
          ))}
        </div>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={sections.map((section) => section.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {sections.map((section, index) => (
              <SortableSectionCard
                key={section.id}
                section={section}
                index={index}
                onUpdate={updateSection}
                onRemove={removeSection}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {sections.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed p-8 text-center text-sm text-slate-500">
          Chưa có section nào.
        </div>
      ) : null}
    </div>
  );
}