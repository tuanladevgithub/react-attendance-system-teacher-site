export type SessionResult = {
  t_attendance_session_id: number;

  t_student_id: number;

  m_attendance_status_id?: number;

  record_time: Date;

  ip_address: string;
};
