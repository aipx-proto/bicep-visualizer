import "https://esm.sh/gh/aipx-proto/wc-agent-hook@v1.2.0?bundle-deps";
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
      nodes: z.array(z.object({ id: z.string(), type: z.string(), hasChildren: z.boolean().optional() })),
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

agent.getInstructions = () =>
  `
Generate an Azure deployment resource graph based on user's goal. 

Use the following syntax:

// Group node
{
  id: "<groupId>",
  type: "group"
  hasChildren: true,
}

// Item node
{
  id: "<itemId>",
  type: "<itemType>",
}

// Item node inside a group
{
  id: "<groupId>::<itemId>",
  type: "<itemType>",
}

// Edge: meaning targetNode depends on sourceNode
{
  sourceId: <sourceNodeId>,
  targetId: <targetNodeId>
}

Requirement:
1. <groupId> and <itemId> are lowerCamelCase
2. <itemType> must be one of the following:

microsoft.compute/availabilitysets
microsoft.compute/disks
microsoft.compute/virtualmachines
microsoft.compute/virtualmachinescalesets
microsoft.compute/proximityplacementgroups
microsoft.compute/diskencryptionsets
microsoft.containerservice/managedclusters
microsoft.compute/snapshots
microsoft.batch/batchaccounts
microsoft.compute/images
microsoft.compute/galleries
microsoft.sql/servers
microsoft.sql/servers/databases
microsoft.documentdb/databaseaccounts
microsoft.dbformysql/servers
microsoft.dbformysql/flexibleservers
microsoft.dbformariadb/servers
microsoft.sqlvirtualmachine/sqlvirtualmachines
microsoft.datafactory/factories
microsoft.dbforpostgressql/servers
microsoft.dbforpostgressql/flexibleservers
microsoft.datamigration/services
microsoft.sql/servers/elasticpools
microsoft.sql/managedinstances
microsoft.sql/managedinstances/databases
microsoft.cache/redis
microsoft.sql/instancepools
microsoft.network/privatednszones
microsoft.network/dnszones
microsoft.network/loadbalancers
microsoft.network/networkinterfaces
microsoft.network/networksecuritygroups
microsoft.network/publicipaddresses
microsoft.network/virtualnetworkgateways
microsoft.network/virtualnetworks
microsoft.network/virtualnetworks/subnets
microsoft.network/ipgroups
microsoft.network/privatelinkservices
microsoft.network/trafficmanagerprofiles
microsoft.network/networkwatchers
microsoft.network/routefilters
microsoft.network/ddosprotectionplans
microsoft.network/frontdoors
microsoft.network/applicationgateways
microsoft.network/localnetworkgateways
microsoft.network/expressroutecircuits
microsoft.network/connections
microsoft.network/routetables
microsoft.network/azurefirewalls
microsoft.network/serviceendpointpolicies
microsoft.network/natgateways
microsoft.network/virtualwans
microsoft.network/firewallpolicies
microsoft.network/publicipprefixes
microsoft.network/applicationsecuritygroups
microsoft.resources/resourcegroups
microsoft.keyvault/vaults
microsoft.automation/automationaccounts
Microsoft.Authorization/policyDefinitions
microsoft.subscription/aliases
microsoft.storage/storageaccounts
microsoft.storage/storageaccounts/fileservices
microsoft.storage/storageaccounts/queueservices
microsoft.storage/storageaccounts/tableservices
microsoft.recoveryservices/vaults
microsoft.storagesync/storagesyncservices
microsoft.databox/jobs
microsoft.databoxedge/databoxedgedevices
microsoft.netapp/netappaccounts
microsoft.datashare/accounts
microsoft.web/serverfarms
microsoft.web/sites
microsoft.web/certificates
microsoft.web/hostingenvironments
microsoft.notificationhubs/namespaces
microsoft.devices/iothubs
microsoft.iotcentral/iotapps
microsoft.timeseriesinsights/environments
microsoft.operationalinsights/workspaces
microsoft.eventhub/namespaces
microsoft.eventhub/clusters
microsoft.streamanalytics/streamingjobs
microsoft.synapse/workspaces
microsoft.databricks/workspaces
microsoft.botservice/botservices
microsoft.cognitiveservices/accounts
microsoft.machinelearning/workspaces
microsoft.hdinsight/clusters
microsoft.analysisservices/servers
microsoft.insights/components
microsoft.devtestlab/labs
microsoft.aad/domainservices
microsoft.logic/workflows
microsoft.azureactivedirectory/b2cdirectories
microsoft.managedidentity/identities
microsoft.labservices/labaccounts
microsoft.apimanagement/service
microsoft.servicebus/namespaces
microsoft.containerinstance/containergroups
microsoft.containerregistry/registries
microsoft.app/containerapps
microsoft.app/managedenvironments
microsoft.cdn/service
microsoft.unknown


Now use the updateGraph to respond in this JSON format
{
  nodes: GroupNode|ItemNode|NestedItemNode[],
  edges: Edge[]
}
`.trim();
