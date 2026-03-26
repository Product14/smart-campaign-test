import { SAMPLE_CAMPAIGNS } from "@/lib/mock-data";
import EditClient from "./EditClient";

export function generateStaticParams() {
  return SAMPLE_CAMPAIGNS.map((c) => ({ id: c.id }));
}

export default function EditCampaignPage() {
  return <EditClient />;
}
