import * as React from "react";
import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { IColumnSelectorProps, IColumnConfig } from "./IDashboardProps";

const ColumnSelector: React.FC<
  IColumnSelectorProps & { visible: boolean; onHide: () => void }
> = (props) => {
  const [columns, setColumns] = useState<IColumnConfig[]>([...props.columns]);

  useEffect(() => {
    if (props.columns) {
      setColumns([...props.columns]);
    }
  }, [props.columns]);

  const handleToggleColumn = (fieldName: string) => {
    setColumns(
      columns.map((col) =>
        col.fieldName === fieldName ? { ...col, visible: !col.visible } : col,
      ),
    );
  };

  const handleSelectAll = () => {
    setColumns(columns.map((col) => ({ ...col, visible: true })));
  };

  const handleDeselectAll = () => {
    setColumns(
      columns.map((col) => {
        if (col.fieldName === "ID") return col;
        return { ...col, visible: false };
      }),
    );
  };

  const handleApply = () => {
    props.onColumnChange(columns);
  };

  const handleReset = () => {
    setColumns([...props.columns]);
  };

  const visibleCount = columns.filter((c) => c.visible).length;

  return (
    <Dialog
      visible={props.visible}
      onHide={props.onHide}
      header="Select Columns"
      modal
      style={{ width: "90vw", maxWidth: "400px" }}
    >
      <div style={{ padding: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
            paddingBottom: "12px",
            borderBottom: "1px solid #dee2e6",
          }}
        >
          <p style={{ margin: 0, fontWeight: 600 }}>
            Visible Columns: {visibleCount}
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handleSelectAll}
              style={{
                padding: "4px 8px",
                fontSize: "12px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              All
            </button>
            <button
              onClick={handleDeselectAll}
              style={{
                padding: "4px 8px",
                fontSize: "12px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              None
            </button>
          </div>
        </div>

        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {columns.map((col) => (
            <div
              key={col.fieldName}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 0",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <input
                type="checkbox"
                checked={col.visible}
                onChange={() => handleToggleColumn(col.fieldName)}
                disabled={col.fieldName === "ID" || col.fieldName === "Title"}
                style={{
                  marginRight: "12px",
                  width: "16px",
                  height: "16px",
                  cursor: "pointer",
                }}
              />
              <label
                style={{
                  flex: 1,
                  cursor:
                    col.fieldName === "ID" || col.fieldName === "Title"
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    col.fieldName === "ID" || col.fieldName === "Title"
                      ? 0.6
                      : 1,
                  margin: 0,
                  fontSize: "14px",
                }}
              >
                {col.displayName}
                {(col.fieldName === "ID" || col.fieldName === "Title") && (
                  <span style={{ fontSize: "12px", color: "#999", marginLeft: "8px" }}>
                    (Required)
                  </span>
                )}
              </label>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "flex-end",
            marginTop: "20px",
            paddingTop: "16px",
            borderTop: "1px solid #dee2e6",
          }}
        >
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
            Apply
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ColumnSelector;
