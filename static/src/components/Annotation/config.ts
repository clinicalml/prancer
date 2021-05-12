import { Label } from './types'

const SAMPLE_LABELS: Label[] = [
  {
    labelId: 'C000',
    title: 'Label0',
    categories: [{ title: 'category', type: 'general' }],
  },
  {
    labelId: 'C001',
    title: 'Label1',
    categories: [{ title: 'category', type: 'general' }],
  },
  {
    labelId: 'C002',
    title: 'Label2',
    categories: [{ title: 'category', type: 'general' }],
  }
]

const LABELS = SAMPLE_LABELS

export default LABELS

export const INLINE_LABELS = false
