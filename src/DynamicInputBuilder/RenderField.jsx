
import { Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';


const evaluateVisibility = (element, formValues) => {
    if (!element.visibilityCode) return true; // default to visible if no code provided
    // console.log("FormValuescdcedcew:",formValues);
    
    try {
        const inputData = {};
        (element.dependsOn || []).forEach(dep => {
            inputData[dep] = formValues[dep];
        });
        // console.log("FormValues:",inputData);

    // Evaluate the visibilityCode
    return eval(`
      (() => {
        const inputData = ${JSON.stringify(inputData)};
        ${element.visibilityCode}
      })()
    `);
  } catch (error) {
    console.error("Visibility evaluation failed:", error);
    return false;
  }
};

const RenderField =  ({ element, parentId, currentIndex, stepsBlocksData, formValues, handleEdit, handleInputChange, handleChangeSequence,setStepsBlocksData, checkCondition }) => {


    const isVisible = !element.visibleIf || checkCondition(element.visibleIf);
    const isDisabled = element.disabledIf && checkCondition(element.disabledIf);
    const [options, setOptions] = useState([]);

    if (!isVisible) return null;
    if (!stepsBlocksData || !stepsBlocksData.steps) return null;

    const fieldId = (parentId !== 'root') ? `${parentId}.${element.id}` : `${element.id}`;
    // console.log("ParentId:",parentId);
    console.log("FieldId:",fieldId);
    const canMoveUp = currentIndex > 0;
    const canMoveDown = currentIndex < (stepsBlocksData.steps[parentId]?.length - 1);

    // Create a stable list of dependent values to use in the useEffect dependency array
    const dependentValues = element.dependsOn?.map(depKey => formValues[depKey]) || [];

    useEffect(() => {
        const determineOptions = async () => {
            if (element.type !== 'select') return;

            // Handle dynamic options
            if (element.inputType === 'dynamic' && element.sourceCode) {
                try {
                    let data;
                    if (element.dependsOn && element.dependsOn.length > 0) {
                        const inputData = formValues;
                        console.log("Form:",inputData);
                        // element.dependsOn.forEach(depKey => {
                        //     inputData[depKey] = formValues[depKey] || null;
                        // });
                        data = await eval(`(async (inputData) => { ${element.sourceCode} })`)(inputData);
                    } else {
                        data = await eval(`(async () => { ${element.sourceCode} })()`);
                    }

                    const fetchedOptions = Array.isArray(data)
                        ? data.map(item => ({
                            value: typeof item === 'string' ? item : item.value,
                            label: typeof item === 'string' ? item : item.label
                        }))
                        : [];
                    setOptions(fetchedOptions);

                } catch (error) {
                    console.error(`Error evaluating sourceCode for ${element.id}:`, error);
                    setOptions([]);
                }
            } else {
                // Handle static options
                setOptions(element.options || []);
            }
        };

        determineOptions();
    }, [element.id, element.type, element.inputType, element.sourceCode, element.options, ...dependentValues]);

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
                    <button type="button" onClick={() => handleEdit(fieldId)} style={{ display: 'flex', alignItems: 'center', padding: 4 }}><Pencil size={16} /></button>
                    <button type='button' onClick={() => handleChangeSequence(parentId, fieldId, 'up')} disabled={!canMoveUp}>↑</button>
                    <button type='button' onClick={() => handleChangeSequence(parentId, fieldId, 'down')} disabled={!canMoveDown}>↓</button>
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
                    <button type="button" onClick={() => handleEdit(fieldId)} style={{ display: 'flex', alignItems: 'center', padding: 4 }}><Pencil size={16} /></button>
                    <button type='button' onClick={() => handleChangeSequence(parentId, fieldId, 'up')} disabled={!canMoveUp}>↑</button>
                    <button type='button' onClick={() => handleChangeSequence(parentId, fieldId, 'down')} disabled={!canMoveDown}>↓</button>
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
                    <button type="button" onClick={() => handleEdit(fieldId)} style={{ display: 'flex', alignItems: 'center', padding: 4 }}><Pencil size={16} /></button>
                    <button type='button' onClick={() => handleChangeSequence(parentId, fieldId, 'up')} disabled={!canMoveUp}>↑</button>
                    <button type='button' onClick={() => handleChangeSequence(parentId, fieldId, 'down')} disabled={!canMoveDown}>↓</button>
                </div>
            );

        case 'select': 
        {
            if(element.inputType === 'dynamic'){
                const isVisible = evaluateVisibility(element, formValues);
                if(!isVisible) return null;
                }
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
                        <option value="">{element.placeholder || `Select ${element.label}`}</option>
                        {options.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <button type="button" onClick={() => handleEdit(fieldId)} style={{ display: 'flex', alignItems: 'center', padding: 4 }}><Pencil size={16} /></button>
                    <button type='button' onClick={() => handleChangeSequence(parentId, fieldId, 'up')} disabled={!canMoveUp}>↑</button>
                    <button type='button' onClick={() => handleChangeSequence(parentId, fieldId, 'down')} disabled={!canMoveDown}>↓</button>
                </div>
            );
        }

        default:
            return (
                <div key={element.id} style={{ marginBottom: 12, color: 'orange' }}>
                    Unsupported field type: {element.type} (ID: {element.id})
                </div>
            );
    }
};

export default RenderField;
