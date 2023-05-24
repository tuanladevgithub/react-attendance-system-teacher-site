import { SessionResult } from "./session-result.type";

export type Student = {
  id: number;

  student_code: string;

  email: string;

  password: string;

  last_name: string;

  first_name: string;

  gender: "MALE" | "FEMALE";

  phone_number?: string;

  age?: number;

  sessionResult?: SessionResult;
};
