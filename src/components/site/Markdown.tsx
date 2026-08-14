import { Fragment, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";

/**
 * Minimal, safe markdown renderer for editorial blog content.
 * Supports: ## / ### headings, paragraphs, - and 1. lists, **bold**,
 * and [label](/internal-path) links. No HTML is ever injected.
 */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    if (match[1]) {
      nodes.push(
        <strong key={`${keyPrefix}-b-${index}`} className="font-semibold text-foreground">
          {match[1]}
        </strong>,
      );
    } else if (match[2] && match[3]) {
      const href = match[3];
      nodes.push(
        href.startsWith("/") ? (
          <Link
            key={`${keyPrefix}-l-${index}`}
            to={href}
            className="font-medium text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
          >
            {match[2]}
          </Link>
        ) : (
          <a
            key={`${keyPrefix}-l-${index}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline underline-offset-4"
          >
            {match[2]}
          </a>
        ),
      );
    }
    lastIndex = pattern.lastIndex;
    index += 1;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

export function Markdown({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);

  return (
    <div className="space-y-6">
      {blocks.map((block, blockIndex) => {
        const key = `b${blockIndex}`;

        if (block.startsWith("### ")) {
          return (
            <h3 key={key} className="font-display text-lg font-semibold tracking-tight text-foreground">
              {renderInline(block.slice(4), key)}
            </h3>
          );
        }
        if (block.startsWith("## ")) {
          return (
            <h2 key={key} className="mt-10 font-display text-2xl font-bold tracking-tight text-foreground">
              {renderInline(block.slice(3), key)}
            </h2>
          );
        }

        const lines = block.split("\n").map((line) => line.trim());

        if (lines.every((line) => line.startsWith("- "))) {
          return (
            <ul key={key} className="space-y-2.5 pl-1">
              {lines.map((line, lineIndex) => (
                <li key={`${key}-${lineIndex}`} className="flex gap-3 text-[15px] leading-relaxed text-muted-foreground">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{renderInline(line.slice(2), `${key}-${lineIndex}`)}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (lines.every((line) => /^\d+\.\s/.test(line))) {
          return (
            <ol key={key} className="space-y-2.5">
              {lines.map((line, lineIndex) => (
                <li key={`${key}-${lineIndex}`} className="flex gap-3 text-[15px] leading-relaxed text-muted-foreground">
                  <span className="font-display text-sm font-bold text-primary">{lineIndex + 1}.</span>
                  <span>{renderInline(line.replace(/^\d+\.\s/, ""), `${key}-${lineIndex}`)}</span>
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={key} className="text-[15px] leading-relaxed text-muted-foreground">
            {lines.map((line, lineIndex) => (
              <Fragment key={`${key}-${lineIndex}`}>
                {lineIndex > 0 ? " " : null}
                {renderInline(line, `${key}-${lineIndex}`)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
