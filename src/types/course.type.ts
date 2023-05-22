import { Subject } from "./subject.type";

export type Course = {
  id: number;

  m_subject_id: number;

  t_teacher_id: number;

  course_code: string;

  description?: string;

  start_date: string;

  end_date?: string;

  countStudents?: number;

  subject?: Subject;
};
