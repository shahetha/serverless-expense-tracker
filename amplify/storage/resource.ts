import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "expenseReceipts",

  access: (allow) => ({
    "receipts/*": [
      allow.authenticated.to(["read", "write", "delete"]),
    ],
  }),
});