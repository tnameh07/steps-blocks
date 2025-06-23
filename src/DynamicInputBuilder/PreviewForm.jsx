import RenderGroup from "./RenderGroup";
import AddFieldModal from './AddFieldModel';
import { useState } from 'react';

const PreviewForm = ({ stepsBlocksData, formValues, handleEdit, handleInputChange, handleChangeSequence,setStepsBlocksData}) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [addToGroup, setAddToGroup] = useState(null);

    const checkCondition = (condition) => {
      // console.log("condition",condition)
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
    console.log("stepsBlocksData",stepsBlocksData)
    return (
  <div style={{
    flex: 1,
    background: '#fafafa',
    borderRadius: 8,
    padding: 16,
    overflowY: 'auto',
    boxShadow: '0 2px 8px #0001'
  }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12
    }}>
      <h3 style={{ margin: 0 }}>Preview Form ({stepsBlocksData?.title})</h3>
      <button type="button" onClick={() => {
        setAddToGroup('root'); 
        setShowAddModal(true);
      }}>Add Field</button>

    </div>

    <form id="preview-form" className="dynamic-form">
      {stepsBlocksData?.steps?.root?.map((rootId, index) => (
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
          checkCondition={checkCondition}
          setShowAddModal={setShowAddModal}
          setAddToGroup={setAddToGroup}
        />
      ))}
    </form>
    {showAddModal && (
  <AddFieldModal
    parentId={addToGroup}
    setShowAddModal={setShowAddModal}
    setStepsBlocksData={setStepsBlocksData}
  />
)}

  </div>
);

};

export default PreviewForm;


