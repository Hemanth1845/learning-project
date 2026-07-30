const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const DSAProblem = require('../models/DSAProblem');
const Note = require('../models/Note');
const { osLessons, dbmsLessons, cnLessons } = require('./coursesQAData');
const { additionalLessons } = require('./additionalCoursesQAData');

const seedAdmin = async () => {
  const adminExists = await User.findOne({ username: 'admin' });
  const hashedPassword = await bcrypt.hash('Hemanth@123', 10);
  if (!adminExists) {
    await User.create({
      username: 'admin',
      email: 'admin@placementprep.com',
      password: hashedPassword,
      role: 'admin',
      xp: 1000,
      streak: 5,
      rank: 1,
      profilePic: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
    });
    console.log('Default admin seeded successfully (admin/Hemanth@123)');
  } else {
    adminExists.password = hashedPassword;
    await adminExists.save();
    console.log('Admin password updated successfully to Hemanth@123');
  }
};

const seedDSAProblems = async () => {
  await DSAProblem.deleteMany({});
  const problems = [
    { problemId: 1, title: 'Two Sum', topic: 'Arrays', difficulty: 'Easy', xp: 10, solveUrl: 'https://leetcode.com/problems/two-sum/' },
    { problemId: 2, title: 'Maximum Subarray', topic: 'Dynamic Programming', difficulty: 'Medium', xp: 30, solveUrl: 'https://leetcode.com/problems/maximum-subarray/' },
    { problemId: 3, title: 'Binary Search', topic: 'Binary Search', difficulty: 'Easy', xp: 10, solveUrl: 'https://leetcode.com/problems/binary-search/' },
    { problemId: 4, title: 'Valid Parentheses', topic: 'Stacks & Queues', difficulty: 'Easy', xp: 10, solveUrl: 'https://leetcode.com/problems/valid-parentheses/' },
    { problemId: 5, title: 'Reverse String', topic: 'Strings', difficulty: 'Easy', xp: 10, solveUrl: 'https://leetcode.com/problems/reverse-string/' },
    { problemId: 6, title: 'Merge Two Sorted Lists', topic: 'Linked Lists', difficulty: 'Easy', xp: 10, solveUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
    { problemId: 7, title: 'Climbing Stairs', topic: 'Dynamic Programming', difficulty: 'Easy', xp: 10, solveUrl: 'https://leetcode.com/problems/climbing-stairs/' },
    { problemId: 8, title: 'Longest Substring Without Repeating Characters', topic: 'Sliding Window', difficulty: 'Medium', xp: 30, solveUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
    { problemId: 9, title: 'Kth Largest Element in an Array', topic: 'Heaps', difficulty: 'Medium', xp: 30, solveUrl: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },
    { problemId: 10, title: '3Sum', topic: 'Arrays', difficulty: 'Medium', xp: 30, solveUrl: 'https://leetcode.com/problems/3sum/' },
    { problemId: 11, title: 'Valid Anagram', topic: 'Strings', difficulty: 'Easy', xp: 10, solveUrl: 'https://leetcode.com/problems/valid-anagram/' },
    { problemId: 12, title: 'Invert Binary Tree', topic: 'Trees', difficulty: 'Easy', xp: 10, solveUrl: 'https://leetcode.com/problems/invert-binary-tree/' },
    { problemId: 13, title: 'Clone Graph', topic: 'Graphs', difficulty: 'Medium', xp: 30, solveUrl: 'https://leetcode.com/problems/clone-graph/' },
    { problemId: 14, title: 'Implement Trie (Prefix Tree)', topic: 'Tries', difficulty: 'Medium', xp: 30, solveUrl: 'https://leetcode.com/problems/implement-trie-prefix-tree/' },
    { problemId: 15, title: 'Number of 1 Bits', topic: 'Bit Manipulation', difficulty: 'Easy', xp: 10, solveUrl: 'https://leetcode.com/problems/number-of-1-bits/' },
    { problemId: 16, title: 'Merge k Sorted Lists', topic: 'Linked Lists', difficulty: 'Hard', xp: 50, solveUrl: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
    { problemId: 17, title: 'Longest Palindromic Substring', topic: 'Dynamic Programming', difficulty: 'Medium', xp: 30, solveUrl: 'https://leetcode.com/problems/longest-palindromic-substring/' },
    { problemId: 18, title: 'Edit Distance', topic: 'Dynamic Programming', difficulty: 'Hard', xp: 50, solveUrl: 'https://leetcode.com/problems/edit-distance/' },
    { problemId: 19, title: 'Container With Most Water', topic: 'Sliding Window', difficulty: 'Medium', xp: 30, solveUrl: 'https://leetcode.com/problems/container-with-most-water/' },
    { problemId: 20, title: 'Word Search', topic: 'Recursion & Backtracking', difficulty: 'Medium', xp: 30, solveUrl: 'https://leetcode.com/problems/word-search/' }
  ];
  const problemsWithRAG = problems.map(p => ({
    ...p,
    slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    year_level: ['2nd', '3rd', '4th'],
    target_role: 'Software Engineer',
    is_placement_prep: true
  }));
  await DSAProblem.insertMany(problemsWithRAG);
  console.log('DSA Problems pre-seeded successfully');
};

const seedCoursesAndLessons = async () => {
  // Always clear existing courses and lessons to apply our rich new seeder content!
  await Course.deleteMany({});
  await Lesson.deleteMany({});

  // Define courses
  const coursesData = [
    { title: 'Operating Systems', description: 'Core principles of OS: Processes, Memory Management, File Systems, and CPU Scheduling.', category: 'Core CS', difficulty: 'Medium', thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&q=80&w=400', slug: 'operating-systems', year_level: ['3rd'], target_role: 'System Engineer', is_placement_prep: true },
    { title: 'Computer Networks', description: 'Deep dive into computer network layers, protocols, TCP/IP, routing algorithms, and network security.', category: 'Core CS', difficulty: 'Medium', thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=400', slug: 'computer-networks', year_level: ['3rd'], target_role: 'Network Administrator', is_placement_prep: true },
    { title: 'DBMS', description: 'Database Management Systems, relational models, ER diagrams, normalization (1NF to BCNF) and transactions.', category: 'Core CS', difficulty: 'Medium', thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=400', slug: 'dbms', year_level: ['2nd', '3rd'], target_role: 'Database Developer', is_placement_prep: true },
    { title: 'SQL', description: 'Master relational databases using SQL queries: Joins, Aggregations, Subqueries, Indexes, and Optimization.', category: 'Core CS', difficulty: 'Easy', thumbnail: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&q=80&w=400', slug: 'sql', year_level: ['2nd', '3rd'], target_role: 'Database Developer', is_placement_prep: true },
    { title: 'C Programming', description: 'Fundamentals of C, pointers, memory allocation, structures, and low-level optimization.', category: 'Programming', difficulty: 'Easy', thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=400', slug: 'c-programming', year_level: ['1st'], target_role: 'Embedded Software Developer', is_placement_prep: false },
    { title: 'Python', description: 'Learn Python syntax, OOP concepts, libraries (NumPy, Pandas), and advanced decorators.', category: 'Programming', difficulty: 'Easy', thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400', slug: 'python', year_level: ['1st', '2nd'], target_role: 'Data Scientist', is_placement_prep: true },
    { title: 'Java', description: 'Object-Oriented Programming in Java, JVM architecture, multithreading, and collections framework.', category: 'Programming', difficulty: 'Medium', thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400', slug: 'java', year_level: ['1st', '2nd'], target_role: 'Backend Developer', is_placement_prep: true },
    { title: 'Generative AI', description: 'Introduction to LLMs, prompt engineering, fine-tuning, RAG architecture, and Gemini API integration.', category: 'AI', difficulty: 'Hard', thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=400', slug: 'generative-ai', year_level: ['3rd', '4th'], target_role: 'AI Engineer', is_placement_prep: true },
    // Placements context matching courses:
    { title: 'Full-Stack Web Development (HTML, CSS, JS, React, Node)', description: 'Learn responsive frontend building with W3-style tutorials and Node.js backend API creation.', category: 'Web Development', difficulty: 'Medium', thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&q=80&w=400', slug: 'fullstack-web-dev', year_level: ['2nd', '3rd'], target_role: 'Full-Stack Developer', is_placement_prep: true },
    { title: 'Data Structures & Algorithms with Java', description: 'Master arrays, linked lists, trees, graphs, and dynamic programming for coding interviews.', category: 'Programming', difficulty: 'Medium', thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400', slug: 'dsa-java', year_level: ['2nd', '3rd', '4th'], target_role: 'Software Engineer', is_placement_prep: true },
    { title: 'Database Management Systems (DBMS) & SQL Masterclass', description: 'Learn database normalization, queries, indexing, and transactional SQL.', category: 'Core CS', difficulty: 'Medium', thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=400', slug: 'dbms-sql', year_level: ['2nd', '3rd'], target_role: 'Database Administrator', is_placement_prep: true },
    { title: 'Core CS Fundamentals (OS, Networks, System Design)', description: 'Complete prep for campus recruitment technical interview rounds.', category: 'Core CS', difficulty: 'Medium', thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=400', slug: 'core-cs-fundamentals', year_level: ['3rd', '4th'], target_role: 'Software Engineer', is_placement_prep: true }
  ];

  const seededCourses = await Course.insertMany(coursesData);
  console.log('Courses seeded successfully');

  // 1. Seed Operating Systems
  const osCourse = seededCourses.find(c => c.title === 'Operating Systems');
  for (let les of osLessons) {
    await Lesson.create({
      courseId: osCourse._id,
      title: les.title,
      order: les.order,
      content: les.content,
      interviewQuestions: les.interviewQuestions
    });
  }

  // 2. Seed DBMS
  const dbmsCourse = seededCourses.find(c => c.title === 'DBMS');
  for (let les of dbmsLessons) {
    await Lesson.create({
      courseId: dbmsCourse._id,
      title: les.title,
      order: les.order,
      content: les.content,
      interviewQuestions: les.interviewQuestions
    });
  }

  // 3. Seed Computer Networks
  const cnCourse = seededCourses.find(c => c.title === 'Computer Networks');
  for (let les of cnLessons) {
    await Lesson.create({
      courseId: cnCourse._id,
      title: les.title,
      order: les.order,
      content: les.content,
      interviewQuestions: les.interviewQuestions
    });
  }

  // 4. Seed other courses from additionalCoursesQAData.js or fallback to default
  const otherCourses = seededCourses.filter(c => c.title !== 'Operating Systems' && c.title !== 'DBMS' && c.title !== 'Computer Networks');
  for (let c of otherCourses) {
    const customLessons = additionalLessons[c.title];
    if (customLessons && customLessons.length > 0) {
      for (let les of customLessons) {
        await Lesson.create({
          courseId: c._id,
          title: les.title,
          order: les.order,
          content: les.content,
          interviewQuestions: les.interviewQuestions
        });
      }
    } else {
      await Lesson.create({
        courseId: c._id,
        title: `Introduction to ${c.title}`,
        order: 1,
        content: `### Welcome to ${c.title}!
In this course, we will explore the key pillars of ${c.title}.

This is an introductory lesson. You will find lecture notes, external code repositories, and quick video guides to build foundational knowledge. Stay tuned for advanced topics!`,
        videoUrl: 'https://www.youtube.com/embed/tgbNymZ7vqY',
        quiz: {
          title: `Intro to ${c.title} Quiz`,
          xpReward: 50,
          questions: [
            {
              questionText: `What is the main goal of studying ${c.title}?`,
              options: ['To pass placements and build real-world applications', 'To memorize definitions', 'To avoid coding', 'None of the above'],
              correctOptionIndex: 0,
              explanation: `Warm up check on ${c.title} foundations.`
            }
          ]
        }
      });
    }
  }

  console.log('All course lessons, GFG notes, and interview prep questions seeded successfully');
};

const seedNotes = async () => {
  const noteCount = await Note.countDocuments();
  if (noteCount === 0) {
    const notesData = [
      { title: 'TCS Generative Interview Questions', subject: 'General Prep', description: 'Target questions on Generative AI and LLMs asked during TCS placement rounds.', pdfUrl: 'https://drive.google.com/file/d/1jttppiAIRH0yz5aLT9T5LCtXZcDbU5vV/view?usp=sharing' },
      { title: 'TCS LLM Interview Questions', subject: 'General Prep', description: 'Advanced LLM and LangChain developer questions collected from TCS tech drives.', pdfUrl: 'https://drive.google.com/file/d/1mPE07BkDPXNskSGvhaQoDptAE3ZabAcm/view?usp=sharing' },
      { title: 'TCS Technical Interview Questions', subject: 'General Prep', description: 'Core computer science subject questions (OS, DBMS, CN) asked by TCS panels.', pdfUrl: 'https://drive.google.com/file/d/1FQGGORBNB3yJrbhvwaPpAa7BHufdp-x3/view?usp=sharing' },
      { title: 'TCS College Drive Interview Questions', subject: 'General Prep', description: 'Aptitude and coding questions compiled from on-campus recruitment events.', pdfUrl: 'https://drive.google.com/file/d/1IJjMlu3aeeXEzCqeLAeHAaMmHcR6X6J9/view?usp=sharing' },
      { title: 'Operating Systems (OS) Cheatsheet', subject: 'Operating Systems', description: 'Quick cheat sheets and summary notes for kernel structures, syscalls, and deadlock handling.', pdfUrl: 'https://drive.google.com/file/d/1FQGGORBNB3yJrbhvwaPpAa7BHufdp-x3/view?usp=sharing' },
      { title: 'Database Management Systems (DBMS) Cheatsheet', subject: 'DBMS', description: 'Relational models, key constraints, normal forms (1NF to BCNF), and ACID transactions.', pdfUrl: 'https://drive.google.com/file/d/1FQGGORBNB3yJrbhvwaPpAa7BHufdp-x3/view?usp=sharing' }
    ];
    await Note.insertMany(notesData);
    console.log('Default placement & cheatsheet Notes seeded successfully');
  }
};

const runSeeder = async () => {
  try {
    await seedAdmin();
    await seedDSAProblems();
    await seedCoursesAndLessons();
    await seedNotes();
    
    // Call theory & aptitude seeder
    const runTheoryAptitudeSeeder = require('./theoryAptitudeSeeder');
    await runTheoryAptitudeSeeder();

    // Call dynamic RAG vector document builder!
    const { indexDatabaseForRAG } = require('../utils/ragIndexer');
    await indexDatabaseForRAG();
    
    console.log('Database seeding process finished.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = runSeeder;
