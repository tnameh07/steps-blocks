import React, { useState, useEffect } from 'react';

// Sub-component for the 'Add' mode form
const AddFieldForm = ({ formData, handleChange }) => (
  <>
    <div>
      <label style={styles.label}>ID</label>
      <input
        type="text"
        name="id"
        value={formData.id || ''}
        onChange={handleChange}
        style={styles.input}
        placeholder="e.g., first_name"
      />
    </div>
    <div>
      <label style={styles.label}>Key</label>
      <input
        type="text"
        name="key"
        value={formData.key || ''}
        onChange={handleChange}
        style={styles.input}
        placeholder="e.g., firstName"
      />
    </div>
    <div>
      <label style={styles.label}>Label</label>
      <input
        type="text"
        name="label"
        value={formData.label || ''}
        onChange={handleChange}
        style={styles.input}
        placeholder="e.g., First Name"
      />
    </div>
    <div>
      <label style={styles.label}>Type</label>
      <select name="type" value={formData.type || 'text'} onChange={handleChange} style={styles.input}>
        <option value="text">Text</option>
        <option value="radio">Radio</option>
        <option value="checkbox">Checkbox</option>
        <option value="select">Select</option>
        <option value="group">Group</option>
        <option value="section">Section</option>
      </select>
    </div>
  </>
);

// Sub-component for the 'Edit' mode form
const EditFieldForm = ({ formData, handleChange, handleComplexChange }) => (
  <>
    {Object.keys(formData).map(key => {
      const value = formData[key];
      const isIdDisabled = (key === 'id' || key === 'key');

      // Render a checkbox for boolean values
      if (typeof value === 'boolean') {
        return (
          <div key={key}>
            <label style={{...styles.label, display: 'flex', alignItems: 'center', textTransform: 'capitalize'}}>
              <input
                type="checkbox"
                name={key}
                checked={!!value}
                onChange={handleChange}
                style={{ marginRight: 8 }}
              />
              {key}
            </label>
          </div>
        );
      }
      
      // Render a textarea for objects/arrays (e.g., options, children)
      if (typeof value === 'object' && value !== null) {
        return (
          <div key={key}>
            <label style={styles.label}>{key}</label>
            <textarea
              name={key}
              value={JSON.stringify(value, null, 2)}
              onChange={handleComplexChange}
              style={{...styles.input, height: '100px', fontFamily: 'monospace'}}
            />
          </div>
        );
      }

      // Default to a standard text input
      return (
        <div key={key}>
          <label style={styles.label}>{key}</label>
          <input
            type="text"
            name={key}
            value={value || ''}
            onChange={handleChange}
            disabled={isIdDisabled}
            style={{ ...styles.input, backgroundColor: isIdDisabled ? '#f0f0f0' : '#fff' }}
          />
        </div>
      );
    })}
  </>
);


const FieldModal = ({ isOpen, onClose, onSave, initialData, mode }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData(initialData || {});
  }, [isOpen, initialData]);

  if (!isOpen) {
    return null;
  }
console.log("initialData, mode  : ",initialData, mode )
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // Handles changes in textareas meant for JSON content
  const handleComplexChange = (e) => {
    const { name, value } = e.target;
    try {
      const parsedValue = JSON.parse(value);
      setFormData(prev => ({ ...prev, [name]: parsedValue }));
    } catch (error) {
      console.error("Invalid JSON format:", error);
    }
  };

  const handleSave = () => {
    if (mode === 'add' && (!formData.id || !formData.key || !formData.label)) {
      alert('ID, Key, and Label are required for new fields.');
      return;
    }
    onSave(formData);
  };

  const title = mode === 'add' ? 'Add New Field' : 'Edit Field';

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.header}>{title}</h3>
        
        <div style={styles.formContainer}>
          {mode === 'add' ? (
            <AddFieldForm formData={formData} handleChange={handleChange} />
          ) : (
            <EditFieldForm formData={formData} handleChange={handleChange} handleComplexChange={handleComplexChange} />
          )}
        </div>

        <div style={styles.footer}>
          <button onClick={onClose} style={styles.buttonSecondary}>Cancel</button>
          <button onClick={handleSave} style={styles.buttonPrimary}>Save</button>
        </div>
      </div>
    </div>
  );
};

// Basic styling
const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    background: '#fff', padding: 24, borderRadius: 8, width: '450px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  },
  header: { marginTop: 0, marginBottom: 20 },
  formContainer: { display: 'flex', flexDirection: 'column', gap: 15, maxHeight: '60vh', overflowY: 'auto' },
  label: { display: 'block', marginBottom: 5, fontWeight: '500', textTransform: 'capitalize' },
  input: { width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc', boxSizing: 'border-box' },
  footer: { marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 },
  buttonPrimary: { padding: '10px 20px', borderRadius: 4, border: 'none', backgroundColor: '#007bff', color: '#fff', cursor: 'pointer' },
  buttonSecondary: { padding: '10px 20px', borderRadius: 4, border: '1px solid #ccc', backgroundColor: '#fff', cursor: 'pointer' }
};

export default FieldModal;
