import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IColumnConfig {
  fieldName: string;
  displayName: string;
  type: "text" | "number" | "date" | "choice" | "person" | "lookup" | "boolean";
  visible: boolean;
  filterable: boolean;
  searchable: boolean;
  sortable: boolean;
  width?: string;
  required?: boolean;
  choices?: string[]; // For choice field
  maxLength?: number;
  format?: "date-only" | "date-time"; // For date fields
  isLookup?: boolean;
  lookupListName?: string;
  lookupDisplayField?: string;
}

export interface IDashboardConfig {
  listName: string;
  siteUrl?: string;
  columns: IColumnConfig[];
  commonFilters?: string[]; // Field names to show as common filters
  searchableFields?: string[]; // Field names to search on
  itemsPerPage?: number;
  theme?: IThemeConfig;
  enableAddForm?: boolean;
  enableEditForm?: boolean;
  enableDeleteForm?: boolean;
  enableColumnSelector?: boolean;
  enableExport?: boolean;
}

export interface IThemeConfig {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  customCSS?: string;
}

export interface IDashboardProps {
  context: WebPartContext;
  config: any;
  onItemSelect?: (item: any) => void;
  onRefresh?: () => void;
}

export interface IFilterValue {
  fieldName: string;
  operator: "eq" | "ne" | "gt" | "lt" | "ge" | "le" | "substringof";
  value: any;
}

export interface IDynamicFormProps {
  visible: boolean;
  isEdit: boolean;
  item?: any;
  columns: IColumnConfig[];
  onHide: () => void;
  onSubmit: (data: any) => Promise<void>;
  loading?: boolean;
}

export interface IColumnSelectorProps {
  columns: IColumnConfig[];
  onColumnChange: (columns: IColumnConfig[]) => void;
}

export interface IFilterPanelProps {
  columns: IColumnConfig[];
  commonFilters: string[];
  onApplyFilter: (filters: IFilterValue[]) => void;
  loading?: boolean;
}
