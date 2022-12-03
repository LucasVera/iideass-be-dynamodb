import baseIdeaMock from "./baseIdeaMock";

// Marking props optional to test different scenarios
interface CreateBodyInput {
  email?: string
  subject?: string
  description?: string
  ideaType?: string
}
export default {
  ...baseIdeaMock,
  description: "integration description",
  ideaType: "Story",
} as CreateBodyInput
