import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ResearchViewer from "@/components/sections/ResearchViewer";
import { researchBySlug, researchDocs } from "@/content/research";

export function generateStaticParams() {
  return researchDocs.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const d = researchBySlug.get(slug);
  return { title: d ? `${d.title} — Recherche` : "Recherche" };
}

export default async function ResearchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = researchBySlug.get(slug);
  if (!doc) notFound();
  return <ResearchViewer doc={doc} />;
}
