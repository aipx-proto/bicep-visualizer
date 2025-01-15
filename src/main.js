import "https://esm.sh/gh/aipx-proto/wc-agent-hook@v1.0.0?bundle-deps";
import { createVisualizer } from "./lib";

const DEMO_GRAPH = {
  nodes: [
    {
      id: "testGroup1",
      type: "<module>",
      hasChildren: true,
    },
    {
      id: "testGroup1::azureIdentity",
      type: "microsoft.managedidentity/identities",
    },
    {
      id: "testGroup1::azureMap",
      type: "microsoft.unknown",
    },
    {
      id: "testGroup1::signalrDatabase",
      type: "microsoft.sql/servers/databases",
    },
    {
      id: "testGroup2",
      type: "<module>",
      hasChildren: true,
    },
    {
      id: "testGroup2::azureCommunicationService",
      type: "microsoft.unknown",
    },
  ],
  edges: [
    {
      sourceId: "testGroup1::azureIdentity",
      targetId: "testGroup1::azureMap",
    },
    {
      sourceId: "testGroup1::azureIdentity",
      targetId: "testGroup1::signalrDatabase",
    },
    {
      sourceId: "testGroup1::azureIdentity",
      targetId: "testGroup2::azureCommunicationService",
    },
    {
      sourceId: "testGroup2",
      targetId: "testGroup1",
    },
  ],
};

// DEMO
const { update } = createVisualizer(document.getElementById("root"), DEMO_GRAPH);

/** The agent will call `getTools()` to see what tools it can use */
agent.getTools = () => {
  /** You can define a tool like this */
  const updateGraphTool = {
    name: "updateGraph",
    description: "Update the Azure Resource Graph",
    parameters: z.object({
      nodes: z.array(z.object({ id: z.string().required(), type: z.string().required(), hasChildren: z.boolean() })),
      edges: z.array(z.object({ sourceId: z.string(), targetId: z.string() })),
    }),
    run: ({ nodes, edges }) => {
      update({ nodes, edges });

      /* Give text feedback to the agent */
      return `Graph updated`;
    },
  };

  /** In the end, show all the tools to the agent by returning them */
  return [updateGraphTool];
};

/** The agent will call `getState()` to see what the current state is, which can inform its tool use */
agent.getState = () => {
  /** Return a string that describes the current state */
  return `
The current graph looks like this:
${JSON.stringify(DEMO_GRAPH, null, 2)}
      `;
};
