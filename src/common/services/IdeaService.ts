import Repository from "@common/repository/BaseRepository";
import { IdeaType, IdeaDto } from '../models/Idea'
import Idea from '../models/Idea'
import { DynamoDbFilterAllDto, DynamoDbFilterAllResult } from "@common/repository/DynamoRepository";

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
   * @param type (IdeaType)- type of the idea (enum)
   * @returns Newly created idea
   */
  async createIdea(
    email: string,
    subject: string,
    description: string,
    type: IdeaType
  ): Promise<IdeaDto> {
    const idea = Idea.generate(email, subject, description, type)
    idea.preCreate()
    const ideaDto: IdeaDto = await this.repository.save(idea.toDto())

    return ideaDto
  }

  /**
   * Returns the list of ideas of a user with a given email
   * @param email (string) - Email of the user
   * @returns List of ideas
   */
  async findUserIdeas(email: string): Promise<{ ideas: IdeaDto[], count: number }> {
    const filters: DynamoDbFilterAllDto = {
      pk: { name: 'email', value: email },
    }

    const { items, count } = await this.repository.findAll(filters) as DynamoDbFilterAllResult

    const ideas = items.map(idea => new Idea(
      idea.id,
      idea.email,
      idea.subject,
      idea.description,
      idea.type,
      idea.createdAt,
      idea.updatedAt,
      idea.deletedAt
    ).toDto())

    return { ideas, count }
  }
}
