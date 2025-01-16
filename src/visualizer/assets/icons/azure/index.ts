// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
export async function importResourceIconInline(resourceType: string): Promise<string> {
  const rawSVGString = await importRawSVGString();
  const svgDom = new DOMParser().parseFromString(rawSVGString, "image/svg+xml");

  // remove width and height on the svg node
  const svgNode = svgDom.querySelector("svg");
  if (svgNode) {
    svgNode.removeAttribute("width");
    svgNode.removeAttribute("height");
  }

  return svgDom.documentElement.outerHTML;

  async function importRawSVGString() {
    switch (resourceType.toLowerCase()) {
      // Extensions
      case "microsoft.cognitiveServices/search":
        return (await import("./_extension/cognitive-search.svg?raw")).default;

      // Microsoft.Compute
      case "microsoft.compute/availabilitysets":
        return (await import("./compute/10025-icon-service-Availability-Sets.svg?raw")).default;
      case "microsoft.compute/disks":
        return (await import("./compute/10032-icon-service-Disks.svg?raw")).default;
      case "microsoft.compute/virtualmachines":
        return (await import("./compute/10021-icon-service-Virtual-Machine.svg?raw")).default;
      case "microsoft.compute/virtualmachinescalesets":
        return (await import("./compute/10034-icon-service-VM-Scale-Sets.svg?raw")).default;
      case "microsoft.compute/proximityplacementgroups":
        return (await import("./compute/10365-icon-service-Proximity-Placement-Groups.svg?raw")).default;
      case "microsoft.compute/diskencryptionsets":
        return (await import("./compute/00398-icon-service-Disk-Encryption-Sets.svg?raw")).default;
      case "microsoft.containerservice/managedclusters":
        return (await import("./compute/10023-icon-service-Kubernetes-Services.svg?raw")).default;
      case "microsoft.compute/snapshots":
        return (await import("./compute/10026-icon-service-Disks-Snapshots.svg?raw")).default;
      case "microsoft.batch/batchaccounts":
        return (await import("./compute/10031-icon-service-Batch-Accounts.svg?raw")).default;
      case "microsoft.compute/images":
        return (await import("./compute/10033-icon-service-Images.svg?raw")).default;
      case "microsoft.compute/galleries":
        return (await import("./compute/10039-icon-service-Shared-Image-Galleries.svg?raw")).default;

      // Microsoft.SQL
      case "microsoft.sql/servers":
        return (await import("./databases/10132-icon-service-SQL-Server.svg?raw")).default;
      case "microsoft.sql/servers/databases":
        return (await import("./databases/10130-icon-service-SQL-Database.svg?raw")).default;
      case "microsoft.documentdb/databaseaccounts":
        return (await import("./databases/10121-icon-service-Azure-Cosmos-DB.svg?raw")).default;
      case "microsoft.dbformysql/servers":
      case "microsoft.dbformysql/flexibleservers":
        return (await import("./databases/10122-icon-service-Azure-Database-MySQL-Server.svg?raw")).default;
      case "microsoft.dbformariadb/servers":
        return (await import("./databases/10123-icon-service-Azure-Database-MariaDB-Server.svg?raw")).default;
      case "microsoft.sqlvirtualmachine/sqlvirtualmachines":
        return (await import("./databases/10124-icon-service-Azure-SQL-VM.svg?raw")).default;
      case "microsoft.datafactory/factories":
        return (await import("./databases/10126-icon-service-Data-Factory.svg?raw")).default;
      case "microsoft.dbforpostgressql/servers":
      case "microsoft.dbforpostgressql/flexibleservers":
        return (await import("./databases/10131-icon-service-Azure-Database-PostgreSQL-Server.svg?raw")).default;
      case "microsoft.datamigration/services":
        return (await import("./databases/10133-icon-service-Azure-Database-Migration-Services.svg?raw")).default;
      case "microsoft.sql/servers/elasticpools":
        return (await import("./databases/10134-icon-service-SQL-Elastic-Pools.svg?raw")).default;
      case "microsoft.sql/managedinstances":
        return (await import("./databases/10136-icon-service-SQL-Managed-Instance.svg?raw")).default;
      case "microsoft.sql/managedinstances/databases":
        return (await import("./databases/10135-icon-service-Managed-Database.svg?raw")).default;
      case "microsoft.cache/redis":
        return (await import("./databases/10137-icon-service-Cache-Redis.svg?raw")).default;
      case "microsoft.sql/instancepools":
        return (await import("./databases/10139-icon-service-Instance-Pools.svg?raw")).default;

      // microsoft.network
      case "microsoft.network/privatednszones":
      case "microsoft.network/dnszones":
        return (await import("./networking/10064-icon-service-DNS-Zones.svg?raw")).default;
      case "microsoft.network/loadbalancers":
        return (await import("./networking/10062-icon-service-Load-Balancers.svg?raw")).default;
      case "microsoft.network/networkinterfaces":
        return (await import("./networking/10080-icon-service-Network-Interfaces.svg?raw")).default;
      case "microsoft.network/networksecuritygroups":
        return (await import("./networking/10067-icon-service-Network-Security-Groups.svg?raw")).default;
      case "microsoft.network/publicipaddresses":
        return (await import("./networking/10069-icon-service-Public-IP-Addresses.svg?raw")).default;
      case "microsoft.network/virtualnetworkgateways":
        return (await import("./networking/10063-icon-service-Virtual-Network-Gateways.svg?raw")).default;
      case "microsoft.network/virtualnetworks":
        return (await import("./networking/10061-icon-service-Virtual-Networks.svg?raw")).default;
      case "microsoft.network/virtualnetworks/subnets":
        return (await import("./custom/subnets.svg?raw")).default;
      case "microsoft.network/ipgroups":
        return (await import("./networking/00701-icon-service-IP-Groups.svg?raw")).default;
      case "microsoft.network/privatelinkservices":
        return (await import("./networking/01105-icon-service-Private-Link-Service.svg?raw")).default;
      case "microsoft.network/trafficmanagerprofiles":
        return (await import("./networking/10065-icon-service-Traffic-Manager-Profiles.svg?raw")).default;
      case "microsoft.network/networkwatchers":
        return (await import("./networking/10066-icon-service-Network-Watcher.svg?raw")).default;
      case "microsoft.network/routefilters":
        return (await import("./networking/10071-icon-service-Route-Filters.svg?raw")).default;
      case "microsoft.network/ddosprotectionplans":
        return (await import("./networking/10072-icon-service-DDoS-Protection-Plans.svg?raw")).default;
      case "microsoft.network/frontdoors":
        return (await import("./networking/10073-icon-service-Front-Doors.svg?raw")).default;
      case "microsoft.network/applicationgateways":
        return (await import("./networking/10076-icon-service-Application-Gateways.svg?raw")).default;
      case "microsoft.network/localnetworkgateways":
        return (await import("./networking/10077-icon-service-Local-Network-Gateways.svg?raw")).default;
      case "microsoft.network/expressroutecircuits":
        return (await import("./networking/10079-icon-service-ExpressRoute-Circuits.svg?raw")).default;
      case "microsoft.network/connections":
        return (await import("./networking/10081-icon-service-Connections.svg?raw")).default;
      case "microsoft.network/routetables":
        return (await import("./networking/10082-icon-service-Route-Tables.svg?raw")).default;
      case "microsoft.network/azurefirewalls":
        return (await import("./networking/10084-icon-service-Firewalls.svg?raw")).default;
      case "microsoft.network/serviceendpointpolicies":
        return (await import("./networking/10085-icon-service-Service-Endpoint-Policies.svg?raw")).default;
      case "microsoft.network/natgateways":
        return (await import("./networking/10310-icon-service-NAT.svg?raw")).default;
      case "microsoft.network/virtualwans":
        return (await import("./networking/10353-icon-service-Virtual-WANs.svg?raw")).default;
      case "microsoft.network/firewallpolicies":
        return (await import("./networking/10362-icon-service-Web-Application-Firewall-Policies(WAF).svg?raw")).default;
      case "microsoft.network/publicipprefixes":
        return (await import("./networking/10372-icon-service-Public-IP-Prefixes.svg?raw")).default;
      case "microsoft.network/applicationsecuritygroups":
        return (await import("./security/10244-icon-service-Application-Security-Groups.svg?raw")).default;

      // Microsoft.Resources
      case "microsoft.resources/resourcegroups":
        return (await import("./general/10007-icon-service-Resource-Groups.svg?raw")).default;

      // Microsoft.Security
      case "microsoft.keyvault/vaults":
        return (await import("./security/10245-icon-service-Key-Vaults.svg?raw")).default;

      // Microsoft.Automation
      case "microsoft.automation/automationaccounts":
        return (await import("./management/00022-icon-service-Automation-Accounts.svg?raw")).default;

      // Microsoft.Authorization
      case "Microsoft.Authorization/policyDefinitions":
        return (await import("./management/10316-icon-service-Policy.svg?raw")).default;

      // Microsoft.Subscriptions
      case "microsoft.subscription/aliases":
        return (await import("./general/10002-icon-service-Subscriptions.svg?raw")).default;

      // Microsoft.Storage
      case "microsoft.storage/storageaccounts":
        return (await import("./storage/10086-icon-service-Storage-Accounts.svg?raw")).default;
      case "microsoft.storage/storageaccounts/fileservices":
        return (await import("./general/10838-icon-service-Storage-Azure-Files.svg?raw")).default;
      case "microsoft.storage/storageaccounts/queueservices":
        return (await import("./general/10840-icon-service-Storage-Queue.svg?raw")).default;
      case "microsoft.storage/storageaccounts/tableservices":
        return (await import("./general/10841-icon-service-Table.svg?raw")).default;
      case "microsoft.recoveryservices/vaults":
        return (await import("./storage/00017-icon-service-Recovery-Services-Vaults.svg?raw")).default;
      case "microsoft.storagesync/storagesyncservices":
        return (await import("./storage/10093-icon-service-Storage-Sync-Services.svg?raw")).default;
      case "microsoft.databox/jobs":
        return (await import("./storage/10094-icon-service-Data-Box.svg?raw")).default;
      case "microsoft.databoxedge/databoxedgedevices":
        return (await import("./storage/10095-icon-service-Data-Box-Edge.svg?raw")).default;
      case "microsoft.netapp/netappaccounts":
        return (await import("./storage/10096-icon-service-Azure-NetApp-Files.svg?raw")).default;
      case "microsoft.datashare/accounts":
        return (await import("./storage/10098-icon-service-Data-Shares.svg?raw")).default;

      // Microsoft.Web
      case "microsoft.web/serverfarms":
        return (await import("./appServices/00046-icon-service-App-Service-Plans.svg?raw")).default;
      case "microsoft.web/sites":
        return (await import("./appServices/10035-icon-service-App-Services.svg?raw")).default;
      case "microsoft.web/certificates":
        return (await import("./appServices/00049-icon-service-App-Service-Certificates.svg?raw")).default;
      case "microsoft.web/hostingenvironments":
        return (await import("./appServices/10047-icon-service-App-Service-Environments.svg?raw")).default;

      // Microsoft.NotificationHubs
      case "microsoft.notificationhubs/namespaces":
        return (await import("./iot/10045-icon-service-Notification-Hubs.svg?raw")).default;

      // Microsoft.Devices
      case "microsoft.devices/iothubs":
        return (await import("./iot/10182-icon-service-IoT-Hub.svg?raw")).default;

      // Microsoft.IoTCentral
      case "microsoft.iotcentral/iotapps":
        return (await import("./iot/10184-icon-service-IoT-Central-Applications.svg?raw")).default;

      // Microsoft.TimeSeriesInsights
      case "microsoft.timeseriesinsights/environments":
        return (await import("./iot/10181-icon-service-Time-Series-Insights-Environments.svg?raw")).default;

      // Microsoft.OperationalInsights
      case "microsoft.operationalinsights/workspaces":
        return (await import("./analytics/00009-icon-service-Log-Analytics-Workspaces.svg?raw")).default;

      // Microsoft.EventHub
      case "microsoft.eventhub/namespaces":
        return (await import("./analytics/00039-icon-service-Event-Hubs.svg?raw")).default;

      case "microsoft.eventhub/clusters":
        return (await import("./analytics/10149-icon-service-Event-Hub-Clusters.svg?raw")).default;

      // Microsoft.StreamAnalytics
      case "microsoft.streamanalytics/streamingjobs":
        return (await import("./analytics/00042-icon-service-Stream-Analytics-Jobs.svg?raw")).default;

      // Microsoft.Synapse
      case "microsoft.synapse/workspaces":
        return (await import("./analytics/00606-icon-service-Azure-Synapse-Analytics.svg?raw")).default;

      // Microsoft.Databricks
      case "microsoft.databricks/workspaces":
        return (await import("./analytics/10787-icon-service-Azure-Databricks.svg?raw")).default;

      // Microsoft.BotService
      case "microsoft.botservice/botservices":
        return (await import("./ai/10165-icon-service-Bot-Services.svg?raw")).default;

      // Microsoft.CognitiveServices
      case "microsoft.cognitiveservices/accounts":
        return (await import("./ai/10162-icon-service-Cognitive-Services.svg?raw")).default;

      // Microsoft.MachineLearning
      case "microsoft.machinelearning/workspaces":
        return (await import("./ai/10167-icon-service-Machine-Learning-Studio-Workspaces.svg?raw")).default;

      // Microsoft.HDInsight
      case "microsoft.hdinsight/clusters":
        return (await import("./analytics/10142-icon-service-HD-Insight-Clusters.svg?raw")).default;

      // Microsoft.AnalysisServices
      case "microsoft.analysisservices/servers":
        return (await import("./analytics/10148-icon-service-Analysis-Services.svg?raw")).default;

      // microsoft.insights
      case "microsoft.insights/components":
        return (await import("./devops/00012-icon-service-Application-Insights.svg?raw")).default;

      // Microsoft.DevTestLab
      case "microsoft.devtestlab/labs":
        return (await import("./devops/10264-icon-service-DevTest-Labs.svg?raw")).default;

      // Microsoft.AAD
      case "microsoft.aad/domainservices":
        return (await import("./identity/10222-icon-service-Azure-AD-Domain-Services.svg?raw")).default;

      // Microsoft.Logic
      case "microsoft.logic/workflows":
        return (await import("./iot/10201-icon-service-Logic-Apps.svg?raw")).default;

      // Microsoft.AzureActiveDirectory
      case "microsoft.azureactivedirectory/b2cdirectories":
        return (await import("./identity/10228-icon-service-Azure-AD-B2C.svg?raw")).default;

      // Microsoft.ManagedIdentity
      case "microsoft.managedidentity/identities":
        return (await import("./identity/10227-icon-service-Managed-Identities.svg?raw")).default;

      // Microsoft.LabServices
      case "microsoft.labservices/labaccounts":
        return (await import("./devops/10265-icon-service-Lab-Services.svg?raw")).default;

      // Microsoft.ApiManagement
      case "microsoft.apimanagement/service":
        return (await import("./appServices/10042-icon-service-API-Management-Services.svg?raw")).default;

      // Microsoft.ServiceBus
      case "microsoft.servicebus/namespaces":
        return (await import("./general/10836-icon-service-Service-Bus.svg?raw")).default;

      // Microsoft.ContainerInstance
      case "microsoft.containerinstance/containergroups":
        return (await import("./containers/10104-icon-service-Container-Instances.svg?raw")).default;

      // Microsoft.ContainerRegistry
      case "microsoft.containerregistry/registries":
        return (await import("./containers/10105-icon-service-Container-Registries.svg?raw")).default;

      // Microsoft.App
      case "microsoft.app/containerapps":
        return (await import("./containers/02884-icon-service-Worker-Container-App.svg?raw")).default;

      case "microsoft.app/managedenvironments":
        return (await import("./containers/02989-icon-service-Container-App-Environments.svg?raw")).default;

      // Microsoft.Cdn
      case "microsoft.cdn/service":
        return (await import("./appServices/00056-icon-service-CDN-Profiles.svg?raw")).default;

      default:
        return (await import("./custom/resource.svg?raw")).default;
    }
  }
}
