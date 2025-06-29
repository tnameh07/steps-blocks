export const defaultInputGroups = [
  {
    id: "personal-info",
    type: "group",
    label: "Personal Info",
    description: "Your basic details",
    children: [
      {
        id: "full-name",
        key: "fullName",
        type: "text",
        inputType: "text",
        label: "Full Name",
        inputType: "static",
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
  inputType: "static",
  options: [
    { value: "optin", label: "Email" },
    { value: "phone", label: "Phone" },
    { value: "mail", label: "Mail" }
  ],
  required: true
},
{
  id: "child2",
  key: "child2",
  type: "text",
  inputType: "text",
  label: "Child 2",
  placeholder: "Enter child 2 value",
  visibleIf: {
    field: "child1",
    operator: "notEquals",
    value: ""
  }
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
      inputType: "static",
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
      inputType: "static",
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
        id: "city",
        key: "city",
        type: "text",
        inputType: "text",
        label: "City",
        placeholder: "Anytown"
      },
      {
        id: "street",
        key: "street",
        type: "text",
        inputType: "text",
        label: "Street",
        placeholder: "123 Main St",
        visibleIf: {
        field: "city",
        operator: "notEquals",
        value: ""
      }
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
    type: "group",
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
        inputType: "static",
        required: true,
        visibleIf: {
        field: "company",
        operator: "notEquals",
        value: ""
      }
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
        label: "End Date",
        disabledIf: {
        field: "startDate",
        operator: "equals",
        value: ""
      }
      }
    ]
  },
  {
      id: "feedback",
      key: "feedback",
      type: "select",
      label: "Feedback",
      inputType: "static",
      options: [
        { value: "positive", label: "Positve" },
        { value: "negative", label: "Negative" },
        { value: "other", label: "Other" }
      ],
      required: true
    },
  {
  id: "other",
  key: "other",
  type: "text",
  label: "Other :Please Specify",
  inputType: "static",
  required: true,
  visibleIf: {
        field: "feedback",
        operator: "equals",
        value: "other"
      }
  },
  {
  id: "country",
  key: "country",
  type: "select",
  label: "Country",
  inputType: "dynamic",
  sourceCode: `
   try {
      const getCountry = await fetch('https://flow.sokt.io/func/scriEozEsv6d/?fields=country');
      const country = await getCountry.json();
      return country;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  `,
  // "function abc(){const country = [\"US\", \"India\", \"Japan\"]; return country;} abc();",
  // options: [
  //   { value: "US", label: "US" },
  //   { value: "India", label: "India" },
  //   { value: "Japan", label: "Japan" }
  // ],
  required: true
},
{
  id: "state",
  key: "state",
  type: "select",
  label: "State",
  inputType: "dynamic",
  required: true,
  dependsOn: ["country", "subscribe"],
  sourceCode: "try { if (!inputData.country) { return []; } const res = await fetch(`https://flow.sokt.io/func/scriEozEsv6d/?fields=state&country=${inputData.country}`); if (!res.ok) { return []; } const states = await res.json(); return states; } catch (e) { console.error(e); return []; }",
  visibilityCode: `
    return inputData.country === "India" && inputData.subscribe === true;
  `
},

];

export function creatingBlock(groups, parentKey) {
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
      ...group,
      // id: fullKey
    
      // id: group.id,
      // label: group.label,
      // type: group.type,
      // key: group.key,
      // description: group.description,
      // placeholder: group.placeholder,
      // required: group.required,
      // validation: group.validation,
      // options: group.options,
      // inputType: group.inputType,
      // visibleIf: group.visibleIf,
      // defaultValue: group.defaultValue
    };
  //   // Handle children recursively
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

export function creatingFirstSequence(groups){
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
                sequence[fullKey] = group.children.map(child => `${fullKey}.${child.id}`);
                collectChildren(group.children, fullKey);
            }
        }
    }
    collectChildren(groups, "");
    return sequence;
}


export function changeSequence(stepsBlocksData, setStepsBlocksData, group_id, field_id, direction) {
  console.log("Parent: ",group_id);
  console.log("current: ",field_id);
  if (!stepsBlocksData || !stepsBlocksData.steps[group_id]) return;

  const stepsGroup = stepsBlocksData.steps[group_id];
  const blocksGroup = stepsBlocksData.blocks[group_id];
  const currentIndex = stepsGroup.indexOf(field_id);

  let targetIndex;
  if (direction === 'up') targetIndex = currentIndex - 1;
  else if (direction === 'down') targetIndex = currentIndex + 1;
  else return;

  if (targetIndex < 0 || targetIndex >= stepsGroup.length) return;

  // Immutably copy arrays
  const newStepsGroup = [...stepsGroup];
  const newBlocksChildren = blocksGroup?.children ? [...blocksGroup.children] : null;

  // Swap in steps
  [newStepsGroup[currentIndex], newStepsGroup[targetIndex]] = [newStepsGroup[targetIndex], newStepsGroup[currentIndex]];
  // Swap in blocks.children if present
  if (newBlocksChildren) {
    [newBlocksChildren[currentIndex], newBlocksChildren[targetIndex]] = [newBlocksChildren[targetIndex], newBlocksChildren[currentIndex]];
  }

  // Build new state
  setStepsBlocksData(prev => ({
    ...prev,
    steps: {
      ...prev.steps,
      [group_id]: newStepsGroup,
    },
    blocks: {
      ...prev.blocks,
      [group_id]: {
        ...prev.blocks[group_id],
        ...(newBlocksChildren ? { children: newBlocksChildren } : {}),
      },
    },
  }));
};


export function reconstructInputGroups(stepsBlocksData) {
  const { blocks, steps } = stepsBlocksData;
  function buildGroup(key) {
    const block = blocks[key];
    const group = { ...block };

    if (steps[key]) {
      group.children = steps[key].map(childId => buildGroup(childId));
    } else {
      delete group.children;
    }

    return group;
  }
  const reconstructed = steps.root.map(rootKey => buildGroup(rootKey));
  return reconstructed;
}

export const handleEditFieldChange = (fieldKey, newValue , setLocalEditData) => {
  setLocalEditData(prev => {
      const newLocalEditData = { ...prev, [fieldKey]: newValue };

      // Special handling for type change:
      // If type changes to something that doesn't need options, clear them
      if (fieldKey === "type") {
          if (!["select", "radio", "multichoice"].includes(newValue)) {
              delete newLocalEditData.options;
          } else if (!newLocalEditData.options) {
              // If type changes to something that needs options and they don't exist, initialize
              newLocalEditData.options = [];
          }
      }

      // Special handling for inputType change:
      // If inputType changes from dynamic, clear sourceCode
      if (fieldKey === "inputType" && newValue !== "dynamic") {
          delete newLocalEditData.sourceCode;
      } else if (fieldKey === "inputType" && newValue === "dynamic" && !newLocalEditData.sourceCode) {
           newLocalEditData.sourceCode = ""; // Initialize sourceCode if it's dynamic and not present
      }
      
      return newLocalEditData;
  });
}

export function extractDependsOnKeysFromCode(codeString) {
  console.log(codeString);
  const regex = /inputData\.([a-zA-Z0-9_]+)/g;
  const matches = [...codeString.matchAll(regex)];
  const keys = matches.map(match => match[1]);
  const result = Array.from(new Set(keys));
  console.log("result : ",result)
  return result;
}