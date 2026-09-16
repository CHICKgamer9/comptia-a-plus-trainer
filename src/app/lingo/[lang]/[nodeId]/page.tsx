import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LINGO_COURSES } from "@/content/lingo/courses";
import { LINGO_LANGS, isLingoLangId } from "@/content/lingo/types";
import { LingoPlayer } from "@/components/lingo/LingoPlayer";

export function generateStaticParams() {
  const params: { lang: string; nodeId: string }[] = [];
  for (const lang of LINGO_LANGS) {
    for (let unit = 1; unit <= 10; unit += 1) {
      for (let lesson = 1; lesson <= 6; lesson += 1) {
        params.push({
          lang,
          nodeId: `${lang}-u${String(unit).padStart(2, "0")}-l${String(lesson).padStart(2, "0")}`,
        });
      }
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const meta = isLingoLangId(lang) ? LINGO_COURSES[lang] : undefined;
  return { title: meta ? `${meta.title} lesson` : "Lesson" };
}

export default async function LingoLessonPage({
  params,
}: {
  params: Promise<{ lang: string; nodeId: string }>;
}) {
  const { lang, nodeId } = await params;
  if (!isLingoLangId(lang)) notFound();
  return <LingoPlayer key={nodeId} lang={lang} nodeId={nodeId} />;
}
