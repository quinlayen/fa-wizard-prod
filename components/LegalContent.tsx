// The source text contains print-width line breaks. Reflow prose while keeping
// headings, list items, and postal addresses as distinct semantic elements.
export default function LegalContent({ children }: { children: string }) {
  const blocks = children.trim().split(/\n\s*\n/);

  return (
    <div className="space-y-5 text-base leading-relaxed break-words">
      {blocks.map((block, index) => {
        const lines = block.trim().split("\n").map((line) => line.trim());
        const elements: import("react").ReactNode[] = [];
        let paragraph: string[] = [];
        let bullets: string[] = [];
        const flush = () => {
          if (paragraph.length) {
            elements.push(<p key={`p-${elements.length}`}>{paragraph.join(" ")}</p>);
            paragraph = [];
          }
          if (bullets.length) {
            elements.push(
              <ul key={`ul-${elements.length}`} className="list-disc pl-6 space-y-1">
                {bullets.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            );
            bullets = [];
          }
        };

        for (const line of lines) {
          if (/^\d+\.\s/.test(line)) {
            flush();
            elements.push(<h2 key={`h-${elements.length}`} className="font-bold text-lg pt-3">{line}</h2>);
          } else if (line.startsWith("•")) {
            if (paragraph.length) flush();
            bullets.push(line.replace(/^•\s*/, ""));
          } else if (bullets.length) {
            // Long list items wrap onto the next line in the original text.
            bullets[bullets.length - 1] += ` ${line}`;
          } else if (/^[a-e]\)\s/.test(line)) {
            flush();
            paragraph.push(line);
          } else {
            paragraph.push(line);
          }
        }
        // Keep the business address readable without preserving prose wraps.
        if (lines[0] === "Financial Aid Experts, Inc.") {
          return <p key={index}>{lines.map((line, i) => <span key={i} className="block">{line}</span>)}</p>;
        }
        flush();
        return <div key={index} className="space-y-3">{elements}</div>;
      })}
    </div>
  );
}
