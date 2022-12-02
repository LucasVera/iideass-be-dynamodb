export default {
  type: 'object',
  properties: {
    email: { type: 'string' },
    subject: { type: 'string' },
    description: { type: 'string' },
    type: { type: 'string' },
  },
} as const
