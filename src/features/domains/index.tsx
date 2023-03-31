import { DomainDetailsDto, DomainImportDto } from "lib/network/swagger-client";
import { useRequestContext } from "providers/request-provider";
import {
  defaultFilterOrderColumn,
  defaultFilterOrderDirection,
  modelName,
  domainListPageBreadcrumb,
  searchLabel,
} from "./constants";
import { DataList } from "components/data-list";
import { GridColDef } from "@mui/x-data-grid";
import { CoreModule } from "lib/router";
import { dataListBreadcrumbLinks } from "utils/constants";

export const Domains = () => {
  const { client } = useRequestContext();

  const getDomainList = async (query: string) => {
    try {
      const result = await client.api.domainsList({
        query: query,
      });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const getDomainExportUrlAsync = async (query: string) => {
    const { url } = await client.api.domainsExportList({
      query: query,
    });
    return url;
  };

  const handleDomainImport = async (data: DomainImportDto[]) => {
    await client.api.domainsImportCreate(data);
  };

  const columns: GridColDef<DomainDetailsDto>[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 2,
    },
    {
      field: "title",
      headerName: "Title",
      flex: 2,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
    },
    {
      field: "url",
      headerName: "Url",
      flex: 2,
    },
    {
      field: "dnsCheck",
      headerName: "Dns Check",
      flex: 2,
    },
    {
      field: "free",
      headerName: "Free",
      flex: 2,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 2,
      valueGetter: (params) => {
        const createdAt = params.value as string;
        const formattedDate = new Date(createdAt).toLocaleDateString();
        return formattedDate;
      },
    },
  ];

  return (
    <DataList
      modelName={modelName}
      columns={columns}
      dataListBreadcrumbLinks={dataListBreadcrumbLinks}
      currentBreadcrumb={domainListPageBreadcrumb}
      defaultFilterOrderColumn={defaultFilterOrderColumn}
      defaultFilterOrderDirection={defaultFilterOrderDirection}
      searchBarLabel={searchLabel}
      endRoute={CoreModule.orders}
      getModelDataList={getDomainList}
      getExportUrl={getDomainExportUrlAsync}
      dataImportCreate={handleDomainImport}
      initialGridState={{
        columns: { columnVisibilityModel: { dnsCheck: false, free: false } },
        sorting: {
          sortModel: [{ field: defaultFilterOrderColumn, sort: defaultFilterOrderDirection }],
        },
      }}
    ></DataList>
  );
};