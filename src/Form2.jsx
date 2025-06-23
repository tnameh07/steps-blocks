import React, { useCallback, useEffect, useRef, useState } from 'react';
import InputJsonBuilder from './DynamicInputBuilder/InputJsonBuilder.jsx';
import PreviewForm from './DynamicInputBuilder/PreviewForm.jsx';
import EditModel from './EditModel.jsx';
import { changeSequence, creatingBlock, creatingFirstSequence, defaultInputGroups, reconstructInputGroups } from './utility.js';

const Form = () => {
  const [jsonText, setJsonText] = useState([]);
  // const [inputGroups, setInputGroups] = useState(defaultInputGroups);
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
//  const isFirstRender = useRef(true);

  const fetchData = async () => {
    try {
      const response = await fetch('https://flow.sokt.io/func/scriEozEsv6d');
      const data = await response.json();
      console.log("data", data)
      return data;
      // setFormValues(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  const createBlocksSequence = async (inputGroups) => {
    console.log("Input groups:", inputGroups)
    const blocks = await creatingBlock(inputGroups, "");
    const sequence = await creatingFirstSequence(inputGroups);
    const finaljsona = {
      title: "Dynamic Form Preview",
      steps: sequence,
      blocks: blocks
    };
    console.log("finaljsona", finaljsona);

    return finaljsona;
  }

  const handleJsonChange = (e) => {
    const value = e.target.value;
    setJsonText(value);
    try {
      // const parsed = JSON.parse(value);
      isUpdatingFromJson.current = true;
      // setInputGroups(parsed);
      const blocksSequenceData =  createBlocksSequence(value);
        console.log("blocksSequenceData", blocksSequenceData);
        setStepsBlocksData(blocksSequenceData);
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
    const fetchAndSetData = async () => {
      console.log("first functin", stepsBlocksData);
      const data = await fetchData();
      if (data && data.length) {
        console.log("data", data);
        const blocksSequenceData = await createBlocksSequence(data);
        console.log("blocksSequenceData", blocksSequenceData);
        setStepsBlocksData(blocksSequenceData);
        // setJsonText(JSON.stringify(data, null, 2));
      }
      // Note: stepsBlocksData here will not reflect the latest state immediately after setStepsBlocksData
      // If you want to log the updated state, use another useEffect watching stepsBlocksData
      console.log("second update stepsBlocksData", stepsBlocksData);
    };
console.log("first", stepsBlocksData);

    fetchAndSetData();
  }, []);

  // useEffect(() => {
  //   const blocks = creatingBlock(inputGroups, "");
  //   const sequence = creatingFirstSequence(inputGroups);
  //   const finaljsona = {
  //     title: "Dynamic Form Preview",
  //     steps: sequence,
  //     blocks: blocks
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
      setJsonText(JSON.stringify(newInputGroups, null, 2));
      isUpdatingFromGui.current = false;
    }
    // console.log("abc", stepsBlocksData);
  }, [stepsBlocksData]);

  //     isUpdatingFromGui.current = true;
  //   }
  // }, [editData]);


  const handleChangeSequence = (group_id, field_id, direction) => {
    isUpdatingFromGui.current = true; // Set flag before GUI changes
    changeSequence(stepsBlocksData, setStepsBlocksData, group_id, field_id, direction);
  };

  return (
    <div style={{ display: 'flex', height: '80vh', gap: 24 }}>
      {/* JSON Editor Block */}
      <InputJsonBuilder 
      handleJsonChange={handleJsonChange} 
      jsonText={jsonText} 
      setJsonText={setJsonText} 
      jsonError={jsonError}/>
   {/* Preview Form Block */}
      <PreviewForm
        stepsBlocksData={stepsBlocksData}
        formValues={formValues}
        handleEdit={handleEdit}
        handleInputChange={handleInputChange}
        handleChangeSequence={handleChangeSequence}
        setStepsBlocksData={setStepsBlocksData}
      />
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