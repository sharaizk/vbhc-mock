import ProviderDashboard from "@/components/performance/ProviderDashboard";
import { HOME_USER } from "@/mock/home";
import "@/css/performance.css";
export default function Performance() {
  return <>{<ProviderDashboard role={HOME_USER.role} />}</>;
}
