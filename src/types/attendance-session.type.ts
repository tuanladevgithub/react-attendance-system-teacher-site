export type AttendanceSession = {
  id: number;

  t_course_id: number;

  password?: string;

  session_date: string;

  start_hour: number;

  start_min: number;

  end_hour: number;

  end_min: number;

  description?: string;
};
