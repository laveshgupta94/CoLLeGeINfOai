export type CollegeEvent = {
    id: string;
    title: string;
    date: string;
    time: string;
    venue: string;
    description: string;
};

export type Exam = {
    id: string;
    exam_name: string;
    start_date: string;
    end_date: string;
    subjects: { subject: string; date: string; time: string }[];
};

export type AttendanceRule = {
    total_classes: number;
    required_percentage: number;
};

export type KnowledgeItem = {
    id: string;
    category: string;
    title: string;
    description: string;
    updated_at: string;
};

export const mockEvents: CollegeEvent[] = [
    {
        id: 'evt1',
        title: 'Tech Fest 2024',
        date: '2024-10-15',
        time: '10:00 AM',
        venue: 'Main Auditorium',
        description: 'Annual technical festival with competitions, workshops, and guest lectures.',
    },
    {
        id: 'evt2',
        title: 'Cultural Night',
        date: '2024-10-20',
        time: '06:00 PM',
        venue: 'Open Air Theater',
        description: 'A night of music, dance, and drama performances by students.',
    },
    {
        id: 'evt3',
        title: 'Annual Sports Day',
        date: '2024-11-25',
        time: '09:00 AM',
        venue: 'College Ground',
        description: 'Track and field events, team sports, and fun activities.',
    },
];

export const mockExams: Exam[] = [
    {
        id: 'exam1',
        exam_name: 'Mid-Term Examinations',
        start_date: '2024-11-05',
        end_date: '2024-11-15',
        subjects: [
            { subject: 'Computer Science', date: '2024-11-05', time: '09:00 AM' },
            { subject: 'Mathematics', date: '2024-11-07', time: '09:00 AM' },
            { subject: 'Physics', date: '2024-11-09', time: '09:00 AM' },
            { subject: 'Chemistry', date: '2024-11-11', time: '09:00 AM' },
            { subject: 'English', date: '2024-11-13', time: '09:00 AM' },
        ],
    },
    {
        id: 'exam2',
        exam_name: 'Final Examinations',
        start_date: '2025-04-20',
        end_date: '2025-05-05',
        subjects: [
            { subject: 'Data Structures', date: '2025-04-20', time: '01:00 PM' },
            { subject: 'Algorithms', date: '2025-04-22', time: '01:00 PM' },
            { subject: 'Database Systems', date: '2025-04-25', time: '01:00 PM' },
            { subject: 'Operating Systems', date: '2025-04-28', time: '01:00 PM' },
            { subject: 'Networks', date: '2025-04-30', time: '01:00 PM' },
        ],
    },
];

export const mockAttendanceRule: AttendanceRule = {
    total_classes: 120,
    required_percentage: 75,
};

export const mockKnowledgeBase: KnowledgeItem[] = [
    {
        id: 'kb1',
        category: 'Rules',
        title: 'Library Rules',
        description: 'Silence must be maintained. No food or drinks allowed. Books must be returned on time.',
        updated_at: '2024-05-10T10:00:00Z',
    },
    {
        id: 'kb2',
        category: 'FAQs',
        title: 'Hostel Curfew',
        description: 'The hostel curfew is 10:00 PM for all students.',
        updated_at: '2024-05-11T11:30:00Z',
    }
];
