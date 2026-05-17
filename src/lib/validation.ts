import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export const ResetPassSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const RegisterSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export const ConfirmResetPassSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const OTPConfirmationSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  code: z
    .string()
    .length(6, "Code must be exactly 6 digits")
    .regex(/^\d+$/, "Code must only contain numbers"),
});

const ReceiptBase = z.object({
  store_name: z.string().min(1, "Store name is required"),
  total_amount: z.coerce.number().positive("Amount must be greater than 0"),
  currency: z.string().min(1, "Currency is required").default("MYR"),
  receipt_date: z.string().min(1, "Date is required"), // Usually ISO string from DatePicker
  category: z.string().min(1, "Please select a category"),
  descriptions: z.string().optional(),
  payment_method: z.string().min(1, "Payment method is required"),
  invoice_no: z.string().optional().nullable(),
  tax_amount: z.coerce.number().nonnegative().optional().default(0),
  // image_ref_url: z.string().min(1, "Invalid image URL").optional().nullable(),
  image_ref_url: z.string().optional(),
});

export const CreateReceiptSchema = ReceiptBase;

export const EditReceiptSchema = ReceiptBase.extend({
  id: z.number().or(z.string()), // ID is required for PUT
});

export type CreateReceiptInput = z.infer<typeof CreateReceiptSchema>;
export type EditReceiptInput = z.infer<typeof EditReceiptSchema>;
