import Idea from "@common/models/Idea";

export const ideaMockFactory = (overrides: any = {}) => {
  const {
    email = 'emailMock',
    subject = 'subjectMock',
    description = 'descriptionMock',
    ideaType = 'ideaTypeMock',
    id,
    createdAt,
    updatedAt,
    deletedAt,
  } = overrides

  return new Idea(
    id,
    email,
    subject,
    description,
    ideaType,
    createdAt,
    updatedAt,
    deletedAt,
  )
}