import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { Dialog } from "primereact/dialog";
import styles from "./DynamicForm.module.scss";
import { IDynamicFormProps, IColumnConfig } from "./IDashboardProps";

const DynamicForm: React.FC<IDynamicFormProps> = (props) => {
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const initializeFormData = useCallback(() => {
    const initialData = props.item || {};
    const newFormData: { [key: string]: any } = {};
    const newErrors: { [key: string]: string } = {};

    if (props.columns && Array.isArray(props.columns)) {
      props.columns.forEach((col) => {
        newFormData[col.fieldName] = initialData[col.fieldName] || "";
        newErrors[col.fieldName] = "";
      });
    }

    setFormData(newFormData);
    setErrors(newErrors);
    setTouched({});
  }, [props.item, props.columns]);

  useEffect(() => {
    if (props.visible) {
      initializeFormData();
    }
  }, [props.visible, props.item, props.isEdit, initializeFormData]);

  const validateField = (column: IColumnConfig, value: any): string => {
    if (column.required && !value) {
      return `${column.displayName} is required`;
    }

    if (column.type === "text" && column.maxLength && value) {
      if (value.toString().length > column.maxLength) {
        return `${column.displayName} must not exceed ${column.maxLength} characters`;
      }
    }

    if (column.type === "number" && value) {
      if (isNaN(value)) {
        return `${column.displayName} must be a number`;
      }
    }

    if (column.type === "date" && value) {
      if (isNaN(new Date(value).getTime())) {
        return `${column.displayName} must be a valid date`;
      }
    }

    return "";
  };

  const handleFieldChange = (
    fieldName: string,
    value: any,
    column: IColumnConfig,
  ) => {
    const error = validateField(column, value);

    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));

    setTouched((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
  };

  const handleBlur = (fieldName: string) => {
    setTouched((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    if (!props.columns || !Array.isArray(props.columns)) {
      return isValid;
    }

    props.columns.forEach((col) => {
      const error = validateField(col, formData[col.fieldName]);
      if (error) {
        newErrors[col.fieldName] = error;
        isValid = false;
      }
    });

    if (!isValid) {
      setErrors(newErrors);
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      ...(props.isEdit && { ID: props.item.ID }),
    };

    await props.onSubmit(submitData);
  };

  const renderFormField = (column: IColumnConfig) => {
    if (
      column.fieldName === "ID" ||
      column.fieldName === "Created" ||
      column.fieldName === "Modified" ||
      column.fieldName === "Author"
    ) {
      return null;
    }

    const value = formData[column.fieldName];
    const error = errors[column.fieldName];
    const isTouched = touched[column.fieldName];
    const showError = isTouched && error;

    switch (column.type) {
      case "choice":
        return (
          <div key={column.fieldName} className={styles.formGroup}>
            <label>
              {column.displayName}
              {column.required && <span className={styles.required}>*</span>}
            </label>
            <select
              value={value}
              onChange={(e) =>
                handleFieldChange(column.fieldName, e.target.value, column)
              }
              onBlur={() => handleBlur(column.fieldName)}
              className={showError ? "error" : ""}
              disabled={props.loading}
            >
              <option value="">-- Select --</option>
              {column.choices?.map((choice) => (
                <option key={choice} value={choice}>
                  {choice}
                </option>
              ))}
            </select>
            {showError && (
              <span className={styles.errorMessage}>{error}</span>
            )}
          </div>
        );

      case "date":
        return (
          <div key={column.fieldName} className={styles.formGroup}>
            <label>
              {column.displayName}
              {column.required && <span className={styles.required}>*</span>}
            </label>
            <input
              type={
                column.format === "date-time" ? "datetime-local" : "date"
              }
              value={
                value ? new Date(value).toISOString().slice(0, 16) : ""
              }
              onChange={(e) =>
                handleFieldChange(column.fieldName, e.target.value, column)
              }
              onBlur={() => handleBlur(column.fieldName)}
              className={showError ? "error" : ""}
              disabled={props.loading}
            />
            {showError && (
              <span className={styles.errorMessage}>{error}</span>
            )}
          </div>
        );

      case "number":
        return (
          <div key={column.fieldName} className={styles.formGroup}>
            <label>
              {column.displayName}
              {column.required && <span className={styles.required}>*</span>}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) =>
                handleFieldChange(column.fieldName, e.target.value, column)
              }
              onBlur={() => handleBlur(column.fieldName)}
              className={showError ? "error" : ""}
              disabled={props.loading}
            />
            {showError && (
              <span className={styles.errorMessage}>{error}</span>
            )}
          </div>
        );

      case "boolean":
        return (
          <div key={column.fieldName} className={styles.formGroup}>
            <label>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) =>
                  handleFieldChange(
                    column.fieldName,
                    e.target.checked,
                    column,
                  )
                }
                disabled={props.loading}
              />
              {column.displayName}
              {column.required && <span className={styles.required}>*</span>}
            </label>
          </div>
        );

      default: {
        const isTextarea = column.maxLength && column.maxLength > 255;

        return (
          <div key={column.fieldName} className={styles.formGroup}>
            <label>
              {column.displayName}
              {column.required && <span className={styles.required}>*</span>}
            </label>
            {isTextarea ? (
              <>
                <textarea
                  value={value}
                  onChange={(e) =>
                    handleFieldChange(
                      column.fieldName,
                      e.target.value,
                      column,
                    )
                  }
                  onBlur={() => handleBlur(column.fieldName)}
                  className={showError ? "error" : ""}
                  disabled={props.loading}
                  maxLength={column.maxLength}
                  placeholder={`Enter ${column.displayName.toLowerCase()}`}
                />
                {column.maxLength && (
                  <span className={styles.charCount}>
                    {(value || "").length}/{column.maxLength}
                  </span>
                )}
              </>
            ) : (
              <input
                type="text"
                value={value}
                onChange={(e) =>
                  handleFieldChange(
                    column.fieldName,
                    e.target.value,
                    column,
                  )
                }
                onBlur={() => handleBlur(column.fieldName)}
                className={showError ? "error" : ""}
                disabled={props.loading}
                maxLength={column.maxLength}
                placeholder={`Enter ${column.displayName.toLowerCase()}`}
              />
            )}
            {showError && (
              <span className={styles.errorMessage}>{error}</span>
            )}
            {column.maxLength && !isTextarea && (
              <span className={styles.fieldHint}>
                Max {column.maxLength} characters
              </span>
            )}
          </div>
        );
      }
    }
  };(props.columns || [])

  const formColumns = props.columns.filter(
    (col) =>
      col.fieldName !== "ID" &&
      col.fieldName !== "Created" &&
      col.fieldName !== "Modified" &&
      col.fieldName !== "Author",
  );

  return (
    <Dialog
      visible={props.visible}
      onHide={props.onHide}
      header={props.isEdit ? "Edit Item" : "Add New Item"}
      modal
      style={{ width: "90vw", maxWidth: "600px" }}
      className={styles.formContainer}
    >
      <div className={styles.formContainer}>
        {formColumns.map((col) => renderFormField(col))}

        <div className={styles.formActions}>
          <button
            className={styles.cancelBtn}
            onClick={props.onHide}
            disabled={props.loading}
          >
            Cancel
          </button>
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={props.loading}
          >
            {props.loading ? (
              <>
                <i className="pi pi-spin pi-spinner" />
                Saving...
              </>
            ) : (
              <>
                <i className="pi pi-check" />
                {props.isEdit ? "Update" : "Create"}
              </>
            )}
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default DynamicForm;
