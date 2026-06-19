import { User } from "@/modules/users/model/user.model";
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";

@Table({ tableName: 'chats', timestamps: true, paranoid: true })
export class Chat extends Model {
    @Column({ type: DataType.STRING, allowNull: false })
    message: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    user_id: number

    @BelongsTo(() => User)
    user: User

}