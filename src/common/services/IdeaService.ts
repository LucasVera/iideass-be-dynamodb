import Repository from '@common/repository/BaseRepository'
import { IdeaType, IdeaDto } from '../models/Idea'
import Idea from '../models/Idea'
import {
  DynamoDbDeleteOneDto,
  DynamoDbFilterAllDto,
  DynamoDbFilterAllResult,
  DynamoDbFindByPkDto,
  DynamoDbUpdateOneDto,
} from '@common/repository/DynamoRepository'
import { getUnixTimestamp } from '@common/util/datetime'
import { BadInputError, NotFoundError } from '@common/errors/CustomError'

export default class IdeaService {
  private repository: Repository

  constructor(repository: Repository) {
    this.repository = repository
  }

  /**
   * Creates an id with given attributes
   * @param email (string) - user's email
   * @param subject (string) - subject of the idea
   * @param description (string) - description of the idea
   * @param ideaType (IdeaType)- type of the idea (enum)
   * @returns Newly created idea
   */
  async createIdea(email: string, subject: string, description: string, ideaType: IdeaType): Promise<IdeaDto> {
    const idea = Idea.generate(email, subject, description, ideaType)
    idea.preCreate()
    const ideaDto: IdeaDto = await this.repository.save(idea.toDto())

    return ideaDto
  }

  /**
   * Returns the list of ideas of a user with a given email
   * @param email (string) - Email of the user
   * @returns List of ideas
   */
  async findUserIdeas(email: string): Promise<{ ideas: IdeaDto[]; count: number }> {
    const filters: DynamoDbFilterAllDto = {
      key: { pk: { name: 'email', value: email } },
    }

    const { items, count } = (await this.repository.findAll(filters)) as DynamoDbFilterAllResult

    const ideas = items.map((idea) =>
      new Idea(
        idea.id,
        idea.email,
        idea.subject,
        idea.description,
        idea.ideaType,
        idea.createdAt,
        idea.updatedAt,
        idea.deletedAt
      ).toDto()
    )

    return { ideas, count }
  }

  async findOne(email: string, subject: string): Promise<Idea> {
    const filter: DynamoDbFindByPkDto = {
      key: {
        pk: { name: 'email', value: email },
        sk: { name: 'subject', value: subject },
      },
    }

    const result = await this.repository.findByPk(filter)

    if (!result) return result

    return new Idea(
      result.id,
      result.email,
      result.subject,
      result.description,
      result.ideaType,
      result.createdAt,
      result.updatedAt,
      result.deletedAt
    )
  }

  async updateIdea(email: string, subject: string, description: string, ideaType: IdeaType): Promise<boolean> {
    const propsToUpdate: any[] = [{ updatedAt: getUnixTimestamp() }]
    if (description) propsToUpdate.push({ description })
    if (ideaType) propsToUpdate.push({ ideaType })

    const updateOneDto: DynamoDbUpdateOneDto = {
      key: {
        pk: { name: 'email', value: email },
        sk: { name: 'subject', value: subject },
      },
      propsToUpdate,
    }

    await this.repository.updateOne(updateOneDto)

    return true
  }

  async deleteIdea(idea: Idea): Promise<number> {
    // delete first, then re-create
    const ideaDto = idea.toDto()
    const key = {
      pk: { name: 'email', value: ideaDto.email },
      sk: { name: 'subject', value: ideaDto.subject },
    }

    const deleteOneDto: DynamoDbDeleteOneDto = { key }

    await this.repository.deleteOne(deleteOneDto)

    idea.preDelete()

    const deletedIdea = await this.repository.save(idea.toDto())

    return deletedIdea
  }

  async findAndValidateIdeaExists(email: string, subject: string): Promise<Idea> {
    const err = new NotFoundError('Idea not found', { email, subject })
    const dbIdea = await this.findOne(email, subject)
    if (!dbIdea) throw err

    const dto = dbIdea.toDto()
    if (!dto || !dto.email) throw err

    return dbIdea
  }

  async validateIdeaDoesntExist(email: string, subject: string): Promise<void> {
    const dbIdea = await this.findOne(email, subject)
    const dto = dbIdea.toDto()
    if (dto && dto.email) throw new BadInputError('Idea already exists', { email, subject })
  }
}
