import { Optional } from "sequelize";
import {
  Table,
  Column,
  Model,
  Unique,
  ForeignKey,
  BelongsTo,
  HasMany,
  DefaultScope,
  Scopes,
} from "sequelize-typescript";
interface AuthAttributes {
  id: number
  username: string
  hash: string
  role: string
}
export interface AuthCreationAttributes extends Optional<AuthAttributes, 'id'> {}
@Table
export class Authorize extends Model<AuthAttributes,AuthCreationAttributes> {
  @Column
  username!: string;

  @Column
  hash!: string;

  @Column
  role!: string;
}
interface UserAttributes {
  id: number;
  firstname?: string;
  surname?: string;
  serialnumber: number;
  cars?:Car[]
}
export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}
@Table
export class Users extends Model<UserAttributes,UserCreationAttributes> {
  @Column
  firstname!: string;

  @Column
  surname?: string;

 
  @Unique
  @Column
  serialnumber!: number;

  @HasMany(() => Car, "userserialnumber")
  cars?: Car[];
}
interface CarAttributes {
  id: number;
  make?: string;
  model?: string;
  userserialnumber: number;
}
export interface CarCreationAttributes extends Optional<CarAttributes, 'id'> {}
@Table
export class Car extends Model {
  @Column
  make!: string;

  @Column
  model?: string;
  @ForeignKey(() => Users)
  @Column
  userserialnumber!: number;
  @BelongsTo(() => Users, "serialnumber")
  users?: Users;
}

interface ElControlAttributes {
  id: number;
  card: number;
  relay: number;
  type?: string;
  groupname: string;
  title?: string;
  kwh?:number
  kwhs?:Kwh[]
}
export interface ElControlCreationAttributes extends Optional<ElControlAttributes, 'id'> {}

@DefaultScope(() => ({
  attributes: [
    'card',
    'relay',
    'type',
    'groupname',
    'title',
    'kwh']
}))
@Scopes(() => ({
  full: {
    include: [Kwh]
  },
  lights: {
    where: {groupname : 'valot' }
  }
}))
@Table({ timestamps: false })
export class Elcontrol extends Model<ElControlAttributes,ElControlCreationAttributes> {
  @Column
  card!: number;

  @Column
  relay!: number;

  @Column
  type!: string;

  @Column
  groupname!: string;
  @Column
  title?: string;

/*   @Column
  status!: boolean; */

  @Column
  kwh?: number;
  @HasMany(() => Kwh, "elcontrolrelay")
  kwhs?: Kwh[];
}
interface KwhAttributes {
  id:number
  pulses: number;
  elcontrolrelay:number
}
export interface KwhCreationAttributes extends Optional<KwhAttributes, 'id'> {}
@Table
export class Kwh extends Model<KwhCreationAttributes,KwhAttributes> {
  @Column pulses!: number;
  @ForeignKey(() => Elcontrol)
  @Column
  elcontrolrelay!: number;
  @BelongsTo(() => Elcontrol, "relay") elcontrol?: Elcontrol;
}
