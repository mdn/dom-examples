const commands = [
  {
    name: "backColor",
    val: "red",
    desc: "Changes the document background color. In styleWithCss mode, it affects the background color of the containing block instead. This requires a <color> value string to be passed in as a value argument.",
  },
  {
    name: "bold",
    icon: "bold",
    desc: "Toggles bold on/off for the selection or at the insertion point.",
  },
  {
    name: "contentReadOnly",
    desc: "Makes the content document either read-only or editable. This requires a boolean true/false as the value argument.",
  },
  {
    name: "copy",
    icon: "clipboard",
    desc: "Copies the current selection to the clipboard. Conditions of having this behavior enabled vary from one browser to another, and have evolved over time.",
  },
  {
    name: "createLink",
    val: "https://developer.mozilla.org/",
    icon: "link",
    desc: "Creates an hyperlink from the selection, but only if there is a selection. Requires a URI string as a value argument for the hyperlink's href. The URI must contain at least a single character, which may be whitespace.",
  },
  {
    name: "cut",
    icon: "scissors",
    desc: "Removes the current selection and copies it to the clipboard. When this behavior is enabled varies between browsers, and its conditions have evolved over time.",
  },
  {
    name: "decreaseFontSize",
    desc: "Adds a <small> tag around the selection or at the insertion point.",
  },
  {
    name: "defaultParagraphSeparator",
    desc: "Changes the paragraph separator used when new paragraphs are created in editable text regions.",
  },
  {
    name: "delete",
    icon: "scissors",
    desc: "Deletes the current selection.",
  },
  {
    name: "enableAbsolutePositionEditor",
    desc: "Enables or disables the grabber that allows absolutely-positioned elements to be moved around.",
  },
  {
    name: "enableInlineTableEditing",
    desc: "Enables or disables the table row/column insertion and deletion controls.",
  },
  {
    name: "enableObjectResizing",
    desc: "Enables or disables the resize handles on images, tables, and absolutely-positioned elements and other resizable objects.",
  },
  {
    name: "fontName",
    val: "'Inconsolata', monospace",
    desc: 'Changes the font name for the selection or at the insertion point. This requires a font name string (like "Arial") as a value argument.',
  },
  {
    name: "fontSize",
    val: "7",
    icon: "text-height",
    desc: "Changes the font size for the selection or at the insertion point. This requires an integer from 1 - 7 as a value argument.",
  },
  {
    name: "foreColor",
    val: "rgba(0,0,0,.5)",
    desc: "Changes a font color for the selection or at the insertion point. This requires a hexadecimal color value string as a value argument.",
  },
  {
    name: "formatBlock",
    val: "<blockquote>",
    desc: "Adds an HTML block-level element around the line containing the current selection, replacing the block element containing the line if one exists (in Firefox, <blockquote> is the exception — it will wrap any containing block element). Requires a tag-name string as a value argument. Virtually all block-level elements can be used.",
  },
  {
    name: "forwardDelete",
    desc: "Deletes the character ahead of the cursor's position, identical to hitting the Delete key on a Windows keyboard.",
  },
  {
    name: "heading",
    val: "h3",
    icon: "header",
    desc: 'Adds a heading element around a selection or insertion point line. Requires the tag-name string as a value argument (i.e., "H1", "H6").',
  },
  {
    name: "hiliteColor",
    val: "Orange",
    desc: "Changes the background color for the selection or at the insertion point. Requires a color value string as a value argument. useCSS must be true for this to function.",
  },
  {
    name: "increaseFontSize",
    desc: "Adds a <big> tag around the selection or at the insertion point.",
  },
  {
    name: "indent",
    icon: "indent",
    desc: "Indents the line containing the selection or insertion point. In Firefox, if the selection spans multiple lines at different levels of indentation, only the least indented lines in the selection will be indented.",
  },
  {
    name: "insertBrOnReturn",
    desc: "Controls whether the Enter key inserts a <br> element, or splits the current block element into two.",
  },
  {
    name: "insertHorizontalRule",
    desc: "Inserts a <hr> element at the insertion point, or replaces the selection with it.",
  },
  {
    name: "insertHTML",
    val: "&lt;h3&gt;Life is great!&lt;/h3&gt;",
    icon: "code",
    desc: "Inserts an HTML string at the insertion point (deletes selection). Requires a valid HTML string as a value argument.",
  },
  {
    name: "insertImage",
    val: "http://dummyimage.com/160x90",
    icon: "picture-o",
    desc: "Inserts an image at the insertion point (deletes selection). Requires a URL string for the image's src as a value argument. The requirements for this string are the same as createLink.",
  },
  {
    name: "insertOrderedList",
    icon: "list-ol",
    desc: "Creates a numbered ordered list for the selection or at the insertion point.",
  },
  {
    name: "insertUnorderedList",
    icon: "list-ul",
    desc: "Creates a bulleted unordered list for the selection or at the insertion point.",
  },
  {
    name: "insertParagraph",
    icon: "paragraph",
    desc: "Inserts a paragraph around the selection or the current line.",
  },
  {
    name: "insertText",
    val: new Date().toString(),
    icon: "file-text-o",
    desc: "Inserts the given plain text at the insertion point (deletes selection).",
  },
  {
    name: "italic",
    icon: "italic",
    desc: "Toggles italics on/off for the selection or at the insertion point.",
  },
  {
    name: "justifyCenter",
    icon: "align-center",
    desc: "Centers the selection or insertion point.",
  },
  {
    name: "justifyFull",
    icon: "align-justify",
    desc: "Justifies the selection or insertion point.",
  },
  {
    name: "justifyLeft",
    icon: "align-left",
    desc: "Justifies the selection or insertion point to the left.",
  },
  {
    name: "justifyRight",
    icon: "align-right",
    desc: "Right-justifies the selection or the insertion point.",
  },
  {
    name: "outdent",
    icon: "outdent",
    desc: "Outdents the line containing the selection or insertion point.",
  },
  {
    name: "paste",
    icon: "clipboard",
    desc: "Pastes the clipboard contents at the insertion point (replaces current selection). Disabled for web content.",
  },
  {
    name: "redo",
    icon: "repeat",
    desc: "Redoes the previous undo command.",
  },
  {
    name: "removeFormat",
    desc: "Removes all formatting from the current selection.",
  },
  {
    name: "selectAll",
    desc: "Selects all of the content of the editable region.",
  },
  {
    name: "strikeThrough",
    icon: "strikethrough",
    desc: "Toggles strikethrough on/off for the selection or at the insertion point.",
  },
  {
    name: "subscript",
    icon: "subscript",
    desc: "Toggles subscript on/off for the selection or at the insertion point.",
  },
  {
    name: "superscript",
    icon: "superscript",
    desc: "Toggles superscript on/off for the selection or at the insertion point.",
  },
  {
    name: "underline",
    icon: "underline",
    desc: "Toggles underline on/off for the selection or at the insertion point.",
  },
  {
    name: "undo",
    icon: "undo",
    desc: "Undoes the last executed command.",
  },
  {
    name: "unlink",
    icon: "chain-broken",
    desc: "Removes the anchor tag from a selected anchor link.",
  },
  {
    name: "useCSS",
    desc: "Toggles the use of HTML tags or CSS for the generated markup. Requires a boolean true/false as a value argument. NOTE: This argument is logically backwards (i.e., use false to use CSS, true to use HTML). This has been deprecated in favor of styleWithCSS.",
  },
  {
    name: "styleWithCSS",
    desc: "Replaces the useCSS command. true modifies/generates style attributes in markup, false generates presentational elements.",
  },
  {
    name: "AutoUrlDetect",
    desc: "Changes the browser auto-link behavior.",
  },
];

const buttons = document.querySelector(".buttons");
commands.forEach((command) => {
  const button = document.createElement("button");
  const supported = document.queryCommandSupported(command.name);
  button.class = `btn btn-xs btn-${supported ? "succes" : "error"}`;
  button.addEventListener("mousedown", (e) => e.preventDefault());
  if (supported) {
    button.addEventListener("click", () => {
      const val = command.val
        ? prompt(`Value for ${command.name}?`, command.val) || ""
        : "";
      document.execCommand(command.name, false, val);
    });
  }
  button.innerHTML = `<i class="${cmd.icon ? `fa fa-${cmd.icon}` : ""}"></i> ${command.name}`;
  buttons.appendChild(button);
});
