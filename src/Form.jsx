import React, { useEffect, useState, useCallback } from 'react';
import { defaultInputGroups, creatingBlock, creatingFirstSequence, changeSequence } from './utility.js';
import RenderGroup from './DynamicInputBuilder/RenderGroup.jsx';
import FieldModal from './DynamicInputBuilder/FieldModal.jsx';

const Form = () => {
  const [jsonText, setJsonText] = useState(JSON.stringify(defaultInputGroups, null, 2));
  const [inputGroups, setInputGroups] = useState(defaultInputGroups);
  const [stepsBlocksData, setStepsBlocksData] = useState(null);
  const [jsonError, setJsonError] = useState(null);
  const [formValues, setFormValues] = useState({}); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ mode: 'add', data: null, parentId: null });

  const handleJsonChange = (e) => {
    const value = e.target.value;
    setJsonText(value);
    try {
      const parsed = JSON.parse(value);
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

  const handleOpenModal = useCallback((mode, id, parentId) => {
    console.log("mode, id", mode, id, parentId)
    const fieldId = (parentId != 'root') ?`${parentId}.${id}`:`${id}`;
    console.log("fieldId", fieldId)
    if (mode === 'edit') {
      console.log("fieldId", fieldId)
      setModalConfig({ mode: 'edit', data: stepsBlocksData.blocks[fieldId], parentId: null });
    } else { 
      const newFieldTemplate = { id: '', key: '', label: '', type: 'text', required: false, description: '', placeholder: '' };
      setModalConfig({ mode: 'add', data: newFieldTemplate, parentId: fieldId });
    }
    setIsModalOpen(true);
  }, [stepsBlocksData]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalConfig({ mode: 'add', data: null, parentId: null }); 
  };

  const handleSaveModal = (formData) => {
    const { mode, parentId } = modalConfig;
    const fieldId = formData.id;

    if (mode === 'add') {
      if (!fieldId || !formData.key) {
        alert('Field ID and Key are required.');
        return;
      }
      if (stepsBlocksData.blocks[fieldId]) {
        alert(`Field with ID "${fieldId}" already exists.`);
        return;
      }

      setStepsBlocksData(prev => {
        const updated = { ...prev };
        updated.blocks[fieldId] = formData; 
        if (prev.steps[parentId]) {
          updated.steps[parentId] = [...prev.steps[parentId], fieldId]; 
        } else {
          updated.steps[parentId] = [fieldId];
        }
        return updated;
      });

    } else { 
      setStepsBlocksData(prev => ({
        ...prev,
        blocks: {
          ...prev.blocks,
          [fieldId]: formData
        }
      }));
    }

    handleCloseModal();
  };

  useEffect(()=>{
    const blocks = creatingBlock(inputGroups, "");
    const sequence = creatingFirstSequence(inputGroups);

    const finaljsona = { 
      title: "Dynamic Form Preview",
      steps: sequence,
      blocks: blocks }
    setStepsBlocksData(finaljsona);
    console.log("FINAL JSON:", finaljsona);

  }, [inputGroups]);

  function previewForm(stepsBlocksData) {
    if (!stepsBlocksData || !stepsBlocksData.steps || !stepsBlocksData.blocks) return null;

    function renderField(element, index) {

      switch (element.type) {
        case 'text':
          return (
            <div key={element.id} style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>
                {element.label} {element.required && <span style={{ color: 'red' }}>*</span>}
              </label>
              <input
                type={element.inputType || 'text'} 
                placeholder={element.placeholder || element.label}
                required={element.required}
                value={formValues[element.key] || ''}
                onChange={(e) => handleInputChange(e, element.key)}
                style={{ width: '70%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
              />  
                  <button onClick={() =>{changeSequence(stepsBlocksData, parent_id, index, element.id)}}>↑</button>
              <button onClick={() => {}}>↓</button>
              {element.description && <p style={{ fontSize: '0.8em', color: '#888', marginTop: 4 }}>r</p>}
            </div>
          );
        case 'radio':
          return (
            <div key={element.id} style={{ marginBottom: 12 }}>
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
                 <button onClick={() => {}}>↑</button>
                 <button onClick={() => {}}>↓</button>
              </div>
            </div>
          );
        case 'checkbox':
          return (
            <div key={element.id} style={{ marginBottom: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  name={element.key}
                  checked={!!formValues[element.key]}
                  onChange={(e) => handleInputChange(e, element.key)}
                />
                {element.label} {element.required && <span style={{ color: 'red' }}>*</span>}
              </label>
              <button onClick={() => {}}>↑</button>
              <button onClick={() => {}}>↓</button>
            </div>
          );
        case 'select':
          return (
            <div key={element.id} style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>
                {element.label} {element.required && <span style={{ color: 'red' }}>*</span>}
              </label>
              <select
                value={formValues[element.key] || ''}
                onChange={(e) => handleInputChange(e, element.key)}
                style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
              >
                <option value="">Select an option</option>
                {element.options?.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button onClick={() => {}}>↑</button>
              <button onClick={() => {}}>↓</button>
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

    function renderGroup(elementId, index, parentId) {
      console.log("elementId :" , elementId)
      const element = stepsBlocksData.blocks[elementId];

      return (
        <RenderGroup
          key={elementId}
          elementId={elementId}
          parentId={parentId}
          currentIndex={index}
          stepsBlocksData={stepsBlocksData}
          formValues={formValues}
          handleInputChange={handleInputChange}
          handleChangeSequence={() => {}} 
          checkCondition={() => true} 
          handleOpenModal={handleOpenModal}
        />
      );
    }

    return (
      <form>
        {stepsBlocksData.steps.root.map((rootId, index) => renderGroup(rootId, index, 'root'))}
      </form>
    );
  }

  return (
    <>
      <FieldModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveModal}
        initialData={modalConfig.data}
        mode={modalConfig.mode}
      />
      <div style={{ display: 'flex', height: '80vh', gap: 24 }}>
      {/* JSON Editor Block */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3>JSON Editor (inputGroups)</h3>
        <textarea
          value={jsonText}
          onChange={handleJsonChange}
          style={{ flex: 1, width: '100%', minHeight: 0, fontFamily: 'monospace', fontSize: 14, border: jsonError ? '2px solid red' : '1px solid #ccc', borderRadius: 4, padding: 8 }}
        />
        {jsonError && <div style={{ color: 'red', marginTop: 4 }}>Invalid JSON: {jsonError}</div>}
      </div>
      {/* Preview Form Block */}
      {
        stepsBlocksData ?  <div style={{ flex: 1, background: '#fafafa', borderRadius: 8, padding: 16, overflowY: 'auto', boxShadow: '0 2px 8px #0001' }}>
        <h3>Preview Form ({stepsBlocksData.title})</h3>
        {previewForm(stepsBlocksData)}
        <h4 style={{ marginTop: 24 }}>Transformed Steps & Blocks</h4>
        <pre style={{ background: '#f0f8ff', padding: 8, borderRadius: 4, fontSize: 12, maxHeight: 200, overflowY: 'auto' }}>
          {JSON.stringify(stepsBlocksData, null, 2)}
        </pre>
      </div> : <p>Loading...</p>
      }
     
      </div>
    </>
  );
};

export default Form
//   const result = {};
//   for (const group of groups) {
//     let fullKey;
//     if(parentKey){
//         fullKey = `${parentKey}.${group.id}`;
//     }else{
//         fullKey = group.id;
//     }
//     // Base map of the group
//     const map = {
//       id: group.id,
//       label: group.label,
//       type: group.type,
//       key: group.key,
//       description: group.description,
//       placeholder: group.placeholder,
//       required: group.required,
//       validation: group.validation,
//       options: group.options,
//       inputType: group.inputType,
//       visibleIf: group.visibleIf,
//       defaultValue: group.defaultValue
//     };
//     // Handle children recursively
//     if (group.children) {
//       map.children = group.children.map(function(child){
//         return `${fullKey}.${child.id}`;  //  Store full paths
//       });
//       result[fullKey] = map;
//       // Recursively flatten the children
//       Object.assign(result, creatingBlock(group.children, fullKey));
//     } else {
//       result[fullKey] = map;
//     }
//   }
//   return result;
// }

// function creatingFirstSequence(groups){
//     let sequence = {};
//     let root = [];
//     root = groups.map(function(child){
//         return child.id;
//     })
//     sequence.root = root;
//     //recursively adding children
//      function collectChildren(groups, parentKey) {
//         for (const group of groups) {
//             const fullKey = parentKey ? `${parentKey}.${group.id}` : group.id;
//             if (group.children) {
//                 sequence[fullKey] = group.children.map(child => `${fullKey}.${child.id}`);
//                 collectChildren(group.children, fullKey);
//             }
//         }
//     }
//     collectChildren(groups, "");
//     return sequence;
// }

// function changeSequence(stepsBlocksData, group_id, newIndex, field_id) {
//   const stepsGroup = stepsBlocksData.steps[group_id] ? stepsBlocksData.steps[group_id] : null;
//   const blocksGroup = stepsBlocksData.blocks[group_id] ? stepsBlocksData.blocks[group_id] : null;

//   console.log(stepsGroup , "   :  " ,blocksGroup)
//   if (!stepsGroup || !blocksGroup || !blocksGroup.children) {
//     console.error("Invalid group ID or group structure.");
//     return;
//   }

//   const currentIndex = stepsGroup.indexOf(field_id);
// console.log(currentIndex)
//   if (currentIndex === -1) {
//     console.error("Field not found in the specified group.");
//     return;
//   }

//   // Remove field_id from current position
//   stepsGroup.splice(currentIndex, 1);
//   blocksGroup.children.splice(currentIndex, 1);

//   // Clamp newIndex to valid range
//   const clampedIndex = Math.min(Math.max(newIndex, 0), stepsGroup.length);

//   // Insert field_id at newIndex
//   stepsGroup.splice(clampedIndex, 0, field_id);
//   blocksGroup.children.splice(clampedIndex, 0, field_id);

//   console.log(`Updated order in group "${group_id}":`, stepsGroup);
// }

// changeSequence("personal-info", 0, "personal-info.email");