import DynamoRepository from "@common/repository/DynamoRepository"
import dynamodb from "@common/aws/dynamodb"
import { ideaMockFactory } from "@common/util/tests"
import { when, resetAllWhenMocks } from 'jest-when'
import IdeaService from "./IdeaService"

jest.mock('@common/aws/dynamodb')

// Using AAA pattern: arrange, act, assert
describe('Idea service tests', () => {
  describe('create Idea tests', () => {

    afterEach(() => {
      resetAllWhenMocks()
    })

    it('Creates and idea with given parameters', async () => {
      const ideaMock = ideaMockFactory()
      const dto = ideaMock.toDto()
      when(dynamodb.putItem)
        .calledWith(expect.any(Object))
        .mockResolvedValue({} as any)

      const service = new IdeaService(new DynamoRepository({ TableName: 'mock' }))
      const newIdea = await service.createIdea(dto.email, dto.subject, dto.description, dto.ideaType)

      expect(newIdea).toBeTruthy()
      expect(newIdea.id).toBeTruthy()
      expect(newIdea.createdAt).toBeTruthy()
      expect(newIdea.updatedAt).toBeTruthy()
      expect(newIdea.deletedAt).toBeFalsy()
      expect(newIdea.email).toBe(dto.email)
      expect(newIdea.subject).toBe(dto.subject)
      expect(newIdea.description).toBe(dto.description)
      expect(newIdea.ideaType).toBe(dto.ideaType)
    })

    it('Throws error when dynamodb putItem fails', async () => {

      const ideaMock = ideaMockFactory()
      const dto = ideaMock.toDto()
      const error = new Error('test')
      when(dynamodb.putItem)
        .mockRejectedValue(error)

      const service = new IdeaService(new DynamoRepository({ TableName: 'mock' }))

      let runtimeError
      let newIdea
      try {
        newIdea = await service.createIdea(dto.email, dto.subject, dto.description, dto.ideaType)
      }
      catch (ex) {
        runtimeError = ex
      }

      expect(newIdea).toBeFalsy()
      expect(runtimeError).toBeTruthy()
      expect(runtimeError instanceof Error).toBeTruthy()
      expect(runtimeError.message).toBe(error.message)
    })

  })

  describe('delete idea tests', () => {
    it('Should mark object as deleted instead of actually deleting it', async () => {
      const ideaMock = ideaMockFactory({ createdAt: 123, updatedAt: 123, id: 123 })
      const dto = ideaMock.toDto()

      when(dynamodb.deleteItem)
        .calledWith(expect.any(Object))
        .mockResolvedValue({} as any)

      when(dynamodb.putItem)
        .calledWith(expect.any(Object))
        .mockResolvedValue({} as any)

      const service = new IdeaService(new DynamoRepository({ TableName: 'mock' }))
      const deletedIdea = await service.deleteIdea(ideaMock)

      expect(deletedIdea).toBeTruthy()
      expect(deletedIdea.id).toBeTruthy()
      expect(deletedIdea.createdAt).toBeTruthy()
      expect(deletedIdea.updatedAt).toBeTruthy()
      expect(deletedIdea.email).toBe(dto.email)
      expect(deletedIdea.description).toBe(dto.description)
      expect(deletedIdea.ideaType).toBe(dto.ideaType)

      expect(deletedIdea.deletedAt).toBeTruthy()
      const splittedSubject = deletedIdea.subject.split('-')
      expect(splittedSubject.length).toBe(2)
      const [originalSubject, deletedAtTimestamp] = splittedSubject
      expect(originalSubject).toBe(dto.subject)
      expect(deletedIdea.deletedAt).toBe(Number(deletedAtTimestamp))
    })
  })
})
