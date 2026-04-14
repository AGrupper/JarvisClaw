/**
 * Google Classroom helper via gws CLI
 */

const { execSync } = require('child_process');

function gws(args) {
  try {
    const out = execSync(`gws ${args}`, { encoding: 'utf8', timeout: 15000 });
    return JSON.parse(out);
  } catch (e) {
    return null;
  }
}

function getCourses() {
  const result = gws('classroom courses list --params \'{"studentId": "me", "courseStates": ["ACTIVE"]}\'');
  return result?.courses || [];
}

function getCourseWork(courseId) {
  const result = gws(`classroom courses.courseWork list --params '{"courseId": "${courseId}", "courseWorkStates": ["PUBLISHED"], "orderBy": "dueDate asc"}'`);
  return result?.courseWork || [];
}

function getAnnouncements(courseId) {
  const result = gws(`classroom courses.announcements list --params '{"courseId": "${courseId}"}'`);
  return result?.announcements || [];
}

function getStudentSubmissions(courseId, courseWorkId) {
  const result = gws(`classroom courses.courseWork.studentSubmissions list --params '{"courseId": "${courseId}", "courseWorkId": "${courseWorkId}", "userId": "me"}'`);
  return result?.studentSubmissions || [];
}

async function fetchAllClassroomData() {
  const courses = getCourses();
  const now = new Date();
  const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const upcoming = [];
  const announcements = [];

  for (const course of courses) {
    const courseWork = getCourseWork(course.id);
    for (const cw of courseWork) {
      if (!cw.dueDate) continue;
      const due = new Date(
        `${cw.dueDate.year}-${String(cw.dueDate.month).padStart(2,'0')}-${String(cw.dueDate.day).padStart(2,'0')}`
      );
      if (due <= twoWeeksFromNow) {
        const submissions = getStudentSubmissions(course.id, cw.id);
        const submission = submissions[0];
        const submitted = submission?.state === 'TURNED_IN' || submission?.state === 'RETURNED';
        upcoming.push({
          id: cw.id,
          courseId: course.id,
          courseName: course.name,
          title: cw.title,
          dueDate: due.toISOString(),
          urgent: due <= tomorrow,
          submitted
        });
      }
    }

    const courseAnnouncements = getAnnouncements(course.id);
    const recentCutoff = new Date(now.getTime() - 48 * 60 * 60 * 1000);
    for (const ann of courseAnnouncements.slice(0, 5)) {
      const created = new Date(ann.creationTime);
      if (created >= recentCutoff) {
        announcements.push({
          id: ann.id,
          courseId: course.id,
          courseName: course.name,
          text: ann.text?.slice(0, 200),
          createdAt: ann.creationTime
        });
      }
    }
  }

  return { upcoming, announcements, courses };
}

module.exports = { getCourses, getCourseWork, getAnnouncements, fetchAllClassroomData };
