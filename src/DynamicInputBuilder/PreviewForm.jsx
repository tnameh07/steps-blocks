import RenderGroup from "./RenderGroup";

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


