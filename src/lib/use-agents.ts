import { useEffect, useState } from "react";
import { listAgents, type Agent } from "./agent-store";

export function useAgents(): Agent[] {
  const [agents, setAgents] = useState<Agent[]>([]);
  useEffect(() => {
    const sync = () => setAgents(listAgents());
    sync();
    window.addEventListener("prodloop:agents", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("prodloop:agents", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return agents;
}
