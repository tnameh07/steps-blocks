import React, { useState } from 'react'



const defaultInputGroups = [
  {
    id: "personal-info",
    type: "section",
    label: "Personal Info",
    description: "Your basic details",
    children: [
      {
        id: "full-name",
        key: "fullName",
        type: "text",
        inputType: "text",
        label: "Full Name",
        placeholder: "John Doe",
        required: true,
        validation: { minLength: 2, maxLength: 50 }
      },
      {
        id: "nested-group",
        key: "nestedGroup",
        type: "group",
        label: "Nested Group",
        children: [
            
{
  id: "child1",
  key: "child1",
  type: "select",
  label: "Child 1",
  options: [
    { value: "optin", label: "Email" },
    { value: "phone", label: "Phone" },
    { value: "mail", label: "Mail" }
  ],
  required: true,
  visibleIf: {
    field: "subscribe",
    operator: "equals",
    value: true
  }
},
{
  id: "child2",
  key: "child2",
  type: "text",
  inputType: "text",
  label: "Child 2",
  placeholder: "Enter child 2 value"
},
        ]
    },
    {
      id: "email",
      key: "email",
      type: "text",
      inputType: "email",
      label: "Email",
      placeholder: "john@example.com",
      required: true,
      validation: {
        pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
      }
    },
    {
      id: "gender",
      key: "gender",
      type: "radio",
      label: "Gender",
      options: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" }
      ]
    },
    {
      id: "subscribe",
      key: "subscribe",
      type: "checkbox",
      label: "Subscribe to newsletter",
      defaultValue: false
    },
    {
      id: "contact-method",
      key: "contactMethod",
      type: "select",
      label: "Preferred Contact",
      options: [
        { value: "email", label: "Email" },
        { value: "phone", label: "Phone" },
        { value: "mail", label: "Mail" }
      ],
      required: true,
      visibleIf: {
        field: "subscribe",
        operator: "equals",
        value: true
      }
    },
    ]
  },
  {
    id: "address-info",
    type: "group",
    label: "Address",
    children: [
      {
        id: "street",
        key: "street",
        type: "text",
        inputType: "text",
        label: "Street",
        placeholder: "123 Main St"
      },
      {
        id: "city",
        key: "city",
        type: "text",
        inputType: "text",
        label: "City",
        placeholder: "Anytown"
      },
      {
        id: "zip",
        key: "zip",
        type: "text",
        inputType: "number",
        label: "ZIP",
        placeholder: "12345"
      },
    ]
  },
  {
    id: "work-experience",
    type: "repeater",
    label: "Work Experience",
    description: "List of past jobs",
    children: [
      {
        id: "company",
        key: "company",
        type: "text",
        inputType: "text",
        label: "Company",
        required: true
      },
      {
        id: "job-title",
        key: "role",
        type: "text",
        inputType: "text",
        label: "Role",
        required: true
      },
      {
        id: "start",
        key: "startDate",
        type: "text",
        inputType: "date",
        label: "Start Date"
      },
      {
        id: "end",
        key: "endDate",
        type: "text",
        inputType: "date",
        label: "End Date"
      }
    ]
  },

];


const Form = () => {
  const [jsonText, setJsonText] = useState(JSON.stringify(defaultInputGroups, null, 2));
  const [inputGroups, setInputGroups] = useState(defaultInputGroups);
  const [jsonError, setJsonError] = useState(null);
  const [formValues, setFormValues] = useState({}); // New state for form values

  // Parse JSON editor input
  const handleJsonChange = (e) => {
    const value = e.target.value;
    setJsonText(value);
    try {
      const parsed = JSON.parse(value);
      setInputGroups(parsed);
      setJsonError(null);
    } catch (err) {
      setJsonError(err.message);
    }
  };

  // Handle input changes for form fields
  const handleInputChange = (e, fieldKey) => {
    const { type, name, value, checked } = e.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [fieldKey]: type === 'checkbox' ? checked : value
    }));
  };

  const blocks = creatingBlock(inputGroups, "");
  const sequence = creatingFirstSequence(inputGroups);

  const finaljson = {
    title: "Dynamic Form Preview", // A title for the form
    steps: sequence,
    blocks: blocks
  };

  // console.log("=== TRANSFORMED STRUCTURE ===");
  // console.log("STEPS (Sequence):", JSON.stringify(sequence, null, 2));
  // console.log("BLOCKS (Flat Map):", JSON.stringify(blocks, null, 2));
  console.log("FINAL JSON:", finaljson);

  function renderFormFromFinalJson(finaljson) {
    if (!finaljson || !finaljson.steps || !finaljson.blocks) return null;

    function checkCondition(visibleIf) {
      if (!visibleIf) return true;
      const { field: targetFieldId, operator, value: expectedValue } = visibleIf;
      const targetField = finaljson.blocks[targetFieldId];

      if (!targetField) {
        console.warn(`VisibleIf: Target field ID '${targetFieldId}' not found.`);
        return false;
      }

      const currentFieldValue = formValues[targetField.key]; // Use the 'key' for formValues lookup

      switch (operator) {
        case 'equals':
          return currentFieldValue === expectedValue;
        case 'not_equals':
          return currentFieldValue !== expectedValue;
        case 'is_checked': // For checkboxes
          return !!currentFieldValue;
        case 'is_not_checked':
          return !currentFieldValue;
        // Add more operators as needed (e.g., 'greater_than', 'less_than')
        default:
          return true;
      }
    }

    // Render individual input fields
    function renderField(element) {
      // console.log("element :" , element)
      // if (!checkCondition(element.visibleIf)) {
      //   return null; // Don't render if condition is false
      // }

      switch (element.type) {
        case 'text':
          return (
            <div key={element.id} style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>
                {element.label} {element.required && <span style={{ color: 'red' }}>*</span>}
              </label>
              <input
                type={element.inputType || 'text'} // Use inputType or default to 'text'
                placeholder={element.placeholder || element.label}
                required={element.required}
                value={formValues[element.key] || ''}
                onChange={(e) => handleInputChange(e, element.key)}
                style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
              />
              {element.description && <p style={{ fontSize: '0.8em', color: '#888', marginTop: 4 }}>{element.description}</p>}
            </div>
          );
        case 'radio':
          return (
            <div key={element.id} style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>
                {element.label} {element.required && <span style={{ color: 'red' }}>*</span>}
              </label>
              <div style={{ display: 'flex', gap: 16 }}>
                {element.options?.map(opt => (
                  <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <input
                      type="radio"
                      name={element.key} // Name attribute is important for radio groups
                      value={opt.value}
                      checked={formValues[element.key] === opt.value}
                      onChange={(e) => handleInputChange(e, element.key)}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
          );
        case 'checkbox':
          return (
            <div key={element.id} style={{ marginBottom: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  name={element.key}
                  checked={!!formValues[element.key]}
                  onChange={(e) => handleInputChange(e, element.key)}
                />
                {element.label} {element.required && <span style={{ color: 'red' }}>*</span>}
              </label>
            </div>
          );
        case 'select':
          return (
            <div key={element.id} style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>
                {element.label} {element.required && <span style={{ color: 'red' }}>*</span>}
              </label>
              <select
                value={formValues[element.key] || ''}
                onChange={(e) => handleInputChange(e, element.key)}
                style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
              >
                <option value="">Select an option</option>
                {element.options?.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          );
        default:
          return (
            <div key={element.id} style={{ marginBottom: 12, color: 'orange' }}>
              Unsupported field type: {element.type} (ID: {element.id})
            </div>
          );
      }
    }

    // Render groups, sections, and repeaters
    function renderGroup(elementId) {
      console.log("elementId :" , elementId)
      const element = finaljson.blocks[elementId];
      console.log("element found:", element);
      if (!element) {
        console.warn(`Element with ID '${elementId}' not found in blocks.`);
        return null;
      }

      // If it's a field (not a container), render it directly
      if (element.type === 'text' || element.type === 'radio' || element.type === 'checkbox' || element.type === 'select') {
        return renderField(element);
      }

      // Handle container types (section, group, repeater)
      switch (element.type) {
        case 'section':
          return (
            <div key={element.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <h4 style={{ marginTop: 0, marginBottom: 12 }}>{element.label}</h4>
              {element.description && <p style={{ fontSize: '0.9em', color: '#666' }}>{element.description}</p>}
              <div style={{ paddingLeft: 8 }}>
                {element.children && element.children.map(childId => renderGroup(childId))}
              </div>
            </div>
          );
        case 'group':
          return (
            <div key={element.id} style={{ marginLeft: 16, marginBottom: 8, borderLeft: '2px solid #eee', paddingLeft: 8 }}>
              <label style={{ fontWeight: 'bold' }}>{element.label}</label>
              <div style={{ marginTop: 4 }}>
                {element.children && element.children.map(childId => renderGroup(childId))}
              </div>
            </div>
          );
        case 'repeater':
          // Basic repeater rendering - needs more complex logic for add/remove instances
          return (
            <div key={element.id} style={{ border: '1px dashed #ccc', padding: 16, marginBottom: 16 }}>
              <h4 style={{ marginTop: 0 }}>{element.label}</h4>
              {element.description && <p style={{ fontSize: '0.9em', color: '#666' }}>{element.description}</p>}
              <div style={{ paddingLeft: 8 }}>
                {/* For simplicity, render one instance for now. Add/Remove functionality would go here */}
                {element.children && element.children.map(childId => renderGroup(childId))}
              </div>
            </div>
          );
        default:
          return (
            <div key={element.id} style={{ marginBottom: 12, color: 'orange' }}>
              Unsupported container type: {element.type} (ID: {element.id})
            </div>
          );
      }
    }

    return (
      <form>
        {finaljson.steps.root.map(rootId => renderGroup(rootId))}
      </form>
    );
  }

  return (
    <div style={{ display: 'flex', height: '80vh', gap: 24 }}>
      {/* JSON Editor Block */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3>JSON Editor (inputGroups)</h3>
        <textarea
          value={jsonText}
          onChange={handleJsonChange}
          style={{ flex: 1, width: '100%', minHeight: 0, fontFamily: 'monospace', fontSize: 14, border: jsonError ? '2px solid red' : '1px solid #ccc', borderRadius: 4, padding: 8 }}
        />
        {jsonError && <div style={{ color: 'red', marginTop: 4 }}>Invalid JSON: {jsonError}</div>}
      </div>
      {/* Preview Form Block */}
      <div style={{ flex: 1, background: '#fafafa', borderRadius: 8, padding: 16, overflowY: 'auto', boxShadow: '0 2px 8px #0001' }}>
        <h3>Preview Form ({finaljson.title})</h3>
        {renderFormFromFinalJson(finaljson)}
        {/* <h4 style={{ marginTop: 24 }}>Form Values</h4>
        <pre style={{ background: '#f4f4f4', padding: 8, borderRadius: 4, fontSize: 13 }}>
          {JSON.stringify(formValues, null, 2)}
        </pre> */}
        <h4 style={{ marginTop: 24 }}>Transformed Steps & Blocks</h4>
        <pre style={{ background: '#f0f8ff', padding: 8, borderRadius: 4, fontSize: 12, maxHeight: 200, overflowY: 'auto' }}>
          {JSON.stringify(finaljson, null, 2)}
        </pre>
        {/* <h4 style={{ marginTop: 16 }}>Transformed Blocks (Sample)</h4>
        <pre style={{ background: '#fff8f0', padding: 8, borderRadius: 4, fontSize: 12, maxHeight: 300, overflowY: 'auto' }}>
          {JSON.stringify(Object.fromEntries(Object.entries(blocks).slice(0, 5)), null, 2)}
        </pre> */}
      </div>
    </div>
  );
};

export default Form

// function creatingFirstSequence(groups) {
//   let sequence = { root: [] };
//   // Collect top-level section, group, and repeater IDs
//   groups.forEach(item => {
//     if (item.type === "section" || item.type === "group" || item.type === "repeater") {
//       sequence.root.push(item.id);
//     }
//   });
//   return sequence;
// }

function creatingBlock(groups, parentKey) {
  const result = {};
  for (const group of groups) {
    let fullKey;
    if(parentKey){
        fullKey = `${parentKey}.${group.id}`;
    }else{
        fullKey = group.id;
    }
    // Base map of the group
    const map = {
      id: group.id,
      label: group.label,
      type: group.type,
      key: group.key,
      description: group.description,
      placeholder: group.placeholder,
      required: group.required,
      validation: group.validation,
      options: group.options,
      inputType: group.inputType,
      visibleIf: group.visibleIf,
      defaultValue: group.defaultValue
    };
    // Handle children recursively
    if (group.children) {
      map.children = group.children.map(function(child){
        return `${fullKey}.${child.id}`;  //  Store full paths
      });
      result[fullKey] = map;
      // Recursively flatten the children
      Object.assign(result, creatingBlock(group.children, fullKey));
    } else {
      result[fullKey] = map;
    }
  }
  return result;
}

function creatingFirstSequence(groups){
    let sequence = {};
    let root = [];
    root = groups.map(function(child){
        return child.id;
    })
    sequence.root = root;
    //recursively adding children
     function collectChildren(groups, parentKey) {
        for (const group of groups) {
            const fullKey = parentKey ? `${parentKey}.${group.id}` : group.id;
            if (group.children) {
                sequence[group.id] = group.children.map(child => `${fullKey}.${child.id}`);
                collectChildren(group.children, fullKey);
            }
        }
    }
    collectChildren(groups, "");
    return sequence;
}