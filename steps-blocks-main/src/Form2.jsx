import React, { useEffect, useState } from 'react'
import { defaultInputGroups, creatingBlock, creatingFirstSequence ,reconstructInputGroups} from './utility.js';


const Form = () => {
    const [jsonText, setJsonText] = useState(JSON.stringify(defaultInputGroups, null, 2));
    const [inputGroups, setInputGroups] = useState(defaultInputGroups);
    const [stepsBlocksData, setStepsBlocksData] = useState(null);
    const [jsonError, setJsonError] = useState(null);
    const [formValues, setFormValues] = useState({});
    const [StepBlocksEdit, setStepBlocksEdit] = useState(null);
     const [editData, setEditData] = useState(null); // Add this if not already present
      const [editPath, setEditPath] = useState(null); // Add this if not already present
      // const [showEditModal, setShowEditModal] = useState(false); // Add this too
  const [showEditModal, setShowEditModal] = useState(false);
    // Parse JSON editor input
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
  console.log("showEditModal :", showEditModal)
    // Handle input changes for form fields
    const handleInputChange = (e, fieldKey) => {
      const { type, name, value, checked } = e.target;
      setFormValues(prevValues => ({
        ...prevValues,
        [fieldKey]: type === 'checkbox' ? checked : value
      }));
    };
  
    const changeSequence = (group_id, field_id, direction) => {
        if (!stepsBlocksData || !stepsBlocksData.steps[group_id]) return;
      
        const stepsGroup = stepsBlocksData.steps[group_id];
        const blocksGroup = stepsBlocksData.blocks[group_id];
        const currentIndex = stepsGroup.indexOf(field_id);
      
        let targetIndex;
        if (direction === 'up') targetIndex = currentIndex - 1;
        else if (direction === 'down') targetIndex = currentIndex + 1;
        else return;
      
        if (targetIndex < 0 || targetIndex >= stepsGroup.length) return;
      
        // Immutably copy arrays
        const newStepsGroup = [...stepsGroup];
        const newBlocksChildren = blocksGroup?.children ? [...blocksGroup.children] : null;
      
        // Swap in steps
        [newStepsGroup[currentIndex], newStepsGroup[targetIndex]] = [newStepsGroup[targetIndex], newStepsGroup[currentIndex]];
        // Swap in blocks.children if present
        if (newBlocksChildren) {
          [newBlocksChildren[currentIndex], newBlocksChildren[targetIndex]] = [newBlocksChildren[targetIndex], newBlocksChildren[currentIndex]];
        }
      
        // Build new state
        setStepsBlocksData(prev => ({
          ...prev,
          steps: {
            ...prev.steps,
            [group_id]: newStepsGroup,
          },
          blocks: {
            ...prev.blocks,
            [group_id]: {
              ...prev.blocks[group_id],
              ...(newBlocksChildren ? { children: newBlocksChildren } : {}),
            },
          },
        }));
      };
      
      const handleEdit = (id) => {
        console.log("Inside handle edit",id);
      const block = stepsBlocksData.blocks[id]; // Get the block definition using ID
      // console.log("Editing field:", block[id]);
    
      // Now open your modal/form with block’s data prefilled
      setEditData(block);      // Store this in a state
      setEditPath(id);         // Keep track of full path or id
      setShowEditModal(true);  // Open modal
    };

    const handleFieldChange = (fieldKey, newValue) => {
      console.log("dsdsdsdf",newValue);
      console.log("dsdsdsdf",fieldKey);
    setEditData(prev => ({
      ...prev,
      [fieldKey]: newValue
    }));
  };
  console.log("editPath :", editPath , "editData :", editData)
    const handleSave = () => {
  console.log("editPath :", editPath, " ", editData);
  if (!editData) return;

  // 🔧 Manually build updated blocks BEFORE setting state
  const updatedBlocks = {
    ...stepsBlocksData.blocks,
    [editPath]: editData,
  };

  // // ✅ Use updated blocks immediately for reconstruction
  // const newInputGroups = reconstructInputGroups(updatedBlocks, stepsBlocksData.steps);
  // console.log("updated", newInputGroups);

  // //  Reflect changes in JSON editor
  // setInputGroups(newInputGroups);
  // setJsonText(JSON.stringify(newInputGroups, null, 2)); 

  // ✅ THEN set the new blocks to state
  setStepsBlocksData(prev => ({
    ...prev,
    blocks: updatedBlocks
  }));
  console.log(" setStepBlocksEdit(true) ,",  StepBlocksEdit)
 setStepBlocksEdit(true)
  setShowEditModal(false);
 
};
console.log("StepBlocksEdit :", StepBlocksEdit)
    
useEffect(()=>{
console.log("trigger StepBlocksEdit" ,StepBlocksEdit)
    // ✅ Use updated blocks immediately for reconstruction
    if(StepBlocksEdit){
      console.log("trigger 1 ")
const newInputGroups = reconstructInputGroups(stepsBlocksData);
  console.log("updated", newInputGroups);

  //  Reflect changes in JSON editor
  console.log("newInputGroups :", newInputGroups)
  setInputGroups(newInputGroups);
  setJsonText(JSON.stringify(newInputGroups, null, 2)); 
  setStepBlocksEdit(false)
    }
  
console.log("trigger")
},[setStepBlocksEdit])
    
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
    }, [inputGroups]);

  
    function previewForm(stepsBlocksData) {
      if (!stepsBlocksData || !stepsBlocksData.steps || !stepsBlocksData.blocks) return null;
  
      // IMPROVED: Render individual input fields with parent context
      function renderField(element, parentId, currentIndex) {
        const fieldId = `${parentId}-${element.id}`;
        const canMoveUp = currentIndex > 0;
        const canMoveDown = currentIndex < (stepsBlocksData.steps[parentId]?.length - 1);
  
        switch (element.type) {
          case 'text':
            return (
              <div key={element.id} id={fieldId} className={`field-${element.type}`} style={{ marginBottom: 12 , display: 'flex', alignItems: 'center', gap: 8 }}>
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
                <button type="button" onClick={() => handleEdit(element.id)}>Edit</button>
                <button 
                type='button'
                  onClick={() => changeSequence(parentId, element.id, 'up')}
                  disabled={!canMoveUp}
                >
                  ↑
                </button>
                <button 
                type='button'
                  onClick={() => changeSequence(parentId, element.id, 'down')}
                  disabled={!canMoveDown}
                >
                  ↓
                </button>
                {element.description && <p style={{ fontSize: '0.8em', color: '#888', marginTop: 4 }}>{element.description}</p>}
              </div>
            );
          
          case 'radio':
            return (
              <div key={element.id} id={fieldId} className={`field-${element.type}`} style={{ marginBottom: 12 , display: 'flex', alignItems: 'center', gap: 8 }}>
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
                  onClick={() => changeSequence(parentId, element.id, 'up')}
                  disabled={!canMoveUp}
                >
                  ↑
                </button>
                <button 
                type='button'
                  onClick={() => changeSequence(parentId, element.id, 'down')}
                  disabled={!canMoveDown}
                >
                  ↓
                </button>
              </div>
            );
          
          case 'checkbox':
            return (
              <div key={element.id} id={fieldId} className={`field-${element.type}`} style={{ marginBottom: 12 , display: 'flex', alignItems: 'center', gap: 8 }}>
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
                  onClick={() => changeSequence(parentId, element.id, 'up')}
                  disabled={!canMoveUp}
                >
                  ↑
                </button>
                <button 
                type='button'
                  onClick={() => changeSequence(parentId, element.id, 'down')}
                  disabled={!canMoveDown}
                >
                  ↓
                </button>
              </div>
            );
          
          case 'select':
            return (
              <div key={element.id} id={fieldId} className={`field-${element.type}`} style={{ marginBottom: 12 , display: 'flex', alignItems: 'center', gap: 8 }}>
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
                  onClick={() => changeSequence(parentId, element.id, 'up')}
                  disabled={!canMoveUp}
                >
                  ↑
                </button>
                <button 
                type='button'
                  onClick={() => changeSequence(parentId, element.id, 'down')}
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
  
      // HELPER: Get the full field ID as it appears in steps
      function getFullFieldId(elementId, parentId) {
        // For root level, the field ID in steps is just the elementId
        if (parentId === 'root') {
          return elementId;
        }
        // For nested levels, it's usually parentId.elementId
        return `${parentId}.${elementId}`;
      }
  
      // IMPROVED: Render groups with proper parent context tracking
      function renderGroup(elementId, parentId, currentIndex) {
        // console.log("Rendering elementId:", elementId, "with parentId:", parentId, "at index:", currentIndex);
        // console.log("elementId :" , elementId ,  "parentId :", parentId)
        const element = stepsBlocksData.blocks[elementId];
        if (!element) {
          return null;
        }
  
        const groupId = `${parentId}-${element.id}`;
        const canMoveUp = currentIndex > 0;
        const canMoveDown = currentIndex < (stepsBlocksData.steps[parentId]?.length - 1);
  
        // If it's a field (not a container), render it directly
        if(["text","radio","checkbox","select"].includes(element.type)) {
          return renderField(element, parentId, currentIndex);
        }

        if(["section","group","repeater"].includes(element.type)) {
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
                      onClick={() => changeSequence(parentId, elementId, 'up')}
                      disabled={!canMoveUp}
                      style={{ marginLeft: 10 }}
                    >
                      ↑
                    </button>
                    <button 
                    type='button'
                      onClick={() => changeSequence(parentId, elementId, 'down')}
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
      }
  
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
        {showEditModal &&     
        <div style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(0, 0, 0, 0.5)', 
      display: 'flex', alignItems: 'center', justifyContent: 'center' 
    }}>
      <div style={{ 
        background: '#fff', padding: 20, borderRadius: 8, width: '50%', 
        maxHeight: '80vh', overflowY: 'auto' 
      }}>
        <h3>Edit Field</h3>
        <form>
      {Object.entries(editData).map(([key, value]) => (
      <div key={key} style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 4 }}>
          {key}
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => handleFieldChange(key, e.target.value)}
          style={{ width: '100%', padding: 8 }}
        />
      </div>
    ))}
  </form>
        <button onClick={handleSave}>Save</button>
        <button onClick={() => setShowEditModal(false)}>Close</button>
      </div>
    </div>}
      </div>
    );
  };

  export default Form; 
  
//   const EditModel = (editData)=>{
//     const handleFieldChange = (fieldKey, newValue) => {
//       console.log("dsdsdsdf",newValue);
//       console.log("dsdsdsdf",fieldKey);
//     setEditData(prev => ({
//       ...prev,
//       [fieldKey]: newValue
//     }));
//   };

// console.log( "editData : ", editData)
//     return 
//     <div style={{ 
//       position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
//       backgroundColor: 'rgba(0, 0, 0, 0.5)', 
//       display: 'flex', alignItems: 'center', justifyContent: 'center' 
//     }}>
//       <div style={{ 
//         background: '#fff', padding: 20, borderRadius: 8, width: '50%', 
//         maxHeight: '80vh', overflowY: 'auto' 
//       }}>
//         <h3>Edit Field</h3>
//         <form>
//       {Object.entries(editData).map(([key, value]) => (
//       <div key={key} style={{ marginBottom: 12 }}>
//         <label style={{ display: 'block', marginBottom: 4 }}>
//           {key}
//         </label>
//         <input
//           type="text"
//           value={value}
//           onChange={(e) => handleFieldChange(key, e.target.value)}
//           style={{ width: '100%', padding: 8 }}
//         />
//       </div>
//     ))}
//   </form>
//         <button onClick={handleSave}>Save</button>
//         <button onClick={() => setShowEditModal(false)}>Close</button>
//       </div>
//     </div>
//   }