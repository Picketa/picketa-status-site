import markdownStyles from "./markdown-styles.module.css";

type Props = {
  content: string;
};

export function MarkdownBody({ content }: Props) {
  return (
    <div
      className={markdownStyles["markdown"]}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
