import type { BuilderBlock, BuilderDocument } from "./types";
import { BuilderBlockRenderer } from "./block-renderer";

type Props = {
  value: unknown;
};

function normalizeDocument(value: unknown): BuilderDocument {
  if (
    value &&
    typeof value === "object" &&
    (value as BuilderDocument).version === 2 &&
    Array.isArray((value as BuilderDocument).blocks)
  ) {
    return value as BuilderDocument;
  }

  return {
    version: 2,
    blocks: [],
  };
}

function renderChildren(block: BuilderBlock) {
  return (
    <>
      {block.children?.map((child) => (
        <RenderBlock key={child.id} block={child} />
      ))}
    </>
  );
}

function RenderBlock({ block }: { block: BuilderBlock }) {
  return (
    <BuilderBlockRenderer block={block} renderChildren={renderChildren} />
  );
}

export function PageBuilderV2Renderer({ value }: Props) {
  const document = normalizeDocument(value);

  if (!document.blocks.length) return null;

  return (
    <div className="w-full overflow-x-hidden bg-white">
      {document.blocks.map((block) => (
        <RenderBlock key={block.id} block={block} />
      ))}
    </div>
  );
}