import React, { useMemo, useCallback, useState ,useEffect} from "react";
import RenderGroup from "./RenderGroup";
import EditModel from "../EditModel";

const PreviewForm = ({ stepsBlocksData, handleChangeSequence, setStepsBlocksData, isUpdatingFromGui }) => {
  // Colocate formValues state in this component since it's only used here
  const [formValues, setFormValues] = useState({});
  
  // Move edit-related state to this component
  const [editData, setEditData] = useState(null);
  const [editPath, setEditPath] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Handle edit action
  const handleEdit = useCallback((id) => {
    console.log('PreviewForm handleEdit called for:', id);
    const block = stepsBlocksData.blocks[id];
    setEditData({...block}); // Create a copy to avoid reference issues
    setEditPath(id);
    setShowEditModal(true);
  }, [stepsBlocksData.blocks]);

    // Colocate handleInputChange in this component
  const handleInputChange = useCallback((e, fieldKey) => {
    const { type, value, checked } = e.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [fieldKey]: type === 'checkbox' ? checked : value
    }));
  }, []);

  // Memoize the checkCondition function to avoid recreating it on every render
    // Log when stepsBlocksData changes
  useEffect(() => {
    console.log('PreviewForm: stepsBlocksData updated');
  }, [stepsBlocksData]);
    
  const checkCondition = useCallback((condition) => {
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
  }, [formValues]);
    
    if (!stepsBlocksData || !stepsBlocksData.steps || !stepsBlocksData.blocks) return null;
    
    // Memoize the root elements to prevent unnecessary re-renders
    const rootElements = useMemo(() => {
      if (!stepsBlocksData.steps.root) return [];
      
      return stepsBlocksData.steps.root.map((rootId, index) => (
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
        />
      ));
    }, [stepsBlocksData, formValues, handleEdit, handleInputChange, handleChangeSequence, checkCondition, setStepsBlocksData]);
    console.log("stepsBlocksData :",stepsBlocksData)
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
                {rootElements}
            </form>
            
            {/* Edit Modal - Now managed within PreviewForm */}
            {showEditModal &&
              <EditModel
                editPath={editPath}
                setEditData={setEditData}
                editData={editData}
                setStepsBlocksData={setStepsBlocksData}
                setShowEditModal={setShowEditModal}
              />
            }
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

// Enhanced React.memo with smarter comparison for deeply nested state
// export default React.memo(PreviewForm);
export default PreviewForm;

/**
   (prevProps, nextProps) => {
  // Don't do deep comparison - allow component to update when stepsBlocksData changes
  // This ensures edits will propagate through the component tree
  if (prevProps.stepsBlocksData !== nextProps.stepsBlocksData) {
    console.log('PreviewForm.memo: Detected stepsBlocksData change, allowing re-render');
    return false; // Different objects = allow re-render
  }
  
  // For other props, use reference equality as before
  return (
    prevProps.formValues === nextProps.formValues &&
    prevProps.handleEdit === nextProps.handleEdit &&
    prevProps.handleInputChange === nextProps.handleInputChange &&
    prevProps.handleChangeSequence === nextProps.handleChangeSequence
  );
} 
 
 */


