



import { Pencil } from 'lucide-react';


const RenderField = ({ element, parentId, currentIndex, stepsBlocksData, formValues, handleEdit, handleInputChange, handleChangeSequence, checkCondition }) => {

    const isVisible = !element.visibleIf || checkCondition(element.visibleIf);
    const isDisabled = element.disabledIf && checkCondition(element.disabledIf);
    if (!isVisible) return null;
    if (!stepsBlocksData || !stepsBlocksData.steps) return null;

    const fieldId = (parentId != 'root') ?`${parentId}.${element.id}`:`${element.id}`;
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
                        style={{
                        width: 'auto',
                        padding: 8,
                        border: '1px solid #ccc',
                        borderRadius: 4,
                        cursor: element.disabledIf && isDisabled ? 'not-allowed' : 'text',
                        borderColor: element.disabledIf && isDisabled ? 'red' : '#ccc'
                        }}

                    />
                    <button type="button" onClick={() => handleEdit(fieldId)} style={{ marginRight: 8, display: 'flex', alignItems: 'center', padding: 4 }}>
                    <Pencil size={16} />
                    </button>

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

            let dynamicOptions = element.options;
            

            // Support for dependsOn
            if (element.dependsOn && element.dependsOn.field && element.dependsOn.map) {
                const depField = element.dependsOn.field;
                const selectedValue = formValues[depField];
                const mappedOptions = element.dependsOn.map[selectedValue] || [];
                dynamicOptions = mappedOptions.map(opt => ({
                    value: opt,
                    label: opt
                }));
                console.log("mapped options:",dynamicOptions);
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
                        style={{
                            width: 'auto',
                            padding: 8,
                            border: '1px solid #ccc',
                            borderRadius: 4,
                            cursor: element.disabledIf && isDisabled ? 'not-allowed' : 'text',
                            borderColor: element.disabledIf && isDisabled ? 'red' : '#ccc'
                            }}

                    >
                        <option value="">Select an option</option>
                        {dynamicOptions.map(opt => (
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

export default RenderField;
