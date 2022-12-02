import { getUnixTimestamp } from '@common/util/datetime'
import { generateRandom } from '@common/util/number'
import Model from './BaseModel'

export default class Idea extends Model {
  private id: number
  private email: string
  private subject: string
  private description: string
  private type: IdeaType
  private createdAt?: number
  private updatedAt?: number
  private deletedAt?: number

  constructor(
    id: number,
    email: string,
    subject: string,
    description: string,
    type: IdeaType,
    createdAt?: number,
    updatedAt?: number,
    deletedAt?: number
  ) {
    super()
    this.id = id
    this.email = email
    this.subject = subject
    this.description = description
    this.type = type
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
  }

  toDto = (): IdeaDto => ({
    id: this.id,
    email: this.email,
    subject: this.subject,
    description: this.description,
    type: this.type,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    deletedAt: this.deletedAt,
  })

  preCreate = () => {
    const currentTimestamp = getUnixTimestamp()
    this.createdAt = currentTimestamp
    this.updatedAt = currentTimestamp
  }

  static generate = (email: string, subject: string, description: string, type: IdeaType) =>
    new Idea(generateRandom(), email, subject, description, type)
}

export enum IdeaType {
  STORY = 'Story',
  APP = 'App',
  DISH = 'Dish',
  NON_TECH_PROJECT = 'Non tech project',
  VACATION_TRIP = 'Vacation trip',
  OTHER = 'Other',
}

export interface IdeaDto {
  id: number
  email: string
  subject: string
  description: string
  type: IdeaType
  createdAt: number
  updatedAt: number
  deletedAt: number
}
