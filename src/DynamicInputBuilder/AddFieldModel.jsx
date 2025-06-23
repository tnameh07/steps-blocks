import React, { useRef } from "react";

const AddFieldModal = ({ parentId, setShowAddModal, setStepsBlocksData }) => {
  console.log("I am a parent",parentId);
  const idRef = useRef();
  const keyRef = useRef();
  const labelRef = useRef();
  const typeRef = useRef();

  const handleSave = () => {
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
    console.log(newField);
    setStepsBlocksData(prev => {
      const updated = { ...prev };
      updated.blocks[id] = newField;

      if (!updated.steps[parentId]) {
        updated.steps[parentId] = [];
      }
      updated.steps[parentId].push(id);

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

        <button onClick={handleSave}>Save</button>
        <button onClick={() => setShowAddModal(false)} style={{ marginLeft: 8 }}>Cancel</button>
      </div>
    </div>
  );
};

export default AddFieldModal;
