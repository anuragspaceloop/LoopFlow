import { Plus, CheckCircle2, ChevronDown } from "lucide-react";
import { WorkflowCanvas } from "@/components/WorkflowCanvas";
import { Button } from "@/components/ui/button";
import { defaultWorkflow, type Agent } from "@/lib/agent-store";

export function WorkflowTab({ agent, onNext }: { agent: Agent; onNext: () => void }) {
  const graph = agent.workflow ?? defaultWorkflow(agent.persona);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-medium text-heading">Conversation workflow</h2>
          <p className="text-[12px] text-secondary-text">
            How the agent navigates a call. Nodes are auto-generated — drag, pan and zoom to edit.
          </p>
        </div>
        <div className="flex gap-1.5">
          <button className="inline-flex items-center gap-1.5 rounded-md border border-hairline bg-surface px-2.5 py-1.5 text-[12px] text-secondary-text hover:text-heading cursor-pointer">
            <Plus className="h-3.5 w-3.5" /> Add node
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-md border border-hairline bg-surface px-2.5 py-1.5 text-[12px] text-secondary-text hover:text-heading cursor-pointer">
            <CheckCircle2 className="h-3.5 w-3.5" /> Sync from SOP
          </button>
          <Button
            onClick={onNext}
            className="gap-1.5 cursor-pointer"
          >
            Continue to Integrations <ChevronDown className="h-4 w-4 -rotate-90" />
          </Button>
        </div>
      </div>
      <WorkflowCanvas graph={graph} />
    </div>
  );
}
