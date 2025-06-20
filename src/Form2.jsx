import React, { useEffect, useRef, useState } from 'react'
import { defaultInputGroups, creatingBlock, creatingFirstSequence, changeSequence, reconstructInputGroups } from './utility.js';
import EditModel from './EditModel.jsx';

const Form = () => {
  const [jsonText, setJsonText] = useState(JSON.stringify(defaultInputGroups, null, 2));
  const [inputGroups, setInputGroups] = useState(defaultInputGroups);
  const [stepsBlocksData, setStepsBlocksData] = useState(null);
  const [jsonError, setJsonError] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [editData, setEditData] = useState(null);
  const [editPath, setEditPath] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const isUpdatingFromJson = useRef(false);
  const isUpdatingFromGui = useRef(false);

  const handleJsonChange = (e) => {
    const value = e.target.value;
    setJsonText(value);
    try {
      const parsed = JSON.parse(value);
      isUpdatingFromJson.current = true; 
      setInputGroups(parsed);
      setJsonError(null);
    } catch (err) {
      setJsonError(err.message);
    }
  };

  const handleInputChange = (e, fieldKey) => {
    const { type, name, value, checked } = e.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [fieldKey]: type === 'checkbox' ? checked : value
    }));
  };
  const handleEdit = (id) => {
    const block = stepsBlocksData.blocks[id];
    setEditData(block);
    setEditPath(id);
    setShowEditModal(true);
  };
  useEffect(() => {
    const blocks = creatingBlock(inputGroups, "");
    const sequence = creatingFirstSequence(inputGroups);

    const finaljsona = {
      title: "Dynamic Form Preview",
      steps: sequence,
      blocks: blocks
    };
    setStepsBlocksData(finaljsona);
    console.log("FINAL JSON:", finaljsona);
    isUpdatingFromJson.current = false; 
  }, [inputGroups]);
  
  useEffect(() => {
    if(stepsBlocksData && !isUpdatingFromJson.current && isUpdatingFromGui.current){
      const newInputGroups = reconstructInputGroups(stepsBlocksData);
      setInputGroups(newInputGroups);
      setJsonText(JSON.stringify(newInputGroups, null, 2));
      isUpdatingFromGui.current = false;
    }
  }, [ stepsBlocksData]);

  useEffect(() => {
    if(editData ){
      const newInputGroups = reconstructInputGroups(stepsBlocksData);
      setInputGroups(newInputGroups);
      setJsonText(JSON.stringify(newInputGroups, null, 2));
      isUpdatingFromGui.current = true;
    }
  }, [editData]);


  const handleChangeSequence = (stepsBlocksData, setStepsBlocksData, group_id, field_id, direction) => {
    isUpdatingFromGui.current = true; // Set flag before GUI changes
    changeSequence(stepsBlocksData, setStepsBlocksData, group_id, field_id, direction);
  };

  function renderField(element, parentId, currentIndex) {
    const fieldId = `${parentId}.${element.id}`;
    const canMoveUp = currentIndex > 0;
    const canMoveDown = currentIndex < (stepsBlocksData.steps[parentId]?.length - 1);

    switch (element.type) {
      case 'text':
        return (
          <div key={element.id} id={fieldId} className={`field-${element.type}`} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>
              {element.label} {element.required && <span style={{ color: 'red' }}>*</span>}
            </label>
            <input
              type={element.inputType || 'text'}
              placeholder={element.placeholder || element.label}
              required={element.required}
              value={formValues[element.key] || ''}
              onChange={(e) => handleInputChange(e, element.key)}
              style={{ width: 'auto', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
            />
            <button type="button" onClick={() => handleEdit(fieldId)}>Edit</button>
            <button
              type='button'
              onClick={() => handleChangeSequence(stepsBlocksData, setStepsBlocksData, parentId, fieldId, 'up')}
              disabled={!canMoveUp}
            >
              ↑
            </button>
            <button
              type='button'
              onClick={() => handleChangeSequence(stepsBlocksData, setStepsBlocksData, parentId, fieldId, 'down')}
              disabled={!canMoveDown}
            >
              ↓
            </button>
            {element.description && <p style={{ fontSize: '0.8em', color: '#888', marginTop: 4 }}>{element.description}</p>}
          </div>
        );

      case 'radio':
        return (
          <div key={element.id} id={fieldId} className={`field-${element.type}`} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>
              {element.label} {element.required && <span style={{ color: 'red' }}>*</span>}
            </label>
            <div style={{ display: 'flex', gap: 16 }}>
              {element.options?.map(opt => (
                <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <input
                    type="radio"
                    name={element.key}
                    value={opt.value}
                    checked={formValues[element.key] === opt.value}
                    onChange={(e) => handleInputChange(e, element.key)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            <button
              type='button'
              onClick={() => handleChangeSequence(stepsBlocksData, setStepsBlocksData, parentId, fieldId, 'up')}
              disabled={!canMoveUp}
            >
              ↑
            </button>
            <button
              type='button'
              onClick={() => handleChangeSequence(stepsBlocksData, setStepsBlocksData, parentId, fieldId, 'down')}
              disabled={!canMoveDown}
            >
              ↓
            </button>
          </div>
        );

      case 'checkbox':
        return (
          <div key={element.id} id={fieldId} className={`field-${element.type}`} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                name={element.key}
                checked={!!formValues[element.key]}
                onChange={(e) => handleInputChange(e, element.key)}
              />
              {element.label} {element.required && <span style={{ color: 'red' }}>*</span>}
            </label>
            <button
              type='button'
              onClick={() => handleChangeSequence(stepsBlocksData, setStepsBlocksData, parentId, fieldId, 'up')}
              disabled={!canMoveUp}
            >
              ↑
            </button>
            <button
              type='button'
              onClick={() => handleChangeSequence(stepsBlocksData, setStepsBlocksData, parentId, fieldId, 'down')}
              disabled={!canMoveDown}
            >
              ↓
            </button>
          </div>
        );

      case 'select':
        return (
          <div key={element.id} id={fieldId} className={`field-${element.type}`} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>
              {element.label} {element.required && <span style={{ color: 'red' }}>*</span>}
            </label>
            <select
              value={formValues[element.key] || ''}
              onChange={(e) => handleInputChange(e, element.key)}
              style={{ width: 'auto', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
            >
              <option value="">Select an option</option>
              {element.options?.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              type='button'
              onClick={() => handleChangeSequence(stepsBlocksData, setStepsBlocksData, parentId, fieldId, 'up')}
              disabled={!canMoveUp}
            >
              ↑
            </button>
            <button
              type='button'
              onClick={() => handleChangeSequence(stepsBlocksData, setStepsBlocksData, parentId, fieldId, 'down')}
              disabled={!canMoveDown}
            >
              ↓
            </button>
          </div>
        );

      default:
        return (
          <div key={element.id} style={{ marginBottom: 12, color: 'orange' }}>
            Unsupported field type: {element.type} (ID: {element.id})
          </div>
        );
    }
  }

  function renderGroup(elementId, parentId, currentIndex) {
    const element = stepsBlocksData.blocks[elementId];
    if (!element) {
      return null;
    }
    const groupId = `${parentId}-${element.id}`;
    const canMoveUp = currentIndex > 0;
    const canMoveDown = currentIndex < (stepsBlocksData.steps[parentId]?.length - 1);

    // If it's a field (not a container), render it directly
    if (["text", "radio", "checkbox", "select"].includes(element.type)) {
      return renderField(element, parentId, currentIndex);
    }
    if (["section", "group", "repeater"].includes(element.type)) {
      return (
        <div
          key={element.id}
          id={groupId}
          className={`container-${element.type}`}
          style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 16 }}
        >
          <label style={{ fontWeight: 'bold' }}>
            {element.label}
            <button
              type='button'
              onClick={() => handleChangeSequence(stepsBlocksData, setStepsBlocksData, parentId, elementId, 'up')}
              disabled={!canMoveUp}
              style={{ marginLeft: 10 }}
            >
              ↑
            </button>
            <button
              type='button'
              onClick={() => handleChangeSequence(stepsBlocksData, setStepsBlocksData, parentId, elementId, 'down')}
              disabled={!canMoveDown}
            >
              ↓
            </button>
          </label>
          <div style={{ marginTop: 4 }}>
            {element.children && element.children.map((childId, childIndex) =>
              renderGroup(childId, elementId, childIndex)
            )}
          </div>
        </div>
      );
    }
    return null;
  }
  function previewForm(stepsBlocksData) {
    if (!stepsBlocksData || !stepsBlocksData.steps || !stepsBlocksData.blocks) return null;
    return (
      <form id="preview-form" className="dynamic-form">
        {stepsBlocksData.steps.root.map((rootId, index) =>
          renderGroup(rootId, 'root', index)
        )}
      </form>
    );
  }

  return (
    <div style={{ display: 'flex', height: '80vh', gap: 24 }}>
      {/* JSON Editor Block */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3>JSON Editor (inputGroups)</h3>
        <textarea
          value={jsonText}
          onChange={handleJsonChange}
          style={{
            flex: 1,
            width: '100%',
            minHeight: 0,
            fontFamily: 'monospace',
            fontSize: 14,
            border: jsonError ? '2px solid red' : '1px solid #ccc',
            borderRadius: 4,
            padding: 8
          }}
        />
        {jsonError && <div style={{ color: 'red', marginTop: 4 }}>Invalid JSON: {jsonError}</div>}
      </div>

      {/* Preview Form Block */}
      {stepsBlocksData ? (
        <div style={{
          flex: 1,
          background: '#fafafa',
          borderRadius: 8,
          padding: 16,
          overflowY: 'auto',
          boxShadow: '0 2px 8px #0001'
        }}>
          <h3>Preview Form ({stepsBlocksData.title})</h3>
          {previewForm(stepsBlocksData)}

          <h4 style={{ marginTop: 24 }}>Transformed Steps & Blocks</h4>
          <pre style={{
            background: '#f0f8ff',
            padding: 8,
            borderRadius: 4,
            fontSize: 12,
            maxHeight: 200,
            overflowY: 'auto'
          }}>
            {JSON.stringify(stepsBlocksData, null, 2)}
          </pre>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      {/* Edit Modal */}
      {showEditModal &&
        <EditModel
          editPath={editPath}
          setEditData={setEditData}
          editData={editData}
          setStepsBlocksData={setStepsBlocksData}
          setShowEditModal={setShowEditModal} />}
    </div>
  );
};

export default Form;