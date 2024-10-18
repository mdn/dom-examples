import { tokenizeHTML } from "./tokenizer.js";
import {
  fromOffsetsToRenderedTokenNodes,
  fromSelectionToOffsets,
  fromOffsetsToSelection,
} from "./converter.js";

const IS_EDIT_CONTEXT_SUPPORTED = "EditContext" in window;
const IS_CUSTOM_HIGHLIGHT_SUPPORTED = "Highlight" in window;

// The editor element.
const editorEl = document.getElementById("html-editor");

// The current tokens from the html text.
let currentTokens = [];

// Instances of CSS custom Highlight objects, used to render
// the IME composition text formats.
const imeHighlights = {
  "solid-thin": null,
  "solid-thick": null,
  "dotted-thin": null,
  "dotted-thick": null,
  "dashed-thin": null,
  "dashed-thick": null,
  "wavy-thin": null,
  "wavy-thick": null,
  "squiggle-thin": null,
  "squiggle-thick": null,
};
if (IS_CUSTOM_HIGHLIGHT_SUPPORTED) {
  for (const [key, value] of Object.entries(imeHighlights)) {
    imeHighlights[key] = new Highlight();
    CSS.highlights.set(`ime-${key}`, imeHighlights[key]);
  }
} else {
  console.warn(
    "Custom highlights are not supported in this browser. IME formats will not be rendered."
  );
}

(function () {
  if (!IS_EDIT_CONTEXT_SUPPORTED) {
    editorEl.textContent =
      "Sorry, your browser doesn't support the EditContext API. This demo will not work.";
    return;
  }

  // Instantiate the EditContext object.
  const editContext = new EditContext({
    text: "<html>\n  <body id=foo>\n    <h1 id='header'>Cool Title</h1>\n    <p class=\"wow\">hello<br/>How are you? test</p>\n  </body>\n</html>",
  });

  // Attach the EditContext object to the editor element.
  // This makes the element focusable and able to receive text input.
  editorEl.editContext = editContext;

  // Update the control bounds (i.e. where the editor is on the screen)
  // now, and when the window is resized.
  // This helps the OS position the IME composition window correctly.
  function updateControlBounds() {
    const editorBounds = editorEl.getBoundingClientRect();
    editContext.updateControlBounds(editorBounds);
  }
  updateControlBounds();
  window.addEventListener("resize", updateControlBounds);

  // Update the selection and selection bounds in the EditContext object.
  // This helps the OS position the IME composition window correctly.
  function updateSelection(start, end) {
    editContext.updateSelection(start, end);
    // Get the bounds of the selection.
    editContext.updateSelectionBounds(
      document.getSelection().getRangeAt(0).getBoundingClientRect()
    );
  }

  // The render function is used to update the view of the editor.
  // The EditContext object is our "model", and the editorEl is our "view".
  // The render function's job is to update the view when the model changes.
  function render(text, selectionStart, selectionEnd) {
    // Empty the editor. We're re-rendering everything.
    editorEl.innerHTML = "";

    // Tokenize the text.
    currentTokens = tokenizeHTML(text);

    // Render each token as a DOM node.
    for (const token of currentTokens) {
      const span = document.createElement("span");
      span.classList.add(`token-${token.type}`);
      span.textContent = token.value;
      editorEl.appendChild(span);

      // Store the new DOM node as a property of the token
      // in the currentTokens array. We will need it again
      // later in fromOffsetsToRenderedTokenNodes.
      token.node = span;
    }

    // Move the selection to the correct location.
    // It was lost when we updated the DOM.
    // The EditContext API gives us the selection as text offsets.
    // Convert it into a DOM selection.
    const { anchorNode, anchorOffset, extentNode, extentOffset } =
      fromOffsetsToSelection(selectionStart, selectionEnd, editorEl);
    document
      .getSelection()
      .setBaseAndExtent(anchorNode, anchorOffset, extentNode, extentOffset);
  }

  // Listen to the EditContext's textupdate event.
  // This tells us when text input happens. We use it to re-render the view.
  editContext.addEventListener("textupdate", (e) => {
    render(editContext.text, e.selectionStart, e.selectionEnd);
  });

  // Visually show when we're composing text, like when using an IME,
  // or voice dictation.
  editContext.addEventListener("compositionstart", (e) => {
    editorEl.classList.add("is-composing");
  });
  editContext.addEventListener("compositionend", (e) => {
    editorEl.classList.remove("is-composing");
  });

  // Update the character bounds when the EditContext needs it.
  editContext.addEventListener("characterboundsupdate", (e) => {
    const tokenNodes = fromOffsetsToRenderedTokenNodes(
      currentTokens,
      e.rangeStart,
      e.rangeEnd
    );

    const charBounds = tokenNodes.map(({ node, nodeOffset, charOffset }) => {
      const range = document.createRange();
      range.setStart(node.firstChild, charOffset - nodeOffset);
      range.setEnd(node.firstChild, charOffset - nodeOffset + 1);
      return range.getBoundingClientRect();
    });

    editContext.updateCharacterBounds(e.rangeStart, charBounds);
  });

  // Draw IME composition text formats if needed.
  editContext.addEventListener("textformatupdate", (e) => {
    const formats = e.getTextFormats();

    for (const format of formats) {
      // Find the DOM selection that corresponds to the format's range.
      const selection = fromOffsetsToSelection(
        format.rangeStart,
        format.rangeEnd,
        editorEl
      );

      // Highlight the selection with the right style and thickness.
      addHighlight(selection, format.underlineStyle, format.underlineThickness);
    }
  });

  function addHighlight(selection, underlineStyle, underlineThickness) {
    // Get the right CSS custom Highlight object depending on the
    // underline style and thickness.
    const highlight =
      imeHighlights[
        `${underlineStyle.toLowerCase()}-${underlineThickness.toLowerCase()}`
      ];

    if (highlight) {
      // Add a range to the Highlight object.
      const range = document.createRange();
      range.setStart(selection.anchorNode, selection.anchorOffset);
      range.setEnd(selection.extentNode, selection.extentOffset);
      highlight.add(range);
    }
  }

  // Handle key presses that are not already handled by the EditContext.
  editorEl.addEventListener("keydown", (e) => {
    // keyCode === 229 is a special code that indicates an IME event.
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event#keydown_events_with_ime
    if (e.keyCode === 229) {
      return;
    }
    const start = Math.min(
      editContext.selectionStart,
      editContext.selectionEnd
    );
    const end = Math.max(editContext.selectionStart, editContext.selectionEnd);

    if (e.key === "Tab") {
      e.preventDefault();
      editContext.updateText(start, end, "\t");
      updateSelection(start + 1, start + 1);
      render(
        editContext.text,
        editContext.selectionStart,
        editContext.selectionEnd
      );
    } else if (e.key === "Enter") {
      editContext.updateText(start, end, "\n");
      updateSelection(start + 1, start + 1);
      render(
        editContext.text,
        editContext.selectionStart,
        editContext.selectionEnd
      );
    }
  });

  // Listen to selectionchange events to let the EditContext know where it is.
  document.addEventListener("selectionchange", () => {
    const selection = document.getSelection();
    const offsets = fromSelectionToOffsets(selection, editorEl);
    if (offsets) {
      updateSelection(offsets.start, offsets.end);
    }
  });

  // Render the initial view.
  render(
    editContext.text,
    editContext.selectionStart,
    editContext.selectionEnd
  );
})();
