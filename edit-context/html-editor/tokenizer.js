const WHITESPACE = [" ", "\n", "\t"];

function getOpenTagName(htmlString, pos) {
  let tagName = "";
  let char = htmlString.charAt(pos);

  while (char !== ">" && char !== " " && char !== "/" && char !== "") {
    tagName += char;
    char = htmlString.charAt(++pos);
  }

  return tagName;
}

function getCloseTagName(htmlString, pos) {
  let tagName = "";
  let char = htmlString.charAt(pos);

  while (char !== ">" && char !== "") {
    tagName += char;
    char = htmlString.charAt(++pos);
  }

  return tagName;
}

function getWhiteSpace(htmlString, pos) {
  let whitespace = "";
  let char = htmlString.charAt(pos);

  while (WHITESPACE.includes(char) && char !== "") {
    whitespace += char;
    char = htmlString.charAt(++pos);
  }

  return whitespace;
}

function getAttributeName(htmlString, pos) {
  let attributeName = "";
  let char = htmlString.charAt(pos);

  while (char !== "=" && char !== " " && char !== ">" && char !== "") {
    attributeName += char;
    char = htmlString.charAt(++pos);
  }

  return attributeName;
}

function getAttributeValue(htmlString, pos, quote) {
  let attributeValue = "";
  let char = htmlString.charAt(pos);

  const isAtEnd = (c) => {
    if (quote) {
      return c === quote || c === "";
    }
    return c === " " || c === ">" || c === "/" || c === "";
  };

  while (!isAtEnd(char)) {
    attributeValue += char;
    char = htmlString.charAt(++pos);
  }

  return attributeValue;
}

function getText(htmlString, pos) {
  let text = "";
  let char = htmlString.charAt(pos);

  while (char !== "<" && char !== "") {
    text += char;
    char = htmlString.charAt(++pos);
  }

  return text;
}

export function tokenizeHTML(htmlString) {
  let pos = 0;
  let isInTag = false;
  let isInAttribute = false;
  let isAfterAttributeEqual = false;

  const tokens = [];

  while (pos < htmlString.length) {
    const char = htmlString.charAt(pos);
    const nextChar = htmlString.charAt(pos + 1);

    if (char === "<" && nextChar !== "/" && !isInTag && !isInAttribute) {
      isInTag = true;
      tokens.push({ type: "openTagStart", value: "<", pos });
      pos++;
      const tagName = getOpenTagName(htmlString, pos);
      tokens.push({ type: "tagName", value: tagName, pos });
      pos += tagName.length;
      continue;
    }

    if (WHITESPACE.includes(char) && isInTag) {
      const whitespace = getWhiteSpace(htmlString, pos);
      tokens.push({ type: "whitespace", value: whitespace, pos });
      pos += whitespace.length;
      isInAttribute = false;
      continue;
    }

    if (char === ">" && isInTag && !isInAttribute) {
      isInTag = false;
      tokens.push({ type: "openTagEnd", value: ">", pos });
      pos++;
      continue;
    }

    if (isInTag && !isInAttribute && char === "/" && nextChar === ">") {
      isInTag = false;
      tokens.push({ type: "selfClose", value: "/>", pos });
      pos += 2;
      continue;
    }

    if (isInTag && !isInAttribute) {
      isInAttribute = true;
      const attributeName = getAttributeName(htmlString, pos);
      tokens.push({ type: "attributeName", value: attributeName, pos });
      pos += attributeName.length;

      if (htmlString.charAt(pos) !== "=" && htmlString.charAt(pos) !== "'" && htmlString.charAt(pos) !== '"') {
        isInAttribute = false;
      }

      continue;
    }

    if (char === "=" && isInAttribute && isInTag) {
      isAfterAttributeEqual = true;
      tokens.push({ type: "equal", value: "=", pos });
      pos++;
      continue;
    }

    if (isAfterAttributeEqual && isInAttribute && isInTag) {
      const hasQuote = char === "'" || char === '"';
      const quote = hasQuote ? char : "";

      if (hasQuote) {
        tokens.push({ type: "quoteStart", value: quote, pos });
        pos++;
      }

      const attributeValue = getAttributeValue(htmlString, pos, quote);
      tokens.push({ type: "attributeValue", value: attributeValue, pos });
      pos += attributeValue.length;

      if (hasQuote && htmlString.charAt(pos) === quote) {
        tokens.push({ type: "quoteEnd", value: quote, pos });
        pos++;
      }

      isInAttribute = false;
      isAfterAttributeEqual = false;
      continue;
    }

    if (!isInTag && char === "<" && nextChar === "/") {
      tokens.push({ type: "closeTagStart", value: "</", pos });
      pos += 2;

      const tagName = getCloseTagName(htmlString, pos);
      tokens.push({ type: "tagName", value: tagName, pos });
      pos += tagName.length;

      if (htmlString.charAt(pos) === ">") {
        tokens.push({ type: "closeTagEnd", value: ">", pos });
        pos++;
      }

      continue;
    }

    if (!isInTag) {
      const text = getText(htmlString, pos);
      tokens.push({ type: "text", value: text, pos });
      pos += text.length;
      continue;
    }
  }

  return tokens;
}
