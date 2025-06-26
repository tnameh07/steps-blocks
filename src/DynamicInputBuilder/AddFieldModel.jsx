import React, { useRef } from "react";

const AddFieldModal = ({ parentId, setShowAddModal, setStepsBlocksData }) => {
  
  const idRef = useRef();
  const keyRef = useRef();
  const labelRef = useRef();
  const typeRef = useRef();

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
    setStepsBlocksData(prev => {
      const updated = { ...prev };
      
      // Determine final ID based on parentId
      const finalId = parentId === "root" ? id : `${parentId}.${id}`;

      // 1️⃣ Add the new field to blocks with correct finalId
      updated.blocks[finalId] = { ...newField, id: finalId };

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

        <button onClick={AddhandleSave}>Save</button>
        <button onClick={() => setShowAddModal(false)} style={{ marginLeft: 8 }}>Cancel</button>
      </div>
    </div>
  );
};

export default AddFieldModal;
