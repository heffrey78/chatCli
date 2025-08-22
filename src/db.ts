import * as dotenv from "dotenv";
import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
  Association,
  Sequelize,
} from "sequelize";
import pgvector from 'pgvector/sequelize';

dotenv.config();

const dbName = process.env.DB_NAME;
const userName = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

pgvector.registerType(Sequelize);

if (!dbName || !userName || !password) throw new Error("No db creds");

const sequelize = new Sequelize(dbName, userName, password, {
  host: "localhost",
  dialect: "postgres",
  logging: false
});

class Conversation extends Model<
  InferAttributes<Conversation, { omit: "messages" }>,
  InferCreationAttributes<Conversation, { omit: "messages" }>
> {
  declare id: CreationOptional<number>;
  declare name: string;

  // timestamps!
  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getMessages: HasManyGetAssociationsMixin<Message>;
  declare addMessage: HasManyAddAssociationMixin<Message, number>;
  declare hasMessage: HasManyHasAssociationMixin<Message, number>;
  declare countMessages: HasManyCountAssociationsMixin;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare messages?: Message[];

  declare static associations: {
    messages: Association<Conversation, Message>;
  };
}

class Message extends Model<
  InferAttributes<Message>,
  InferCreationAttributes<Message>
> {
  declare id: CreationOptional<number>;
  declare role: string;
  declare content: string;
  declare conversationId: number;

  // timestamps!
  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
}

Conversation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: "conversations",
    sequelize, // passing the `sequelize` instance is required
  }
);

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    role: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    content: {
        type: new DataTypes.TEXT,
        allowNull: false,
      },
    conversationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: "messages",
    sequelize, // passing the `sequelize` instance is required
  }
);

// Here we associate which actually populates out pre-declared `association` static and other methods.
Conversation.hasMany(Message, {
  sourceKey: "id",
  foreignKey: "conversationId",
  as: "messages", // this determines the name in `associations`!
});

export { sequelize, Conversation, Message }
