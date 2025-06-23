import React, { useCallback, useEffect, useRef, useState } from 'react';
import InputJsonBuilder from './DynamicInputBuilder/InputJsonBuilder.jsx';
import PreviewForm from './DynamicInputBuilder/PreviewForm.jsx';
import EditModel from './EditModel.jsx';
import { creatingBlock, creatingFirstSequence, defaultInputGroups, reconstructInputGroups, changeSequence } from "./utility";

const Form = () => {
  const [jsonText, setJsonText] = useState(JSON.stringify(defaultInputGroups, null, 2));
  // const [inputGroups, setInputGroups] = useState(defaultInputGroups);
  const [stepsBlocksData, setStepsBlocksData] = useState(() => {
    const blocks = creatingBlock(defaultInputGroups, "");
    const sequence = creatingFirstSequence(defaultInputGroups);
    return {
      title: "Dynamic Form Preview",
      steps: sequence,
      blocks: blocks
    };
  });
  const [jsonError, setJsonError] = useState(null);
  const isUpdatingFromJson = useRef(false);
  const isUpdatingFromGui = useRef(false);

  const handleJsonChange = useCallback((e) => {
    const value = e.target.value;
    setJsonText(value);
    try {
      const parsed = JSON.parse(value);
      isUpdatingFromJson.current = true;
      
      // Update both inputGroups and stepsBlocksData directly
      // setInputGroups(parsed);
      
      // Transform directly without waiting for useEffect
      const blocks = creatingBlock(parsed, "");
      const sequence = creatingFirstSequence(parsed);
      setStepsBlocksData({
        title: "Dynamic Form Preview",
        steps: sequence,
        blocks: blocks
      });
      
      setJsonError(null);
      // Reset flag after updates are complete
      setTimeout(() => {
        isUpdatingFromJson.current = false;
      }, 0);
    } catch (err) {
      setJsonError(err.message);
    }
  }, []);

  useEffect(() => {
    // Only update when GUI changes trigger updates to stepsBlocksData
    if (stepsBlocksData && !isUpdatingFromJson.current && isUpdatingFromGui.current) {
      const newInputGroups = reconstructInputGroups(stepsBlocksData);
      // setInputGroups(newInputGroups);
      setJsonText(JSON.stringify(newInputGroups, null, 2));
      isUpdatingFromGui.current = false;
    }
  }, [stepsBlocksData]);

  // useEffect(() => {
  //   if (editData) {
  //     // Mark as GUI update to prevent circular updates
  //     isUpdatingFromGui.current = true;
      
  //     // No need to reconstruct inputGroups here since the stepsBlocksData 
  //     // effect will handle this when stepsBlocksData changes
  //   }
  // }, [editData]);

  // };
  
  const handleChangeSequence = useCallback((group_id, field_id, direction) => {
    console.log('Form: handleChangeSequence called', { group_id, field_id, direction });
    
    isUpdatingFromGui.current = true;
    
    // Call the utility function with the current state
    changeSequence(stepsBlocksData, (updatedData) => {
      console.log('Setting new stepsBlocksData state after sequence change');
      setStepsBlocksData(updatedData);
    }, group_id, field_id, direction);
  }, [stepsBlocksData]);

  return (
    <div style={{ display: 'flex', height: '80vh', gap: 24 }}>
      {/* JSON Editor Block */}
      {jsonText && <InputJsonBuilder handleJsonChange={handleJsonChange} jsonText={jsonText} jsonError={jsonError}/>}
      {/* Preview Form Block */}
      {stepsBlocksData ? (
        <PreviewForm 
          stepsBlocksData={stepsBlocksData} 
          handleChangeSequence={handleChangeSequence} 
          setStepsBlocksData={setStepsBlocksData}
          isUpdatingFromGui={isUpdatingFromGui} 
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Form;