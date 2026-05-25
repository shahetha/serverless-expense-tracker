import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Expense: a
    .model({
      amount:        a.float().required(),
      date:          a.string().required(),
      merchant:      a.string().required(),
      category:      a.enum([
        'Food_and_Dining',
        'Travel',
        'Shopping',
        'Entertainment',
        'Health',
        'Utilities',
        'Housing',
        'Transport',
        'Education',
        'Other',
      ]),
      paymentMethod: a.enum([
        'Credit_Card',
        'Debit_Card',
        'Cash',
        'Bank_Transfer',
        'Other',
      ]),
      notes:         a.string(),
      receiptKey:    a.string(),
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
