import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cheatsheets, getCheatsheet } from "@/content/cheatsheets";
import { cardsForSheet } from "@/content/bench-cards";
import { Card } from "@/components/ui";

export function generateStaticParams() {
  return cheatsheets.map((sheet) => ({ sheetId: sheet.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sheetId: string }>;
}): Promise<Metadata> {
  const { sheetId } = await params;
  const sheet = getCheatsheet(sheetId);
  return { title: sheet ? sheet.title : "Reference" };
}

export default async function CheatsheetPage({
  params,
}: {
  params: Promise<{ sheetId: string }>;
}) {
  const { sheetId } = await params;
  const sheet = getCheatsheet(sheetId);
  if (!sheet) notFound();

  return (
    <div>
      <Link
        href="/reference"
        className="mb-4 inline-block text-sm text-muted hover:text-foreground"
      >
        ← All sheets
      </Link>
      <h1 className="text-3xl font-semibold tracking-tight">{sheet.title}</h1>
      <p className="mt-2 mb-8 max-w-2xl text-muted">{sheet.summary}</p>
      <div className="space-y-6">
        {sheet.tables.map((table) => (
          <Card key={table.title} className="overflow-hidden p-0">
            <div className="border-b border-border px-4 py-3 text-sm font-medium">
              {table.title}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[28rem] text-left text-sm">
                <thead className="text-muted">
                  <tr>
                    {table.headers.map((header) => (
                      <th key={header} className="px-4 py-2 font-medium">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, index) => (
                    <tr key={row.join("|")} className={index % 2 ? "bg-surface-2/50" : ""}>
                      {row.map((cell, cellIndex) => (
                        <td
                          key={`${cell}-${cellIndex}`}
                          className={`px-4 py-2 align-top leading-6 ${cellIndex === 0 ? "font-mono text-[13px] text-accent" : ""}`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ))}
        {sheet.notes?.length ? (
          <Card>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              Notes
            </p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-6">
              {sheet.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </Card>
        ) : null}
        {cardsForSheet(sheet.id).length ? (
          <Card>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              Binder backs
            </p>
            <p className="mt-2 text-sm text-muted">
              These knowledge cards share this sheet. Open the Binder to flip them.
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {cardsForSheet(sheet.id).map((card) => (
                <li key={card.id}>
                  <Link href={`/binder?card=${card.id}`} className="text-accent hover:underline">
                    {card.title}
                  </Link>
                  <span className="text-muted"> — {card.subtitle}</span>
                </li>
              ))}
            </ul>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
