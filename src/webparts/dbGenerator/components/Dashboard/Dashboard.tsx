import * as React from "react";
import { useRef, useState, useEffect, useCallback } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import styles from "./Dashboard.module.scss";
import { IDashboardProps, IColumnConfig, IFilterValue } from "./IDashboardProps";
import DynamicForm from "./DynamicForm";
import FilterPanel from "./FilterPanel";
import ColumnSelector from "./ColumnSelector";
import SPServices from "../../../../External/CommonServices/SPServices";
import { getVisibleColumns } from "./dashboardConfig";

const Dashboard: React.FC<IDashboardProps> = (props) => {
  const toastRef = useRef<Toast>(null);

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [columns, setColumns] = useState<IColumnConfig[]>([...props.config.columns]);
  const [filters, setFilters] = useState<IFilterValue[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(props.config.itemsPerPage || 10);
  const [error, setError] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
       console.log(pageNumber);
      const params: any = {
        Listname: props.config.listName,
        Topcount: 5000, // Get all for client-side filtering/paging
      };

      // Add search filter
      if (searchTerm) {
        const searchableFields = columns
          .filter((col) => col.searchable)
          .map((col) => col.fieldName);

        params.Filter = searchableFields.map((field) => ({
          FilterKey: field,
          Operator: "substringof",
          FilterValue: searchTerm,
        }));
        params.FilterCondition = "or";
      }

      // Add applied filters
      if (filters.length > 0) {
        const existingFilters = params.Filter || [];
        params.Filter = [
          ...existingFilters,
          ...filters.map((f) => ({
            FilterKey: f.fieldName,
            Operator: f.operator,
            FilterValue: f.value,
          })),
        ];
        params.FilterCondition = "and";
      }

      const data = await SPServices.SPReadItems(params);

      setItems(data || []);
      setTotalRecords((data || []).length);
      setLoading(false);
    } catch (error) {
      console.error("Error loading items:", error);
      setError("Failed to load items. Please try again.");
      setLoading(false);
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load dashboard items",
      });
    }
  }, [props.config.listName, searchTerm, columns, filters]);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  const handleAddClick = () => {
    setShowForm(true);
    setIsEditMode(false);
    setSelectedItem(null);
  };

  const handleEditClick = (item: any) => {
    setShowForm(true);
    setIsEditMode(true);
    setSelectedItem(item);
  };

  const confirmDelete = async (item: any) => {
    try {
      setLoading(true);

      await SPServices.SPDeleteItem({
        Listname: props.config.listName,
        ID: item.ID,
      });

      toastRef.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Item deleted successfully",
      });

      await loadItems();
    } catch (error) {
      console.error("Error deleting item:", error);
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete item",
      });
      setLoading(false);
    }
  };

  const handleDeleteClick = (item: any) => {
    confirmDialog({
      message: "Are you sure you want to delete this item?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      accept: () => void confirmDelete(item),
      reject: () => undefined,
    });
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      setLoading(true);

      if (isEditMode) {
        await SPServices.SPUpdateItem({
          Listname: props.config.listName,
          ID: formData.ID,
          RequestJSON: formData,
        });

        toastRef.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Item updated successfully",
        });
      } else {
        await SPServices.SPAddItem({
          Listname: props.config.listName,
          RequestJSON: formData,
        });

        toastRef.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Item created successfully",
        });
      }

      setShowForm(false);
      await loadItems();
    } catch (error) {
      console.error("Error submitting form:", error);
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to save item",
      });
      setLoading(false);
    }
  };

  const handleFormHide = () => {
    setShowForm(false);
    setSelectedItem(null);
  };

  const handleFilterPanelHide = () => {
    setShowFilterPanel(false);
  };

  const handleApplyFilters = (newFilters: IFilterValue[]) => {
    setFilters(newFilters);
    setPageNumber(1);
    setShowFilterPanel(false);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPageNumber(1);
  };

  const handleColumnChange = (newColumns: IColumnConfig[]) => {
    setColumns(newColumns);
    setShowColumnSelector(false);
  };

  const handleRefresh = () => {
    void loadItems();
  };

  const renderActionButtons = (rowData: any) => {
    return (
      <div className={styles.actionButtons}>
        {props.config.enableEditForm && (
          <button
            className={styles.editBtn}
            onClick={() => handleEditClick(rowData)}
            title="Edit"
          >
            <i className="pi pi-pencil" />
          </button>
        )}
        {props.config.enableDeleteForm && (
          <button
            className={styles.deleteBtn}
            onClick={() => handleDeleteClick(rowData)}
            title="Delete"
          >
            <i className="pi pi-trash" />
          </button>
        )}
      </div>
    );
  };

  const renderColumnData = (rowData: any, columnConfig: IColumnConfig) => {
    const value = rowData[columnConfig.fieldName];

    switch (columnConfig.type) {
      case "date":
        return value ? new Date(value).toLocaleDateString() : "N/A";
      case "boolean":
        return value ? "Yes" : "No";
      case "person":
        return value?.Title || value?.DisplayName || value || "N/A";
      case "lookup":
        return value?.Title || value || "N/A";
      default:
        return value || "N/A";
    }
  };

  const visibleColumns = getVisibleColumns({
    ...props.config,
    columns,
  });

  return (
    <div className={styles.dashboardContainer}>
      <Toast ref={toastRef} position="top-right" />
      <ConfirmDialog />

      {/* Header */}
      <div className={styles.dashboardHeader}>
        <h1>{props.config.listName} Dashboard</h1>
        <div className={styles.headerActions}>
          {props.config.enableAddForm && (
            <button
              onClick={handleAddClick}
              style={{
                backgroundColor: props.config.theme?.primaryColor,
                color: "white",
              }}
            >
              <i className="pi pi-plus" />
              Add New
            </button>
          )}
          <button
            onClick={handleRefresh}
            style={{
              backgroundColor: props.config.theme?.secondaryColor,
              color: "white",
            }}
            disabled={loading}
            title="Refresh"
          >
            <i
              className={`pi ${loading ? "pi-spin pi-spinner" : "pi-refresh"}`}
            />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>{error}</p>
        </div>
      )}

      {/* Toolbar */}
      <div className={styles.toolbarContainer}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            disabled={loading}
          />
        </div>

        <button
          className={styles.filterButton}
          onClick={() => setShowFilterPanel(!showFilterPanel)}
        >
          <i className="pi pi-filter" />
          Filters
        </button>

        {props.config.enableColumnSelector && (
          <button
            className={styles.columnSelector}
            onClick={() => setShowColumnSelector(!showColumnSelector)}
          >
            <i className="pi pi-list" />
            Columns
          </button>
        )}
      </div>

      {/* Data Table */}
      {loading && items.length === 0 ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p>Loading items...</p>
        </div>
      ) : items.length === 0 ? (
        <div className={styles.emptyMessage}>
          <i className="pi pi-inbox" style={{ fontSize: "64px" }} />
          <p>No items found</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <DataTable
            value={items}
            paginator
            rows={pageSize}
            totalRecords={totalRecords}
            lazy={false}
            scrollable
            loading={loading}
          >
            {visibleColumns.map((col) => (
              <Column
                key={col.fieldName}
                field={col.fieldName}
                header={col.displayName}
                sortable={col.sortable}
                body={(rowData) => renderColumnData(rowData, col)}
                style={{ width: col.width || "auto" }}
              />
            ))}

            {(props.config.enableEditForm || props.config.enableDeleteForm) && (
              <Column
                header="Actions"
                body={(rowData) => renderActionButtons(rowData)}
                style={{ width: "120px", textAlign: "center" }}
              />
            )}
          </DataTable>
        </div>
      )}

      {/* Dynamic Form Dialog */}
      {props.config.enableAddForm || props.config.enableEditForm ? (
        <DynamicForm
          visible={showForm}
          isEdit={isEditMode}
          item={selectedItem}
          columns={columns}
          onHide={handleFormHide}
          onSubmit={handleFormSubmit}
          loading={loading}
        />
      ) : null}

      {/* Filter Panel Dialog */}
      <FilterPanel
        visible={showFilterPanel}
        columns={columns}
        commonFilters={props.config.commonFilters || []}
        onApplyFilter={handleApplyFilters}
        onHide={handleFilterPanelHide}
        loading={loading}
      />

      {/* Column Selector Dialog */}
      {props.config.enableColumnSelector && (
        <ColumnSelector
          visible={showColumnSelector}
          columns={columns}
          onColumnChange={handleColumnChange}
          onHide={() => setShowColumnSelector(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
