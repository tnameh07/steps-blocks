import { useState, useCallback, useEffect } from "react";

const EditModel = ({ editPath, editData, setStepsBlocksData, setShowEditModal, setEditData }) => {
  const [localEditData, setLocalEditData] = useState(editData);
  const [isLoading, setIsLoading] = useState(false);

  const handleFieldChange = useCallback((fieldKey, newValue) => {
    setLocalEditData(prev => ({ ...prev, [fieldKey]: newValue }));
  }, [editData]);

  const handleSave = () => {
    if (!localEditData) return;
    setIsLoading(true);

    try {
      // Update parent state
      setStepsBlocksData(prev => ({
        ...prev,
        blocks: {
          ...prev.blocks,
          [editPath]: localEditData
        }
      }));

      setEditData(localEditData);
      setShowEditModal(false);
    } catch (error) {
      console.log('Error saving changes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setLocalEditData(editData);
  }, [editData]);

  // Helper to determine if a field should be disabled
  const isFieldDisabled = (fieldKey) => {
    if (fieldKey === "id" || fieldKey === "key") return true;
    if (
      localEditData.type === "group" &&
      (fieldKey === "options" || fieldKey === "children")
    ) return true;
    return false;
  };

  return (
   <div
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
  }}
>
  <div
    style={{
      background: "#fff",
      padding: 24,
      borderRadius: 10,
      width: "50%",
      maxHeight: "80vh",
      overflowY: "auto",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
    }}
  >
    <h3 style={{ marginBottom: 20 }}>Edit Field</h3>

    <form>
      {Object.entries(localEditData).map(([key, value]) => (
        <div
          key={key}
          style={{
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16
          }}
        >
          <label
            htmlFor={key}
            style={{ flex: "0 0 100px", fontWeight: "500" }}
          >
            {key}
          </label>
          <input
            id={key}
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(key, e.target.value)}
            disabled={isFieldDisabled(key)}
            style={{
              flex: 1,
              padding: 8,
              borderRadius: 4,
              border: "1px solid #ccc",
              backgroundColor: isFieldDisabled(key) ? "#f0f0f0" : "#fff",
              color: isFieldDisabled(key) ? "#888" : "#000"
            }}
          />
        </div>
      ))}
    </form>

    <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
      <button
        disabled={isLoading}
        onClick={handleSave}
        style={{
          padding: "8px 16px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: isLoading ? "not-allowed" : "pointer"
        }}
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </button>

      <button
        onClick={() => setShowEditModal(false)}
        style={{
          padding: "8px 16px",
          backgroundColor: "#f5f5f5",
          color: "#333",
          border: "1px solid #ccc",
          borderRadius: 4,
          cursor: "pointer"
        }}
      >
        Close
      </button>
    </div>
  </div>
</div>

  );
};

export default EditModel;
