import {
  HOME_ACTIVITY,
  HOME_ALERTS,
  HOME_CONTRACTS,
  HOME_MODULES,
  HOME_PULSE,
  HOME_USER,
} from "@/mock/home";
import "@/css/home.css";
import HomeHeader from "@/components/home/layout/HomeHeader";
import HomeFooter from "@/components/home/layout/HomeFooter";
import ModuleHero from "@/components/home/ModuleHero";
import Heatmap from "@/components/home/Heatmap";
import PortfolioPulse from "@/components/home/PortfolioPulse";
import Attention from "@/components/home/Attention";
import Activity from "@/components/home/Activity";

export default function Home() {
  return (
    <div className="home-page">
      <HomeHeader user={HOME_USER} />

      <ModuleHero modules={HOME_MODULES} />

      <div className="ops-console">
        <PortfolioPulse p={HOME_PULSE} />
        <div className="ops-grid">
          <Heatmap contracts={HOME_CONTRACTS} />
          <Attention alerts={HOME_ALERTS} />
        </div>
      </div>

      <Activity items={HOME_ACTIVITY} />

      <HomeFooter user={HOME_USER} />
    </div>
  );
}
