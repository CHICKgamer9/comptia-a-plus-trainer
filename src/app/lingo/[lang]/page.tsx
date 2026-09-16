import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LINGO_COURSES } from "@/content/lingo/courses";
import { isLingoLangId } from "@/content/lingo/types";
import { LingoTree } from "@/components/lingo/LingoTree";

export function generateStaticParams() {
  return Object.keys(LINGO_COURSES).map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const meta = isLingoLangId(lang) ? LINGO_COURSES[lang] : undefined;
  return { title: meta ? meta.title : "Languages" };
}

export default async function LingoLangPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLingoLangId(lang)) notFound();
  return <LingoTree lang={lang} />;
}
