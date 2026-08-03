const TheorySubject = require('../models/TheorySubject');
const TheoryChapter = require('../models/TheoryChapter');
const AptitudeTopic = require('../models/AptitudeTopic');
const { osTheoryChapters } = require('./osTheoryData');
const { synonymsData, oneWordSubData, idiomsData, spellCheckData, prepositionsData, articlesData, readingCompData, errorSpottingData, voiceData, speechData, bloodRelationsData, seatingArrangementData, mirrorImagesData, analogyData, classificationData } = require('./aptitudeQuestionsData');

const seedTheoryData = async () => {
  const count = await TheorySubject.countDocuments();
  if (count > 0) {
    console.log('Theory subjects already seeded. Skipping...');
    return;
  }

  // Define subjects
  const subjects = [
    { id: 'dsa', title: 'DSA Theory', icon: '🔢', order: 1 },
    { id: 'oops', title: 'OOPS', icon: '📦', order: 2 },
    { id: 'os', title: 'Operating Systems', icon: '⚙️', order: 3 },
    { id: 'dbms', title: 'DBMS', icon: '🗄️', order: 4 },
    { id: 'cn', title: 'Computer Networks', icon: '🌐', order: 5 },
    { id: 'ml', title: 'Machine Learning', icon: '🧠', order: 6 },
    { id: 'maths', title: 'Mathematics', icon: '∑', order: 7 }
  ];

  await TheorySubject.insertMany(subjects);
  console.log('Theory subjects seeded successfully.');

  // Define chapter lists for each subject
  const subjectsChapters = {
    dsa: [
      'Time Complexity', 'Space Complexity', 'Recursion', 'Backtracking', 'Arrays', 
      'Strings', 'Linked List', 'Stack', 'Queue', 'Deque', 'HashMap', 'Heap', 
      'BST', 'AVL Tree', 'Trie', 'Graph', 'BFS', 'DFS', 'Topological Sort', 
      'Union Find', 'Segment Tree', 'Fenwick Tree', 'Dynamic Programming', 
      'Greedy', 'Sliding Window', 'Prefix Sum', 'Binary Search', 'Bit Manipulation', 
      'Math', 'Geometry', 'Number Theory', 'Interview Patterns', 'Cheat Sheets', 
      'Frequently Asked Questions'
    ],
    oops: [
      'Classes', 'Objects', 'Constructors', 'Destructor', 'Encapsulation', 
      'Abstraction', 'Inheritance', 'Polymorphism', 'Overloading', 'Overriding', 
      'Static', 'Final', 'Interface', 'Abstract Class', 'Exception Handling', 
      'Packages', 'Collections', 'Generics', 'Multithreading', 'Synchronization', 
      'Interview Questions'
    ],
    os: [
      'Operating System Introduction',
      'Process, Program, and Thread',
      'Types of Operating System',
      'Batch OS, Multiprogramming OS and Multitasking OS',
      'Multiprocessing OS and Real-time OS',
      'Distributed, Clustured, Embedded OS',
      'Process and Its State',
      'Process Control Block',
      'Context Switching',
      'User Mode and Kernel Mode',
      'Scheduling Queues and Schedulers in OS',
      'Process Scheduling Algorithms, Preemptive vs. Non-Preemptive',
      'Scheduling Algorithms (FCFS, SJF, SRTF)',
      'Scheduling Algorithms (HRRN, RR, PBS, MLQ)',
      'Threads in Operating System',
      'Multithreading Models: User-Level vs. Kernel-Level',
      'Process Synchronization & Race Conditions',
      'Semaphores and Mutexes',
      'Classic Synchronization Problems (Bounded Buffer, Readers-Writers)',
      'Deadlock Introduction & Necessary Conditions',
      'Deadlock Prevention, Avoidance (Banker\'s Algorithm)',
      'Memory Management: Contiguous vs. Non-Contiguous',
      'Paging and Translation Lookaside Buffer (TLB)',
      'Virtual Memory & Page Replacement Algorithms (FIFO, LRU, Optimal)',
      'File System Structures & Allocation Methods',
      'Disk Scheduling Algorithms (FCFS, SSTF, SCAN, LOOK)',
      'OS Protection & Security',
      'Linux Core Commands & Shell Scripting',
      'Frequently Asked Technical Interview Questions'
    ],
    dbms: [
      'ER Model', 'Keys', 'Normalization', 'SQL', 'Transactions', 'ACID', 
      'Indexing', 'Joins', 'Views', 'Stored Procedures', 'Triggers', 'Locking', 
      'Deadlock', 'Recovery', 'Distributed DBMS', 'NoSQL', 'MongoDB', 
      'Interview Questions'
    ],
    cn: [
      'OSI', 'TCP/IP', 'Physical Layer', 'Data Link', 'Network Layer', 
      'Transport Layer', 'Session Layer', 'Presentation Layer', 'Application Layer', 
      'TCP', 'UDP', 'DNS', 'DHCP', 'HTTP', 'HTTPS', 'SMTP', 'FTP', 'Routing', 
      'Congestion', 'Interview Questions'
    ],
    ml: [
      'Linear Regression', 'Logistic Regression', 'Decision Tree', 'Random Forest', 
      'SVM', 'Naive Bayes', 'KNN', 'Clustering', 'PCA', 'Neural Networks', 
      'CNN', 'RNN', 'LSTM', 'Transformers', 'LLM', 'RAG', 'LangChain', 
      'Embeddings', 'Vector DB', 'Fine Tuning', 'Prompt Engineering', 
      'Interview Questions'
    ],
    maths: [
      'Probability', 'Statistics', 'Bayes', 'Mean', 'Median', 'Mode', 
      'Variance', 'Standard Deviation', 'Linear Algebra', 'Matrix', 'Vector', 
      'Calculus', 'Differentiation', 'Integration'
    ]
  };

  const makeChapterContent = (subject, title) => {
    return `### Introduction to ${title}

Welcome to the comprehensive guide on **${title}**. This chapter covers foundational concepts, implementation guidelines, and critical interview patterns.

---

### Key Concepts & Definitions

1. **Core Definition**: ${title} is a fundamental concept in ${subject.toUpperCase()} used to solve structural, behavioral, or algorithmic problems.
2. **Key Attribute**: It provides optimization boundaries, structured data schemas, and mathematical guarantees.

---

### Implementation & Code Examples

Here is how to implement or solve problems related to ${title} in Java, C++, and Python:

#### C++ Implementation
\`\`\`cpp
#include <iostream>
#include <vector>
using namespace std;

// Solves standard challenges on ${title}
void solve${title.replace(/[^a-zA-Z0-9]/g, '')}() {
    cout << "Executing ${title} algorithm" << endl;
}
\`\`\`

#### Java Implementation
\`\`\`java
import java.util.*;

public class ${title.replace(/[^a-zA-Z0-9]/g, '')}Solution {
    // Computes target logic for ${title}
    public static void main(String[] args) {
        System.out.println("Running ${title} check");
    }
}
\`\`\`

#### Python Implementation
\`\`\`python
# Dynamic python module for ${title}
def solve_${title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_')}():
    print("Processing ${title}")
\`\`\`

---

### Comparison Matrix
| Attribute | Typical Complexity | Use Case | Memory Impact |
|---|---|---|---|
| Basic Setup | O(1) | Starter initialization | Minimal |
| Core Operation | O(log N) | Binary division | Medium |
| Scaled Mode | O(N) | Array scanning | Low |

---

### 💡 High-Yield Interview Tips
> [!TIP]
> When asked about **${title}**, start by explaining the time-space trade-offs. Interviewers love to see candidates who optimize for memory efficiency.
> Avoid using library shortcuts initially; write clean, manual implementations to demonstrate raw programming skills.

---

### ⚠️ Common Mistakes & Pitfalls
- **Off-by-One Errors**: Be careful with array indices or recursion base cases.
- **Null Pointer Dereferences**: Always include safe checks for nodes and dynamic variables.
- **Integer Overflow**: Use long or double types where sum sizes exceed $2^{31}-1$.

---

### 🎯 Real Interview Questions & Explanations

#### Q1: Can you describe the primary bottleneck in scaling ${title}?
**Answer**: The primary bottleneck relates to synchronization overhead or cache misses in linear data traversals. This is optimized by applying segmentation, partitioning, or local hashing maps.

#### Q2: How does the average performance of ${title} compare to basic alternatives?
**Answer**: Average performance is significantly superior due to structural balance, yielding logarithmic bounds compared to linear constraints of basic alternatives.

---

### 🏢 Company-Wise Frequently Asked Questions
* **Google**: "Explain the range-query implementation of ${title}."
* **Amazon**: "Design a service that uses ${title} to rank real-time events."
* **TCS**: "What is the difference between this and static arrays?"
`;
  };

  const chaptersData = [];
  for (const subjectId of Object.keys(subjectsChapters)) {
    const chaptersList = subjectsChapters[subjectId];
    for (let i = 0; i < chaptersList.length; i++) {
      const title = chaptersList[i];
      const customOSChapter = (subjectId === 'os') ? osTheoryChapters[title] : null;

      if (customOSChapter) {
        chaptersData.push({
          subjectId,
          title,
          order: i + 1,
          content: customOSChapter.content,
          codeExamples: customOSChapter.codeExamples || [
            { language: 'cpp', code: `#include <iostream>\nusing namespace std;\n\nvoid solve() {\n  cout << "C++ implementation of ${title}" << endl;\n}` },
            { language: 'java', code: `import java.util.*;\n\npublic class Solution {\n  public static void main(String[] args) {\n    System.out.println("Java implementation of ${title}");\n  }\n}` },
            { language: 'python', code: `def solve():\n    print("Python implementation of ${title}")` }
          ],
          diagramUrl: 'https://images.unsplash.com/photo-1516116211223-5c359a36298a?auto=format&fit=crop&q=80&w=600',
          interviewTips: customOSChapter.interviewTips || `Always discuss edge cases before writing code for ${title}. Mention potential memory constraints.`,
          commonMistakes: customOSChapter.commonMistakes || `Forgetting base cases, ignoring null pointer checks, and off-by-one array bounds error.`,
          realInterviewQuestions: customOSChapter.realInterviewQuestions || [
            { question: `What is the significance of ${title}?`, answer: `It provides optimization solutions for core logic requirements.`, difficulty: 'Medium' }
          ],
          companyFAQs: customOSChapter.companyFAQs || [
            { companyName: 'TCS', questionText: `Explain how ${title} is used in backend system stacks.` },
            { companyName: 'Infosys', questionText: `What are the memory trade-offs when implementing ${title}?` }
          ],
          notesUrl: 'https://drive.google.com/file/d/1FQGGORBNB3yJrbhvwaPpAa7BHufdp-x3/view?usp=sharing',
          xpReward: 20
        });
      } else {
        chaptersData.push({
          subjectId,
          title,
          order: i + 1,
          content: makeChapterContent(subjectId, title),
          codeExamples: [
            { language: 'cpp', code: `#include <iostream>\nusing namespace std;\n\nvoid solve() {\n  cout << "C++ implementation of ${title}" << endl;\n}` },
            { language: 'java', code: `import java.util.*;\n\npublic class Solution {\n  public static void main(String[] args) {\n    System.out.println("Java implementation of ${title}");\n  }\n}` },
            { language: 'python', code: `def solve():\n    print("Python implementation of ${title}")` }
          ],
          diagramUrl: 'https://images.unsplash.com/photo-1516116211223-5c359a36298a?auto=format&fit=crop&q=80&w=600',
          interviewTips: `Always discuss edge cases before writing code for ${title}. Mention potential memory constraints.`,
          commonMistakes: `Forgetting base cases, ignoring null pointer checks, and off-by-one array bounds error.`,
          realInterviewQuestions: [
            { question: `What is the significance of ${title}?`, answer: `It provides optimization solutions for core logic requirements.`, difficulty: 'Medium' }
          ],
          companyFAQs: [
            { companyName: 'TCS', questionText: `Explain how ${title} is used in backend system stacks.` },
            { companyName: 'Infosys', questionText: `What are the memory trade-offs when implementing ${title}?` }
          ],
          notesUrl: 'https://drive.google.com/file/d/1FQGGORBNB3yJrbhvwaPpAa7BHufdp-x3/view?usp=sharing',
          xpReward: 20
        });
      }
    }
  }

  await TheoryChapter.insertMany(chaptersData);
  console.log(`Seeded ${chaptersData.length} theory chapters successfully.`);
};

// Returns actual formulas, explanations, solved examples, pitfalls, and ASCII diagrams for a topic
const getTopicSpecificData = (title) => {
  const data = {
    formula: 'X = Y * Z',
    overview: 'This topic forms the fundamental pillar of aptitude tests. It measures the logical reasoning ability or mathematical skill of the candidate under constrained timelines.',
    formulaDetails: 'General equation formatting: Value = (Base * Factor) / Scale.',
    example: 'Q: Find the value if base is 100, factor is 5, and scale is 10.\n\nSolution:\nValue = (100 * 5) / 10 = 50.',
    advancedExample: 'Q: Evaluate under compounded conditions where base increases by 10% successively.\n\nSolution:\nValue = Base * 1.10 = 110.',
    shortcut: 'Use standard ratio assumptions instead of full variable expressions to save time.',
    pitfall: 'Forgetting to align units before multiplying or dividing the base numbers.',
    chart: `
+-------------------------------------------------+
|              CONCEPT FLOW DIAGRAM               |
|                                                 |
|  [Input Data] ---> [Apply Model] ---> [Output]  |
+-------------------------------------------------+
`
  };

  // Specific content mapping for major topics
  if (title === 'Number System') {
    data.formula = 'Sum of series = n(n + 1)/2\nDivisibility by 11: Odd sum - Even sum = 11k';
    data.overview = 'Number system deals with types of numbers (rational, irrational, prime, composite), divisibility rules, remainders, factors, and unit digit cycles. Understanding cycles of numbers (like cyclicity of 4) is critical for solving powers-based unit digit questions.';
    data.formulaDetails = 'Sum of first n squares = n(n + 1)(2n + 1) / 6\nSum of first n cubes = [n(n + 1)/2]²\nNumber of factors of N = p^a * q^b * r^c is (a+1)(b+1)(c+1) where p,q,r are prime.';
    data.example = 'Q: Find the sum of first 20 natural numbers.\n\nSolution:\n1. Use formula: Sum = n(n+1)/2.\n2. n = 20.\n3. Sum = (20 * 21) / 2 = 210.';
    data.advancedExample = 'Q: Find the unit digit of 7^95.\n\nSolution:\n1. Cyclicity of 7 is 4.\n2. Divide 95 by 4: 95 % 4 = 3.\n3. Unit digit of 7^95 is same as 7^3 = 343, which is 3.';
    data.shortcut = 'To check divisibility by 3 or 9, sum the digits. If digit sum is divisible by 3 or 9, the number is also divisible.';
    data.pitfall = 'Confusing prime numbers with odd numbers (e.g. thinking 9 is prime, or forgetting 2 is the only even prime number).';
    data.chart = `
+-------------------------------------------------------------+
|                      NUMBER CLASSIFICATION                  |
|                                                             |
|                       Real Numbers                          |
|                       /          \\                          |
|               Rational            Irrational (e.g. sqrt(2)) |
|              /        \\                                     |
|         Integers      Fractions                             |
|         /      \\                                            |
|     Negative   Whole Numbers                                |
|                /      \\                                     |
|               0       Natural Numbers                       |
+-------------------------------------------------------------+
`;
  } else if (title === 'Percentage') {
    data.formula = 'Percentage = (Part / Whole) * 100\nNet change = a + b + (ab / 100)%';
    data.overview = 'Percentages are ways to write fractions with denominator 100. They are widely used in commercial math, population trends, price-consumption balances, and relative evaluations.';
    data.formulaDetails = 'If price increases by R%, reduction in consumption = [R / (100 + R)] * 100%\nIf price decreases by R%, increase in consumption = [R / (100 - R)] * 100%';
    data.example = 'Q: If A\'s income is 25% more than B\'s, by how much % is B\'s income less than A\'s?\n\nSolution:\nFormula: [R / (100 + R)] * 100%\nLess % = [25 / (125)] * 100 = 20%.';
    data.advancedExample = 'Q: If radius of a circle increases by 10%, find the percentage change in its area.\n\nSolution:\nArea = pi * r^2. Since radius increases successively in 2 dimensions: \nNet % increase = a + b + ab/100 = 10 + 10 + (10*10)/100 = 21%.';
    data.shortcut = 'Memorize fraction to percentage mappings: 1/2 = 50%, 1/3 = 33.3%, 1/4 = 25%, 1/5 = 20%, 1/6 = 16.67%, 1/8 = 12.5%, 1/12 = 8.33%.';
    data.pitfall = 'Applying successive percentage changes additively (e.g. thinking 10% increase followed by 10% decrease equals 0% change, whereas it is actually a 1% net decrease).';
    data.chart = `
+-----------------------------------------------------+
|              SUCCESSIVE PERCENTAGE CYCLE            |
|                                                     |
|   Initial Value (100)                               |
|        |                                            |
|        +---> [ +10% Increase ] ---> Value = 110     |
|                                         |           |
|        +--------------------------------+           |
|        |                                            |
|        v                                            |
|   Value (110) ---> [ -10% Decrease ] ---> Final: 99 |
|                                                     |
|   Net Change = 99 - 100 = -1% (Loss of 1%)          |
+-----------------------------------------------------+
`;
  } else if (title === 'Profit & Loss') {
    data.formula = 'Profit = SP - CP\nProfit% = (Profit / CP) * 100';
    data.overview = 'Profit and loss problems involve Cost Price (buying price), Selling Price (selling price), and Marked Price (catalog price). Discounts are always applied to Marked Price, while Profit/Loss is calculated relative to Cost Price.';
    data.formulaDetails = 'SP = CP * (100 + Gain%) / 100\nSP = CP * (100 - Loss%) / 100\nDiscount% = (Marked Price - SP) / Marked Price * 100';
    data.example = 'Q: An article bought for Rs. 80 is sold for Rs. 100. Find the profit percentage.\n\nSolution:\n1. Profit = 100 - 80 = Rs. 20.\n2. Profit% = (20 / 80) * 100 = 25%.';
    data.advancedExample = 'Q: A shopkeeper allows a 10% discount on marked price but still makes a 20% profit. If cost price is Rs. 300, find marked price.\n\nSolution:\n1. SP = CP * 1.20 = 300 * 1.2 = Rs. 360.\n2. Since 10% discount is allowed: SP = MP * 0.90 => 360 = MP * 0.90 => MP = Rs. 400.';
    data.shortcut = 'If two items are sold at same SP, one at x% gain and other at x% loss, there is a net loss of (x / 10)² % always.';
    data.pitfall = 'Calculating profit or loss percentage on the Selling Price (SP) instead of the Cost Price (CP) unless explicitly instructed in the question.';
    data.chart = `
+----------------------------------------------------------+
|                 COMMERCIAL MATH SCHEME                   |
|                                                          |
|  Cost Price (CP)  ======= [ +Markup ] ======> Marked Price|
|       \\\\                                          //     |
|        \\\\                                        //      |
|     [ +Profit ]                              [ -Discount]|
|          \\\\                                      //      |
|           v                                      v       |
|                     Selling Price (SP)                   |
+----------------------------------------------------------+
`;
  } else if (title === 'Simple Interest') {
    data.formula = 'SI = (P * R * T) / 100\nAmount = P + SI';
    data.overview = 'Simple interest is computed strictly on the principal sum. The principal amount remains unchanged over the years, meaning the interest generated is constant each year.';
    data.formulaDetails = 'P = (SI * 100) / (R * T)\nR = (SI * 100) / (P * T)\nT = (SI * 100) / (P * R)';
    data.example = 'Q: Calculate simple interest on Rs. 5000 at 6% p.a. for 4 years.\n\nSolution:\nSI = (5000 * 6 * 4) / 100 = 50 * 24 = Rs. 1200.';
    data.advancedExample = 'Q: A sum of money doubles itself in 8 years at simple interest. Find the rate of interest.\n\nSolution:\n1. Doubling means SI = P.\n2. P = (P * R * 8) / 100 => R * 8 = 100 => R = 12.5% p.a.';
    data.shortcut = 'If a sum of money becomes "n" times itself in T years at simple interest, the rate R = 100(n - 1) / T %.';
    data.pitfall = 'Confusing time units (e.g. using months directly in T instead of converting months to years by dividing by 12).';
    data.chart = `
+-------------------------------------------------------------+
|                     SIMPLE INTEREST TIMELINE                |
|                                                             |
| Year 0: Principal = Rs. 1000                                |
| Year 1: Interest = Rs. 100  =======> Total Amount = Rs. 1100|
| Year 2: Interest = Rs. 100  =======> Total Amount = Rs. 1200|
| Year 3: Interest = Rs. 100  =======> Total Amount = Rs. 1300|
|                                                             |
| * Interest remains flat at Rs. 100 every single year.       |
+-------------------------------------------------------------+
`;
  } else if (title === 'Compound Interest') {
    data.formula = 'Amount (A) = P * (1 + R/100)^n\nCI = Amount - P';
    data.overview = 'Compound interest is interest calculated on the initial principal, which also includes all of the accumulated interest of previous periods. It represents compounding growth or interest on interest.';
    data.formulaDetails = 'If compounded half-yearly: A = P * (1 + (R/2)/100)^(2n)\nIf compounded quarterly: A = P * (1 + (R/4)/100)^(4n)\nDifference between CI & SI for 2 years = P * (R/100)²';
    data.example = 'Q: Find compound interest on Rs. 2000 at 10% p.a. for 2 years compounded annually.\n\nSolution:\n1. A = 2000 * (1 + 10/100)² = 2000 * (1.1)² = 2420.\n2. CI = A - P = 2420 - 2000 = Rs. 420.';
    data.advancedExample = 'Q: The difference between CI and SI for a sum at 5% rate for 2 years is Rs. 15. Find the sum.\n\nSolution:\n1. Use formula: Diff = P * (R/100)².\n2. 15 = P * (5/100)² => 15 = P * (1/20)² = P / 400.\n3. P = 15 * 400 = Rs. 6000.';
    data.shortcut = 'Compound interest growth multipliers: 10% rate for 2 years = 21% net increase. 20% rate for 2 years = 44% net increase.';
    data.pitfall = 'Calculating compound interest by computing SI on accumulated amounts year-by-year manually, which is extremely slow and leads to calculation errors.';
    data.chart = `
+---------------------------------------------------------------+
|                    COMPOUND INTEREST FLOW                     |
|                                                               |
| Year 0: Principal = Rs. 1000                                  |
| Year 1: Interest = 10% of 1000 = Rs. 100. Amount = Rs. 1100   |
| Year 2: Interest = 10% of 1100 = Rs. 110. Amount = Rs. 1210   |
| Year 3: Interest = 10% of 1210 = Rs. 121. Amount = Rs. 1331   |
|                                                               |
| * Interest increases over time (Rs. 100 -> Rs. 110 -> Rs. 121)|
+---------------------------------------------------------------+
`;
  } else if (title === 'Average') {
    data.formula = 'Average = Sum of elements / Number of elements';
    data.overview = 'Averages represent the central value of a set of data. Concepts include consecutive number averages, weighted averages, and inclusion/exclusion of elements.';
    data.formulaDetails = 'Sum of elements = Average * Number of elements\nWeighted average = (n1*A1 + n2*A2) / (n1 + n2)';
    data.example = 'Q: The average score of 4 students is 80. A 5th student joins and the average becomes 82. Find the 5th student\'s score.\n\nSolution:\n1. Sum of 4 students = 4 * 80 = 320.\n2. Sum of 5 students = 5 * 82 = 410.\n3. Score of 5th student = 410 - 320 = 90.';
    data.advancedExample = 'Q: A cricketer has an average of 40 runs in 10 innings. How many runs must he score in the 11th inning to raise his average to 45?\n\nSolution:\n1. Sum of 10 innings = 400.\n2. Target sum for 11 innings = 11 * 45 = 495.\n3. Runs required = 495 - 400 = 95 runs.';
    data.shortcut = 'If a car travels from A to B at x km/h and returns at y km/h, the average speed for the round trip is 2xy / (x + y) km/h.';
    data.pitfall = 'Computing average speed by taking the simple arithmetic mean of the two speeds (e.g. saying average of 40 km/h and 60 km/h is 50 km/h, which is incorrect if travel distances are equal).';
    data.chart = `
+----------------------------------------------------------+
|                  WEIGHTED AVERAGE DIAGRAM                |
|                                                          |
|  Group A: n1 = 20, Avg1 = 60   Group B: n2 = 30, Avg2 = 70|
|       \\                             /                    |
|        \\                           /                     |
|         v                         v                      |
|                Combined Class Average                    |
|       Avg = (20*60 + 30*70) / (20 + 30) = 3300/50 = 66   |
+----------------------------------------------------------+
`;
  } else if (title === 'Ages') {
    data.formula = 'Present age = x\nt years ago = x - t; t years hence = x + t';
    data.overview = 'Problems on ages require translating verbal sentences describing past, present, and future age relationships into linear algebraic equations.';
    data.formulaDetails = 'Age differences between two individuals remain completely constant at any point in time.\nIf age ratio is a:b, we assume ages are ax and bx.';
    data.example = 'Q: A mother is 4 times as old as her daughter. In 20 years, she will be twice as old. Find daughter\'s present age.\n\nSolution:\n1. Daughter = x, Mother = 4x.\n2. In 20 years: 4x + 20 = 2(x + 20) => 4x + 20 = 2x + 40.\n3. 2x = 20 => x = 10 years.';
    data.advancedExample = 'Q: Ratio of ages of A and B is 3:4. Ten years ago, the ratio was 1:2. Find their present ages.\n\nSolution:\n1. Ages = 3x and 4x. Ten years ago: (3x - 10)/(4x - 10) = 1/2.\n2. 2(3x - 10) = 4x - 10 => 6x - 20 = 4x - 10 => 2x = 10 => x = 5.\n3. Present ages: A = 15, B = 20.';
    data.shortcut = 'If present ratio is a:b, and after T years ratio becomes c:d, then present age of A = a * [ T * (d - c) ] / (ad - bc).';
    data.pitfall = 'Forgetting to add or subtract years for both individuals when moving through timelines (e.g. adding 10 years to father\'s age but forgetting to add 10 to the son\'s age).';
    data.chart = `
+-------------------------------------------------------------+
|                      AGE TIMELINE GRAPH                     |
|                                                             |
|  10 Years Ago (x - 10) <--- Present (x) ---> In 10 Years (x + 10) |
|                                                             |
| * Key rule: If A is 5 years older than B today, A was 5     |
|   years older than B 10 years ago and will be 5 years      |
|   older in 10 years. Difference is invariant.              |
+-------------------------------------------------------------+
`;
  } else if (title === 'Time & Work') {
    data.formula = 'Work = Rate * Time\nIf A takes X days, A\'s 1-day work = 1/X';
    data.overview = 'Time and work describes the relationship between the number of people, their work efficiencies, and the time required to complete a given task. Work rate and time are inversely proportional.';
    data.formulaDetails = 'If A takes X days and B takes Y days, together they take XY / (X + Y) days.\nChain Rule: M1 * D1 * H1 / W1 = M2 * D2 * H2 / W2 (M=Men, D=Days, H=Hours, W=Work).';
    data.example = 'Q: A can do a work in 12 days, and B can do it in 24 days. Working together, how many days will they take?\n\nSolution:\nTogether = (12 * 24) / (12 + 24) = 288 / 36 = 8 days.';
    data.advancedExample = 'Q: 10 men can complete a project in 15 days working 6 hours a day. How many days will it take 15 men working 5 hours a day to complete the same work?\n\nSolution:\n1. Apply Chain Rule: M1*D1*H1 = M2*D2*H2.\n2. 10 * 15 * 6 = 15 * D2 * 5 => 900 = 75 * D2.\n3. D2 = 900 / 75 = 12 days.';
    data.shortcut = 'If A is twice as fast as B, A\'s efficiency is 2x and B\'s is x. Ratio of times taken by A and B is 1:2.';
    data.pitfall = 'Adding times directly (e.g. saying if A takes 4 days and B takes 6 days, together they take 10 days, which is logically impossible since working together must take less time).';
    data.chart = `
+---------------------------------------------------------------+
|                      WORK EFFICIENCY MATRIX                   |
|                                                               |
|  Person A (Rate = 1/10) --+                                   |
|                           |                                   |
|                           +---> [ Combined Rate: 1/10 + 1/15 ] ---> Time = 6 days |
|                           |                                   |
|  Person B (Rate = 1/15) --+                                   |
+---------------------------------------------------------------+
`;
  } else if (title === 'Time Speed Distance' || title === 'Train Problems') {
    data.formula = 'Distance = Speed * Time\nSpeed in m/s = Speed in km/h * 5/18';
    data.overview = 'Time, speed, and distance cover movement principles, including unit conversions, relative speed (moving in the same or opposite directions), average speeds, and trains crossing objects.';
    data.formulaDetails = 'Relative speed (same direction) = S1 - S2\nRelative speed (opposite direction) = S1 + S2\nTime to cross platform = (Train length + Platform length) / Train speed';
    data.example = 'Q: A train 200m long crosses a bridge of length 300m at a speed of 72 km/h. Find time taken.\n\nSolution:\n1. Speed = 72 * 5/18 = 20 m/s.\n2. Total distance = 200 + 300 = 500m.\n3. Time = 500 / 20 = 25 seconds.';
    data.advancedExample = 'Q: A thief steals a car at 2 PM and drives at 60 km/h. The theft is discovered at 3 PM and owner chases him in another car at 80 km/h. When will the owner catch him?\n\nSolution:\n1. Thief travels for 1 hour before chase starts. Lead distance = 60 km.\n2. Relative speed = 80 - 60 = 20 km/h.\n3. Catch time = Lead / Rel Speed = 60 / 20 = 3 hours. Catch occurs at 3 PM + 3 hours = 6 PM.';
    data.shortcut = 'If distances are equal, Average speed = 2xy / (x+y). If times are equal, Average speed = (x+y)/2.';
    data.pitfall = 'Forgetting to convert speed to m/s when train lengths are given in meters and time is in seconds.';
    data.chart = `
+-------------------------------------------------------------+
|                     RELATIVE SPEED DIRECTIONS               |
|                                                             |
|  Opposite Directions (Add Speeds):                          |
|  Train A (S1 --->)  <=========>  (<--- S2) Train B          |
|  Relative Speed = S1 + S2                                   |
|                                                             |
|  Same Direction (Subtract Speeds):                          |
|  Train A (S1 --->)  ==========>  (S2 --->) Train B          |
|  Relative Speed = S1 - S2                                   |
+-------------------------------------------------------------+
`;
  } else if (title === 'Blood Relations') {
    data.formula = 'Family Tree Levels:\nLevel 0: Parents; Level -1: Children; Level +1: Grandparents';
    data.overview = 'Blood relation questions test logical connections between family members. Representing relations using a clean family tree diagram is the most effective approach.';
    data.formulaDetails = 'Use specific symbols: + or Square for Male; - or Circle for Female; = for Spouses; | for Generation gap.';
    data.example = 'Q: Pointing to a boy, Vinay said, "He is the son of the only son of my grandfather." Relation?\n\nSolution:\n1. Grandfather\'s only son = Vinay\'s father.\n2. Son of Vinay\'s father = Vinay\'s brother.';
    data.advancedExample = 'Q: A is the mother of B. B is the sister of C. D is the son of C. How is A related to D?\n\nSolution:\n1. A is mother of B and C (since B and C are sisters/siblings).\n2. D is C\'s son. So A is C\'s mother, making A the maternal grandmother of D.';
    data.shortcut = 'Always start tracing the family tree backwards from the person mentioned after "of my" in the question statement.';
    data.pitfall = 'Assuming gender based strictly on name (e.g. assuming "Kiran" is female or "Raj" is male when not explicitly stated).';
    data.chart = `
+--------------------------------------------------------+
|                     FAMILY TREE CODES                  |
|                                                        |
|      [Grandfather (+)] ======= [Grandmother (-)]       |
|                             |                          |
|                       [Father (+)] === [Mother (-)]    |
|                                     |                  |
|                            +--------+--------+         |
|                            |                 |         |
|                       [Sister (-)]     [Candidate (+)] |
+--------------------------------------------------------+
`;
  } else if (title === 'Coding & Decoding') {
    data.formula = 'A=1, B=2, ..., Z=26\nOpposite pairs sum to 27 (A=1 + Z=26 = 27)';
    data.overview = 'Coding-decoding requires decoding a secret pattern rule from a given word-code pair and applying that same rule to code a new word.';
    data.formulaDetails = 'Standard EJOTY code offsets: E=5, J=10, O=15, T=20, Y=25.';
    data.example = 'Q: If COLD is coded as DPME, code WARM.\n\nSolution:\n1. Rule is +1 shift: C(+1)->D, O(+1)->P, L(+1)->M, D(+1)->E.\n2. Apply to WARM: W(+1)->X, A(+1)->B, R(+1)->S, M(+1)->N. Result = XBSN.';
    data.advancedExample = 'Q: If MACHINE is coded as 19-7-9-14-15-20-11, code DANGER.\n\nSolution:\n1. Numeric code matches original alphabet index + 6.\n2. M(13+6=19), A(1+6=7), C(3+6=9)... \n3. Apply to DANGER: D(4+6=10), A(1+6=7), N(14+6=20), G(7+6=13), E(5+6=11), R(18+6=24). Result = 10-7-20-13-11-24.';
    data.shortcut = 'Write index numbers above letters immediately. Memorizing the EJOTY pattern saves substantial indexing time.';
    data.pitfall = 'Failing to test the coding pattern on the entire word, leading to missing letters that shift by alternate values (like alternating +1 and -1 shifts).';
    data.chart = `
+-------------------------------------------------------------+
|                      EJOTY INDEXING SYSTEM                  |
|                                                             |
|   Letter:     E      J      O      T      Y                 |
|   Index:      5     10     15     20     25                 |
|                                                             |
|   Example: G is two positions after E (5 + 2 = 7).          |
|   Example: W is three positions after T (20 + 3 = 23).      |
+-------------------------------------------------------------+
`;
  } else if (title === 'Syllogism') {
    data.formula = 'All A are B: A is inside B\nSome A are B: A overlaps B';
    data.overview = 'Syllogisms involve deductive reasoning from statements to verify if specific conclusions follow logically. Using overlapping Venn diagrams is the standard solving framework.';
    data.formulaDetails = 'Either-Or cases follow if: 1. Both conclusions are invalid independently. 2. Subjects match. 3. One is positive and one is negative (e.g. Some & No).';
    data.example = 'Q: Statements: All cats are dogs. Some dogs are birds. Conclusion: Some cats are birds?\n\nSolution:\n1. Cats are inside Dogs. Birds overlap Dogs.\n2. Birds do not necessarily overlap Cats. Conclusion does not follow.';
    data.advancedExample = 'Q: Statements: No A is B. No B is C. Conclusion: No A is C?\n\nSolution:\n1. A is separate from B. B is separate from C.\n2. A can still overlap C. Thus, "No A is C" is not a definite conclusion. It does not follow.';
    data.shortcut = 'Draw the "minimum overlapping" diagram to check for basic invalidation. If a conclusion fails in the minimum overlap, it is invalid.';
    data.pitfall = 'Assuming logical conclusions based on real-world facts rather than strictly following the statements (e.g. rejecting a conclusion because "All tables are birds" is physically impossible).';
    data.chart = `
+-------------------------------------------------------+
|                    SYLLOGISM OVERLAPS                 |
|                                                       |
|   All A are B:          Some A are B:                 |
|   +---------------+     +---------+---------+         |
|   | B             |     | A       | B       |         |
|   |   +-------+   |     |      +--+--+      |         |
|   |   | A     |   |     |      |Over |      |         |
|   |   +-------+   |     |      +--+--+      |         |
|   +---------------+     +---------+---------+         |
+-------------------------------------------------------+
`;
  }

  return data;
};

// Procedural generator that creates exactly 25 or 50 structured pages of study material
const generateDetailedTextbook = (category, title) => {
  // Key subjects that receive 50 pages. Others receive 25.
  const keyTopics = [
    'Percentage', 'Time & Work', 'Profit & Loss', 'Simple Interest', 'Compound Interest', 
    'Average', 'Ages', 'Time Speed Distance', 'Train Problems', 'Blood Relations', 
    'Coding & Decoding', 'Syllogism'
  ];
  
  const pageCount = keyTopics.includes(title) ? 50 : 25;
  const tData = getTopicSpecificData(title);
  const pages = [];

  for (let p = 1; p <= pageCount; p++) {
    let term = `Page ${p}: `;
    let definition = '';

    if (p === 1) {
      term += 'Introduction & Focus Objectives';
      definition = `Welcome to the comprehensive textbook chapter on **${title}**.\n\n### Learning Objectives\n- Understand the core logical framework behind ${title}.\n- Study foundational mathematical principles and formulas.\n- Master speed-math shortcut tricks designed for competitive exams and technical placements.\n- Learn to identify and avoid common pitfalls.\n\n### Placement Importance\nThis topic is highly prioritized in aptitude rounds of top-tier software and consulting firms (like Google, Amazon, TCS, Infosys, and Deloitte). You can expect 2 to 4 questions from this domain in standard screening assessments.`;
    } else if (p === 2) {
      term += 'Conceptual Background & Real-World Use Case';
      definition = `### Context of ${title}\n\n${tData.overview}\n\n### Real-world Analogy\nImagine you are optimizing resource allocations in a production network or computing return on investments for a server system. The concepts of ${title} translate directly into these operational logic steps, ensuring high efficiency.`;
    } else if (p === 3) {
      term += 'Detailed Core Definitions';
      definition = `Let's break down the essential terminology associated with **${title}**:\n\n1. **Base Variable**: The initial baseline quantity against which changes are measured.\n2. **Relative Modifier**: The rate or factor of increment, decrement, or logical relation.\n3. **Outcome Measure**: The final derived state after mathematical calculations are performed.\n\nStudy these terms carefully as they form the variables in our algebraic equations.`;
    } else if (p === 4) {
      term += 'Underlying Assumptions & Scope boundaries';
      definition = `### Axioms & Constraints\nWhen solving problems on ${title}, the following boundaries are assumed to maintain consistency:\n\n- **Uniformity**: All rate changes, dimensions, or relations behave linearly unless exponential compound conditions are specified.\n- **Closed System**: No external factors (leaks, losses, friction, unlisted variables) affect the calculations unless stated in the problem statement.\n- **Precision bounds**: Standard rounding rules apply. Standard fractions are kept intact to avoid precision losses during division.`;
    } else if (p === 5) {
      term += 'Visual Concept Chart & Flow Diagram';
      definition = `### Concept Visualization\nHere is an ASCII visual layout mapping the logical flow of **${title}**:\n${tData.chart}\n\nUse this flow diagram to structure your solution steps. Identify which stage of the flow the question prompt is referring to.`;
    } else if (p === 6) {
      term += 'Core Mathematical Equations (Basic)';
      definition = `### Basic Formulas\nHere are the starting equations you must commit to memory:\n\n\`\`\`\n${tData.formula}\n\`\`\`\n\nThese equations represent the baseline relations between your inputs and outputs. Always write down these formulas before substituting values.`;
    } else if (p === 7) {
      term += 'Advanced Mathematical Equations (Detailed)';
      definition = `### Detailed Formulas & Extensions\nFor complex variants of **${title}**, use these extended formulas:\n\n\`\`\`\n${tData.formulaDetails}\n\`\`\`\n\nThese formulas account for compound variations, multi-variable changes, or advanced geometric/logical constraints.`;
    } else if (p === 8) {
      term += 'Algebraic Derivations of Formulas';
      definition = `### Formula Proofs\nUnderstanding the derivation of the core formulas helps in solving non-standard questions:\n\n1. Let the base parameter be $X$.\n2. Apply a modification of $Y$ units per time $T$.\n3. The accumulated modifier is $Y \\cdot T$.\n4. Combining with base gives the standard equation: $Total = X + (Y \\cdot T)$ or $Total = X \\cdot (1 + Y/100)^T$.\n\nKnowing this proof prevents memorization block during interviews.`;
    } else if (p === 9) {
      term += 'Standard Units & Conversion Scales';
      definition = `### Unit Systems\nAligning units is the most critical step before beginning calculations:\n\n- **Time**: Convert hours to minutes (x60) or seconds (x3600), and vice versa.\n- **Money/Percentages**: Maintain ratios as fractional representations (e.g. 20% is 0.2) to prevent scale errors.\n- **Logical sets**: Group items by unique sets (disjoint or overlapping) to maintain Venn diagram boundaries.`;
    } else if (p === 10) {
      term += 'Shortcut Trick #1: Speed Calculation Hack';
      definition = `### Shortcut Trick #1\n\n- **Description**: ${tData.shortcut}\n\n- **Benefit**: Reduces mathematical expansion steps from 6 lines to a single mental calculation.\n\n- **Application Scenario**: Ideal for multiple-choice questions where quick elimination of options is needed.`;
    } else if (p === 11) {
      term += 'Shortcut Trick #2: Option Elimination Strategy';
      definition = `### Shortcut Trick #2\n\n- **Description**: Plug options back into the problem statement. Start with middle values (e.g. Option B or C) to narrow down whether the target is larger or smaller.\n\n- **Benefit**: Saves calculation time on quadratics or systems of linear equations.\n\n- **Application Scenario**: Best for ages, mixtures, and work-rate questions.`;
    } else if (p === 12) {
      term += 'Shortcut Trick #3: Value Substitution Hack';
      definition = `### Shortcut Trick #3\n\n- **Description**: Substitute abstract variables with simple numbers (like 100 for percentages, or 12/24 for work rates) to visualize the problem.\n\n- **Benefit**: Simplifies abstract algebra into simple arithmetic.\n\n- **Application Scenario**: Ideal for ratio, partnership, and fraction equations.`;
    } else if (p === 13) {
      term += 'Standard Solved Example #1 (Beginner)';
      definition = `### Solved Example #1\n\n${tData.example}\n\n*Review the steps carefully. Note how the basic formulas are applied directly to the given inputs.*`;
    } else if (p === 14) {
      term += 'Standard Solved Example #2 (Intermediate)';
      definition = `### Solved Example #2\n\n${tData.advancedExample}\n\n*This example requires successive percentage calculations, algebraic setups, or logical boundary maps. Notice the substitution steps.*`;
    } else if (p === 15) {
      term += 'Standard Solved Example #3 (Advanced)';
      definition = `### Solved Example #3\n\n**Question**: If the variables are modified under compounding conditions (e.g., rate changes by 5%, then 10% in successive stages), what is the final state?\n\n**Solution**:\n1. Apply multiplier 1: $M1 = 1.05$.\n2. Apply multiplier 2: $M2 = 1.10$.\n3. Combined multiplier = $1.05 \\cdot 1.10 = 1.155$.\n4. Net change = $15.5\\%$.`;
    } else if (p === 16) {
      term += 'Data Sufficiency Solved Example';
      definition = `### Data Sufficiency Example\n\n**Question**: Is the total value of the item greater than Rs. 500?\n- Statement I: The item's base cost is Rs. 400.\n- Statement II: A profit of 30% was earned on the sale.\n\n**Solution**:\n1. Statement I alone is not sufficient (selling price is unknown).\n2. Statement II alone is not sufficient (base cost is unknown).\n3. Combining both: $SP = 400 \\cdot 1.3 = Rs. 520$, which is > 500. Both statements together are sufficient.`;
    } else if (p === 17) {
      term += 'Placement Exam Solved Example (Google/Amazon Variant)';
      definition = `### Placement Interview Question\n\n**Question**: A candidate is asked to optimize an event queue where events arrive at rate $R_1$ and are processed at rate $R_2$. Under what conditions does the queue size exceed $Q_m$?\n\n**Solution**:\nThis is a pipe flow rate problem. The net accumulation rate is $R_{net} = R_1 - R_2$. If $R_1 > R_2$, queue size exceeds $Q_m$ in time $T = Q_m / (R_1 - R_2)$ seconds.`;
    } else if (p === 18) {
      term += 'Placement Interview Strategy & Tips';
      definition = `### Interview Strategy\n- **Ask clarifying questions**: Confirm if rates are constant or variable before writing formulas.\n- **State assumptions**: Inform the interviewer that you assume no external factors (like transaction costs or processing latency) unless stated.\n- **Verify edge cases**: What happens if the inputs are 0, negative, or infinite? State these bounds clearly.`;
    } else if (p === 19) {
      term += 'Common Pitfalls & Mistakes to Avoid';
      definition = `### Pitfalls Catalog\n\n- **Pitfall**: ${tData.pitfall}\n\n- **Fix**: Write down all quantities with their units (e.g., meters, seconds, hours) on scratch paper and unify them first.\n- **Pitfall**: Applying simple averages instead of weighted averages or harmonic means.\n- **Fix**: Use formulas rather than arithmetic shortcuts when quantities are unbalanced.`;
    } else if (p === 20) {
      term += 'Practice Worksheet: Problem Set A';
      definition = `### Practice Worksheet A\n\n**Problem 1**: Find the output if input is 300 and multiplier is 15%.\n**Problem 2**: A can do a task in 8 hours. B can do it in 16 hours. How long working together?\n**Problem 3**: If ratio is 4:5 and sum of items is 180, find the larger item.`;
    } else if (p === 21) {
      term += 'Practice Worksheet: Problem Set B';
      definition = `### Practice Worksheet B\n\n**Problem 4**: A train 120m long passes a pole at 90 km/h. Find time to cross.\n**Problem 5**: Pointing to a woman, a man says, "Her daughter is the grandmother of my son." How is the woman related to the man?`;
    } else if (p === 22) {
      term += 'Practice Worksheet: Detailed Solutions';
      definition = `### Worksheet Solutions\n\n**Solution 1**: $300 \\cdot 0.15 = 45$.\n**Solution 2**: $Time = (8 \\cdot 16) / (8 + 16) = 128 / 24 = 5.33$ hours.\n**Solution 3**: $Larger = 180 \\cdot (5 / 9) = 100$.\n**Solution 4**: $Speed = 90 \\cdot (5/18) = 25$ m/s. $Time = 120 / 25 = 4.8$ seconds.\n**Solution 5**: Woman is grandmother of the man (maternal/paternal).`;
    } else if (p === 23) {
      term += 'Memory Cheat Sheet Table';
      definition = `### Quick Revision Cheat Sheet\n\n\`\`\`\n+------------------+---------------------------------+\n| Concept Type     | Core Formula                    |\n+------------------+---------------------------------+\n| Base Equation    | ${tData.formula.split('\n')[0]}  |\n| Extended Formula | ${tData.formulaDetails.split('\n')[0]} |\n| Shortcut Rule    | ${tData.shortcut.substring(0, 30)}... |\n+------------------+---------------------------------+\n\`\`\`\n\nUse this table for quick revision 10 minutes before the assessment!`;
    } else if (p === 24) {
      term += 'Frequently Asked Questions (FAQ)';
      definition = `### FAQ\n\n**Q: Why does the formula fail when inputs are negative?**\n**A**: Aptitude problems deal with physical quantities (ages, speeds, works, counts) which are strictly non-negative. Negative values imply reverse vector directions or logical inconsistencies.\n\n**Q: Can I solve these questions by trial-and-error?**\n**A**: Yes, by testing options, but formulas provide guaranteed solutions within 30 seconds.`;
    } else if (p === 25) {
      term += 'Chapter Summary & Next Steps';
      definition = `### Chapter Summary\nYou have completed the core textbook module on **${title}**.\n\nKey takeaways:\n1. Master the basic equations.\n2. Apply the unit check rules.\n3. Leverage shortcut hacks to save time.\n\n**Next Steps**: Proceed to the **timed Quiz** tab on the top-right to test your understanding and secure your XP points!`;
    } else {
      // Pages 26-50 for key subjects
      const subIdx = p - 25;
      term += `Advanced Section ${subIdx} - Special Cases`;
      definition = `### Advanced Module - Section ${subIdx}\nThis section explores advanced variations, special proofs, and multi-variable extensions of **${title}**.\n\n### Advanced Theoretical Framework\nUnder advanced constraints, the parameters are subject to continuous decay or growth rates, modeled by differential progressions. The equation is represented as:\n\n$$V(t) = V_0 \\cdot e^{r \\cdot t}$$\n\n### Advanced Worked Out Case Study\nFor a system operating under high-load thresholds, we compute the critical latency limits using the **${title}** equations. Let the load factor be $L = 0.85$ and threshold boundaries be $\\theta = 0.05$. Applying the limit relations, we get:\n\n$$Margin = \\frac{L \\cdot (1 - \\theta)}{\\theta} = \\frac{0.85 \\cdot 0.95}{0.05} = 16.15$$\n\nReview this setup as it maps directly to complex problem statements in product companies.`;
    }

    pages.push({ term, definition });
  }

  return pages;
};

const seedAptitudeData = async () => {
  const topicCount = await AptitudeTopic.countDocuments();
  if (topicCount > 0) {
    console.log('Aptitude topics already seeded. Skipping...');
    return;
  }

  const { generateQuestions } = require('./aptitudeQuestionsGenerator');

  const listCategories = {
    quant: [
      'Number System', 'Percentage', 'Profit & Loss', 'Ratio', 'Time & Work', 
      'Time Speed Distance', 'Pipes & Cisterns', 'Probability', 'Permutation', 
      'Combination', 'LCM', 'HCF', 'Ages', 'Partnership', 'Average', 'Calendar', 
      'Clock', 'Simplification'
    ],
    logical: [
      'Blood Relations', 'Coding Decoding', 'Seating Arrangement', 'Puzzle', 
      'Direction Sense', 'Statement & Conclusion', 'Statement & Assumption', 
      'Course of Action', 'Syllogism', 'Calendar', 'Clock', 'Ranking', 
      'Missing Number', 'Series', 'Mirror Images', 'Paper Folding', 'Cube Problems', 
      'Data Sufficiency'
    ],
    verbal: [
      'Synonyms', 'Antonyms', 'One Word Substitution', 'Idioms & Phrases', 
      'Sentence Correction', 'Fill in the Blanks', 'Reading Comprehension', 
      'Error Detection', 'Para Jumbles', 'Active Passive', 'Direct Indirect Speech', 
      'Vocabulary', 'Sentence Improvement'
    ]
  };

  const companiesList = ['TCS', 'Infosys', 'Wipro', 'Accenture', 'Capgemini', 'Cognizant', 'Deloitte', 'HCL', 'Tech Mahindra'];

  const topicsData = [];

  for (const catId of Object.keys(listCategories)) {
    const list = listCategories[catId];
    for (let i = 0; i < list.length; i++) {
      const title = list[i];
      const shuffled = [...companiesList].sort(() => 0.5 - Math.random());
      const tags = shuffled.slice(0, 3);

      const concepts = generateDetailedTextbook(catId, title);
      const shortcuts = [
        `Shortcut Trick A: Practice the formula sheets and formulas carefully.`,
        `Shortcut Trick B: Draw simple diagrams (like family trees or Venn diagrams) before solving.`,
        `Shortcut Trick C: Eliminate choices that are obviously incorrect to save time.`
      ];

      topicsData.push({
        category: catId,
        title,
        difficulty: i % 3 === 0 ? 'Easy' : i % 3 === 1 ? 'Medium' : 'Hard',
        desc: `Master core placement-level concepts, learn shortcut tricks, and practice ${['Number System', 'Percentage', 'Profit & Loss'].includes(title) ? 300 : ['Missing Number', 'Series', 'Mirror Images', 'Paper Folding', 'Cube Problems', 'Data Sufficiency'].includes(title) ? 100 : 50} high-yield questions for ${title}.`,
        questionsCount: ['Number System', 'Percentage', 'Profit & Loss'].includes(title) ? 300 : ['Missing Number', 'Series', 'Mirror Images', 'Paper Folding', 'Cube Problems', 'Data Sufficiency'].includes(title) ? 100 : 50,
        shortcutsCount: shortcuts.length,
        duration: `${30 + (i % 3) * 10} min`,
        tags,
        concepts,
        shortcuts,
        quizQuestions: generateQuestions(catId, title),
        xpReward: 50,
        order: i + 1,
        slug: `${catId}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        year_level: ['1st', '2nd', '3rd', '4th'],
        target_role: 'Software Engineer',
        is_placement_prep: true
      });
    }
  }

  await AptitudeTopic.insertMany(topicsData);
  console.log(`Seeded ${topicsData.length} aptitude topics successfully.`);
};

const runTheoryAptitudeSeeder = async () => {
  await seedTheoryData();
  await seedAptitudeData();
};

module.exports = runTheoryAptitudeSeeder;
