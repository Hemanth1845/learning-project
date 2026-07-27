const VectorDocument = require('../models/VectorDocument');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const TheoryChapter = require('../models/TheoryChapter');
const AptitudeTopic = require('../models/AptitudeTopic');
const DSAProblem = require('../models/DSAProblem');
const { getEmbedding } = require('./gemini');

// Set of custom career guide FAQs to index in RAG
const careerFAQs = [
  {
    title: "1st Year Study Plan",
    content: "Course recommendations for 1st Year Engineering: Focus on building programming basics and computer fundamentals. You should take C Programming, Python, and Java Basics. Develop problem-solving skills, learn Linux command line interface, and understand Git version control. Your study roadmap: Weeks 1-8: C Programming & Git basics. Weeks 9-16: Python programming. Weeks 17-24: Java Basics and Digital Logic. Direct routes to take: [C Programming](/courses), [Python](/courses), [Prep Aptitude](/aptitude).",
    type: "faq",
    slug: "roadmap-first-year"
  },
  {
    title: "2nd Year Study Plan",
    content: "Study plan for 2nd Year: Learn Object-Oriented Programming (OOP) and Data Structures & Algorithms (DSA) thoroughly using Java or C++. Study database systems (SQL, DBMS) and operating systems. Learn core web technologies (HTML, CSS, JavaScript, Bootstrap). Your study roadmap: Weeks 1-8: Java, OOP, SQL. Weeks 9-16: DSA concepts (Arrays, Strings, Linked Lists, Stack, Queue). Weeks 17-24: HTML, CSS, JavaScript basics. Direct links: [Data Structures & Algorithms with Java](/courses), [Database Management Systems (DBMS) & SQL Masterclass](/courses), [Study CS Theory](/theory).",
    type: "faq",
    slug: "roadmap-second-year"
  },
  {
    title: "3rd Year Study Plan / Placement Prep",
    content: "Roadmap for 3rd Year CSE students preparing for placements:\nPhase 1 (Weeks 1-8): Master advanced DSA (Trees, Graphs, Dynamic Programming) and database normalization/indexing. Complete [Data Structures & Algorithms with Java](/courses) and [Database Management Systems (DBMS) & SQL Masterclass](/courses).\nPhase 2 (Weeks 9-16): Build Full-Stack Projects using React, Node.js, Express, and MongoDB. Complete [Full-Stack Web Development (HTML, CSS, JS, React, Node)](/courses).\nPhase 3 (Weeks 17-24): Study CS core fundamentals (OS, Networks, System Design) and practice aptitude. Take [Prep Aptitude](/aptitude) modules, practice [Daily Coding Challenges](/daily-problems), and take [Mock Interviews](/interviews). Maintain a daily login streak and build a professional resume using our [Resume Builder](/resume-ats).",
    type: "faq",
    slug: "roadmap-third-year"
  },
  {
    title: "4th Year Study Plan",
    content: "Study plan for 4th Year: Focus on advanced microservices (Spring Boot, Redis, Kafka), cloud deployment (AWS, Azure), system design (HLD/LLD), and behavioral HR mock interviews. Complete [Core CS Fundamentals (OS, Networks, System Design)](/courses). Practice mock tests for specific companies. Direct routes: [Mock Interview Setup](/mock-interview), [Study CS Theory](/theory), [Get PDF Notes](/notes).",
    type: "faq",
    slug: "roadmap-fourth-year"
  },
  {
    title: "How to become an AI Engineer",
    content: "AI Developer Path: To become an AI or Machine Learning engineer, start with Python. Learn ML algorithms (regression, decision trees, naive bayes, clustering, PCA). Study Deep Learning (neural networks, CNNs, RNNs, LSTMs, Transformers). Dive into Generative AI: Learn Prompt Engineering, Embeddings, Vector Databases, Retrieval-Augmented Generation (RAG) and LangChain. Complete our [Full-Stack Web Development (HTML, CSS, JS, React, Node)](/courses) and read AI notes. Practice [Daily Coding Challenges](/daily-problems) to keep your coding sharp.",
    type: "faq",
    slug: "ai-engineer-roadmap"
  },
  {
    title: "How to crack TCS",
    content: "TCS placement preparation guide: TCS eligibility requires minimum 60% CGPA and no active backlogs. TCS selection pattern includes: 1) Cognitive Aptitude (Numerical, Verbal, Reasoning) - practice this in [Prep Aptitude](/aptitude) using our Quantitative and Logical Reasoning modules. 2) Coding Round - practice this in [Practice DSA](/dsa) and solve [Daily Coding Challenges](/daily-problems). 3) Technical & HR Interview - review questions on C, Java, OS, and DBMS. Direct links: [Prep Aptitude](/aptitude), [Get PDF Notes](/notes).",
    type: "faq",
    slug: "crack-tcs-roadmap"
  },
  {
    title: "Preparation for GATE",
    content: "GATE preparation guide: Master core computer science subjects. Study Discrete Mathematics, Theory of Computation, Compiler Design, operating systems, DBMS, computer networks, and algorithms. Complete all [Study CS Theory](/theory) chapters and download subject cheatsheets on [Get PDF Notes](/notes). Practice quantitative aptitude in [Prep Aptitude](/aptitude).",
    type: "faq",
    slug: "gate-preparation"
  },
  {
    title: "Only 3 Months Placement Prep Plan",
    content: "Short-term study plan (3 months left):\nMonth 1: Brush up DSA fundamentals (Arrays, Strings, HashMaps, recursion) and core SQL queries. Complete [Database Management Systems (DBMS) & SQL Masterclass](/courses).\nMonth 2: Learn advanced topics (Trees, Graphs, DP) and study OS/Networks. Practice quantitative and logical reasoning in [Prep Aptitude](/aptitude).\nMonth 3: Conduct mock video simulator interviews [Mock Interview Setup](/mock-interview) and compile resume on [Resume Builder](/resume-ats). Make sure to solve [Daily Coding Challenges](/daily-problems) daily to earn XP and stay sharp.",
    type: "faq",
    slug: "three-months-roadmap"
  },
  {
    title: "Roadmap for Python Developers",
    content: "Python Developer Path: Start with Core Python basics and advanced decorators. Move to SQL and database systems. Learn Django or Flask for web backend development. Then, explore Machine Learning and Generative AI. Direct links: [Courses](/courses), [Study CS Theory](/theory). Try to practice DSA in Python using our code sandbox on [Practice DSA](/dsa).",
    type: "faq",
    slug: "python-developer-roadmap"
  }
];

const indexDatabaseForRAG = async () => {
  try {
    console.log('Starting RAG Vector Indexing...');
    
    // Clear old vector index
    await VectorDocument.deleteMany({});
    console.log('Cleared existing VectorDocument collection.');

    // 1. Index Courses
    const courses = await Course.find();
    console.log(`Indexing ${courses.length} courses...`);
    for (const course of courses) {
      const textToEmbed = `Course Title: ${course.title}. Description: ${course.description}. Difficulty: ${course.difficulty}. Category: ${course.category}. Slug: ${course.slug}. Target Role: ${course.target_role}. Recommended years: ${course.year_level ? course.year_level.join(', ') : ''}`;
      const embedding = await getEmbedding(textToEmbed);
      await VectorDocument.create({
        title: course.title,
        content: textToEmbed,
        type: 'course',
        slug: `courses`, // routes redirect inside courses
        metadata: {
          id: course._id,
          slug: course.slug,
          category: course.category,
          year_level: course.year_level,
          target_role: course.target_role,
          is_placement_prep: course.is_placement_prep
        },
        embedding
      });
    }

    // 2. Index Lessons
    const lessons = await Lesson.find();
    console.log(`Indexing ${lessons.length} course lessons...`);
    for (const lesson of lessons) {
      const textToEmbed = `Lesson Title: ${lesson.title}. Content Outline: ${lesson.content.substring(0, 500)}. It belongs to Course ID: ${lesson.courseId}.`;
      const embedding = await getEmbedding(textToEmbed);
      await VectorDocument.create({
        title: lesson.title,
        content: textToEmbed,
        type: 'lesson',
        slug: `courses`,
        metadata: {
          id: lesson._id,
          courseId: lesson.courseId
        },
        embedding
      });
    }

    // 3. Index Theory Chapters
    const chapters = await TheoryChapter.find();
    console.log(`Indexing ${chapters.length} theory chapters...`);
    for (const ch of chapters) {
      const textToEmbed = `Theory Subject: ${ch.subjectId}. Chapter Title: ${ch.title}. Content Preview: ${ch.content.substring(0, 500)}. Interview Tips: ${ch.interviewTips}. Common Mistakes: ${ch.commonMistakes}`;
      const embedding = await getEmbedding(textToEmbed);
      await VectorDocument.create({
        title: ch.title,
        content: textToEmbed,
        type: 'theory',
        slug: `theory`,
        metadata: {
          id: ch._id,
          subjectId: ch.subjectId
        },
        embedding
      });
    }

    // 4. Index Aptitude Topics
    const aptTopics = await AptitudeTopic.find();
    console.log(`Indexing ${aptTopics.length} aptitude topics...`);
    for (const topic of aptTopics) {
      const textToEmbed = `Aptitude Topic: ${topic.title}. Category: ${topic.category}. Description: ${topic.desc}. Shortcuts: ${topic.shortcuts ? topic.shortcuts.join(' ') : ''}. Slug: ${topic.slug}`;
      const embedding = await getEmbedding(textToEmbed);
      await VectorDocument.create({
        title: topic.title,
        content: textToEmbed,
        type: 'aptitude',
        slug: `aptitude`,
        metadata: {
          id: topic._id,
          slug: topic.slug,
          category: topic.category,
          year_level: topic.year_level,
          target_role: topic.target_role,
          is_placement_prep: topic.is_placement_prep
        },
        embedding
      });
    }

    // 5. Index DSA Problems
    const problems = await DSAProblem.find();
    console.log(`Indexing ${problems.length} DSA practice problems...`);
    for (const prob of problems) {
      const textToEmbed = `DSA Problem: ${prob.title}. Topic: ${prob.topic}. Difficulty: ${prob.difficulty}. XP: ${prob.xp}. Solve URL: ${prob.solveUrl}. Slug: ${prob.slug}`;
      const embedding = await getEmbedding(textToEmbed);
      await VectorDocument.create({
        title: prob.title,
        content: textToEmbed,
        type: 'faq', // group in faq search
        slug: `dsa`,
        metadata: {
          id: prob._id,
          slug: prob.slug,
          topic: prob.topic,
          year_level: prob.year_level,
          target_role: prob.target_role,
          is_placement_prep: prob.is_placement_prep
        },
        embedding
      });
    }

    // 6. Index Custom Career Advisor FAQs
    console.log(`Indexing ${careerFAQs.length} custom placement guide roadmaps...`);
    for (const faq of careerFAQs) {
      const embedding = await getEmbedding(faq.content);
      await VectorDocument.create({
        title: faq.title,
        content: faq.content,
        type: 'faq',
        slug: faq.slug,
        metadata: {
          slug: faq.slug,
          is_placement_prep: true,
          year_level: ["1st", "2nd", "3rd", "4th"]
        },
        embedding
      });
    }

    console.log('RAG Vector Indexing completed successfully. Embedded all courses, lessons, chapters, and roadmaps.');
  } catch (error) {
    console.error('RAG Vector Indexing error:', error);
  }
};

module.exports = {
  indexDatabaseForRAG
};
