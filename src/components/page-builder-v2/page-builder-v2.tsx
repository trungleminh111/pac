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
import {
  Crown,
  GripVertical,
  Layers,
  Lock,
  Plus,
  Trash2,
} from "lucide-react";
import {
  blockRegistry,
  getBlockDefinition,
  isPlanAllowed,
} from "./block-registry";
import { BuilderBlockRenderer } from "./block-renderer";
import type {
  BuilderBlock,
  BuilderBlockDefinition,
  BuilderBlockType,
  BuilderDocument,
  BuilderField,
  BuilderFieldTab,
  BuilderPlan,
  BuilderStyle,
} from "./types";

type Props = {
  value: BuilderDocument;
  onChange: (value: BuilderDocument) => void;
  currentPlan?: BuilderPlan;
};

function createId(type: string) {
  return `${type}_${crypto.randomUUID()}`;
}

function createBlock(type: BuilderBlockType): BuilderBlock {
  const definition = getBlockDefinition(type);

  return {
    id: createId(type),
    type,
    props: structuredClone(definition?.defaultProps ?? {}),
    style: structuredClone(definition?.defaultStyle ?? {}) as BuilderStyle,
    children: definition?.acceptsChildren ? [] : undefined,
  };
}

function normalizeDocument(value: BuilderDocument | null | undefined): BuilderDocument {
  if (!value || value.version !== 2 || !Array.isArray(value.blocks)) {
    return { version: 2, blocks: [] };
  }

  return value;
}

function getArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
}

function getByPath(block: BuilderBlock, path: string) {
  const parts = path.split(".");

  if (parts[0] === "style") {
    let current: any = block.style ?? {};

    for (const part of parts.slice(1)) {
      current = current?.[part];
    }

    return current;
  }

  return block.props[path];
}

function setByPath(
  block: BuilderBlock,
  path: string,
  value: unknown
): BuilderBlock {
  const parts = path.split(".");

  if (parts[0] !== "style") {
    return {
      ...block,
      props: {
        ...block.props,
        [path]: value,
      },
    };
  }

  const style = structuredClone(block.style ?? {}) as Record<string, any>;
  let current = style;

  for (const part of parts.slice(1, -1)) {
    current[part] ??= {};
    current = current[part];
  }

  current[parts[parts.length - 1]] = value;

  return {
    ...block,
    style: style as BuilderStyle,
  };
}

function LibraryItem({
  definition,
  currentPlan,
}: {
  definition: BuilderBlockDefinition;
  currentPlan: BuilderPlan;
}) {
  const allowed = isPlanAllowed(currentPlan, definition.plan);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `library-${definition.type}`,
    disabled: !allowed,
    data: {
      from: "library",
      type: definition.type,
    },
  });

  return (
    <button
      ref={setNodeRef}
      type="button"
      {...attributes}
      {...listeners}
      disabled={!allowed}
      className={`flex w-full items-start gap-3 rounded-2xl border bg-white p-4 text-left shadow-sm transition ${
        allowed
          ? "cursor-grab hover:border-[#2271b1] hover:shadow-md active:cursor-grabbing"
          : "cursor-not-allowed opacity-60"
      } ${isDragging ? "opacity-40" : ""}`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2271b1]">
        {allowed ? <Plus className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-950">
            {definition.label}
          </span>

          {definition.plan !== "core" ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-700 ring-1 ring-amber-200">
              <Crown className="h-3 w-3" />
              {definition.plan}
            </span>
          ) : null}
        </div>

        <div className="mt-1 text-xs text-slate-500">
          {definition.description}
        </div>
      </div>
    </button>
  );
}

function CanvasDropZone({ children }: { children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({
    id: "canvas-root",
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[720px] rounded-3xl border-2 border-dashed p-6 transition ${
        isOver
          ? "border-[#2271b1] bg-blue-50/60"
          : "border-slate-200 bg-slate-100"
      }`}
    >
      <div className="mb-4 rounded-2xl border bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm">
        Live canvas preview
      </div>

      {children}
    </div>
  );
}

function SectionDropZone({
  section,
  children,
}: {
  section: BuilderBlock;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `section-${section.id}`,
    data: {
      sectionId: section.id,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-16 border border-dashed p-3 transition ${
        isOver ? "border-[#2271b1] bg-blue-50/60" : "border-slate-200 bg-white/30"
      }`}
    >
      {children}
    </div>
  );
}

function AdminRenderWrapper({
  block,
  selectedId,
  onSelect,
  onDelete,
}: {
  block: BuilderBlock;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const selected = block.id === selectedId;
  const definition = getBlockDefinition(block.type);

  function renderChildren(parent: BuilderBlock) {
    return (
      <SectionDropZone section={parent}>
        {parent.children?.length ? (
          <div className="space-y-4">
            {parent.children.map((child) => (
              <AdminRenderWrapper
                key={child.id}
                block={child}
                selectedId={selectedId}
                onSelect={onSelect}
                onDelete={onDelete}
              />
            ))}
          </div>
        ) : (
          <div className="border border-dashed bg-slate-50 p-8 text-center text-sm text-slate-500">
            Kéo element vào đây
          </div>
        )}
      </SectionDropZone>
    );
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect(block.id);
      }}
      className={`relative bg-white transition ${
        selected
          ? "ring-2 ring-[#2271b1]"
          : "hover:ring-1 hover:ring-slate-300"
      }`}
    >
      <div className="absolute right-2 top-2 z-50 flex items-center gap-2">
        <div className="bg-slate-900 px-2 py-1 text-[10px] font-bold uppercase text-white shadow">
          {definition?.label ?? block.type}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(block.id);
          }}
          className="bg-red-600 p-1.5 text-white shadow"
          title="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="pointer-events-none absolute left-2 top-2 z-50 bg-white/90 p-1 text-slate-500 shadow">
        <GripVertical className="h-4 w-4" />
      </div>

      <BuilderBlockRenderer block={block} renderChildren={renderChildren} />
    </div>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: BuilderField;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const common =
    "w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]";

  if (field.type === "textarea") {
    return (
      <textarea
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        rows={5}
        className={common}
      />
    );
  }

  if (field.type === "select") {
    return (
      <select
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        className={common}
      >
        <option value="">Default</option>
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "number") {
    return (
      <input
        type="text"
        inputMode="numeric"
        value={String(value ?? "")}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^\d.-]/g, "");
          onChange(raw === "" ? "" : Number(raw));
        }}
        placeholder={field.placeholder ?? "VD: 80"}
        className={common}
      />
    );
  }

  if (field.type === "color") {
    return (
      <input
        type="color"
        value={String(value ?? "#ffffff")}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-xl border px-2 py-1"
      />
    );
  }

  if (field.type === "switch") {
    return (
      <label className="inline-flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4"
        />
        Enabled
      </label>
    );
  }

  if (field.type === "repeater") {
    const items = getArray(value);

    function emptyItem() {
      return Object.fromEntries(
        (field.fields ?? []).map((child) => {
          if (child.type === "switch") return [child.name, false];
          if (child.type === "number") return [child.name, 0];
          return [child.name, ""];
        })
      );
    }

    return (
      <div className="space-y-3">
        {items.map((item, itemIndex) => (
          <div key={itemIndex} className="border bg-slate-50 p-3">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-xs font-bold uppercase text-slate-500">
                Item {itemIndex + 1}
              </div>

              <button
                type="button"
                onClick={() => {
                  const next = items.filter((_, index) => index !== itemIndex);
                  onChange(next);
                }}
                className="text-xs font-bold text-red-600"
              >
                Xóa
              </button>
            </div>

            <div className="space-y-3">
              {field.fields?.map((childField) => (
                <div key={childField.name}>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-500">
                    {childField.label}
                  </label>

                  <FieldInput
                    field={childField}
                    value={item[childField.name]}
                    onChange={(childValue) => {
                      const next = items.map((current, index) =>
                        index === itemIndex
                          ? { ...current, [childField.name]: childValue }
                          : current
                      );

                      onChange(next);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => onChange([...items, emptyItem()])}
          className="w-full border border-dashed px-4 py-3 text-sm font-semibold text-[#2271b1]"
        >
          + Thêm item
        </button>
      </div>
    );
  }

  return (
    <input
      type="text"
      value={String(value ?? "")}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      className={common}
    />
  );
}

function Inspector({
  selectedBlock,
  onUpdate,
}: {
  selectedBlock?: BuilderBlock;
  onUpdate: (id: string, fieldName: string, value: unknown) => void;
}) {
  const [activeTab, setActiveTab] = useState<BuilderFieldTab>("content");

  if (!selectedBlock) {
    return (
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-950">Settings</h2>
        <p className="mt-2 text-sm text-slate-500">
          Chọn section hoặc element để chỉnh.
        </p>
      </div>
    );
  }

  const definition = getBlockDefinition(selectedBlock.type);
  if (!definition) return null;

  const tabs: BuilderFieldTab[] = ["content", "style", "advanced"];
  const fields = definition.fields.filter(
    (field) => (field.tab ?? "content") === activeTab
  );

  return (
    <div className="rounded-2xl border bg-white shadow-sm">
      <div className="border-b p-5">
        <h2 className="font-semibold text-slate-950">Settings</h2>
        <p className="mt-1 text-sm text-slate-500">{definition.label}</p>
      </div>

      <div className="grid grid-cols-3 border-b text-sm">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-3 font-semibold capitalize ${
              activeTab === tab
                ? "bg-[#2271b1] text-white"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4 p-5">
        {fields.length ? (
          fields.map((field) => (
            <div key={field.name}>
              <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
                {field.label}
              </label>

              <FieldInput
                field={field}
                value={getByPath(selectedBlock, field.name)}
                onChange={(value) =>
                  onUpdate(selectedBlock.id, field.name, value)
                }
              />
            </div>
          ))
        ) : (
          <div className="text-sm text-slate-500">
            Chưa có setting trong tab này.
          </div>
        )}
      </div>
    </div>
  );
}

export function PageBuilderV2({
  value,
  onChange,
  currentPlan = "core",
}: Props) {
  const document = normalizeDocument(value);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(
    document.blocks[0]?.id ?? null
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  const selectedBlock = useMemo(() => {
    function find(blocks: BuilderBlock[]): BuilderBlock | undefined {
      for (const block of blocks) {
        if (block.id === selectedId) return block;
        const found = find(block.children ?? []);
        if (found) return found;
      }
      return undefined;
    }

    return find(document.blocks);
  }, [document.blocks, selectedId]);

  function updateDocument(blocks: BuilderBlock[]) {
    onChange({ version: 2, blocks });
  }

  function addRootBlock(block: BuilderBlock) {
    updateDocument([...document.blocks, block]);
    setSelectedId(block.id);
  }

  function addChildBlock(parentId: string, child: BuilderBlock) {
    function update(blocks: BuilderBlock[]): BuilderBlock[] {
      return blocks.map((block) => {
        if (block.id === parentId) {
          return {
            ...block,
            children: [...(block.children ?? []), child],
          };
        }

        return {
          ...block,
          children: block.children ? update(block.children) : undefined,
        };
      });
    }

    updateDocument(update(document.blocks));
    setSelectedId(child.id);
  }

  function updateBlockField(id: string, fieldName: string, value: unknown) {
    function update(blocks: BuilderBlock[]): BuilderBlock[] {
      return blocks.map((block) => {
        if (block.id === id) {
          return setByPath(block, fieldName, value);
        }

        return {
          ...block,
          children: block.children ? update(block.children) : undefined,
        };
      });
    }

    updateDocument(update(document.blocks));
  }

  function deleteBlock(id: string) {
    function remove(blocks: BuilderBlock[]): BuilderBlock[] {
      return blocks
        .filter((block) => block.id !== id)
        .map((block) => ({
          ...block,
          children: block.children ? remove(block.children) : undefined,
        }));
    }

    const next = remove(document.blocks);
    updateDocument(next);
    setSelectedId(next[0]?.id ?? null);
  }

  function handleDragStart(event: DragStartEvent) {
    const type = event.active.data.current?.type as BuilderBlockType | undefined;
    const definition = type ? getBlockDefinition(type) : null;
    setActiveLabel(definition?.label ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const type = event.active.data.current?.type as BuilderBlockType | undefined;
    setActiveLabel(null);

    if (!type || !event.over) return;

    const block = createBlock(type);

    if (event.over.id === "canvas-root") {
      if (type === "section" || type === "container" || type === "columns") {
        addRootBlock(block);
        return;
      }

      const section = createBlock("section");
      section.children = [block];
      addRootBlock(section);
      return;
    }

    const overId = String(event.over.id);

    if (overId.startsWith("section-")) {
      const parentId = String(event.over.data.current?.sectionId ?? "");
      if (!parentId) return;

      if (type === "section") {
        addRootBlock(block);
        return;
      }

      addChildBlock(parentId, block);
    }
  }

  const grouped = blockRegistry.reduce<Record<string, BuilderBlockDefinition[]>>(
    (acc, item) => {
      acc[item.category] ??= [];
      acc[item.category].push(item);
      return acc;
    },
    {}
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid items-start gap-6 xl:grid-cols-[280px_minmax(0,1fr)_340px]">
        <aside className="sticky top-6 max-h-[calc(100vh-48px)] space-y-4 overflow-y-auto pr-1">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2271b1]">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-950">Elements</h2>
                <p className="text-xs text-slate-500">Plan: {currentPlan}</p>
              </div>
            </div>
          </div>

          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="space-y-3">
              <div className="text-xs font-bold uppercase text-slate-400">
                {category}
              </div>

              {items.map((item) => (
                <LibraryItem
                  key={item.type}
                  definition={item}
                  currentPlan={currentPlan}
                />
              ))}
            </div>
          ))}
        </aside>

        <main className="min-w-0">
          <CanvasDropZone>
            {document.blocks.length === 0 ? (
              <div className="flex min-h-[640px] items-center justify-center border border-dashed bg-white text-center">
                <div>
                  <div className="text-lg font-semibold text-slate-950">
                    Kéo Section hoặc Element vào đây
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    Nếu kéo element trực tiếp, hệ thống tự tạo Section.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {document.blocks.map((block) => (
                  <AdminRenderWrapper
                    key={block.id}
                    block={block}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                    onDelete={deleteBlock}
                  />
                ))}
              </div>
            )}
          </CanvasDropZone>
        </main>

        <aside className="sticky top-6 max-h-[calc(100vh-48px)] overflow-y-auto pr-1">
          <Inspector
            selectedBlock={selectedBlock}
            onUpdate={updateBlockField}
          />
        </aside>
      </div>

      <DragOverlay>
        {activeLabel ? (
          <div className="rounded-2xl border bg-white px-5 py-4 text-sm font-semibold shadow-xl">
            {activeLabel}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}