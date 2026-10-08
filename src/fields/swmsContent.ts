import type { Field } from 'payload'

const questionFields: Field[] = [
  {
    name: 'question',
    type: 'text',
    required: true,
  },
  {
    name: 'type',
    type: 'select',
    required: true,
    defaultValue: 'yes-no',
    options: [
      { label: 'Yes / No', value: 'yes-no' },
      { label: 'Yes / No / Not applicable', value: 'yes-no-na' },
      { label: 'Acknowledgement', value: 'acknowledgement' },
    ],
  },
  {
    name: 'required',
    type: 'checkbox',
    label: 'Required',
    defaultValue: true,
  },
  {
    name: 'correctAnswer',
    type: 'select',
    label: 'Expected answer',
    defaultValue: 'yes',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
      { label: 'Any', value: 'any' },
    ],
    admin: {
      description:
        'Stored with the question for review. Signing is not blocked when a worker answers differently.',
      condition: (_data, siblingData) =>
        siblingData?.type === 'yes-no' || siblingData?.type === 'yes-no-na',
    },
  },
]

export const swmsSectionsField = (description: string): Field => ({
  name: 'sections',
  type: 'array',
  labels: {
    singular: 'Section',
    plural: 'Sections',
  },
  admin: {
    description,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'textarea',
      label: 'Section content',
    },
    {
      name: 'questions',
      type: 'array',
      labels: {
        singular: 'Question',
        plural: 'Questions',
      },
      fields: questionFields,
    },
  ],
})

export const acknowledgementTextField: Field = {
  name: 'acknowledgementText',
  type: 'textarea',
  required: true,
  label: 'Final acknowledgement statement',
  defaultValue:
    'I have read and understood this Safe Work Method Statement. I agree to follow the safe work practices outlined above.',
}
