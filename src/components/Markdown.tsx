import clsx from "clsx";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownProps = {
  content?: string | null;
  className?: string;
};

export function Markdown({ content, className }: MarkdownProps) {
  if (!content) return null;

  return (
    <div className={clsx("rich-text", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => (
            <h1 style={{ fontFamily: "var(--font-display)" }} {...props} />
          ),
          h2: (props) => (
            <h2 style={{ fontFamily: "var(--font-display)" }} {...props} />
          ),
          h3: (props) => (
            <h3 style={{ fontFamily: "var(--font-display)" }} {...props} />
          ),
          h4: (props) => (
            <h4 style={{ fontFamily: "var(--font-display)" }} {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
