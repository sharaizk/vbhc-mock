"use client";
import ValueFrameworkViewer from "@/components/value-framework/VFViewer2";
import "@/css/value_framework.css";
import { useRouter } from "next/navigation";
export default function ValueFrameworkHome() {
  const router = useRouter();
  return (
    <>
      <ValueFrameworkViewer
        onNavigateToIchom={() => {
          router.push("/ichom");
        }}
      />
    </>
  );
}
