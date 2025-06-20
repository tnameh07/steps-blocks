

 const PreviewForm = ({ stepsBlocksData, formValues, handleEdit, handleInputChange, handleChangeSequence, setStepsBlocksData }) => {

     const checkCondition = (condition) => {
      if (!condition) return false;
      const { field, operator, value } = condition;
      const targetValue = formValues[field] ?? "";
      switch (operator) {
        case "equals":
          return targetValue === value;
        case "notEquals":
          return targetValue !== value;
        default:
          return false;
      }
    };
    if (!stepsBlocksData || !stepsBlocksData.steps || !stepsBlocksData.blocks) return null;
    return (
        <div style={{
            flex: 1,
            background: '#fafafa',
            borderRadius: 8,
            padding: 16,
            overflowY: 'auto',
            boxShadow: '0 2px 8px #0001'
        }}>
            <h3>Preview Form ({stepsBlocksData.title})</h3>
            <form id="preview-form" className="dynamic-form">
                {stepsBlocksData.steps.root.map((rootId, index) =>
                    <RenderGroup
                        key={rootId}
                        elementId={rootId}
                        parentId={'root'}
                        currentIndex={index}
                        stepsBlocksData={stepsBlocksData}
                        formValues={formValues}
                        handleEdit={handleEdit}
                        handleInputChange={handleInputChange}
                        handleChangeSequence={handleChangeSequence}
                        setStepsBlocksData={setStepsBlocksData}
                        checkCondition={checkCondition}
                    />)}
            </form>
            {/* <h4 style={{ marginTop: 24 }}>Transformed Steps & Blocks</h4>
            <pre style={{
                background: '#f0f8ff',
                padding: 8,
                borderRadius: 4,
                fontSize: 12,
                maxHeight: 200,
                overflowY: 'auto'
            }}>
                {JSON.stringify(stepsBlocksData, null, 2)}
            </pre> */}
        </div>
    );
};

export default PreviewForm;

const RenderField = ({ element, parentId, currentIndex, stepsBlocksData, formValues, handleEdit, handleInputChange, handleChangeSequence, setStepsBlocksData , checkCondition }) => {

    const isVisible = !element.visibleIf || checkCondition(element.visibleIf);
    const isDisabled = element.disabledIf && checkCondition(element.disabledIf);
    if (!isVisible) return null;

    if (!stepsBlocksData || !stepsBlocksData.steps) return null;

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
                                    disabled={isDisabled}
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
                            disabled={isDisabled}
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
};

const RenderGroup = ({ elementId, parentId, currentIndex, stepsBlocksData, formValues, handleEdit, handleInputChange, handleChangeSequence, setStepsBlocksData , checkCondition}) => {
   
    const element = stepsBlocksData.blocks[elementId];
    if (!element) {
        return null;
    }
    const isVisible = !element.visibleIf || checkCondition(element.visibleIf);
    if (!isVisible) return null;

    const groupId = `${parentId}-${element.id}`;
    const canMoveUp = currentIndex > 0;
    const canMoveDown = currentIndex < (stepsBlocksData.steps[parentId]?.length - 1);

    // If it's a field (not a container), render it directly
    if (["text", "radio", "checkbox", "select"].includes(element.type)) {
        return <RenderField
            key={element.id}
            element={element}
            parentId={parentId}
            currentIndex={currentIndex}
            stepsBlocksData={stepsBlocksData}
            formValues={formValues}
            handleEdit={handleEdit}
            handleInputChange={handleInputChange}
            handleChangeSequence={handleChangeSequence}
            setStepsBlocksData={setStepsBlocksData}
            checkCondition={checkCondition}
        />
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
                        <RenderGroup
                            key={childId}
                            elementId={childId}
                            parentId={elementId}
                            currentIndex={childIndex}
                            stepsBlocksData={stepsBlocksData}
                            formValues={formValues}
                            handleEdit={handleEdit}
                            handleInputChange={handleInputChange}
                            handleChangeSequence={handleChangeSequence}
                            setStepsBlocksData={setStepsBlocksData}
                            checkCondition={checkCondition}
                        />
                    )}
                </div>
            </div>
        );
    }
    return null;
};