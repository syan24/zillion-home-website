import { MAX_ENQUIRY_FILE_BYTES } from '@/lib/enquiry/options'
import type { PublicEnquiryField } from '@/lib/enquiry/validate'

type LocaleCopy = { en: string; zh: string }

type OptionCopy = { value: string; label: LocaleCopy }

type FieldCopy = {
  blockType: string
  name?: string
  label?: LocaleCopy
  required?: boolean
  width?: number
  placeholder?: LocaleCopy
  options?: OptionCopy[]
  multiple?: boolean
  maxFileSize?: number
  mimeTypes?: string[]
  uploadCollection?: string
}

const uploadMimes = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/vnd.dwg',
  'application/acad',
  'application/x-dwg',
  'application/octet-stream',
]

/** Default Enquiry form. Seeded once; later edits in Admin are kept. */
export const defaultEnquiryFormFields: FieldCopy[] = [
  { blockType: 'text', name: 'name', label: { en: 'Name', zh: '姓名' }, required: true },
  {
    blockType: 'text',
    name: 'phone',
    label: { en: 'Mobile number', zh: '手机号码' },
    width: 50,
  },
  {
    blockType: 'email',
    name: 'email',
    label: { en: 'Email address', zh: '邮箱地址' },
    required: true,
    width: 50,
  },
  {
    blockType: 'text',
    name: 'address',
    label: { en: 'Project address / suburb', zh: '项目地址 / 区域' },
    required: true,
  },
  {
    blockType: 'radio',
    name: 'projectType',
    label: { en: 'Project type', zh: '项目类型' },
    required: true,
    options: [
      { value: 'residential', label: { en: 'Residential', zh: '住宅' } },
      { value: 'commercial', label: { en: 'Commercial', zh: '商业' } },
      { value: 'joinery', label: { en: 'Custom Joinery', zh: '定制木作' } },
    ],
  },
  {
    blockType: 'checkboxGroup',
    name: 'scope',
    label: { en: 'Scope of work', zh: '工作范围' },
    options: [
      { value: 'full-joinery', label: { en: 'Full Joinery', zh: '全屋定制' } },
      { value: 'kitchen', label: { en: 'Kitchen', zh: '厨房' } },
      { value: 'wardrobe', label: { en: 'Wardrobe', zh: '衣柜' } },
      { value: 'bathroom-vanity', label: { en: 'Bathroom Vanity', zh: '浴室柜' } },
      { value: 'tv-unit', label: { en: 'TV Unit', zh: '电视柜' } },
      { value: 'other', label: { en: 'Other', zh: '其他' } },
    ],
  },
  {
    blockType: 'select',
    name: 'budget',
    label: { en: 'Approximate budget', zh: '预计预算' },
    width: 50,
    placeholder: { en: 'Select budget range', zh: '请选择预算范围' },
    options: [
      { value: 'under-50k', label: { en: 'Under $50,000', zh: '5 万澳元以下' } },
      { value: '50k-100k', label: { en: '$50,000 – $100,000', zh: '5 万 – 10 万澳元' } },
      { value: '100k-250k', label: { en: '$100,000 – $250,000', zh: '10 万 – 25 万澳元' } },
      { value: '250k-500k', label: { en: '$250,000 – $500,000', zh: '25 万 – 50 万澳元' } },
      { value: 'over-500k', label: { en: 'Over $500,000', zh: '50 万澳元以上' } },
    ],
  },
  {
    blockType: 'select',
    name: 'timeline',
    label: { en: 'Expected timeline', zh: '期望时间' },
    width: 50,
    placeholder: { en: 'Select expected start', zh: '请选择预计开始时间' },
    options: [
      { value: 'asap', label: { en: 'As soon as possible', zh: '尽快' } },
      { value: '1-3-months', label: { en: '1–3 months', zh: '1–3 个月' } },
      { value: '3-6-months', label: { en: '3–6 months', zh: '3–6 个月' } },
      { value: '6-12-months', label: { en: '6–12 months', zh: '6–12 个月' } },
      { value: 'planning', label: { en: 'Just planning', zh: '还在规划' } },
    ],
  },
  {
    blockType: 'textarea',
    name: 'notes',
    label: { en: 'Project description', zh: '项目描述' },
  },
  {
    blockType: 'upload',
    name: 'attachments',
    label: { en: 'Upload photos / drawings / documents', zh: '上传照片 / 图纸 / 文件' },
    multiple: true,
    maxFileSize: MAX_ENQUIRY_FILE_BYTES,
    uploadCollection: 'enquiry-files',
    mimeTypes: uploadMimes,
  },
]

export const enquirySubmitLabel: LocaleCopy = { en: 'Submit Enquiry →', zh: '提交咨询 →' }

export const enquiryConfirmationText: LocaleCopy = {
  en: 'Thank you. Your enquiry has been received.',
  zh: '感谢您的咨询，我们已收到您的信息。',
}

export function publicEnquiryFields(locale: 'en' | 'zh'): PublicEnquiryField[] {
  return defaultEnquiryFormFields.map((field) => ({
    blockType: field.blockType,
    name: field.name,
    label: field.label?.[locale],
    required: field.required,
    width: field.width,
    placeholder: field.placeholder?.[locale],
    multiple: field.multiple,
    maxFileSize: field.maxFileSize,
    mimeTypes: field.mimeTypes,
    options: field.options?.map((option) => ({
      value: option.value,
      label: option.label[locale],
    })),
  }))
}

export function payloadEnquiryFields(locale: 'en' | 'zh') {
  return defaultEnquiryFormFields.map((field) => {
    const { label, placeholder, options, mimeTypes, ...rest } = field
    return {
      ...rest,
      ...(label ? { label: label[locale] } : {}),
      ...(placeholder ? { placeholder: placeholder[locale] } : {}),
      ...(options
        ? { options: options.map((option) => ({ value: option.value, label: option.label[locale] })) }
        : {}),
      ...(mimeTypes ? { mimeTypes: mimeTypes.map((mimeType) => ({ mimeType })) } : {}),
    }
  })
}
