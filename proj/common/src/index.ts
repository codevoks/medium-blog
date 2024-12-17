import {z} from "zod";

export const signUpInput = z.object({
     email: z.string().email(),
     password: z.string().min(6),
     name: z.string().optional()
});

export const signInInput = z.object({
    email: z.string().optional(),
    password: z.string().min(6)
});

export const createPostInput = z.object({
    title: z.string(),
    content: z.string()
});

export const updatePostInput = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string()
});

export type SignUpInput = z.infer<typeof signUpInput>;
export type SignIpInput = z.infer<typeof signInInput>;
export type CreatePostInput = z.infer<typeof createPostInput>;
export type UpdatePostInput = z.infer<typeof updatePostInput>;
