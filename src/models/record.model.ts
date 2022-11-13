import { PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm"

class Record extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string

  @Column({ select: false })
  @CreateDateColumn()
  createdAt: Date

  @Column()
  @UpdateDateColumn()
  updatedAt: Date
}

export default Record
