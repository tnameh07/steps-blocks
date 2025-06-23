import React, { useState, useCallback, useMemo, memo, useRef } from 'react';
import { ChevronUp, ChevronDown, Plus, Trash2, Edit3, Save, X } from 'lucide-react';

// Initial data structure
const initialFormData = {
  "title": "Dynamic Form Preview",
  "steps": {
    "root": [
      "personal-info",
      "address-info", 
      "work-experience",
      "feedback",
      "other"
    ],
    "personal-info": [
      "personal-info.full-name",
      "personal-info.nested-group",
      "personal-info.email",
      "personal-info.gender",
      "personal-info.subscribe",
      "personal-info.contact-method"
    ],
    "personal-info.nested-group": [
      "personal-info.nested-group.child1",
      "personal-info.nested-group.child2"
    ],
    "address-info": [
      "address-info.city",
      "address-info.street",
      "address-info.zip"
    ],
    "work-experience": [
      "work-experience.company",
      "work-experience.job-title",
      "work-experience.start",
      "work-experience.end"
    ]
  },
  "blocks": {
    "personal-info": {
      "id": "personal-info",
      "type": "group",
      "label": "Personal Info",
      "description": "Your basic details",
      "children": [
        "personal-info.full-name",
        "personal-info.nested-group",
        "personal-info.email",
        "personal-info.gender",
        "personal-info.subscribe",
        "personal-info.contact-method"
      ]
    },
    "personal-info.full-name": {
      "id": "full-name",
      "key": "fullName",
      "type": "text",
      "inputType": "text",
      "label": "Full Name",
      "placeholder": "John Doe",
      "required": true,
      "validation": {
        "minLength": 2,
        "maxLength": 50
      }
    },
    "personal-info.nested-group": {
      "id": "nested-group",
      "key": "nestedGroup",
      "type": "group",
      "label": "Nested Group",
      "children": [
        "personal-info.nested-group.child1",
        "personal-info.nested-group.child2"
      ]
    },
    "personal-info.nested-group.child1": {
      "id": "child1",
      "key": "child1",
      "type": "select",
      "label": "Child 1",
      "options": [
        { "value": "optin", "label": "Email" },
        { "value": "phone", "label": "Phone" },
        { "value": "mail", "label": "Mail" }
      ],
      "required": true
    },
    "personal-info.nested-group.child2": {
      "id": "child2",
      "key": "child2",
      "type": "text",
      "inputType": "text",
      "label": "Child 2",
      "placeholder": "Enter child 2 value",
      "visibleIf": {
        "field": "child1",
        "operator": "notEquals",
        "value": ""
      }
    },
    "personal-info.email": {
      "id": "email",
      "key": "email",
      "type": "text",
      "inputType": "email",
      "label": "Email",
      "placeholder": "john@example.com",
      "required": true,
      "validation": {
        "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
      }
    },
    "personal-info.gender": {
      "id": "gender",
      "key": "gender",
      "type": "radio",
      "label": "Gender",
      "options": [
        { "value": "male", "label": "Male" },
        { "value": "female", "label": "Female" },
        { "value": "other", "label": "Other" }
      ]
    },
    "personal-info.subscribe": {
      "id": "subscribe",
      "key": "subscribe",
      "type": "checkbox",
      "label": "Subscribe to newsletter",
      "defaultValue": false
    },
    "personal-info.contact-method": {
      "id": "contact-method",
      "key": "contactMethod",
      "type": "select",
      "label": "Preferred Contact",
      "options": [
        { "value": "email", "label": "Email" },
        { "value": "phone", "label": "Phone" },
        { "value": "mail", "label": "Mail" }
      ],
      "required": true,
      "visibleIf": {
        "field": "subscribe",
        "operator": "equals",
        "value": true
      }
    },
    "address-info": {
      "id": "address-info",
      "type": "group",
      "label": "Address",
      "children": [
        "address-info.city",
        "address-info.street",
        "address-info.zip"
      ]
    },
    "address-info.city": {
      "id": "city",
      "key": "city",
      "type": "text",
      "inputType": "text",
      "label": "City",
      "placeholder": "Anytown"
    },
    "address-info.street": {
      "id": "street",
      "key": "street",
      "type": "text",
      "inputType": "text",
      "label": "Street",
      "placeholder": "123 Main St",
      "visibleIf": {
        "field": "city",
        "operator": "notEquals",
        "value": ""
      }
    },
    "address-info.zip": {
      "id": "zip",
      "key": "zip",
      "type": "text",
      "inputType": "number",
      "label": "ZIP",
      "placeholder": "12345"
    },
    "work-experience": {
      "id": "work-experience",
      "type": "group",
      "label": "Work Experience",
      "description": "List of past jobs",
      "children": [
        "work-experience.company",
        "work-experience.job-title",
        "work-experience.start",
        "work-experience.end"
      ]
    },
    "work-experience.company": {
      "id": "company",
      "key": "company",
      "type": "text",
      "inputType": "text",
      "label": "Company",
      "required": true
    },
    "work-experience.job-title": {
      "id": "job-title",
      "key": "role",
      "type": "text",
      "inputType": "text",
      "label": "Role",
      "required": true,
      "visibleIf": {
        "field": "company",
        "operator": "notEquals",
        "value": ""
      }
    },
    "work-experience.start": {
      "id": "start",
      "key": "startDate",
      "type": "text",
      "inputType": "date",
      "label": "Start Date"
    },
    "work-experience.end": {
      "id": "end",
      "key": "endDate",
      "type": "text",
      "inputType": "date",
      "label": "End Date",
      "disabledIf": {
        "field": "startDate",
        "operator": "equals",
        "value": ""
      }
    },
    "feedback": {
      "id": "feedback",
      "key": "feedback",
      "type": "select",
      "label": "Feedback",
      "options": [
        { "value": "positive", "label": "positive" },
        { "value": "negative", "label": "negative" },
        { "value": "other", "label": "other" }
      ],
      "required": true
    },
    "other": {
      "id": "other",
      "key": "other",
      "type": "text",
      "label": "Other :Please Specify",
      "required": true,
      "visibleIf": {
        "field": "feedback",
        "operator": "equals",
        "value": "other"
      }
    }
  }
};

// Context for form data to avoid prop drilling and unnecessary re-renders
const FormContext = React.createContext();

// Field editor component with isolated state
const FieldEditor = memo(({ field, onSave, onCancel }) => {
  const [editData, setEditData] = useState(field);
  const renderCount = useRef(0);
  renderCount.current++;

  console.log(`FieldEditor rendered ${renderCount.current} times for field: ${field.id}`);

  const handleSave = useCallback(() => {
    onSave(editData);
  }, [editData, onSave]);

  const addOption = useCallback(() => {
    setEditData(prev => ({
      ...prev,
      options: [...(prev.options || []), { value: '', label: '' }]
    }));
  }, []);

  const removeOption = useCallback((index) => {
    setEditData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  }, []);

  const updateOption = useCallback((index, key, value) => {
    setEditData(prev => ({
      ...prev,
      options: prev.options.map((option, i) => 
        i === index ? { ...option, [key]: value } : option
      )
    }));
  }, []);

  const updateField = useCallback((key, value) => {
    setEditData(prev => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Edit Field (Renders: {renderCount.current})</h4>
        <div className="flex gap-2">
          <button onClick={handleSave} className="p-1 text-green-600 hover:bg-green-100 rounded">
            <Save size={16} />
          </button>
          <button onClick={onCancel} className="p-1 text-red-600 hover:bg-red-100 rounded">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Label</label>
          <input
            type="text"
            value={editData.label || ''}
            onChange={(e) => updateField('label', e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            value={editData.type || 'text'}
            onChange={(e) => updateField('type', e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
          >
            <option value="text">Text</option>
            <option value="select">Select</option>
            <option value="radio">Radio</option>
            <option value="checkbox">Checkbox</option>
            <option value="group">Group</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Key</label>
          <input
            type="text"
            value={editData.key || ''}
            onChange={(e) => updateField('key', e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Placeholder</label>
          <input
            type="text"
            value={editData.placeholder || ''}
            onChange={(e) => updateField('placeholder', e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={editData.required || false}
            onChange={(e) => updateField('required', e.target.checked)}
            className="mr-2"
          />
          Required
        </label>
      </div>

      {(editData.type === 'select' || editData.type === 'radio') && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Options</label>
            <button
              onClick={addOption}
              className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Add Option
            </button>
          </div>
          {editData.options?.map((option, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Value"
                value={option.value}
                onChange={(e) => updateOption(index, 'value', e.target.value)}
                className="flex-1 px-2 py-1 border rounded text-sm"
              />
              <input
                type="text"
                placeholder="Label"
                value={option.label}
                onChange={(e) => updateOption(index, 'label', e.target.value)}
                className="flex-1 px-2 py-1 border rounded text-sm"
              />
              <button
                onClick={() => removeOption(index)}
                className="p-1 text-red-600 hover:bg-red-100 rounded"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

// Individual field component with proper memoization and isolated actions
const FieldComponent = memo(({ 
  fieldId, 
  field, 
  level = 0, 
  parentPath = 'root',
  canMoveUp, 
  canMoveDown,
  isEditing
}) => {
  const { actions } = React.useContext(FormContext);
  const renderCount = useRef(0);
  renderCount.current++;
  
  console.log(`FieldComponent rendered ${renderCount.current} times for field: ${field.id}`);

  const indentClass = `ml-${level * 4}`;
  
  // Stable callbacks that don't cause re-renders
  const handleMoveUp = useCallback(() => {
    actions.moveField(fieldId, parentPath, 'up');
  }, [fieldId, parentPath, actions.moveField]);

  const handleMoveDown = useCallback(() => {
    actions.moveField(fieldId, parentPath, 'down');
  }, [fieldId, parentPath, actions.moveField]);

  const handleEdit = useCallback(() => {
    actions.editField(fieldId);
  }, [fieldId, actions.editField]);

  const handleDelete = useCallback(() => {
    actions.deleteField(fieldId, parentPath);
  }, [fieldId, parentPath, actions.deleteField]);

  const handleAddChild = useCallback(() => {
    actions.addChildField(fieldId);
  }, [fieldId, actions.addChildField]);

  const handleSaveEdit = useCallback((updatedField) => {
    actions.saveFieldEdit(fieldId, updatedField);
  }, [fieldId, actions.saveFieldEdit]);

  const handleCancelEdit = useCallback(() => {
    actions.cancelFieldEdit();
  }, [actions.cancelFieldEdit]);

  if (isEditing) {
    return (
      <div className={`${indentClass} mb-2`}>
        <FieldEditor
          field={field}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      </div>
    );
  }

  return (
    <div className={`${indentClass} mb-2`}>
      <div className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-3">
          <div className="flex flex-col space-y-1">
            <button
              onClick={handleMoveUp}
              disabled={!canMoveUp}
              className={`p-1 rounded ${canMoveUp ? 'text-blue-600 hover:bg-blue-100' : 'text-gray-300 cursor-not-allowed'}`}
            >
              <ChevronUp size={16} />
            </button>
            <button
              onClick={handleMoveDown}
              disabled={!canMoveDown}
              className={`p-1 rounded ${canMoveDown ? 'text-blue-600 hover:bg-blue-100' : 'text-gray-300 cursor-not-allowed'}`}
            >
              <ChevronDown size={16} />
            </button>
          </div>
          
          <div>
            <div className="font-medium text-gray-900">
              {field.label || field.id} <span className="text-xs text-gray-400">(Renders: {renderCount.current})</span>
            </div>
            <div className="text-sm text-gray-500">
              {field.type} {field.required && '(Required)'}
            </div>
            {field.description && (
              <div className="text-xs text-gray-400 mt-1">{field.description}</div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {field.type === 'group' && (
            <button
              onClick={handleAddChild}
              className="p-2 text-green-600 hover:bg-green-100 rounded transition-colors"
              title="Add child field"
            >
              <Plus size={16} />
            </button>
          )}
          <button
            onClick={handleEdit}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
            title="Edit field"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
            title="Delete field"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for better memoization
  return (
    prevProps.fieldId === nextProps.fieldId &&
    prevProps.field === nextProps.field &&
    prevProps.level === nextProps.level &&
    prevProps.parentPath === nextProps.parentPath &&
    prevProps.canMoveUp === nextProps.canMoveUp &&
    prevProps.canMoveDown === nextProps.canMoveDown &&
    prevProps.isEditing === nextProps.isEditing
  );
});

// Field list component with proper memoization
const FieldList = memo(({ fieldIds, parentPath = 'root', level = 0 }) => {
  const { steps, blocks, editingField } = React.useContext(FormContext);
  const renderCount = useRef(0);
  renderCount.current++;

  console.log(`FieldList rendered ${renderCount.current} times for path: ${parentPath}`);

  if (!fieldIds || !Array.isArray(fieldIds)) return null;

  return (
    <>
      {fieldIds.map((fieldId, index) => {
        const field = blocks[fieldId];
        if (!field) return null;

        const canMoveUp = index > 0;
        const canMoveDown = index < fieldIds.length - 1;
        const isEditing = editingField === fieldId;
        const hasChildren = field.type === 'group' && steps[fieldId];

        return (
          <div key={fieldId}>
            <FieldComponent
              fieldId={fieldId}
              field={field}
              level={level}
              parentPath={parentPath}
              canMoveUp={canMoveUp}
              canMoveDown={canMoveDown}
              isEditing={isEditing}
            />
            
            {hasChildren && !isEditing && (
              <div className="ml-4 border-l-2 border-gray-200 pl-4">
                <FieldList
                  fieldIds={steps[fieldId]}
                  parentPath={fieldId}
                  level={level + 1}
                />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  return (
    prevProps.fieldIds === nextProps.fieldIds &&
    prevProps.parentPath === nextProps.parentPath &&
    prevProps.level === nextProps.level
  );
});

// Main form configuration component
const FormConfigurationSystem = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [editingField, setEditingField] = useState(null);
  const renderCount = useRef(0);
  renderCount.current++;

  console.log(`FormConfigurationSystem rendered ${renderCount.current} times`);

  // Stable actions object that doesn't change unless necessary
  const actions = useMemo(() => ({
    moveField: (fieldId, parentPath, direction) => {
      setFormData(prev => {
        const newSteps = { ...prev.steps };
        const currentOrder = [...newSteps[parentPath]];
        const currentIndex = currentOrder.indexOf(fieldId);
        
        if (direction === 'up' && currentIndex > 0) {
          [currentOrder[currentIndex], currentOrder[currentIndex - 1]] = 
          [currentOrder[currentIndex - 1], currentOrder[currentIndex]];
        } else if (direction === 'down' && currentIndex < currentOrder.length - 1) {
          [currentOrder[currentIndex], currentOrder[currentIndex + 1]] = 
          [currentOrder[currentIndex + 1], currentOrder[currentIndex]];
        }
        
        newSteps[parentPath] = currentOrder;
        return { ...prev, steps: newSteps };
      });
    },

    editField: (fieldId) => {
      setEditingField(fieldId);
    },

    saveFieldEdit: (fieldId, updatedField) => {
      setFormData(prev => ({
        ...prev,
        blocks: {
          ...prev.blocks,
          [fieldId]: updatedField
        }
      }));
      setEditingField(null);
    },

    cancelFieldEdit: () => {
      setEditingField(null);
    },

    deleteField: (fieldId, parentPath) => {
      setFormData(prev => {
        const newSteps = { ...prev.steps };
        const newBlocks = { ...prev.blocks };
        
        newSteps[parentPath] = newSteps[parentPath].filter(id => id !== fieldId);
        delete newBlocks[fieldId];
        
        if (newSteps[fieldId]) {
          delete newSteps[fieldId];
        }
        
        return { ...prev, steps: newSteps, blocks: newBlocks };
      });
    },

    addField: (parentPath = 'root') => {
      const newFieldId = `new-field-${Date.now()}`;
      const fullFieldId = parentPath === 'root' ? newFieldId : `${parentPath.replace('.children', '')}.${newFieldId}`;
      
      const newField = {
        id: newFieldId,
        key: newFieldId,
        type: 'text',
        inputType: 'text',
        label: 'New Field',
        placeholder: 'Enter value'
      };

      setFormData(prev => {
        const newSteps = { ...prev.steps };
        const newBlocks = { ...prev.blocks };
        
        if (!newSteps[parentPath]) {
          newSteps[parentPath] = [];
        }
        newSteps[parentPath] = [...newSteps[parentPath], fullFieldId];
        newBlocks[fullFieldId] = newField;
        
        return { ...prev, steps: newSteps, blocks: newBlocks };
      });
    },

    addChildField: (parentFieldId) => {
      const childFieldId = `${parentFieldId}.new-child-${Date.now()}`;
      
      const newField = {
        id: `new-child-${Date.now()}`,
        key: `newChild${Date.now()}`,
        type: 'text',
        inputType: 'text',
        label: 'New Child Field',
        placeholder: 'Enter value'
      };

      setFormData(prev => {
        const newSteps = { ...prev.steps };
        const newBlocks = { ...prev.blocks };
        
        if (!newSteps[parentFieldId]) {
          newSteps[parentFieldId] = [];
        }
        newSteps[parentFieldId] = [...newSteps[parentFieldId], childFieldId];
        newBlocks[childFieldId] = newField;
        
        if (newBlocks[parentFieldId]) {
          newBlocks[parentFieldId] = {
            ...newBlocks[parentFieldId],
            children: newSteps[parentFieldId]
          };
        }
        
        return { ...prev, steps: newSteps, blocks: newBlocks };
      });
    }
  }), []);

  // Context value that only changes when necessary
  const contextValue = useMemo(() => ({
    steps: formData.steps,
    blocks: formData.blocks,
    editingField,
    actions
  }), [formData.steps, formData.blocks, editingField, actions]);

  return (
    <FormContext.Provider value={contextValue}>
      <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {formData.title} <span className="text-sm text-gray-400">(Renders: {renderCount.current})</span>
              </h1>
              <p className="text-gray-600 mt-1">Configure your form structure</p>
            </div>
            <button
              onClick={() => actions.addField('root')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Field</span>
            </button>
          </div>

          <div className="space-y-4">
            <FieldList fieldIds={formData.steps.root} />
          </div>

          {(!formData.steps.root || formData.steps.root.length === 0) && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-4">No fields configured yet</p>
              <button
                onClick={() => actions.addField('root')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Your First Field
              </button>
            </div>
          )}

          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-medium mb-2">Debug Info:</h3>
            <div className="text-sm text-gray-600">
              <div>Total fields: {Object.keys(formData.blocks).length}</div>
              <div>Root level fields: {formData.steps.root?.length || 0}</div>
              <div>Editing field: {editingField || 'None'}</div>
            </div>
          </div>
        </div>
      </div>
    </FormContext.Provider>
  );
};

export default FormConfigurationSystem;