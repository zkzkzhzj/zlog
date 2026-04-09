import type { Root, Paragraph, Text } from "mdast";
import { visit } from "unist-util-visit";

export function remarkSeparator() {
  return (tree: Root) => {
    visit(tree, "paragraph", (node, index, parent) => {
      if (index === undefined || !parent) return;

      const child = node.children[0] as Text;
      if (
        node.children.length === 1 &&
        child.type === "text" &&
        child.value.trim() === ":::"
      ) {
        (parent.children as any[])[index] = {
          type: "mdxJsxFlowElement",
          name: "div",
          attributes: [
            {
              type: "mdxJsxAttribute",
              name: "className",
              value: "separator",
            },
          ],
          children: [{ type: "text", value: "\u00B7\u00B7\u00B7" }],
        };
      }
    });
  };
}
