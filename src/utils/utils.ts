const TEMPLATE_TAG_NAME = "template";
const SCRIPT_TAG_NAME = "script";
const REPLACE_MAKER_TEMPLATE = "___REPLACE_MAKER__TEMPLATE";
const REPLACE_MAKER_SCRIPT = "___REPLACE_MAKER__SCRIPT";

const generateTagsRegex = (tagName: string) => {
  return new RegExp(`^<${tagName}.*>[\\s\\S]*^<\\/${tagName}>`, "m");
};

const getTagIndex = (tagName: string, text: string): number => {
  const regex = generateTagsRegex(tagName);

  return text.search(regex);
};

export const getTag = (text: string, regex: RegExp): string => {
  const result = regex.exec(text);

  if (!result) {
    throw new Error("tags not found.");
  }

  return result[0];
};

export const changeTheOrder = (text: string): string => {
  const templatetagsRegex = generateTagsRegex(TEMPLATE_TAG_NAME);
  const scriptTagsRegex = generateTagsRegex(SCRIPT_TAG_NAME);
  const templateTag = getTag(text, templatetagsRegex);
  const scriptTag = getTag(text, scriptTagsRegex);

  return text
    .replace(templatetagsRegex, REPLACE_MAKER_TEMPLATE)
    .replace(scriptTagsRegex, REPLACE_MAKER_SCRIPT)
    .replace(REPLACE_MAKER_TEMPLATE, scriptTag)
    .replace(REPLACE_MAKER_SCRIPT, templateTag);
};

export const shouldChangeTheOrder = (
  pattern: number,
  text: string
): boolean => {
  const scriptTagIndex = getTagIndex(SCRIPT_TAG_NAME, text);
  const templateTagIndex = getTagIndex(TEMPLATE_TAG_NAME, text);

  if (scriptTagIndex < 0 || templateTagIndex < 0) {
    return false;
  }

  if (pattern === 1 && scriptTagIndex > templateTagIndex) {
    return true;
  }

  return pattern === 2 && scriptTagIndex < templateTagIndex;
};
