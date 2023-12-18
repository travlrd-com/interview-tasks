import { GetUserResult, getUserInfo } from "./getUserWithProfile";
import { createSupabaseForServerAction, createSupabaseForServerComponent } from "@/lib/supabase.server";

export const getUserInfoServerComponent = async (): Promise<GetUserResult> => {
  return getUserInfo(await createSupabaseForServerComponent());
};

export const getUserInfoServerAction = async (): Promise<GetUserResult> => {
  return getUserInfo(await createSupabaseForServerAction());
};
