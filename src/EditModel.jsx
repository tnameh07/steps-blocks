import { useState, useCallback, useEffect } from "react";




const EditModel = ({ editPath, editData, setStepsBlocksData, setShowEditModal, setEditData }) => {
  const [localEditData, setLocalEditData] = useState(editData);
  const [isLoading, setIsLoading] = useState(false);
  const handleFieldChange = useCallback((fieldKey, newValue) => {
    setLocalEditData(prev => ({ ...prev, [fieldKey]: newValue }));
  }, [editData]);

  const handleSave = () => {
    if (!localEditData) return;
    setIsLoading(true);
    console.log('EditModel: Saving changes for', editPath);

    try {
      // Create a completely new state object with new references at every level
      // This ensures proper detection by React.memo equality functions
      setStepsBlocksData(prev => {
        // Extract parent ID and child ID from the edit path
        const pathParts = editPath.split('.');
        const parentId = pathParts.slice(0, -1).join('.') || 'root';
        
        console.log('EditModel: Updating state in parent:', parentId);
        
        // Create a completely new object with all new references to ensure React detects the change
        const newState = {
          ...prev,
          blocks: {
            ...prev.blocks,
            [editPath]: {
              ...localEditData
            }
          }
        };
        
        // Force update of the steps object too so equality checks for parent nodes also fail
        // This is important for parent sequences to detect changes
        if (prev.steps[parentId] && Array.isArray(prev.steps[parentId])) {
          newState.steps = {
            ...prev.steps,
            [parentId]: [...prev.steps[parentId]]
          };
        }
        
        console.log('EditModel: State updated with new references');
        return newState;
      });

      setEditData(localEditData);
      setShowEditModal(false);
    } catch (error) {
      console.log('Error saving changes:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    setLocalEditData(editData);
  }, [editData]);
  
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: '#fff', padding: 20, borderRadius: 8, width: '50%',
        maxHeight: '80vh', overflowY: 'auto'
      }}>
        <h3>Edit Field</h3>
        <form>
          {Object.entries(localEditData).map(([key, value]) => (
            <div key={key} style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>
                {key}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => handleFieldChange(key, e.target.value)}
                style={{ width: '100%', padding: 8 }}
              />
            </div>
          ))}
        </form>
        <button disabled={isLoading} onClick={handleSave}>{isLoading ? 'Saving...' : 'Save Changes'}</button>
        <button onClick={() => setShowEditModal(false)}>Close</button>
      </div>
    </div>
  )
}


export default EditModel;