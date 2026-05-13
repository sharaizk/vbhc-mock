// app/performance/patient-detail/[slug]/page.tsx
import "@/css/performance.css";
import "@/css/patients.css";
import PatientDetailView from "@/components/patient-detail/PatientDetailView";
type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PatientDetailPage({ params }: Props) {
  const { slug } = await params;

  return (
    <>
      <PatientDetailView />
    </>
  );
}
