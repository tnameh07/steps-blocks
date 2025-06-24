import React from 'react';
import RenderField from './RenderField';
import { Pencil } from 'lucide-react';


const RenderGroup = ({ elementId, parentId, currentIndex, stepsBlocksData, formValues, handleOpenModal, handleInputChange, handleChangeSequence, checkCondition }) => {
   
    const element = stepsBlocksData?.blocks[elementId];
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
            handleOpenModal={handleOpenModal}
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
      {/* Top row with label, buttons, add/edit aligned properly */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontWeight: 'bold', margin: 0 }}>
          {element.label}
          <button
            type="button"
            onClick={() => handleChangeSequence(parentId, elementId, 'up')}
            disabled={!canMoveUp}
            style={{ marginLeft: 10 }}
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => handleChangeSequence(parentId, elementId, 'down')}
            disabled={!canMoveDown}
          >
            ↓
          </button>
        </label>

        {/* Edit and Add buttons on right */}
        <div>
          <button type="button" onClick={() => handleOpenModal('edit', elementId ,groupId)} style={{ marginRight: 8 }}>Edit</button>
          <button type="button" onClick={() => handleOpenModal('add', elementId, groupId)}>Add Field</button>
        </div>
      </div>

      <div style={{ marginTop: 4 }}>
        {element?.children && element?.children?.map((childId, childIndex) =>
          <RenderGroup
            key={childId}
            elementId={childId}
            parentId={elementId}
            currentIndex={childIndex}
            stepsBlocksData={stepsBlocksData}
            formValues={formValues}
            handleOpenModal={handleOpenModal}
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

export default RenderGroup;