import React, { useState } from 'react'

// Example inputGroups with all supported types and properties
const defaultInputGroups = [
  {
    id: "section-personal-info", // Unique ID for this section/group
    type: "section", // Marks this as a logical grouping
    label: "Personal Information",
    description: "Please provide your personal details.",
    children: [
      "field-full-name",
      "field-email",
      "field-gender",
      "field-subscribe-newsletter",
      "field-preferred-contact-method" // This field will be conditional
    ]
  },
  {
    id: "section-address",
    type: "group", // Marks this as a nested group within a section
    label: "Address Details",
    children: [
      "field-street",
      "field-city",
      "field-zip-code"
    ]
  },
  {
    id: "section-work-experience-repeater",
    type: "repeater", // Marks this as a repeatable group of fields
    label: "Work Experience",
    description: "Add details of your past work experiences.",
    children: [ // Children are IDs of fields that will be repeated together
      "field-company-name",
      "field-role",
      "field-start-date",
      "field-end-date"
    ]
  },
  // Individual fields (can be placed directly or referenced within sections/groups/repeaters)
  {
    id: "field-full-name",
    key: "fullName", // Key for backend data mapping
    type: "text", // Generic text type
    inputType: "text", // Specific HTML input type
    label: "Full Name",
    description: "Enter your full legal name.",
    placeholder: "John Doe",
    required: true,
    validation: {
      minLength: 2,
      maxLength: 50
    }
  },
  {
    id: "field-email",
    key: "email",
    type: "text",
    inputType: "email", // Use inputType for email
    label: "Email Address",
    placeholder: "john.doe@example.com",
    required: true,
    validation: {
      pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    }
  },
  {
    id: "field-gender",
    key: "gender",
    type: "radio",
    label: "Gender",
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "other", label: "Other" }
    ],
    required: false
  },
  {
    id: "field-subscribe-newsletter",
    key: "newsletter",
    type: "checkbox",
    label: "Subscribe to our newsletter?",
    defaultValue: false
  },
  {
    id: "field-preferred-contact-method",
    key: "contactMethod",
    type: "select",
    label: "Preferred Contact Method",
    options: [
      { value: "email", label: "Email" },
      { value: "phone", label: "Phone" },
      { value: "mail", label: "Postal Mail" }
    ],
    required: true,
    // Conditional visibility: only show if newsletter is true
    visibleIf: {
      field: "field-subscribe-newsletter", // The ID of the field to check against
      operator: "equals",
      value: true // The value to compare against
    }
  },
  {
    id: "field-street",
    key: "street",
    type: "text",
    inputType: "text",
    label: "Street",
    placeholder: "123 Main St"
  },
  {
    id: "field-city",
    key: "city",
    type: "text",
    inputType: "text",
    label: "City",
    placeholder: "Anytown"
  },
  {
    id: "field-zip-code",
    key: "zipCode",
    type: "text",
    inputType: "number", // Example of number input type
    label: "ZIP Code",
    placeholder: "12345"
  },
  {
    id: "field-company-name",
    key: "company",
    type: "text",
    inputType: "text",
    label: "Company Name",
    required: true
  },
  {
    id: "field-role",
    key: "role",
    type: "text",
    inputType: "text",
    label: "Role",
    required: true
  },
  {
    id: "field-start-date",
    key: "startDate",
    type: "text", // Using text for date for simplicity, could be 'date' type
    inputType: "date",
    label: "Start Date"
  },
  {
    id: "field-end-date",
    key: "endDate",
    type: "text",
    inputType: "date",
    label: "End Date"
  }
];

// const defaultInputGroups =[
//   {
//     key: "A",
//     label: "Group A"
//   },
//   {
//     key: "B.hemant",
//     label: "Group B",
//     children: [
//       {
//         key: "B1",
//         label: "Group B1"
//       },
//       {
//         key: "B2",
//         label: "Group B2"
//       }
//     ]
//   }
// ]

// const defaultInputGroups = [
  // {
  //   key: "fullName",
  //   label: "Full Name",
  //   field: {
  //     id: "block-1",
  //     key: "fullName",
  //     type: "text",
  //     label: "Full Name",
  //     description: "Please enter your full legal name as it appears on official documents.",
  //     placeholder: "Jane Mary Smith",
  //     required: true,
  //     validation: {
  //       minLength: 2,
  //       maxLength: 100
  //     }
  //   }
  // },
//   {
//     key: "email",
//     label: "Email Address",
//     field: {
//       id: "block-2",
//       key: "email",
//       type: "email",
//       label: "Email Address",
//       description: "We'll use this to contact you regarding your application.",
//       placeholder: "jane.smith@example.com",
//       required: true,
//       validation: {
//         pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
//       }
//     }
//   },
//   {
//     key: "gender",
//     label: "Gender",
//     field: {
//       id: "block-10",
//       key: "gender",
//       type: "radio",
//       label: "Gender",
//       description: "Optional - helps us with diversity data.",
//       options: [
//         { value: "male", label: "Male" },
//         { value: "female", label: "Female" },
//         { value: "other", label: "Other" },
//         { value: "prefer_not_say", label: "Prefer not to say" }
//       ],
//       required: false
//     }
//   },
//   {
//     key: "address",
//     label: "Address",
//     children: {
//       street: {
//         key: "street",
//         label: "Street Address",
//         field: {
//           id: "block-20",
//           key: "street",
//           type: "text",
//           label: "Street Address",
//           placeholder: "123 Maple Avenue",
//           required: true,
//           validation: {
//             minLength: 5,
//             maxLength: 200
//           }
//         }
//       },
//       city: {
//         key: "city",
//         label: "City",
//         field: {
//           id: "block-21",
//           key: "city",
//           type: "text",
//           label: "City",
//           placeholder: "New York",
//           required: true,
//           validation: {
//             minLength: 2,
//             maxLength: 100
//           }
//         }
//       },
//       zip: {
//         key: "zip",
//         label: "ZIP Code",
//         field: {
//           id: "block-22",
//           key: "zip",
//           type: "text",
//           label: "ZIP Code",
//           placeholder: "10001",
//           required: true,
//           validation: {
//             pattern: "^[0-9]{5}(-[0-9]{4})?$",
//             minLength: 5,
//             maxLength: 10
//           }
//         }
//       }
//     }
//   },
//   {
//     key: "experience",
//     label: "Work Experience",
//     children: {
//       company: {
//         key: "company",
//         label: "Company Name",
//         field: {
//           id: "block-23",
//           key: "company",
//           type: "text",
//           label: "Company Name",
//           placeholder: "Google LLC",
//           required: true,
//           validation: {
//             minLength: 2,
//             maxLength: 150
//           }
//         }
//       },
//       role: {
//         key: "role",
//         label: "Role",
//         field: {
//           id: "block-24",
//           key: "role",
//           type: "text",
//           label: "Role",
//           placeholder: "Software Engineer",
//           required: true,
//           validation: {
//             minLength: 2,
//             maxLength: 100
//           }
//         }
//       },
//       duration: {
//         key: "duration",
//         label: "Duration",
//         field: {
//           id: "block-25",
//           key: "duration",
//           type: "text",
//           label: "Duration",
//           placeholder: "Jan 2021 - Dec 2022",
//           required: true,
//           validation: {
//             minLength: 5,
//             maxLength: 50
//           }
//         }
//       }
//     }
//   }
// ];


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

  const blocks = creatingBlock(inputGroups);
  const sequence = creatingFirstSequence(inputGroups);

  const finaljson = {
    title: "Dynamic Form Preview", // A title for the form
    steps: sequence,
    blocks: blocks
  };

  console.log("finaljson", finaljson);

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

    function renderElement(elementId) {
      const element = finaljson.blocks[elementId];

      if (!element) {
        console.warn(`Element with ID '${elementId}' not found in blocks.`);
        return null;
      }

      // Check visibility condition for individual fields (not for sections/groups/repeaters yet)
      if (element.type !== "section" && element.type !== "group" && element.type !== "repeater" && !checkCondition(element.visibleIf)) {
        return null; // Don't render if condition is false
      }

      switch (element.type) {
        case 'section':
          return (
            <div key={element.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <h4 style={{ marginTop: 0, marginBottom: 12 }}>{element.label}</h4>
              {element.description && <p style={{ fontSize: '0.9em', color: '#666' }}>{element.description}</p>}
              <div style={{ paddingLeft: 8 }}>
                {element.children && element.children.map(childId => renderElement(childId))}
              </div>
            </div>
          );
        case 'group':
          return (
            <div key={element.id} style={{ marginLeft: 16, marginBottom: 8, borderLeft: '2px solid #eee', paddingLeft: 8 }}>
              <label style={{ fontWeight: 'bold' }}>{element.label}</label>
              <div style={{ marginTop: 4 }}>
                {element.children && element.children.map(childId => renderElement(childId))}
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
                {element.children && element.children.map(childId => renderElement(childId))}
              </div>
            </div>
          );
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

    return (
      <form>
        {finaljson.steps.root.map(rootId => renderElement(rootId))}
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
        <h4 style={{ marginTop: 24 }}>Form Values</h4>
        <pre style={{ background: '#f4f4f4', padding: 8, borderRadius: 4, fontSize: 13 }}>
          {JSON.stringify(formValues, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default Form

// function reconstructInputGroups(blocks, sequence) {
//   // This function is not used in the current rendering logic, but kept for reference.
//   // It would be used to convert 'blocks' and 'sequence' back to the original inputGroups format.
//   return [];
// }
function creatingFirstSequence(groups) {
  let sequence = { root: [] };
  // Collect top-level section, group, and repeater IDs
  groups.forEach(item => {
    if (item.type === "section" || item.type === "group" || item.type === "repeater") {
      sequence.root.push(item.id);
    }
  });
  return sequence;
}
function creatingBlock(groups) {
  const result = {};
  // Create a flat map of all items by their ID
  groups.forEach(item => {
    result[item.id] = { ...item }; // Store a copy of the item
  });
  return result;
}


//function to convert json into sequence
// function creatingFirstSequence(groups){
//     let sequence = {};
//     let root = [];
//     root = groups.map(function(child){
//         return child.id;
//     })
//     sequence.root = root;
//     //recursively adding children
//      function collectChildren(groups, parentKey) {
//         for (const group of groups) {
//             const fullKey = parentKey ? `${parentKey}.${group.id}` : group.id;
//             if (group.children) {
//                 sequence[group.id] = group.children.map(child => `${fullKey}.${child.id}`);
//                 collectChildren(group.children, fullKey);
//             }
//         }
//     }
//     collectChildren(groups, "");
//     return sequence;
// }
// function creatingBlock(groups, parentKey) {
//   const result = {};
//   for (const group of groups) {
//     let fullKey;
//     if(parentKey){
//         fullKey = `${parentKey}.${group.id}`;
//     }else{
//         fullKey = group.id;
//     }
//     // Base map of the group
//     const map = {
//       id: group.id,
//       label: group.label
//     };
//     // Handle children recursively
//     if (group.children) {
//       map.children = group.children.map(function(child){
//         return child.id;
//       });
//       result[fullKey] = map;
//       // Recursively flatten the children
//       Object.assign(result, creatingBlock(group.children, fullKey));
//     } else {
//       result[fullKey] = map;
//     }
//   }
//   return result;
// }