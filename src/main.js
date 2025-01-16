import "https://esm.sh/gh/aipx-proto/wc-agent-hook@v1.2.0?bundle-deps";
import { createVisualizer } from "./lib";

const DEMO_GRAPH = {
  nodes: [
    {
      id: "backend",
      type: "<module>",
      hasChildren: true,
    },
    {
      id: "backend::azureIdentity",
      type: "microsoft.managedidentity/identities",
    },
    {
      id: "backend::azureCosmoDB",
      type: "microsoft.sql/servers/databases",
    },
    {
      id: "frontend",
      type: "<module>",
      hasChildren: true,
    },
    {
      id: "frontend::webApp",
      type: "microsoft.app/containerapps",
    },
    {
      id: "frontend::azureCDN",
      type: "microsoft.cdn/service",
    },
  ],
  edges: [
    {
      sourceId: "backend::azureCosmoDB",
      targetId: "backend::azureIdentity",
    },
    {
      sourceId: "frontend::azureCDN",
      targetId: "frontend::webApp",
    },
    {
      sourceId: "frontend",
      targetId: "backend",
    },
  ],
};

// DEMO
const { update, getGraph } = createVisualizer(document.getElementById("root"), DEMO_GRAPH);

function toStandardNode(node) {
  return {
    id: node.id,
    type: node.type === "group" ? "<module>" : node.type,
    hasChildren: node.type === "group",
  };
}

/** The agent will call `getTools()` to see what tools it can use */
agent.getTools = () => {
  /** You can define a tool like this */
  const patchGraphTool = {
    name: "updateGraph",
    description: "Change the nodes and edges of the graph. When you remove a group, its children will be removed as well.",
    parameters: z.object({
      addNodes: z.array(z.object({ id: z.string(), type: z.string(), hasChildren: z.boolean().optional() })),
      addEdges: z.array(z.object({ sourceId: z.string(), targetId: z.string() })),
      removeNodes: z.array(z.string()).describe("The full id of the node to remove, including the group prefix if applicable"),
      removeEdges: z.array(z.object({ sourceId: z.string(), targetId: z.string() })),
    }),
    run: ({ addNodes, addEdges, removeNodes, removeEdges }) => {
      const currentGraph = getGraph();

      const remainingNodes = currentGraph.nodes.filter(
        (node) => !removeNodes.includes(node.id) && !removeNodes.some((removeNode) => node.id.startsWith(removeNode))
      );

      const remainingEdges = currentGraph.edges.filter(
        (edge) => !removeEdges.some((removeEdge) => edge.sourceId === removeEdge.sourceId && edge.targetId === removeEdge.targetId)
      );

      const patched = {
        nodes: [...remainingNodes, ...addNodes.map(toStandardNode)],
        edges: [...remainingEdges, ...addEdges],
      };

      // hasChildren but none of the children are in the graph
      const emptyGroups = patched.nodes.filter((node) => node.hasChildren && !patched.nodes.some((n) => n.id.startsWith(node.id) && n.id !== node.id));
      const nonEmptyNodes = patched.nodes.filter((node) => !emptyGroups.includes(node));

      // The source and target id must be in the graph
      const attachedEdges = patched.edges.filter(
        (edge) => nonEmptyNodes.some((n) => n.id === edge.sourceId) && nonEmptyNodes.some((n) => n.id === edge.targetId)
      );

      update({
        nodes: nonEmptyNodes,
        edges: attachedEdges,
      });

      console.log(`[updated]`, { nodes: nonEmptyNodes, edges: attachedEdges });

      /* Give text feedback to the agent */
      return `Graph updated`;
    },
  };

  const generateNewGraphTool = {
    name: "generateNewGraph",
    description: "Generate a new graph",
    parameters: z.object({
      nodes: z.array(z.object({ id: z.string(), type: z.string(), hasChildren: z.boolean().optional() })),
      edges: z.array(z.object({ sourceId: z.string(), targetId: z.string() })),
    }),
    run: ({ nodes, edges }) => {
      update({ nodes: nodes.map(toStandardNode), edges });

      console.log(`[created]`, { nodes: nonEmptyNodes, edges: nonEmptyEdges });
      /* Give text feedback to the agent */
      return `Graph created`;
    },
  };

  /** In the end, show all the tools to the agent by returning them */
  return [patchGraphTool, generateNewGraphTool];
};

/** The agent will call `getState()` to see what the current state is, which can inform its tool use */
agent.getState = () => {
  const rawGraph = getGraph();
  const simplifiedGraph = {
    nodes: rawGraph.nodes.map((node) => ({ id: node.id, type: node.hasChildren || node.type === "<module>" ? "group" : node.type })),
    edges: rawGraph.edges,
  };

  /** Return a string that describes the current state */
  return `
The current graph looks like this:
${JSON.stringify(simplifiedGraph, null, 2)}
      `;
};

agent.getHint = () =>
  `
Build an Azure deployment resource graph based on user's goal. 

The graph consists of nodes and edges of the following types:

type Graph = {
  nodes: GroupNode|ItemNode|NestedItemNode[],
  edges: Edge[]
}

type GroupNode = {
  id: "<groupId>",
  type: "group"
}

type ItemNode = {
  id: "<itemId>",
  type: "<itemType>",
}

type NestedItemNode = {
  id: "<groupId>::<itemId>",
  type: "<itemType>",
}

type Edge = {
  sourceId: "<sourceNodeId>",
  targetId: "<targetNodeId>"
}

Requirement:
1. <groupId> and <itemId> are lowerCamelCase
2. <itemType> must be one of the following:
3. No loops. No edge between group and its children. DAG only.

microsoft.aad/domainservices
microsoft.analysisservices/servers
microsoft.apimanagement/service
microsoft.app/containerapps
microsoft.app/managedenvironments
Microsoft.Authorization/policyDefinitions
microsoft.automation/automationaccounts
microsoft.azureactivedirectory/b2cdirectories
microsoft.batch/batchaccounts
microsoft.botservice/botservices
microsoft.cache/redis
microsoft.cdn/service
microsoft.cognitiveservices/accounts
microsoft.compute/availabilitysets
microsoft.compute/diskencryptionsets
microsoft.compute/disks
microsoft.compute/galleries
microsoft.compute/images
microsoft.compute/proximityplacementgroups
microsoft.compute/snapshots
microsoft.compute/virtualmachines
microsoft.compute/virtualmachinescalesets
microsoft.containerinstance/containergroups
microsoft.containerregistry/registries
microsoft.containerservice/managedclusters
microsoft.databox/jobs
microsoft.databoxedge/databoxedgedevices
microsoft.databricks/workspaces
microsoft.datafactory/factories
microsoft.datamigration/services
microsoft.datashare/accounts
microsoft.dbformariadb/servers
microsoft.dbformysql/flexibleservers
microsoft.dbformysql/servers
microsoft.dbforpostgressql/flexibleservers
microsoft.dbforpostgressql/servers
microsoft.devices/iothubs
microsoft.devtestlab/labs
microsoft.documentdb/databaseaccounts
microsoft.eventhub/clusters
microsoft.eventhub/namespaces
microsoft.hdinsight/clusters
microsoft.insights/components
microsoft.iotcentral/iotapps
microsoft.keyvault/vaults
microsoft.labservices/labaccounts
microsoft.logic/workflows
microsoft.machinelearning/workspaces
microsoft.managedidentity/identities
microsoft.netapp/netappaccounts
microsoft.network/applicationgateways
microsoft.network/applicationsecuritygroups
microsoft.network/azurefirewalls
microsoft.network/connections
microsoft.network/ddosprotectionplans
microsoft.network/dnszones
microsoft.network/expressroutecircuits
microsoft.network/firewallpolicies
microsoft.network/frontdoors
microsoft.network/ipgroups
microsoft.network/loadbalancers
microsoft.network/localnetworkgateways
microsoft.network/natgateways
microsoft.network/networkinterfaces
microsoft.network/networksecuritygroups
microsoft.network/networkwatchers
microsoft.network/privatednszones
microsoft.network/privatelinkservices
microsoft.network/publicipaddresses
microsoft.network/publicipprefixes
microsoft.network/routefilters
microsoft.network/routetables
microsoft.network/serviceendpointpolicies
microsoft.network/trafficmanagerprofiles
microsoft.network/virtualnetworkgateways
microsoft.network/virtualnetworks
microsoft.network/virtualnetworks/subnets
microsoft.network/virtualwans
microsoft.notificationhubs/namespaces
microsoft.operationalinsights/workspaces
microsoft.recoveryservices/vaults
microsoft.resources/resourcegroups
microsoft.servicebus/namespaces
microsoft.sql/instancepools
microsoft.sql/managedinstances
microsoft.sql/managedinstances/databases
microsoft.sql/servers
microsoft.sql/servers/databases
microsoft.sql/servers/elasticpools
microsoft.sqlvirtualmachine/sqlvirtualmachines
microsoft.storage/storageaccounts
microsoft.storage/storageaccounts/fileservices
microsoft.storage/storageaccounts/queueservices
microsoft.storage/storageaccounts/tableservices
microsoft.storagesync/storagesyncservices
microsoft.streamanalytics/streamingjobs
microsoft.subscription/aliases
microsoft.synapse/workspaces
microsoft.timeseriesinsights/environments
microsoft.web/certificates
microsoft.web/hostingenvironments
microsoft.web/serverfarms
microsoft.web/sites
microsoft.unknown

Now use the patchGraph to make incremental changes and use generateNewGraph for major changes.
`.trim();
