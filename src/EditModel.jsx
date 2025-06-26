import { useState, useCallback, useEffect } from "react";

const EditModel = ({ editPath, editData, setStepsBlocksData, stepsBlocksData,setShowEditModal, setEditData, allFieldIds }) => {
    const [localEditData, setLocalEditData] = useState(editData);
    const [isLoading, setIsLoading] = useState(false);
    const [isOptionsCodeMode, setIsOptionsCodeMode] = useState(false); // State for options code mode

    // Available field types
    const fieldTypes = ["group", "text", "select", "radio", "checkbox", "multichoice"];
    // Input types for the inputType field
    const inputTypes = ["static", "dynamic"];

    const handleFieldChange = useCallback((fieldKey, newValue) => {
        setLocalEditData(prev => {
            const newLocalEditData = { ...prev, [fieldKey]: newValue };

            // Special handling for type change:
            // If type changes to something that doesn't need options, clear them
            if (fieldKey === "type") {
                if (!["select", "radio", "multichoice"].includes(newValue)) {
                    delete newLocalEditData.options;
                } else if (!newLocalEditData.options) {
                    // If type changes to something that needs options and they don't exist, initialize
                    newLocalEditData.options = [];
                }
            }

            // Special handling for inputType change:
            // If inputType changes from dynamic, clear sourceCode
            if (fieldKey === "inputType" && newValue !== "dynamic") {
                delete newLocalEditData.sourceCode;
            } else if (fieldKey === "inputType" && newValue === "dynamic" && !newLocalEditData.sourceCode) {
                 newLocalEditData.sourceCode = ""; // Initialize sourceCode if it's dynamic and not present
            }
            
            return newLocalEditData;
        });
    }, []);

    const handleOptionChange = useCallback((index, field, value) => {
        setLocalEditData(prev => {
            const newOptions = [...(prev.options || [])];
            newOptions[index] = { ...newOptions[index], [field]: value };
            return { ...prev, options: newOptions };
        });
    }, []);

    const addOption = useCallback(() => {
        setLocalEditData(prev => ({
            ...prev,
            options: [...(prev.options || []), { value: "", label: "" }]
        }));
    }, []);

    const deleteOption = useCallback((index) => {
        setLocalEditData(prev => {
            const newOptions = [...(prev.options || [])];
            newOptions.splice(index, 1);
            return { ...prev, options: newOptions };
        });
    }, []);

    const handleSave = () => {
        

        const element = stepsBlocksData.blocks[editPath];
        function extractDependsOnKeysFromCode(codeString) {
            // console.log(codeString);
        const regex = /inputData\.([a-zA-Z0-9_]+)/g;
        const matches = [...codeString.matchAll(regex)];
        const keys = matches.map(match => match[1]);
        return Array.from(new Set(keys));
        }

        const sourceCode = element.sourceCode || '';
        const visibilityCode = element.visibilityCode || '';
        const sourceKeys = extractDependsOnKeysFromCode(sourceCode);
        const visibleKeys = extractDependsOnKeysFromCode(visibilityCode);
        const dependsOn = Array.from(new Set([...sourceKeys, ...visibleKeys]));
        // console.log("Extracted Keys from sourceCode:", sourceKeys);
        // console.log("Extracted Keys from visibilitycode:", visibleKeys);
        // console.log("Combined dependsOn keys:", dependsOn);
        // ✅ Inject dependsOn into localEditData
        localEditData.dependsOn = dependsOn;
        // console.log("localEditData:",localEditData);



        if (!localEditData) return;
        setIsLoading(true);

        try {
            setStepsBlocksData(prev => {
                const newBlocks = { ...prev.blocks };
                newBlocks[editPath] = localEditData;
                return {
                    ...prev,
                    blocks: newBlocks
                };
            });

            setEditData(localEditData);
            setShowEditModal(false);
        } catch (error) {
            console.error('Error saving changes:', error);
        } finally {
            setIsLoading(false);
        }
        // console.log("stepsBlocks:",stepsBlocksData.blocks);
    };

    useEffect(() => {
        setLocalEditData(JSON.parse(JSON.stringify(editData)));
        // Reset options code mode when editData changes
        setIsOptionsCodeMode(false); 
    }, [editData]);

    const isFieldDisabled = (fieldKey) => {
        if (fieldKey === "id" || fieldKey === "key") return true;
        
        // Options and children logic
        const requiresOptions = ["select", "radio", "multichoice"].includes(localEditData.type);
        if (fieldKey === "options" && !requiresOptions) return true;
        if (fieldKey === "children" && localEditData.type !== "group") return true;
        if (fieldKey === "children" && requiresOptions) return true; // A field with options cannot have children directly.

        // Disable sourceCode if inputType is not dynamic
        if (fieldKey === "sourceCode" && localEditData.inputType !== "dynamic") return true;

        return false;
    };

    const renderInputField = (key, value) => {
        const commonProps = {
            id: key,
            style: {
                flex: 1,
                padding: 8,
                borderRadius: 4,
                border: "1px solid #ccc",
                backgroundColor: isFieldDisabled(key) ? "#f0f0f0" : "#fff",
                color: isFieldDisabled(key) ? "#888" : "#000"
            },
            disabled: isFieldDisabled(key),
            onChange: (e) => handleFieldChange(key, e.target.value)
        };

        // --- Specific Field Renderings ---

        // Type Select
        if (key === "type") {
            return (
                <select {...commonProps} value={value}>
                    {fieldTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            );
        }

        // InputType Select
        if (key === "inputType") {
            return (
                <select {...commonProps} value={value}>
                    {inputTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            );
        }

        // Required and DefaultValue as Checkbox
        if (key === "required" || key === "defaultValue") {
            if (typeof value === "boolean") {
                return (
                    <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handleFieldChange(key, e.target.checked)}
                        disabled={isFieldDisabled(key)}
                    />
                );
            }
        }

        // SourceCode for Dynamic InputType
        if (key === "sourceCode") {
            return (
                <textarea
                    {...commonProps}
                    value={value || ""} // Ensure value is not null/undefined for textarea
                    rows={10}
                    style={{ ...commonProps.style, fontFamily: "monospace", whiteSpace: "pre-wrap" }}
                />
            );
        }

        // Options editing based on type and inputType
        if (key === "options" && ["select", "radio", "multichoice"].includes(localEditData.type)) {
            const isStaticInputType = localEditData.inputType === "static";
            
            if (!isStaticInputType) {
                return <span style={{ color: "#888", flex: 1 }}>Options only editable for static inputType.</span>;
            }

            return (
                <div style={{ flex: 1 }}>
                    <button
                        type="button"
                        onClick={() => setIsOptionsCodeMode(!isOptionsCodeMode)}
                        style={{ marginBottom: 10, padding: "5px 10px", borderRadius: 4, border: "1px solid #ccc" }}
                    >
                        {isOptionsCodeMode ? "Edit Visually" : "Code Mode"}
                    </button>

                    {isOptionsCodeMode ? (
                        <textarea
                            {...commonProps}
                            value={JSON.stringify(value, null, 2)}
                            rows={8}
                            style={{ ...commonProps.style, fontFamily: "monospace", whiteSpace: "pre-wrap" }}
                            onChange={(e) => {
                                try {
                                    const parsedValue = JSON.parse(e.target.value);
                                    handleFieldChange(key, parsedValue);
                                } catch (error) {
                                    console.error(`Invalid JSON for ${key}:`, error);
                                }
                            }}
                        />
                    ) : (
                        <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', borderRadius: '4px' }}>
                            {(value || []).map((option, index) => (
                                <div key={index} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                                    <input
                                        type="text"
                                        placeholder="Value"
                                        value={option.value || ""}
                                        onChange={(e) => handleOptionChange(index, "value", e.target.value)}
                                        style={{ flex: 1, padding: 5, borderRadius: 3, border: "1px solid #ddd" }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Label"
                                        value={option.label || ""}
                                        onChange={(e) => handleOptionChange(index, "label", e.target.value)}
                                        style={{ flex: 1, padding: 5, borderRadius: 3, border: "1px solid #ddd" }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => deleteOption(index)}
                                        style={{ padding: "5px 8px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: 3 }}
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addOption}
                                style={{ padding: "5px 10px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: 4, marginTop: 10 }}
                            >
                                Add Option
                            </button>
                        </div>
                    )}
                </div>
            );
        }

        // Children as JSON string (only for group type)
        if (key === "children" && localEditData.type === "group") {
            return (
                <textarea
                    {...commonProps}
                    value={JSON.stringify(value, null, 2)}
                    rows={8}
                    style={{ ...commonProps.style, fontFamily: "monospace", whiteSpace: "pre-wrap" }}
                    onChange={(e) => {
                        try {
                            const parsedValue = JSON.parse(e.target.value);
                            handleFieldChange(key, parsedValue);
                        } catch (error) {
                            console.error(`Invalid JSON for ${key}:`, error);
                        }
                    }}
                />
            );
        }

        // Objects like 'validation', 'visibleIf', 'disabledIf' as JSON string
        if ((key === "validation" || key === "visibleIf" || key === "disabledIf") && typeof value === 'object' && value !== null) {
            return (
                <textarea
                    {...commonProps}
                    value={JSON.stringify(value, null, 2)}
                    rows={3}
                    style={{ ...commonProps.style, fontFamily: "monospace", whiteSpace: "pre-wrap" }}
                    onChange={(e) => {
                        try {
                            const parsedValue = JSON.parse(e.target.value);
                            handleFieldChange(key, parsedValue);
                        } catch (error) {
                            console.error(`Invalid JSON for ${key}:`, error);
                        }
                    }}
                />
            );
        }

        // DependsOn as Multi-Select or Text
        if (key === "dependsOn") {
            // Assuming allFieldIds prop is passed for dropdown options
            if (allFieldIds && Array.isArray(allFieldIds)) {
                return (
                    <select
                        {...commonProps}
                        multiple
                        value={Array.isArray(value) ? value : []} // Ensure value is an array for multiple select
                        onChange={(e) => handleFieldChange(key, Array.from(e.target.selectedOptions, option => option.value))}
                        style={{ ...commonProps.style, minHeight: '60px' }} // Make it taller for multiple selections
                    >
                        {allFieldIds.map(id => (
                            <option key={id} value={id}>{id}</option>
                        ))}
                    </select>
                );
            } else {
                // Fallback to text input if allFieldIds is not provided
                return (
                    <input
                        {...commonProps}
                        type="text"
                        value={Array.isArray(value) ? value.join(", ") : ""}
                        onChange={(e) => handleFieldChange(key, e.target.value.split(",").map(item => item.trim()).filter(item => item !== ''))}
                    />
                );
            }
        }
        
        // Basic text input for other fields (e.g., id, key, label, placeholder, description)
        return (
            <input
                {...commonProps}
                type="text"
                value={String(value)}
            />
        );
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
                                alignItems: ["sourceCode", "options", "children", "validation", "visibleIf", "disabledIf"].includes(key) ? "flex-start" : "center",
                                justifyContent: "space-between",
                                gap: 16
                            }}
                        >
                            <label
                                htmlFor={key}
                                style={{ flex: "0 0 100px", fontWeight: "500", paddingTop: (["sourceCode", "options", "children", "validation", "visibleIf", "disabledIf"].includes(key) && (key !== "options" || isOptionsCodeMode)) ? "8px" : "0" }}
                            >
                                {key}
                            </label>
                            {renderInputField(key, value)}
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