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
        id: fullKey
      
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
  
export function changeSequence(stepsBlocksData, group_id, newIndex, field_id) {
    const stepsGroup = stepsBlocksData.steps[group_id] ? stepsBlocksData.steps[group_id] : null;
    const blocksGroup = stepsBlocksData.blocks[group_id] ? stepsBlocksData.blocks[group_id] : null;
  
    console.log(stepsGroup , "   :  " ,blocksGroup)
    if (!stepsGroup || !blocksGroup || !blocksGroup.children) {
      console.error("Invalid group ID or group structure.");
      return;
    }
  
    const currentIndex = stepsGroup.indexOf(field_id);
  console.log(currentIndex)
    if (currentIndex === -1) {
      console.error("Field not found in the specified group.");
      return;
    }
  
    // Remove field_id from current position
    stepsGroup.splice(currentIndex, 1);
    blocksGroup.children.splice(currentIndex, 1);
  
    // Clamp newIndex to valid range
    const clampedIndex = Math.min(Math.max(newIndex, 0), stepsGroup.length);
  
    // Insert field_id at newIndex
    stepsGroup.splice(clampedIndex, 0, field_id);
    blocksGroup.children.splice(clampedIndex, 0, field_id);
  
    console.log(`Updated order in group "${group_id}":`, stepsGroup);
  }
  