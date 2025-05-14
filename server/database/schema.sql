PRAGMA foreign_keys = ON;

-- Users table
CREATE TABLE Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT NOT NULL,
    user_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_deleted_at TIMESTAMP NULL,
    user_state TEXT NOT NULL CHECK (user_state IN ('registered', 'deleted'))
);

-- Courses table
CREATE TABLE Courses (
    course_id INTEGER PRIMARY KEY AUTOINCREMENT,
    semester TEXT NOT NULL,
    course_code TEXT NOT NULL UNIQUE,
    course_name TEXT NOT NULL,
    course_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enrollment table
CREATE TABLE Enrollment (
    user_id INTEGER,
    course_id INTEGER,
    enrollment_type TEXT NOT NULL CHECK (enrollment_type IN ('student', 'teacher')),
    enrollment_state TEXT NOT NULL CHECK (enrollment_state IN ('active', 'deleted')),
    PRIMARY KEY (user_id, course_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id)
);

-- Discussion Topics Table
CREATE TABLE Topics (
    topic_id INTEGER PRIMARY KEY AUTOINCREMENT,
    topic_title TEXT NOT NULL,
    topic_content TEXT NOT NULL,
    topic_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    topic_deleted_at TIMESTAMP NULL,
    topic_state TEXT NOT NULL CHECK (topic_state IN ('active', 'unpublished', 'deleted')),
    course_id INTEGER,
    topic_posted_by_user_id INTEGER,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (topic_posted_by_user_id) REFERENCES Users(user_id)
);

-- Discussion Topic Entries Table
CREATE TABLE Entries (
    entry_id INTEGER PRIMARY KEY AUTOINCREMENT,
    entry_content TEXT NOT NULL,
    entry_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    entry_deleted_at TIMESTAMP NULL,
    entry_state TEXT NOT NULL CHECK (entry_state IN ('active', 'deleted')),
    entry_parent_id INTEGER NULL,
    entry_posted_by_user_id INTEGER,
    topic_id INTEGER,
    FOREIGN KEY (entry_parent_id) REFERENCES Entries(entry_id),
    FOREIGN KEY (entry_posted_by_user_id) REFERENCES Users(user_id),
    FOREIGN KEY (topic_id) REFERENCES Topics(topic_id) ON DELETE CASCADE
);

CREATE TABLE Login (
    user_login_id TEXT PRIMARY KEY,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);