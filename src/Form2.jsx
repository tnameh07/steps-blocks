import React, { useCallback, useEffect, useRef, useState } from 'react';
import InputJsonBuilder from './DynamicInputBuilder/InputJsonBuilder.jsx';
import PreviewForm from './DynamicInputBuilder/PreviewForm.jsx';
import EditModel from './EditModel.jsx';
import { changeSequence, creatingBlock, creatingFirstSequence, defaultInputGroups, reconstructInputGroups } from './utility.js';

const Form = () => {
  const [jsonText, setJsonText] = useState(JSON.stringify(defaultInputGroups, null, 2));
  const [inputGroups, setInputGroups] = useState(defaultInputGroups);
  const [stepsBlocksData, setStepsBlocksData] = useState(null);
  const [jsonError, setJsonError] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [editData, setEditData] = useState(null);
  const [editPath, setEditPath] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const isUpdatingFromJson = useRef(false);
  const isUpdatingFromGui = useRef(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addToGroup, setAddToGroup] = useState(null);



  const handleJsonChange = (e) => {
    const value = e.target.value;
    setJsonText(value);
    try {
      const parsed = JSON.parse(value);
      isUpdatingFromJson.current = true;
      setInputGroups(parsed);
      setJsonError(null);
    } catch (err) {
      setJsonError(err.message);
    }
  };

  const handleInputChange = useCallback((e, fieldKey) => {
    const { type, name, value, checked } = e.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [fieldKey]: type === 'checkbox' ? checked : value
    }));
  });
  const handleEdit = (id) => {
    const block = stepsBlocksData.blocks[id];
    setEditData(block);
    setEditPath(id);
    setShowEditModal(true);
  };

  useEffect(() => {
//  Updated upstream
    const blocks = creatingBlock(inputGroups, "");
    const sequence = creatingFirstSequence(inputGroups);
    const finaljsona = {
      title: "Dynamic Form Preview",
      steps: sequence,
      blocks: blocks
    };
    setStepsBlocksData(finaljsona);
    console.log("FINAL JSON:", finaljsona);
    isUpdatingFromJson.current = false;
  }, [inputGroups]);

  useEffect(() => {
    if (stepsBlocksData && !isUpdatingFromJson.current && isUpdatingFromGui.current) {
      const newInputGroups = reconstructInputGroups(stepsBlocksData);
      setInputGroups(newInputGroups);
    }
// =======
    const fetchAndSetData = async () => {
      const data = defaultInputGroups // await fetchData();
      if (data && data.length) {
        console.log("data", data);
        const blocksSequenceData = await createBlocksSequence(data);
        console.log("blocksSequenceData", blocksSequenceData);
        setStepsBlocksData(blocksSequenceData);
        setJsonText(JSON.stringify(data, null, 2));
      }
    };
    
    fetchAndSetData();
  }, []);

  useEffect(() => {
    // if (isFirstRender.current) {
    //   isFirstRender.current = false;
    //   return;
    // }
    console.log("after update this should trigger useEffect", stepsBlocksData);
    if (stepsBlocksData) {
    const newInputGroups = reconstructInputGroups(stepsBlocksData);
      // setInputGroups(newInputGroups);
      console.log("newInputGroups JSON: ", newInputGroups);
// >>>>>>> Stashed changes
      setJsonText(JSON.stringify(newInputGroups, null, 2));
      isUpdatingFromGui.current = false;
    }
  }, [stepsBlocksData]);

// <<<<<<< Updated upstream
  useEffect(() => {
    if (editData) {
      const newInputGroups = reconstructInputGroups(stepsBlocksData);
      setInputGroups(newInputGroups);
      setJsonText(JSON.stringify(newInputGroups, null, 2));
      isUpdatingFromGui.current = true;
    }
  }, [editData]);

// =======
  
// >>>>>>> Stashed changes

  const handleChangeSequence = (group_id, field_id, direction) => {
    isUpdatingFromGui.current = true; // Set flag before GUI changes
    changeSequence(stepsBlocksData, setStepsBlocksData, group_id, field_id, direction);
  };

  return (
    <div style={{ display: 'flex', height: '80vh', gap: 24 }}>
      {/* JSON Editor Block */}
      {jsonText && <InputJsonBuilder handleJsonChange={handleJsonChange} jsonText={jsonText} setJsonText={setJsonText} jsonError={jsonError}/>}
   {/* Preview Form Block */}
      {stepsBlocksData ? (
        <PreviewForm stepsBlocksData={stepsBlocksData} formValues={formValues} handleEdit={handleEdit} handleInputChange={handleInputChange}  handleChangeSequence={handleChangeSequence}/>
      ) : (
        <p>Loading...</p>
      )}
      {/* Edit Modal */}
      {showEditModal &&
        <EditModel
          editPath={editPath}
          setEditData={setEditData}
          editData={editData}
          setStepsBlocksData={setStepsBlocksData}
          setShowEditModal={setShowEditModal} />}
    </div>
  );
};

export default Form;