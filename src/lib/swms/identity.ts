const CONTROL_CHARS = /[\u0000-\u001F\u007F]/

export type WorkerIdentity = {
  name: string
  phone: string
  nameKey: string
  phoneKey: string
}

type Ok = { ok: true; value: WorkerIdentity }
type Err = { ok: false; error: string }

export function workerNameKey(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ')
}

/** Australian mobiles match whether they are stored as 04… or +61 4…. */
export function workerPhoneKey(phone: string): string {
  let digits = phone.replace(/\D/g, '')
  if (digits.startsWith('61') && digits.length === 11) digits = `0${digits.slice(2)}`
  return digits
}

export function validateWorkerIdentity(name: unknown, phone: unknown): Ok | Err {
  const cleanName = cleanText(name, 120)
  const cleanPhone = cleanText(phone, 40)

  if (cleanName.length < 2) {
    return { ok: false, error: 'Enter the worker’s full name. 请填写姓名。' }
  }
  if (cleanPhone && !/^[0-9+().\-\s]+$/.test(cleanPhone)) {
    return { ok: false, error: 'Enter a valid phone number. 请填写有效电话。' }
  }

  const phoneKey = workerPhoneKey(cleanPhone)
  if (phoneKey.length < 8 || phoneKey.length > 15) {
    return { ok: false, error: 'Enter a contact phone number. 请填写联系电话。' }
  }

  return {
    ok: true,
    value: {
      name: cleanName,
      phone: cleanPhone,
      nameKey: workerNameKey(cleanName),
      phoneKey,
    },
  }
}

function cleanText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return ''
  const trimmed = value.replace(/\s+/g, ' ').trim()
  if (!trimmed || CONTROL_CHARS.test(trimmed)) return ''
  return trimmed.slice(0, maxLength)
}
