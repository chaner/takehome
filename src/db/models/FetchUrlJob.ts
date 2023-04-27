import { Table, Column, Model, CreatedAt, UpdatedAt, BelongsTo, ForeignKey, HasMany } from 'sequelize-typescript';
import { FetchUrlExecution } from './FetchUrlExecution';

@Table
export class FetchUrlJob extends Model {

  @Column({ primaryKey: true, autoIncrement: true })
  id: bigint;

  @HasMany(() => FetchUrlExecution)
  executions: FetchUrlExecution[];

  @Column
  url: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

}