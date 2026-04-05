import { z } from 'zod';

export const loginSchema = z.object({
    email: z.email("有効なメールアドレスを入力してください"),
    password: z.string().min(1, "パスワードを入力して下さい"),
});

//自動でloginSchemaを生成
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    role: z.enum(["transport_company","shipper"],{
        message: "アカウント種別を選択してください",
    }),
    name: z.string().min(1, "お名前を入力してください"),
  company: z.string().min(1, "会社名を入力してください"),
  email: z.email("有効なメールアドレスを入力してください"),
  password: z.string().min(8, "8文字以上で設定してください"),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, {
    message: "パスワードが一致しません",
    path: ["confirm"]
});

export type RegisterInput = z.infer<typeof registerSchema>;