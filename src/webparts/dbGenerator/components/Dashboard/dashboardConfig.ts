import { IDashboardConfig, IThemeConfig } from "./IDashboardProps";

// Default Theme Configuration
export const DEFAULT_THEME_CONFIG: IThemeConfig = {
  primaryColor: "#007BFF",
  secondaryColor: "#6C757D",
  accentColor: "#28A745",
  backgroundColor: "#F8F9FA",
  textColor: "#212529",
  borderColor: "#DEE2E6",
};

// Example Dashboard Configuration - CUSTOMIZE FOR YOUR LISTS
export const DASHBOARD_CONFIG: IDashboardConfig = {
  listName: "YourListName", // Replace with actual list name
  siteUrl: "", // Optional - leave empty for current site
  columns: [
    {
      fieldName: "ID",
      displayName: "ID",
      type: "number",
      visible: false,
      filterable: false,
      searchable: false,
      sortable: true,
      width: "60px",
    },
    {
      fieldName: "Title",
      displayName: "Title",
      type: "text",
      visible: true,
      filterable: true,
      searchable: true,
      sortable: true,
      width: "250px",
      required: true,
      maxLength: 255,
    },
    {
      fieldName: "Status",
      displayName: "Status",
      type: "choice",
      visible: true,
      filterable: true,
      searchable: false,
      sortable: true,
      width: "120px",
      choices: ["Active", "Inactive", "Pending"],
    },
    {
      fieldName: "Description",
      displayName: "Description",
      type: "text",
      visible: true,
      filterable: false,
      searchable: true,
      sortable: false,
      width: "300px",
      maxLength: 1000,
    },
    {
      fieldName: "Created",
      displayName: "Created Date",
      type: "date",
      visible: true,
      filterable: true,
      searchable: false,
      sortable: true,
      width: "150px",
      format: "date-time",
    },
    {
      fieldName: "Modified",
      displayName: "Modified Date",
      type: "date",
      visible: false,
      filterable: true,
      searchable: false,
      sortable: true,
      width: "150px",
      format: "date-time",
    },
    {
      fieldName: "Author",
      displayName: "Created By",
      type: "person",
      visible: true,
      filterable: true,
      searchable: false,
      sortable: true,
      width: "150px",
    },
  ],
  commonFilters: ["Status", "Created", "Author"], // Shows in quick filter bar
  searchableFields: ["Title", "Description"], // Search across these fields
  itemsPerPage: 10,
  theme: DEFAULT_THEME_CONFIG,
  enableAddForm: true,
  enableEditForm: true,
  enableDeleteForm: true,
  enableColumnSelector: true,
  enableExport: false, // Can be enabled later
};

// Function to get column config by field name
export const getColumnConfig = (
  fieldName: string,
  config: IDashboardConfig,
) => {
  return config.columns.find((col) => col.fieldName === fieldName);
};

// Function to get visible columns only
export const getVisibleColumns = (config: IDashboardConfig) => {
  return config.columns.filter((col) => col.visible);
};

// Function to get filterable columns
export const getFilterableColumns = (config: IDashboardConfig) => {
  return config.columns.filter((col) => col.filterable);
};

// Function to get searchable columns
export const getSearchableColumns = (config: IDashboardConfig) => {
  return config.columns.filter((col) => col.searchable);
};
