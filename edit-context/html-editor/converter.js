// The EditContext object only knows about a plain text string and about
// character offsets. However, our editor view renders the text by using
// DOM nodes. So we sometimes need to convert between the two.
// This function converts from a DOM selection object to character offsets.
export function fromSelectionToOffsets(selection, editorEl) {
  const treeWalker = document.createTreeWalker(editorEl, NodeFilter.SHOW_TEXT);

  let anchorNodeFound = false;
  let extentNodeFound = false;
  let anchorOffset = 0;
  let extentOffset = 0;

  while (treeWalker.nextNode()) {
    const node = treeWalker.currentNode;
    if (node === selection.anchorNode) {
      anchorNodeFound = true;
      anchorOffset += selection.anchorOffset;
    }

    if (node === selection.extentNode) {
      extentNodeFound = true;
      extentOffset += selection.extentOffset;
    }

    if (!anchorNodeFound) {
      anchorOffset += node.textContent.length;
    }
    if (!extentNodeFound) {
      extentOffset += node.textContent.length;
    }
  }

  if (!anchorNodeFound || !extentNodeFound) {
    return null;
  }

  return { start: anchorOffset, end: extentOffset };
}

// The EditContext object only knows about a plain text string and about
// character offsets. However, our editor view renders the text by using
// DOM nodes. So we sometimes need to convert between the two.
// This function converts character offsets to a DOM selection object.
export function fromOffsetsToSelection(start, end, editorEl) {
  const treeWalker = document.createTreeWalker(editorEl, NodeFilter.SHOW_TEXT);

  let offset = 0;
  let anchorNode = null;
  let anchorOffset = 0;
  let extentNode = null;
  let extentOffset = 0;

  while (treeWalker.nextNode()) {
    const node = treeWalker.currentNode;

    if (!anchorNode && offset + node.textContent.length >= start) {
      anchorNode = node;
      anchorOffset = start - offset;
    }

    if (!extentNode && offset + node.textContent.length >= end) {
      extentNode = node;
      extentOffset = end - offset;
    }

    if (anchorNode && extentNode) {
      break;
    }

    offset += node.textContent.length;
  }

  return { anchorNode, anchorOffset, extentNode, extentOffset };
}

// The EditContext object only knows about character offsets. But out editor
// view renders HTML tokens as DOM nodes. This function finds DOM node tokens
// that are in the provided EditContext offset range.
export function fromOffsetsToRenderedTokenNodes(renderedTokens, start, end) {
  const tokenNodes = [];

  for (let offset = start; offset < end; offset++) {
    const token = renderedTokens.find(
      (token) => token.pos <= offset && token.pos + token.value.length > offset
    );
    if (token) {
      tokenNodes.push({
        node: token.node,
        nodeOffset: token.pos,
        charOffset: offset,
      });
    }
  }

  return tokenNodes;
}
