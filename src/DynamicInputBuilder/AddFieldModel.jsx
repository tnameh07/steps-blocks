import React, { useRef , useState} from "react";

const AddFieldModal = ({ parentId, setShowAddModal, setStepsBlocksData }) => {
  
  const idRef = useRef();
  const keyRef = useRef();
  const labelRef = useRef();
  const typeRef = useRef();

  const [inputType, setInputType] = useState("static"); // ✅ state for inputType
  const [sourceCode, setSourceCode] = useState(""); // ✅ state for sourceCode editor

  const AddhandleSave = () => {
    console.log("Parent:",parentId)
    const id = idRef.current.value.trim();
    const key = keyRef.current.value.trim();
    const label = labelRef.current.value.trim();
    const type = typeRef.current.value;

    
    if (!id || !key || !label || !type) return;

    const newField = {
      id,
      key,
      label,
      type,
      required: false,
      description: '',
      placeholder: '',
      visibleIf: null,
      disabledIf: null,
    };

    //to include depends on array in object
    // ✅ Include inputType if not static
    if (inputType === "dynamic") {
      newField.inputType = "dynamic";
      newField.sourceCode = sourceCode;

      // ✅ extract dependsOn keys from sourceCode
      function extractDependsOnKeysFromCode(codeString) {
        const regex = /inputData\.([a-zA-Z0-9_]+)/g;
        const matches = [...codeString.matchAll(regex)];
        const keys = matches.map(match => match[1]);
        return Array.from(new Set(keys));
      }

      newField.dependsOn = extractDependsOnKeysFromCode(sourceCode);
      console.log("DependsOn:",newField.dependsOn);
    } else {
      newField.inputType = "static"; // optional but consistent
    }


    console.log("New Field:",newField,parentId);
    setStepsBlocksData(prev => {
      const updated = { ...prev };
      
      // Determine final ID based on parentId
      const finalId = parentId === "root" ? id : `${parentId}.${id}`;
      console.log("Field:",finalId);
      // 1️⃣ Add the new field to blocks with correct finalId
      updated.blocks[finalId] = { ...newField};

      // 2️⃣ Add the field ID to parent's children only if parent is not root
      if (parentId !== "root" && updated.blocks[parentId]) {
        if (!Array.isArray(updated.blocks[parentId].children)) {
          updated.blocks[parentId].children = [];
        }
        updated.blocks[parentId].children.push(finalId);
      }

      // 3️⃣ Add the field ID to steps[parentId]
      if (!updated.steps[parentId]) {
        updated.steps[parentId] = [];
      }
      updated.steps[parentId].push(finalId);

      return updated;
    });


    setShowAddModal(false);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.4)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 9999
    }}>
      <div style={{ background: '#fff', padding: 20, borderRadius: 8, width: '400px' }}>
        <h3>Add Field</h3>

        {['id', 'key', 'label'].map((field, i) => (
          <div key={field} style={{ marginBottom: 10 }}>
            <label>{field}</label>
            <input ref={field === 'id' ? idRef : field === 'key' ? keyRef : labelRef}
              style={{ width: '100%', padding: 6 }} />
          </div>
        ))}

        <div style={{ marginBottom: 10 }}>
          <label>Type</label>
          <select ref={typeRef} style={{ width: '100%', padding: 6 }}>
            <option value="text">Text</option>
            <option value="radio">Radio</option>
            <option value="checkbox">Checkbox</option>
            <option value="select">Select</option>
          </select>
        </div>

        {/* ✅ NEW: Input Type */}
        <div style={{ marginBottom: 10 }}>
          <label>Input Type</label>
          <select
            value={inputType}
            onChange={(e) => setInputType(e.target.value)}
            style={{ width: '100%', padding: 6 }}
          >
            <option value="static">Static</option>
            <option value="dynamic">Dynamic</option>
          </select>
        </div>

        {/* ✅ NEW: Show based on InputType */}
        {inputType === "dynamic" ? (
          <div style={{ marginBottom: 10 }}>
            <label>Source Code</label>
            <textarea
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              placeholder="return [{ value: 'a', label: 'A' }]"
              style={{
                width: '100%',
                padding: 6,
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                minHeight: 100
              }}
            />
          </div>
        ) : (
          <div style={{ marginBottom: 10 }}>
            <label>Options</label>
            <p style={{ fontSize: '0.9em', color: '#666' }}>Option editing will be available in Edit screen.</p>
          </div>
        )}

        <button onClick={AddhandleSave}>Save</button>
        <button onClick={() => setShowAddModal(false)} style={{ marginLeft: 8 }}>Cancel</button>
      </div>
    </div>
  );
};

export default AddFieldModal;
