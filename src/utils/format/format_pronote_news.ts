import { convert as convertHTML } from "html-to-text";

function parse_news_resume (content: string): string {
  const converted = convertHTML(content);
  const formatted = converted.replace(/Bonjour,|Bonjour à tous|Bonjour !|Bonsoir|Bonjour|Bonjour à tous, |Bonjour , |Bonsoir, /g, "").replace(/\n/g, "");
  const trimmed = formatted.trim();
  return trimmed;
}

export default parse_news_resume;
