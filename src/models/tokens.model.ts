import { Column, Unique, Entity } from "typeorm"

import Record from "@models/record.model"
import { IAuthTokens } from "@typings/auth.type"

@Unique(["userId", "access", "refresh", "identity"])
@Entity("tokens")
class Tokens extends Record {
  @Column()
  public userId: string

  @Column()
  public refresh: string

  @Column()
  public access: string

  @Column()
  public identity: string

  public async update(authTokens: IAuthTokens): Promise<Tokens | undefined> {
    const entity = await Tokens.findOne({ where: { userId: authTokens.userId } })
    if (!entity) {
      return await Tokens.save(authTokens as Tokens)
    }

    entity.updatedAt = new Date()
    return await Tokens.save(Object.assign(entity, authTokens))
  }
}

export default Tokens
