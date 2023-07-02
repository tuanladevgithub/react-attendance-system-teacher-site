export type AttendanceStatus = {
  id: number;

  title: string;

  acronym: string;

  point: number;

  auto_set_when_not_marked: number;
};

export type SessionResult = {
  t_attendance_session_id: number;

  t_student_id: number;

  m_attendance_status_id?: number;

  record_time: string;

  record_by_teacher: number; // 0 or 1

  ip_address?: string;

  attendanceStatus?: AttendanceStatus;
};
