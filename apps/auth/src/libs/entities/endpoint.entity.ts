import { AbstractEntity } from '@app/common';
import { Column, Entity } from 'typeorm';

@Entity()
export class Endpoint extends AbstractEntity<Endpoint> {
  @Column({ nullable: true })
  tag?: string;

  @Column()
  // method: string;
  operation_type: string;

  @Column()
  // path: string;
  operation_name: string;
}
