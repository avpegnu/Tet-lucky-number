import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AdminDocument = Admin & Document;

@Schema({ timestamps: true })
export class Admin {
    @Prop({ required: true, unique: true, type: String })
    username: string;

    @Prop({ required: true, type: String })
    password: string; // Will be hashed using bcrypt
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
