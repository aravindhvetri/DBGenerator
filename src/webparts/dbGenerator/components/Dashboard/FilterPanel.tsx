import * as React from "react";
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { IFilterPanelProps, IFilterValue, IColumnConfig } from "./IDashboardProps";

const FilterPanel: React.FC<IFilterPanelProps & { visible: boolean; onHide: () => void }> = (props) => {
  const [filters, setFilters] = useState<IFilterValue[]>([]);

  const handleAddFilter = () => {
    const newFilter: IFilterValue = {
      fieldName: props.columns[0]?.fieldName || "",
      operator: "eq",
      value: "",
    };
    setFilters([...filters, newFilter]);
  };

  const handleRemoveFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleFilterChange = (
    index: number,
    field: keyof IFilterValue,
    value: any,
  ) => {
    setFilters(
      filters.map((filter, i) =>
        i === index ? { ...filter, [field]: value } : filter,
      ),
    );
  };

  const handleApply = () => {
    const validFilters = filters.filter((f) => f.fieldName && f.value);
    props.onApplyFilter(validFilters);
  };

  const handleReset = () => {
    setFilters([]);
    props.onApplyFilter([]);
  };

  const renderFilterValue = (
    filter: IFilterValue,
    index: number,
    column: IColumnConfig | undefined,
  ) => {
    const columnType = column?.type || "text";

    switch (columnType) {
      case "choice":
        return (
          <select
            value={filter.value}
            onChange={(e) =>
              handleFilterChange(index, "value", e.target.value)
            }
            style={{
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #dee2e6",
            }}
          >
            <option value="">-- Select --</option>
            {column?.choices?.map((choice) => (
              <option key={choice} value={choice}>
                {choice}
              </option>
            ))}
          </select>
        );

      case "date":
        return (
          <input
            type="date"
            value={filter.value}
            onChange={(e) =>
              handleFilterChange(index, "value", e.target.value)
            }
            style={{
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #dee2e6",
            }}
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={filter.value}
            onChange={(e) =>
              handleFilterChange(index, "value", e.target.value)
            }
            placeholder="Enter value"
            style={{
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #dee2e6",
            }}
          />
        );

      default:
        return (
          <input
            type="text"
            value={filter.value}
            onChange={(e) =>
              handleFilterChange(index, "value", e.target.value)
            }
            placeholder="Enter value"
            style={{
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #dee2e6",
            }}
          />
        );
    }
  };

  const filterableColumns = props.columns.filter((c) => c.filterable);

  return (
    <Dialog
      visible={props.visible}
      onHide={props.onHide}
      header="Apply Filters"
      modal
      style={{ width: "90vw", maxWidth: "500px" }}
    >
      <div style={{ padding: "20px" }}>
        {filters.length === 0 ? (
          <p style={{ textAlign: "center", color: "#999", marginBottom: "20px" }}>
            No filters applied. Click "Add Filter" to create one.
          </p>
        ) : (
          <div style={{ marginBottom: "20px" }}>
            {filters.map((filter, index) => {
              const column = props.columns.find((c) => c.fieldName === filter.fieldName);
              return (
                <div
                  key={index}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr auto",
                    gap: "12px",
                    marginBottom: "12px",
                    alignItems: "center",
                    padding: "12px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "4px",
                  }}
                >
                  <select
                    value={filter.fieldName}
                    onChange={(e) =>
                      handleFilterChange(index, "fieldName", e.target.value)
                    }
                    style={{
                      padding: "6px",
                      borderRadius: "4px",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    <option value="">-- Select Field --</option>
                    {filterableColumns.map((col) => (
                      <option key={col.fieldName} value={col.fieldName}>
                        {col.displayName}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filter.operator}
                    onChange={(e) =>
                      handleFilterChange(index, "operator", e.target.value)
                    }
                    style={{
                      padding: "6px",
                      borderRadius: "4px",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    <option value="eq">Equals</option>
                    <option value="ne">Not Equals</option>
                    <option value="gt">Greater Than</option>
                    <option value="lt">Less Than</option>
                    <option value="ge">Greater Or Equal</option>
                    <option value="le">Less Or Equal</option>
                    <option value="substringof">Contains</option>
                  </select>

                  {renderFilterValue(filter, index, column)}

                  <button
                    onClick={() => handleRemoveFilter(index)}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    <i className="pi pi-trash" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
          <button
            onClick={handleAddFilter}
            style={{
              flex: 1,
              padding: "8px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            <i className="pi pi-plus" style={{ marginRight: "8px" }} />
            Add Filter
          </button>
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <button
            onClick={handleReset}
            style={{
              padding: "8px 16px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            style={{
              padding: "8px 16px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default FilterPanel;
