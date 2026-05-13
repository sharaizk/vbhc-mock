"use client";
import "@/css/contract_designer.css";
import dynamic from "next/dynamic";

const ContractFinance = dynamic(
  () => import("@/components/contract-finance/ContractFinance"),
  { ssr: false },
);
export default function ContractFinanceHome() {
  return (
    <>
      <ContractFinance />
    </>
  );
}
