import React, { useMemo } from 'react';
import RenderField from './RenderField';


const RenderGroup = ({ elementId, parentId, currentIndex, stepsBlocksData, formValues, handleEdit, handleInputChange, handleChangeSequence, checkCondition}) => {
   
    console.log('RenderGroup rendering:', elementId);
   
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
                        onClick={() => handleChangeSequence(parentId, elementId, 'up')}
                        disabled={!canMoveUp}
                        style={{ marginLeft: 10 }}
                    >
                        ↑
                    </button>
                    <button
                        type='button'
                        onClick={() => handleChangeSequence(parentId, elementId, 'down')}
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
                            checkCondition={checkCondition}
                        />
                    )}
                </div>
            </div>
        );
    }
    return null;
};

// Custom equality check to prevent unnecessary re-renders
function arePropsEqual(prevProps, nextProps) {
  // First check for updates to current element data
  const currentElementChanged = prevProps.stepsBlocksData.blocks[prevProps.elementId] !== nextProps.stepsBlocksData.blocks[nextProps.elementId];
  
  // Check if children sequence has changed
  const childSequenceChanged = JSON.stringify(prevProps.stepsBlocksData.steps[prevProps.elementId]) !== 
                               JSON.stringify(nextProps.stepsBlocksData.steps[prevProps.elementId]);
  
  // Check if parent sequence has changed (which affects position)
  const parentSequenceChanged = JSON.stringify(prevProps.stepsBlocksData.steps[prevProps.parentId]) !== 
                                JSON.stringify(nextProps.stepsBlocksData.steps[prevProps.parentId]);
  
  // Check if form values relevant to this group changed
  const relevantFormValuesChanged = !Object.keys(prevProps.formValues)
    .filter(key => key.startsWith(prevProps.elementId))
    .every(key => prevProps.formValues[key] === nextProps.formValues[key]);
    
  // Check if current index changed
  const currentIndexChanged = prevProps.currentIndex !== nextProps.currentIndex;
  
  // We should re-render if any of these conditions are true
  const shouldRender = currentElementChanged || 
                      childSequenceChanged || 
                      parentSequenceChanged || 
                      relevantFormValuesChanged ||
                      currentIndexChanged;
  
  if (shouldRender) {
    console.log('RenderGroup will re-render:', prevProps.elementId, { 
      currentElementChanged, 
      childSequenceChanged, 
      parentSequenceChanged,
      relevantFormValuesChanged,
      currentIndexChanged
    });
  }
  
  // Return false to cause re-render when needed
  return !shouldRender;
}

// export default React.memo(RenderGroup);
export default RenderGroup;
