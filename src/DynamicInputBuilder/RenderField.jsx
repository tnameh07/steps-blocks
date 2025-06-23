

import React from 'react';

const RenderField = ({ element, parentId, currentIndex, stepsBlocksData, formValues, handleEdit, handleInputChange, handleChangeSequence, checkCondition }) => {
    console.log('RenderField rendering:', element.id);

    const isVisible = !element.visibleIf || checkCondition(element.visibleIf);
    const isDisabled = element.disabledIf && checkCondition(element.disabledIf);
    if (!isVisible) return null;

    // if (!stepsBlocksData || !stepsBlocksData.steps) return null;

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
                        disabled={isDisabled}
                        style={{ width: 'auto', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
                    />
                    <button type="button" onClick={() => handleEdit(fieldId)}>Edit</button>
                    <button
                        type='button'
                        onClick={() => handleChangeSequence(parentId, fieldId, 'up')}
                        disabled={!canMoveUp}
                    >
                        ↑
                    </button>
                    <button
                        type='button'
                        onClick={() => handleChangeSequence(parentId, fieldId, 'down')}
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
                                    disabled={isDisabled}
                                />
                                {opt.label}
                            </label>
                        ))}
                    </div>
                    <button
                        type='button'
                        onClick={() => handleChangeSequence(parentId, fieldId, 'up')}
                        disabled={!canMoveUp}
                    >
                        ↑
                    </button>
                    <button
                        type='button'
                        onClick={() => handleChangeSequence(parentId, fieldId, 'down')}
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
                            disabled={isDisabled}
                        />
                        {element.label} {element.required && <span style={{ color: 'red' }}>*</span>}
                    </label>
                    <button
                        type='button'
                        onClick={() => handleChangeSequence(parentId, fieldId, 'up')}
                        disabled={!canMoveUp}
                    >
                        ↑
                    </button>
                    <button
                        type='button'
                        onClick={() => handleChangeSequence(parentId, fieldId, 'down')}
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
                        disabled={isDisabled}
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
                        onClick={() => handleChangeSequence(parentId, fieldId, 'up')}
                        disabled={!canMoveUp}
                    >
                        ↑
                    </button>
                    <button
                        type='button'
                        onClick={() => handleChangeSequence(parentId, fieldId, 'down')}
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
};

// Enhanced equality function with deep property comparison for fields
function arePropsEqual(prevProps, nextProps) {
    // Check if the element reference changed
    const elementReferenceChanged = prevProps.element !== nextProps.element;
    
    // Deep check for element properties even if reference is the same
    let elementPropertiesChanged = false;
    
    if (!elementReferenceChanged) {
      // These are the critical properties that should trigger a re-render if changed
      const criticalProps = ['label', 'placeholder', 'required', 'type', 'inputType', 'options'];
      
      // Check each property individually
      for (const prop of criticalProps) {
        if (JSON.stringify(prevProps.element[prop]) !== JSON.stringify(nextProps.element[prop])) {
          console.log(`RenderField detected property change in ${prop}:`, {
            prev: prevProps.element[prop],
            next: nextProps.element[prop]
          });
          elementPropertiesChanged = true;
          break;
        }
      }
    }
  
    // Check if the element's position changed
    const positionChanged = prevProps.currentIndex !== nextProps.currentIndex;
  
    // Check if parent sequence changed (affecting the field's position)
    const parentSequenceChanged = 
      JSON.stringify(prevProps.stepsBlocksData.steps[prevProps.parentId]) !== 
      JSON.stringify(nextProps.stepsBlocksData.steps[prevProps.parentId]);
      
    // Check if field value changed
    const fieldValueChanged = 
      prevProps.formValues[prevProps.element.key] !== 
      nextProps.formValues[prevProps.element.key];
      
    // We should re-render if any of these changed
    const shouldUpdate = 
      elementReferenceChanged || 
      elementPropertiesChanged ||
      positionChanged || 
      parentSequenceChanged || 
      fieldValueChanged;
      
    if (shouldUpdate) {
      console.log('RenderField will re-render:', prevProps.element.id, {
        elementReferenceChanged,
        elementPropertiesChanged,
        positionChanged,
        parentSequenceChanged,
        fieldValueChanged
      });
    }
    
    // Return false to trigger re-render
    return !shouldUpdate;
}

// export default React.memo(RenderField);
export default RenderField;

