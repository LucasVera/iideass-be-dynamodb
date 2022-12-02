import Repository from "@common/repository/BaseRepository";
import { IdeaType, IdeaDto } from '../models/Idea'
import Idea from '../models/Idea'

export default class IdeaService {
  private repository: Repository

  constructor(repository: Repository) {
    this.repository = repository
  }

  async createIdea(email: string, subject: string, description: string, type: IdeaType): Promise<IdeaDto> {
    const idea = Idea.generate(email, subject, description, type)
    idea.preCreate()
    const ideaDto: IdeaDto = await this.repository.save(idea.toDto())

    return ideaDto
  }
}
