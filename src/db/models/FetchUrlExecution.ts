import { Table, Column, Model, CreatedAt, UpdatedAt, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { JobStatus } from '../../services/JobService';
import { FetchUrlJob } from './FetchUrlJob';
@Table
export class FetchUrlExecution extends Model {

  @Column({ primaryKey: true, autoIncrement: true })
  id: bigint;

  @ForeignKey(() => FetchUrlJob)
  fetchUrlJobId: bigint;

  @Column
  status: JobStatus;

  @Column
  error: string;

  @Column
  html: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

}