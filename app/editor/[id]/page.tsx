import { SAMPLE_CAMPAIGNS } from "@/lib/mock-data";
import EditorClient from "./EditorClient";

export function generateStaticParams() {
  return SAMPLE_CAMPAIGNS.map((c) => ({ id: c.id }));
}

export default function EditorPage() {
  return <EditorClient />;
}
