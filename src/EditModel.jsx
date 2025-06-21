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

    try {
      // Update parent state
      setStepsBlocksData(prev => ({
        ...prev,
        blocks: {
          ...prev.blocks,
          [editPath]: localEditData
        }
      }));

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