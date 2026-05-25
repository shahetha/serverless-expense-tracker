import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuid } from "uuid";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE  = process.env.TABLE_NAME!;

export function pk(userSub: string)   { return `USER#${userSub}`; }
export function sk(date: string, id: string) { return `EXPENSE#${date}#${id}`; }

export async function putExpense(userSub: string, input: Record<string, unknown>) {
  const id  = input.id as string || uuid();
  const now = new Date().toISOString();
  const item = {
    PK: pk(userSub), SK: sk(input.date as string, id),
    id, ...input,
    createdAt: input.createdAt || now,
    updatedAt: now,
  };
  await client.send(new PutCommand({ TableName: TABLE, Item: item }));
  return item;
}

export async function getExpenses(userSub: string, month?: string) {
  const params: any = {
    TableName: TABLE,
    KeyConditionExpression: month
      ? "PK = :pk AND begins_with(SK, :prefix)"
      : "PK = :pk AND begins_with(SK, :prefix)",
    ExpressionAttributeValues: {
      ":pk": pk(userSub),
      ":prefix": month ? `EXPENSE#${month}` : "EXPENSE#",
    },
    ScanIndexForward: false,
  };
  const res = await client.send(new QueryCommand(params));
  return (res.Items || []) as Record<string, unknown>[];
}

export async function getExpense(userSub: string, id: string, date: string) {
  const res = await client.send(new GetCommand({ TableName: TABLE, Key: { PK: pk(userSub), SK: sk(date, id) } }));
  return res.Item as Record<string, unknown> | undefined;
}

export async function deleteExpense(userSub: string, id: string, date: string) {
  await client.send(new DeleteCommand({ TableName: TABLE, Key: { PK: pk(userSub), SK: sk(date, id) } }));
}
