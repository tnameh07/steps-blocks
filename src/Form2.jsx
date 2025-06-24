import React, { useCallback, useEffect, useRef, useState } from 'react';
import InputJsonBuilder from './DynamicInputBuilder/InputJsonBuilder.jsx';
import PreviewForm from './DynamicInputBuilder/PreviewForm.jsx';
import FieldModal from './DynamicInputBuilder/FieldModal.jsx';
import { changeSequence, creatingBlock, creatingFirstSequence, defaultInputGroups, reconstructInputGroups } from './utility.js';

const Form = () => {
  const [jsonText, setJsonText] = useState([]);
  // const [inputGroups, setInputGroups] = useState(defaultInputGroups);
  const [stepsBlocksData, setStepsBlocksData] = useState(null);
  const [jsonError, setJsonError] = useState(null);
  const [formValues, setFormValues] = useState({});
  const isUpdatingFromJson = useRef(false);
  const isUpdatingFromGui = useRef(false);

  // State for the unified modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ mode: 'add', data: null, parentId: null });

  const fetchData = async () => {
    try {
      const response = await fetch('https://flow.sokt.io/func/scriEozEsv6d/?fields=all');
      const data = await response.json();
      return data;
      // setFormValues(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const createBlocksSequence = async (inputGroups) => {
    const blocks = await creatingBlock(inputGroups, "");
    const sequence = await creatingFirstSequence(inputGroups);
    const finaljsona = {
      title: "Dynamic Form Preview",
      steps: sequence,
      blocks: blocks
    }; 

    return finaljsona;
  }

  const handleJsonChange = async (e) => {
    const value = e.target.value;
    setJsonText(value);
    try {
      const parsed = JSON.parse(value);
      isUpdatingFromJson.current = true;
      // setInputGroups(parsed);
      const blocksSequenceData =  await createBlocksSequence(parsed);
        
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

  // Handlers for the unified modal
  const handleOpenModal = useCallback((mode, id, parentId) => {
    const fieldId = (parentId != 'root') ?`${parentId}.${id}`:`${id}`;
    if (mode === 'edit') {
      console.log("edit", id, parentId)
      console.log("fieldId", fieldId)
      setModalConfig({ mode: 'edit', data: stepsBlocksData.blocks[parentId], parentId: null });
    } else { // 'add' mode
      const newFieldTemplate = { id: '', key: '', label: '', type: 'text', required: false, description: '', placeholder: '' };
      setModalConfig({ mode: 'add', data: newFieldTemplate, parentId: id });
    }
    setIsModalOpen(true);
  }, [stepsBlocksData]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalConfig({ mode: 'add', data: null, parentId: null }); // Reset config
  };

  const handleSaveModal = (formData) => {
    const { mode, parentId } = modalConfig;
    const fieldId = formData.id;

    if (mode === 'add') {
      if (!fieldId || !formData.key) {
        alert('Field ID and Key are required.');
        return;
      }
      if (stepsBlocksData.blocks[fieldId]) {
        alert(`Field with ID "${fieldId}" already exists.`);
        return;
      }

      setStepsBlocksData(prev => {
        const updated = { ...prev };
        updated.blocks[fieldId] = formData; // Add new block
        if (prev.steps[parentId]) {
          updated.steps[parentId] = [...prev.steps[parentId], fieldId]; // Add to parent's children
        } else {
          updated.steps[parentId] = [fieldId];
        }
        return updated;
      });

    } else { // 'edit' mode
      setStepsBlocksData(prev => ({
        ...prev,
        blocks: {
          ...prev.blocks,
          [fieldId]: formData
        }
      }));
    }

    handleCloseModal();
  };

  useEffect(() => {
    const fetchAndSetData = async () => {
      const data = defaultInputGroups // await fetchData();
      if (data && data.length) {
        const blocksSequenceData = await createBlocksSequence(data);
        setStepsBlocksData(blocksSequenceData);
        setJsonText(JSON.stringify(data, null, 2));
      }
      // Note: stepsBlocksData here will not reflect the latest state immediately after setStepsBlocksData
      // If you want to log the updated state, use another useEffect watching stepsBlocksData 
    };

    fetchAndSetData();
  }, []);

  useEffect(() => {
    // if (isFirstRender.current) {
    //   isFirstRender.current = false;
    //   return;
    // }
    
    if (stepsBlocksData) {
      const newInputGroups = reconstructInputGroups(stepsBlocksData);
      // setInputGroups(newInputGroups);
      
      setJsonText(JSON.stringify(newInputGroups, null, 2));
      isUpdatingFromGui.current = false;
    }
    // 
  }, [stepsBlocksData]);

  const handleChangeSequence = (group_id, field_id, direction) => {
    isUpdatingFromGui.current = true; // Set flag before GUI changes
    changeSequence(stepsBlocksData, setStepsBlocksData, group_id, field_id, direction);
  };

  return (
    <>
      <FieldModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveModal}
        initialData={modalConfig.data}
        mode={modalConfig.mode}
      />
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
        handleOpenModal={handleOpenModal}
        handleInputChange={handleInputChange}
        handleChangeSequence={handleChangeSequence}
        setStepsBlocksData={setStepsBlocksData}
      />
    </div>
    </>
  );
};

export default Form;