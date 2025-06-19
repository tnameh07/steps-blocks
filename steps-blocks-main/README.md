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


Transformed Steps & Blocks

{
    "title": "Dynamic Form Preview",
    "steps": {
        "root": [
            "personal-info",
            "address-info",
            "work-experience"
        ],
        "personal-info": [
            "personal-info.full-name",
            "personal-info.nested-group",
            "personal-info.email",
            "personal-info.gender",
            "personal-info.subscribe",
            "personal-info.contact-method"
        ],
        "nested-group": [
            "personal-info.nested-group.child1",
            "personal-info.nested-group.child2"
        ],
        "address-info": [
            "address-info.street",
            "address-info.city",
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
            "label": "Personal Info",
            "type": "section",
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
            "label": "Full Name",
            "type": "text",
            "key": "fullName",
            "placeholder": "John Doe",
            "required": true,
            "validation": {
                "minLength": 2,
                "maxLength": 50
            },
            "inputType": "text"
        },
        "personal-info.nested-group": {
            "id": "nested-group",
            "label": "Nested Group",
            "type": "group",
            "key": "nestedGroup",
            "children": [
                "personal-info.nested-group.child1",
                "personal-info.nested-group.child2"
            ]
        },
        "personal-info.nested-group.child1": {
            "id": "child1",
            "label": "Child 1",
            "type": "select",
            "key": "child1",
            "required": true,
            "options": [
                {
                    "value": "optin",
                    "label": "Email"
                },
                {
                    "value": "phone",
                    "label": "Phone"
                },
                {
                    "value": "mail",
                    "label": "Mail"
                }
            ],
            "visibleIf": {
                "field": "subscribe",
                "operator": "equals",
                "value": true
            }
        },
        "personal-info.nested-group.child2": {
            "id": "child2",
            "label": "Child 2",
            "type": "text",
            "key": "child2",
            "placeholder": "Enter child 2 value",
            "inputType": "text"
        },
        "personal-info.email": {
            "id": "email",
            "label": "Email",
            "type": "text",
            "key": "email",
            "placeholder": "john@example.com",
            "required": true,
            "validation": {
                "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
            },
            "inputType": "email"
        },
        "personal-info.gender": {
            "id": "gender",
            "label": "Gender",
            "type": "radio",
            "key": "gender",
            "options": [
                {
                    "value": "male",
                    "label": "Male"
                },
                {
                    "value": "female",
                    "label": "Female"
                },
                {
                    "value": "other",
                    "label": "Other"
                }
            ]
        },
        "personal-info.subscribe": {
            "id": "subscribe",
            "label": "Subscribe to newsletter",
            "type": "checkbox",
            "key": "subscribe",
            "defaultValue": false
        },
        "personal-info.contact-method": {
            "id": "contact-method",
            "label": "Preferred Contact",
            "type": "select",
            "key": "contactMethod",
            "required": true,
            "options": [
                {
                    "value": "email",
                    "label": "Email"
                },
                {
                    "value": "phone",
                    "label": "Phone"
                },
                {
                    "value": "mail",
                    "label": "Mail"
                }
            ],
            "visibleIf": {
                "field": "subscribe",
                "operator": "equals",
                "value": true
            }
        },
        "address-info": {
            "id": "address-info",
            "label": "Address",
            "type": "group",
            "children": [
                "address-info.street",
                "address-info.city",
                "address-info.zip"
            ]
        },
        "address-info.street": {
            "id": "street",
            "label": "Street",
            "type": "text",
            "key": "street",
            "placeholder": "123 Main St",
            "inputType": "text"
        },
        "address-info.city": {
            "id": "city",
            "label": "City",
            "type": "text",
            "key": "city",
            "placeholder": "Anytown",
            "inputType": "text"
        },
        "address-info.zip": {
            "id": "zip",
            "label": "ZIP",
            "type": "text",
            "key": "zip",
            "placeholder": "12345",
            "inputType": "number"
        },
        "work-experience": {
            "id": "work-experience",
            "label": "Work Experience",
            "type": "repeater",
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
            "label": "Company",
            "type": "text",
            "key": "company",
            "required": true,
            "inputType": "text"
        },
        "work-experience.job-title": {
            "id": "job-title",
            "label": "Role",
            "type": "text",
            "key": "role",
            "required": true,
            "inputType": "text"
        },
        "work-experience.start": {
            "id": "start",
            "label": "Start Date",
            "type": "text",
            "key": "startDate",
            "inputType": "date"
        },
        "work-experience.end": {
            "id": "end",
            "label": "End Date",
            "type": "text",
            "key": "endDate",
            "inputType": "date"
        }
    }
}