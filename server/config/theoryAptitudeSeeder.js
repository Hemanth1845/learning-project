const TheorySubject = require('../models/TheorySubject');
const TheoryChapter = require('../models/TheoryChapter');
const AptitudeTopic = require('../models/AptitudeTopic');

const seedTheoryData = async () => {
  const subjectCount = await TheorySubject.countDocuments();
  if (subjectCount > 0) {
    console.log('Theory subjects already seeded. Skipping seeder...');
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
      'Introduction', 'Process', 'Thread', 'Scheduling', 'Synchronization', 
      'Deadlock', 'Memory Management', 'Paging', 'Segmentation', 'Virtual Memory', 
      'File System', 'Disk Scheduling', 'Protection', 'Security', 'Linux Commands', 
      'Interview Questions'
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
    await AptitudeTopic.deleteMany({});
    console.log('Cleared old aptitude topics.');
  }

  const listCategories = {
    quant: [
      'Number System', 'Percentage', 'Profit & Loss', 'Simple Interest', 'Compound Interest', 
      'Ratio & Proportion', 'Partnership', 'Average', 'Ages', 'Time & Work', 
      'Pipes & Cisterns', 'Time Speed Distance', 'Boats & Streams', 'Train Problems', 
      'Permutation & Combination', 'Probability', 'Geometry', 'Mensuration', 
      'Trigonometry', 'Logarithms', 'HCF & LCM', 'Calendar', 'Clock', 
      'Data Interpretation', 'Data Sufficiency', 'Mixtures & Allegations', 
      'Sequence & Series', 'Simplification', 'Surds & Indices', 'Quadratic Equations', 
      'Shortcuts & Formulas', 'Previous Questions', 'Company Wise Questions'
    ],
    logical: [
      'Blood Relations', 'Coding & Decoding', 'Seating Arrangement', 'Puzzles', 
      'Direction Sense', 'Statement & Conclusion', 'Statement & Assumption', 
      'Cause & Effect', 'Syllogism', 'Venn Diagrams', 'Input & Output', 
      'Ranking & Order', 'Analogy', 'Classification', 'Number Series', 
      'Alphabet Series', 'Clocks & Calendars', 'Cubes & Dice', 'Mirror & Water Images', 
      'Pattern Completion', 'Decision Making', 'Critical Reasoning', 'Logical Puzzles', 
      'Company Questions'
    ],
    verbal: [
      'Reading Comprehension', 'Synonyms & Antonyms', 'Idioms & Phrases', 
      'Sentence Correction', 'Error Spotting', 'Para Jumbles', 'Cloze Test', 
      'Fill in the Blanks', 'Vocabulary', 'Active & Passive Voice', 'Direct & Indirect Speech', 
      'One Word Substitution', 'Word Formation', 'Spell Check', 'Grammar Tenses', 
      'Articles', 'Prepositions', 'Subject Verb Agreement', 'Company Questions'
    ]
  };

  const companiesList = ['TCS', 'Infosys', 'Wipro', 'Accenture', 'Capgemini', 'Cognizant', 'Deloitte', 'HCL', 'Tech Mahindra'];

  const generateQuizQuestions = (category, title, count = 50) => {
    const questions = [];
    
    for (let i = 1; i <= count; i++) {
      let q = '';
      let options = [];
      let explanation = '';
      
      const num1 = 10 + i * 2;
      const num2 = 5 + (i % 5) * 2;
      const num3 = 100 + i * 15;
      
      const names = ['Ram', 'Rahul', 'Amit', 'John', 'David', 'Sam', 'Sita', 'Priya', 'Anjali', 'Sara', 'Karan', 'Vijay', 'Vikram', 'Raj', 'Rohan', 'Nehal', 'Tanvi', 'Simran', 'Pooja', 'Neha'];
      const nameA = names[i % names.length];
      const nameB = names[(i + 3) % names.length];
      const nameC = names[(i + 7) % names.length];

      if (category === 'quant') {
        if (title === 'Number System') {
          const type = i % 5;
          if (type === 0) {
            const primes = [101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257];
            const p = primes[i % primes.length];
            q = `Which of the following is a prime number?`;
            options = [`${p}`, `${p + 1}`, `${p - 1 === 1 ? 4 : p - 1}`, `${p + 3}`];
            explanation = `${p} is a prime number because it has no positive divisors other than 1 and itself.`;
          } else if (type === 1) {
            const n = 10 + i * 2;
            const sum = (n * (n + 1)) / 2;
            q = `Find the sum of the first ${n} natural numbers.`;
            options = [`${sum}`, `${sum + 10}`, `${sum - 5}`, `${sum * 2}`];
            explanation = `The sum of first n natural numbers is given by the formula n(n + 1)/2. Here, n = ${n}. Sum = (${n} * ${n + 1}) / 2 = ${sum}.`;
          } else if (type === 2) {
            const mult = 100 + i * 5;
            const test = mult * 9;
            const testStr = test.toString();
            const replacedIdx = i % testStr.length;
            const replacedChar = testStr[replacedIdx];
            const partStr = testStr.substring(0, replacedIdx) + '*' + testStr.substring(replacedIdx + 1);
            q = `In the number ${partStr}, what digit should replace '*' so that the number is divisible by 9?`;
            options = [`${replacedChar}`, `${(parseInt(replacedChar) + 2) % 10}`, `${(parseInt(replacedChar) + 5) % 10}`, `${(parseInt(replacedChar) + 8) % 10}`];
            explanation = `A number is divisible by 9 if the sum of its digits is divisible by 9. Sum of digits in ${partStr} excluding '*' is ${testStr.split('').reduce((acc, c) => acc + parseInt(c), 0) - parseInt(replacedChar)}. Adding ${replacedChar} makes the sum divisible by 9.`;
          } else if (type === 3) {
            const base = 2 + (i % 7);
            const pow = 10 + i * 3;
            const unitDigits = {
              2: [6, 2, 4, 8],
              3: [1, 3, 9, 7],
              4: [6, 4, 6, 4],
              5: [5, 5, 5, 5],
              6: [6, 6, 6, 6],
              7: [1, 7, 9, 3],
              8: [6, 8, 4, 2]
            };
            const cycle = unitDigits[base] || [1, 1, 1, 1];
            const ansVal = cycle[pow % 4];
            q = `What is the unit digit in the product of (${base}^${pow})?`;
            options = [`${ansVal}`, `${(ansVal + 2) % 10}`, `${(ansVal + 4) % 10}`, `${(ansVal + 7) % 10}`];
            explanation = `The cyclicity of unit digit of ${base} is 4. The power ${pow} leaves a remainder of ${pow % 4} when divided by 4. Thus the unit digit is ${ansVal}.`;
          } else {
            const d = 10 + i * 2;
            const d2 = 5 + (i % 4);
            const rem = 2 + (i % 3);
            const number = d * 15 + rem;
            const finalRem = number % d2;
            q = `A number when divided by ${d} leaves a remainder of ${rem}. What will be the remainder when the same number is divided by ${d2}?`;
            options = [`${finalRem}`, `${(finalRem + 1) % d2}`, `${(finalRem + 2) % d2}`, `${(finalRem + 3) % d2}`];
            explanation = `Let the number be ${d}x + ${rem}. When divided by ${d2}, the remainder is (${d}x + ${rem}) % ${d2} = ${finalRem}.`;
          }
        } else if (title === 'Percentage') {
          const pct = 10 + (i % 9) * 5;
          const type = i % 5;
          if (type === 0) {
            const ansVal = ((pct / (100 + pct)) * 100).toFixed(2);
            q = `If ${nameA}'s salary is ${pct}% more than ${nameB}'s salary, by what percentage is ${nameB}'s salary less than ${nameA}'s?`;
            options = [`${ansVal}%`, `${pct}%`, `${(pct - 5)}%`, `${(pct + 5)}%`];
            explanation = `Let B's salary be 100. A's salary = ${100 + pct}. Difference = ${pct}. Percentage less = (${pct} / ${100 + pct}) * 100 = ${ansVal}%.`;
          } else if (type === 1) {
            const ansVal = ((pct / (100 - pct)) * 100).toFixed(2);
            q = `If the price of petrol is decreased by ${pct}%, by how much percentage can a driver increase his consumption so as not to decrease his expenditure?`;
            options = [`${ansVal}%`, `${pct}%`, `${(pct - 2)}%`, `${(pct + 2)}%`];
            explanation = `Percentage increase in consumption = [R / (100 - R)] * 100 = [${pct} / ${100 - pct}] * 100 = ${ansVal}%.`;
          } else if (type === 2) {
            const totalMarks = 200 + i * 10;
            const passPct = 30 + (i % 3) * 5;
            const passMarks = (totalMarks * passPct) / 100;
            const gotMarks = passMarks - num2;
            q = `A student has to secure ${passPct}% marks to pass. He gets ${gotMarks} marks and fails by ${num2} marks. Find the maximum marks for the exam.`;
            options = [`${totalMarks}`, `${totalMarks + 50}`, `${totalMarks - 50}`, `None of these`];
            explanation = `Passing marks = ${gotMarks} + ${num2} = ${passMarks}. Since ${passPct}% of total marks = ${passMarks}, Total Marks = (${passMarks} * 100) / ${passPct} = ${totalMarks}.`;
          } else if (type === 3) {
            const initPrice = 1000 + i * 100;
            const finalPrice = Math.round(initPrice * (1 + pct / 100) * 0.9);
            const netChangePct = (((finalPrice - initPrice) / initPrice) * 100).toFixed(2);
            q = `The price of a laptop is first increased by ${pct}% and then decreased by 10%. If the initial price was Rs. ${initPrice}, what is the net percentage change in the price?`;
            options = [`${netChangePct}%`, `${pct - 10}%`, `${pct}%`, '0%'];
            explanation = `Final price = ${initPrice} * (1 + ${pct}/100) * 0.9 = Rs. ${finalPrice}. Net change = ((${finalPrice} - ${initPrice}) / ${initPrice}) * 100 = ${netChangePct}%.`;
          } else {
            const population = 10000 + i * 2000;
            const rate = 5 + (i % 3) * 5;
            const popAfter2Yrs = Math.round(population * Math.pow(1 + rate/100, 2));
            q = `The population of a town is ${population} and it increases at the rate of ${rate}% per annum. What will be the population after 2 years?`;
            options = [`${popAfter2Yrs}`, `${Math.round(population * 1.1)}`, `${population + rate * 2}`, 'None of these'];
            explanation = `Population after 2 years = P * (1 + R/100)^2 = ${population} * (1 + ${rate}/100)^2 = ${popAfter2Yrs}.`;
          }
        } else if (title === 'Profit & Loss') {
          const cp = 100 + i * 10;
          const type = i % 4;
          if (type === 0) {
            const profitPct = 10 + (i % 5) * 5;
            const sp = Math.round(cp * (1 + profitPct/100));
            q = `A merchant buys an item for Rs. ${cp} and sells it for Rs. ${sp}. What is the profit percentage?`;
            options = [`${profitPct}%`, `${(profitPct - 2)}%`, `${(profitPct + 2)}%`, 'None of these'];
            explanation = `Profit = SP - CP = Rs. ${sp - cp}. Profit % = (Profit / CP) * 100 = (${sp - cp} / ${cp}) * 100 = ${profitPct}%.`;
          } else if (type === 1) {
            const lossPct = 5 + (i % 4) * 5;
            const sp = Math.round(cp * (1 - lossPct/100));
            q = `An item bought for Rs. ${cp} is sold at a loss of ${lossPct}%. What is the selling price?`;
            options = [`Rs. ${sp}`, `Rs. ${sp - 10}`, `Rs. ${sp + 10}`, `Rs. ${cp}`];
            explanation = `SP = CP * (1 - Loss/100) = ${cp} * (1 - ${lossPct}/100) = Rs. ${sp}.`;
          } else if (type === 2) {
            const sp = 240 + i * 20;
            const gainPct = 20;
            const cpVal = Math.round((sp * 100) / (100 + gainPct));
            q = `By selling an article for Rs. ${sp}, a shopkeeper gains ${gainPct}%. Find the cost price of the article.`;
            options = [`Rs. ${cpVal}`, `Rs. ${cpVal - 20}`, `Rs. ${cpVal + 20}`, 'None of these'];
            explanation = `CP = (SP * 100) / (100 + Gain%) = (${sp} * 100) / 120 = Rs. ${cpVal}.`;
          } else {
            const cp1 = 1000 + i * 100;
            q = `A dealer sells two machines for Rs. ${cp1} each. On one he gains 10% and on the other he loses 10%. What is his overall gain or loss percentage?`;
            options = ['1% Loss', '1% Gain', 'No Profit No Loss', '2% Loss'];
            explanation = `When two items are sold at the same price, one at a gain of x% and other at a loss of x%, there is always a loss of (x/10)^2 %. Here, loss = (10/10)^2 = 1% loss.`;
          }
        } else if (title === 'Simple Interest') {
          const p = 1000 + i * 500;
          const r = 5 + (i % 6);
          const t = 2 + (i % 4);
          const si = (p * r * t) / 100;
          q = `Find the simple interest on Rs. ${p} at ${r}% per annum for ${t} years.`;
          options = [`Rs. ${si}`, `Rs. ${si + 50}`, `Rs. ${si - 30}`, `Rs. ${si * 1.1}`];
          explanation = `Formula: Simple Interest (SI) = (P * R * T) / 100. SI = (${p} * ${r} * ${t}) / 100 = Rs. ${si}.`;
        } else if (title === 'Compound Interest') {
          const p = 5000 + i * 1000;
          const r = 10;
          const t = 2;
          const ci = Math.round(p * (Math.pow(1 + r/100, t) - 1));
          q = `Find the compound interest on Rs. ${p} at ${r}% per annum for ${t} years compounded annually.`;
          options = [`Rs. ${ci}`, `Rs. ${ci + 150}`, `Rs. ${ci - 100}`, `Rs. ${ci + 50}`];
          explanation = `Amount = P * (1 + R/100)^T = ${p} * (1.1)^2 = Rs. ${Math.round(p * 1.21)}. CI = Amount - Principal = Rs. ${ci}.`;
        } else if (title === 'Ratio & Proportion') {
          const type = i % 3;
          if (type === 0) {
            const sum = 1000 + i * 500;
            const a = 2 + (i % 3);
            const b = 3 + (i % 3);
            const c = 5 + (i % 3);
            const totRatio = a + b + c;
            const shareB = Math.round((sum * b) / totRatio);
            q = `Divide Rs. ${sum} among A, B, and C in the ratio ${a}:${b}:${c}. What is B's share?`;
            options = [`Rs. ${shareB}`, `Rs. ${shareB + 100}`, `Rs. ${shareB - 100}`, `Rs. ${Math.round(sum / 3)}`];
            explanation = `B's share = Total Sum * (b / (a + b + c)) = ${sum} * (${b} / ${totRatio}) = Rs. ${shareB}.`;
          } else if (type === 1) {
            const a = 1 + (i % 3);
            const b = 2 + (i % 3);
            const c = 3 + (i % 3);
            const mult = 10 + i * 2;
            const totVal = a * 1.00 * mult + b * 0.50 * mult + c * 0.25 * mult;
            const num50p = b * mult;
            q = `A bag contains 1-rupee, 50-paise, and 25-paise coins in the ratio ${a}:${b}:${c}. If the total value of these coins is Rs. ${totVal.toFixed(2)}, find the number of 50-paise coins.`;
            options = [`${num50p}`, `${num50p + 20}`, `${num50p - 10}`, `${num50p * 2}`];
            explanation = `Let the coins be ${a}x, ${b}x, and ${c}x. Total value = ${a}x * 1 + ${b}x * 0.50 + ${c}x * 0.25 = ${totVal} => x = ${mult}. Thus, 50p coins = ${b}x = ${num50p}.`;
          } else {
            const a = 2 + (i % 3);
            const b = 3 + (i % 3);
            const c = 4 + (i % 3);
            const d = 5 + (i % 3);
            const acNum = a * c;
            const bdDen = b * d;
            q = `If A:B = ${a}:${b} and B:C = ${c}:${d}, find the ratio of A:C.`;
            options = [`${acNum}:${bdDen}`, `${a}:${d}`, `${c}:${b}`, `${acNum + 1}:${bdDen + 1}`];
            explanation = `A/C = (A/B) * (B/C) = (${a}/${b}) * (${c}/${d}) = ${acNum}/${bdDen}. Thus A:C = ${acNum}:${bdDen}.`;
          }
        } else if (title === 'Partnership') {
          const type = i % 2;
          const invA = 10000 + i * 2000;
          const invB = 15000 + i * 3000;
          if (type === 0) {
            const totalProfit = 5000 + i * 1000;
            const shareA = Math.round((invA * totalProfit) / (invA + invB));
            q = `${nameA} and ${nameB} start a business with investments of Rs. ${invA} and Rs. ${invB} respectively. If the total annual profit is Rs. ${totalProfit}, find ${nameA}'s share.`;
            options = [`Rs. ${shareA}`, `Rs. ${totalProfit - shareA}`, `Rs. ${shareA + 200}`, `Rs. ${shareA - 200}`];
            explanation = `The profit is shared in the ratio of their investments. Ratio A:B = ${invA}:${invB}. A's share = ${totalProfit} * (${invA} / (invA + invB)) = Rs. ${shareA}.`;
          } else {
            const timeA = 12;
            const timeB = 12 - 2 - (i % 4);
            const totalProfit = 10000 + i * 1500;
            const valA = invA * timeA;
            const valB = invB * timeB;
            const shareB = Math.round((valB * totalProfit) / (valA + valB));
            q = `${nameA} starts a business with Rs. ${invA}. After ${12 - timeB} months, ${nameB} joins him with Rs. ${invB}. If the annual profit is Rs. ${totalProfit}, what is ${nameB}'s profit share?`;
            options = [`Rs. ${shareB}`, `Rs. ${totalProfit - shareB}`, `Rs. ${shareB + 500}`, `Rs. ${shareB - 500}`];
            explanation = `Profit ratio = (InvA * TimeA) : (InvB * TimeB) = (${invA} * ${timeA}) : (${invB} * ${timeB}) = ${valA}:${valB}. B's share = ${totalProfit} * (${valB} / (valA + valB)) = Rs. ${shareB}.`;
          }
        } else if (title === 'Average') {
          const count = 3 + (i % 4);
          const avg = 20 + i;
          const sum = count * avg;
          const newWeight = avg + 2;
          const actualTeacherWeight = (count + 1) * newWeight - sum;
          q = `The average weight of a class of ${count} students is ${avg} kg. If the weight of the teacher is included, the average weight increases by 2 kg. What is the weight of the teacher?`;
          options = [`${actualTeacherWeight} kg`, `${actualTeacherWeight - 5} kg`, `${actualTeacherWeight + 5} kg`, 'None of these'];
          explanation = `Total weight of ${count} students = ${count} * ${avg} = ${sum} kg. New average including teacher = ${avg} + 2 = ${avg + 2} kg. Total weight of ${count + 1} people = ${count + 1} * ${avg + 2} = ${(count + 1) * (avg + 2)} kg. Weight of teacher = ${(count + 1) * (avg + 2)} - ${sum} = ${actualTeacherWeight} kg.`;
        } else if (title === 'Ages') {
          const ratioA = 3 + (i % 3);
          const ratioB = ratioA + 1;
          const multiplier = 3 + (i % 5);
          const ageA = ratioA * multiplier;
          const ageB = ratioB * multiplier;
          const diff = ageB - ageA;
          q = `The ratio of the ages of ${nameA} and ${nameB} is ${ratioA}:${ratioB}. If the difference between their ages is ${diff} years, what is the age of ${nameA}?`;
          options = [`${ageA} years`, `${ageB} years`, `${ageA + 5} years`, `${ageB - 2} years`];
          explanation = `Let their ages be ${ratioA}x and ${ratioB}x. Difference = ${ratioB}x - ${ratioA}x = x = ${diff}. Age of A = ${ratioA}x = ${ratioA} * ${diff} = ${ageA} years.`;
        } else if (title === 'Time & Work') {
          const daysA = 10 + (i % 5) * 5;
          const daysB = daysA * 2;
          const together = (daysA * daysB) / (daysA + daysB);
          q = `${nameA} can complete a work in ${daysA} days, and ${nameB} can complete it in ${daysB} days. In how many days can they complete the work working together?`;
          options = [`${together.toFixed(1)} days`, `${(together + 1).toFixed(1)} days`, `${(together - 1).toFixed(1)} days`, 'None of these'];
          explanation = `Together, they do (1/${daysA} + 1/${daysB}) of the work in one day. One day's work = (${daysB} + ${daysA}) / (${daysA} * ${daysB}) = 1 / ${together.toFixed(1)}. Hence, time = ${together.toFixed(1)} days.`;
        } else if (title === 'Pipes & Cisterns') {
          const type = i % 2;
          const h1 = 6 + (i % 5) * 2;
          const h2 = h1 + 4 + (i % 3) * 2;
          if (type === 0) {
            const together = (h1 * h2) / (h1 + h2);
            q = `Pipe A can fill a tank in ${h1} hours and Pipe B can fill it in ${h2} hours. How long will it take to fill the tank if both pipes are opened together?`;
            options = [`${together.toFixed(2)} hours`, `${(together + 1).toFixed(2)} hours`, `${(together - 0.5).toFixed(2)} hours`, `None of these`];
            explanation = `One hour work together = (1/${h1}) + (1/${h2}) = (${h1}+${h2}) / (${h1}*${h2}). Time taken = (${h1}*${h2}) / (${h1}+${h2}) = ${together.toFixed(2)} hours.`;
          } else {
            const net = (h1 * h2) / (h2 - h1);
            q = `Pipe A can fill a tank in ${h1} hours, but due to a leak at the bottom, it takes ${h2} hours to fill. In how many hours can the leak empty the full tank?`;
            options = [`${net.toFixed(1)} hours`, `${(net + 2).toFixed(1)} hours`, `${(net - 2).toFixed(1)} hours`, `None of these`];
            explanation = `Work of leak in 1 hour = (1/${h1}) - (1/${h2}) = (${h2}-${h1}) / (${h1}*${h2}). Time taken to empty = (${h1}*${h2}) / (${h2}-${h1}) = ${net.toFixed(1)} hours.`;
          }
        } else if (title === 'Time Speed Distance' || title === 'Train Problems') {
          const type = i % 2;
          if (type === 0) {
            const speedKmph = 36 + (i % 10) * 18;
            const speedMps = (speedKmph * 5) / 18;
            const length = 100 + (i % 5) * 50;
            const time = length / speedMps;
            q = `A train ${length} meters long passes a pole in how many seconds if its speed is ${speedKmph} km/hr?`;
            options = [`${time.toFixed(1)} seconds`, `${(time + 2).toFixed(1)} seconds`, `${(time - 1).toFixed(1)} seconds`, 'None of these'];
            explanation = `Convert speed to m/s: ${speedKmph} * (5/18) = ${speedMps} m/s. Time to cross pole = Train length / Speed = ${length} / ${speedMps} = ${time.toFixed(1)} seconds.`;
          } else {
            const len1 = 120 + i * 10;
            const len2 = 80 + i * 5;
            const s1 = 40 + (i % 5) * 5;
            const s2 = 20 + (i % 4) * 5;
            const relSpeedMps = ((s1 + s2) * 5) / 18;
            const time = (len1 + len2) / relSpeedMps;
            q = `Two trains of lengths ${len1}m and ${len2}m are running in opposite directions at speeds of ${s1} km/hr and ${s2} km/hr respectively. In what time will they cross each other?`;
            options = [`${time.toFixed(2)} seconds`, `${(time + 3).toFixed(2)} seconds`, `${(time - 2).toFixed(2)} seconds`, `None of these`];
            explanation = `Relative speed (opposite direction) = ${s1} + ${s2} = ${s1+s2} km/hr = ${(s1+s2)*5/18} m/s. Total distance = ${len1} + ${len2} = ${len1+len2}m. Time taken = Distance / Relative Speed = ${time.toFixed(2)} seconds.`;
          }
        } else if (title === 'Boats & Streams') {
          const type = i % 2;
          const sb = 10 + (i % 5) * 2;
          const ss = 2 + (i % 3);
          if (type === 0) {
            const ds = sb + ss;
            const us = sb - ss;
            q = `A boat's speed in still water is ${sb} km/hr and the speed of the stream is ${ss} km/hr. Find the speed of the boat downstream and upstream.`;
            options = [`Downstream: ${ds} km/hr, Upstream: ${us} km/hr`, `Downstream: ${us} km/hr, Upstream: ${ds} km/hr`, `Downstream: ${ds + 2} km/hr, Upstream: ${us - 1} km/hr`, `None of these`];
            explanation = `Downstream speed = Speed in still water + Stream speed = ${sb} + ${ss} = ${ds} km/hr. Upstream speed = Speed in still water - Stream speed = ${sb} - ${ss} = ${us} km/hr.`;
          } else {
            const ds = 12 + (i % 4) * 2;
            const us = 6 + (i % 3) * 2;
            const still = (ds + us) / 2;
            const stream = (ds - us) / 2;
            q = `A man can row downstream at ${ds} km/hr and upstream at ${us} km/hr. Find his speed in still water and the speed of the stream.`;
            options = [`Still water: ${still} km/hr, Stream: ${stream} km/hr`, `Still water: ${stream} km/hr, Stream: ${still} km/hr`, `Still water: ${still + 1} km/hr, Stream: ${stream - 0.5} km/hr`, `None of these`];
            explanation = `Speed in still water = (Downstream + Upstream) / 2 = (${ds} + ${us}) / 2 = ${still} km/hr. Stream speed = (Downstream - Upstream) / 2 = (${ds} - ${us}) / 2 = ${stream} km/hr.`;
          }
        } else if (title === 'Permutation & Combination') {
          const type = i % 3;
          if (type === 0) {
            const words = ['TIGER', 'LEADER', 'MATRIX', 'PORTAL', 'STUDENT', 'APTITUDE'];
            const w = words[i % words.length];
            const fact = (n) => n <= 1 ? 1 : n * fact(n - 1);
            const counts = {};
            for (const char of w) { counts[char] = (counts[char] || 0) + 1; }
            let denom = 1;
            for (const char of Object.keys(counts)) { denom *= fact(counts[char]); }
            const ansVal = fact(w.length) / denom;
            q = `In how many ways can the letters of the word "${w}" be arranged?`;
            options = [`${ansVal}`, `${ansVal + 120}`, `${ansVal - 60}`, `${ansVal * 2}`];
            explanation = `The word "${w}" has ${w.length} letters. Permutations = ${w.length}! / (product of factorials of repeating letter counts) = ${ansVal}.`;
          } else if (type === 1) {
            const n = 5 + (i % 3);
            const r = 2 + (i % 2);
            const fact = (x) => x <= 1 ? 1 : x * fact(x - 1);
            const combs = fact(n) / (fact(r) * fact(n - r));
            q = `In how many ways can a committee of ${r} members be selected from a group of ${n} candidates?`;
            options = [`${combs}`, `${combs + 5}`, `${combs - 2}`, `${combs * 2}`];
            explanation = `Combinations formula: nCr = n! / (r! * (n-r)!). Here n = ${n}, r = ${r}. Result = ${n}! / (${r}! * ${n-r}!) = ${combs}.`;
          } else {
            const people = 6 + (i % 10);
            const handshakes = (people * (people - 1)) / 2;
            q = `In a business meeting of ${people} people, everyone shakes hands with everyone else exactly once. How many handshakes take place?`;
            options = [`${handshakes}`, `${handshakes + people}`, `${handshakes - people}`, `${handshakes * 2}`];
            explanation = `Number of handshakes = nC2 = n * (n - 1) / 2. Here n = ${people}. Total handshakes = (${people} * ${people - 1}) / 2 = ${handshakes}.`;
          }
        } else if (title === 'Probability') {
          const type = i % 2;
          if (type === 0) {
            const red = 4 + (i % 3);
            const black = 5 + (i % 4);
            const total = red + black;
            const nCrTotal = (total * (total - 1)) / 2;
            const nCrRed = (red * (red - 1)) / 2;
            const gcdVal = (a, b) => b === 0 ? a : gcdVal(b, a % b);
            const common = gcdVal(nCrRed, nCrTotal);
            const num = nCrRed / common;
            const den = nCrTotal / common;
            q = `A bag contains ${red} red and ${black} black balls. What is the probability of drawing 2 red balls at random?`;
            options = [`${num}/${den}`, `${num + 1}/${den}`, `${num}/${den + 1}`, `${num + 2}/${den + 3}`];
            explanation = `Probability = (Red C 2) / (Total C 2) = (${red} * ${red - 1} / 2) / (${total} * ${total - 1} / 2) = ${nCrRed} / ${nCrTotal} = ${num}/${den}.`;
          } else {
            q = `What is the probability of drawing a Queen or a King from a well-shuffled deck of 52 cards?`;
            options = [`2/13`, `1/13`, `4/13`, `1/52`];
            explanation = `There are 4 Queens and 4 Kings in a deck of 52 cards. Total favorable cards = 8. Probability = 8 / 52 = 2 / 13.`;
          }
        } else if (title === 'Geometry') {
          const type = i % 2;
          if (type === 0) {
            const a = 2 + (i % 3);
            const b = 3 + (i % 3);
            const c = 4 + (i % 3);
            const sum = a + b + c;
            const smallestAngle = Math.round((180 * a) / sum);
            q = `The angles of a triangle are in the ratio ${a}:${b}:${c}. Find the measure of the smallest angle.`;
            options = [`${smallestAngle}°`, `${smallestAngle + 10}°`, `${smallestAngle - 5}°`, `${smallestAngle * 1.5}°`];
            explanation = `The sum of angles in a triangle is 180°. Smallest angle = 180° * (${a} / ${sum}) = ${smallestAngle}°.`;
          } else {
            const r = 5 + (i % 5);
            const dist = 3 + (i % 3);
            const halfChord = Math.sqrt(r*r - dist*dist);
            const chordLen = 2 * halfChord;
            q = `Find the length of a chord which is at a distance of ${dist} cm from the center of a circle of radius ${r} cm.`;
            options = [`${chordLen.toFixed(2)} cm`, `${(chordLen + 2).toFixed(2)} cm`, `${(chordLen - 1).toFixed(2)} cm`, `None of these`];
            explanation = `By Pythagoras theorem, half chord length = sqrt(radius^2 - distance^2) = sqrt(${r}^2 - ${dist}^2) = ${halfChord.toFixed(2)} cm. Full chord length = 2 * ${halfChord.toFixed(2)} = ${chordLen.toFixed(2)} cm.`;
          }
        } else if (title === 'Mensuration') {
          const type = i % 2;
          const rad = 7 + (i % 5) * 7;
          if (type === 0) {
            const vol = (4 * Math.PI * Math.pow(rad, 3)) / 3;
            q = `Find the volume of a sphere of radius ${rad} cm. (Use pi = 22/7)`;
            options = [`${vol.toFixed(2)} cm³`, `${(vol + 100).toFixed(2)} cm³`, `${(vol - 100).toFixed(2)} cm³`, `None of these`];
            explanation = `Volume of sphere = 4/3 * pi * r^3 = 4/3 * (22/7) * ${rad}^3 = ${vol.toFixed(2)} cm³.`;
          } else {
            const side = 4 + (i % 6);
            const diag = Math.sqrt(3) * side;
            q = `Find the length of the longest diagonal of a cube of side ${side} cm.`;
            options = [`${diag.toFixed(2)} cm`, `${(diag + 1).toFixed(2)} cm`, `${(diag - 1).toFixed(2)} cm`, `None of these`];
            explanation = `The longest diagonal of a cube of side 's' is s * sqrt(3) = ${side} * 1.732 = ${diag.toFixed(2)} cm.`;
          }
        } else if (title === 'Trigonometry') {
          const dist = 30 + i * 5;
          const height = Math.round(dist * Math.sqrt(3));
          q = `The angle of elevation of the top of a tower from a distance of ${dist} meters from its foot is 60°. What is the height of the tower?`;
          options = [`${height} m`, `${height + 10} m`, `${height - 15} m`, `${dist} m`];
          explanation = `tan(60°) = Height / Distance => sqrt(3) = Height / ${dist} => Height = ${dist} * sqrt(3) = ${height} meters.`;
        } else if (title === 'Logarithms') {
          const base = 2 + (i % 3);
          const power = 3 + (i % 4);
          const num = Math.pow(base, power);
          q = `Evaluate the value of log_${base}(${num}).`;
          options = [`${power}`, `${power + 1}`, `${power - 1}`, `${power * 2}`];
          explanation = `Let log_${base}(${num}) = x. Then ${base}^x = ${num} = ${base}^${power}. Thus x = ${power}.`;
        } else if (title === 'HCF & LCM') {
          const type = i % 3;
          if (type === 0) {
            const hcf = 3 + (i % 5);
            const lcm = hcf * (4 + (i % 3)) * (5 + (i % 4));
            const n1 = hcf * (4 + (i % 3));
            const n2 = (hcf * lcm) / n1;
            q = `The HCF and LCM of two numbers are ${hcf} and ${lcm} respectively. If one of the numbers is ${n1}, find the other number.`;
            options = [`${n2}`, `${n2 + 5}`, `${n2 - 5}`, `${n2 * 2}`];
            explanation = `Formula: Product of two numbers = HCF * LCM. Other number = (HCF * LCM) / Given Number = (${hcf} * ${lcm}) / ${n1} = ${n2}.`;
          } else if (type === 1) {
            const a = 4, b = 6, c = 8;
            const lcm = 24;
            const rem = 2 + (i % 3);
            const ansVal = lcm * (1 + (i % 3)) + rem;
            q = `Find the least number which when divided by ${a}, ${b}, and ${c} leaves a remainder of ${rem} in each case.`;
            options = [`${ansVal}`, `${ansVal - 1}`, `${ansVal + 1}`, `${ansVal * 2}`];
            explanation = `The least number is LCM(a, b, c) * k + remainder. LCM(${a}, ${b}, ${c}) = ${lcm}. Required number = ${lcm} * k + ${rem} = ${ansVal}.`;
          } else {
            const a = 10, b = 15, c = 20;
            const lcm = 60;
            const minutes = 30 + i * 5;
            const tolls = Math.floor((minutes * 60) / lcm) + 1;
            q = `Three bells toll together at intervals of ${a}, ${b}, and ${c} seconds respectively. In ${minutes} minutes, how many times do they toll together including the first one?`;
            options = [`${tolls}`, `${tolls - 1}`, `${tolls + 1}`, `None of these`];
            explanation = `They toll together at intervals of LCM(${a}, ${b}, ${c}) = ${lcm} seconds. In ${minutes} minutes (${minutes * 60} seconds), they toll together (${minutes * 60} / ${lcm}) + 1 = ${tolls} times.`;
          }
        } else if (title === 'Calendar') {
          const type = i % 2;
          if (type === 0) {
            const years = 1 + (i % 15);
            const extraDays = Math.floor(years + years/4);
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            const startDayIdx = i % 7;
            const endDay = days[(startDayIdx + extraDays) % 7];
            q = `If 1st January of year X was a ${days[startDayIdx]}, what day of the week was 1st January after ${years} years?`;
            options = [`${endDay}`, `${days[(startDayIdx + extraDays + 1) % 7]}`, `${days[(startDayIdx + extraDays - 1 + 7) % 7]}`, `None of these`];
            explanation = `Every ordinary year contributes 1 odd day and every leap year contributes 2 odd days. Sum of odd days over ${years} years yields ${extraDays} odd days, moving from ${days[startDayIdx]} to ${endDay}.`;
          } else {
            const year = 2000 + i * 4;
            q = `Is the year ${year} a leap year?`;
            options = [`Yes`, `No`, `Cannot be determined`, `Only in certain calendars`];
            explanation = `A year is a leap year if it is divisible by 4, except for centurial years which must be divisible by 400. Since ${year} is divisible by 4, it is a leap year.`;
          }
        } else if (title === 'Clock') {
          const hr = 1 + (i % 11);
          const min = 5 * (i % 12);
          const angle = Math.abs(30 * hr - 5.5 * min);
          const finalAngle = angle > 180 ? 360 - angle : angle;
          q = `Find the angle between the hour hand and the minute hand of a clock at ${hr}:${min.toString().padStart(2, '0')}.`;
          options = [`${finalAngle}°`, `${finalAngle + 10}°`, `${finalAngle - 5}°`, `${360 - finalAngle}°`];
          explanation = `Formula: Angle = |30 * Hour - 11/2 * Minute|. Here Hour = ${hr}, Minute = ${min}. Angle = |30*${hr} - 5.5*${min}| = ${finalAngle}°.`;
        } else if (title === 'Data Interpretation') {
          const total = 500 + i * 100;
          const share = 10 + (i % 5) * 10;
          const count = (total * share) / 100;
          q = `In a survey of ${total} students, a pie chart shows that ${share}% prefer computer science. How many students prefer computer science?`;
          options = [`${count}`, `${count + 50}`, `${count - 50}`, `${count * 2}`];
          explanation = `Students preferring CS = ${share}% of ${total} = (${share}/100) * ${total} = ${count}.`;
        } else if (title === 'Data Sufficiency') {
          q = `Is A older than B?
Statement I: A is 5 years older than C.
Statement II: C is younger than B by 2 years.`;
          options = [`Both Statements I and II together are sufficient to answer`, `Statement I alone is sufficient`, `Statement II alone is sufficient`, `Statements I and II together are not sufficient`];
          explanation = `From I: A = C + 5. From II: C = B - 2 => B = C + 2. Comparing A and B: A > B since C + 5 > C + 2. Hence, both statements together are sufficient.`;
        } else if (title === 'Mixtures & Allegations') {
          const p1 = 40 + (i % 5) * 5;
          const p2 = 60 + (i % 5) * 5;
          const target = p1 + 5;
          const r1 = p2 - target;
          const r2 = target - p1;
          const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);
          const comm = gcd(r1, r2);
          q = `In what ratio must tea at Rs. ${p1}/kg be mixed with tea at Rs. ${p2}/kg so that the mixture is worth Rs. ${target}/kg?`;
          options = [`${r1/comm}:${r2/comm}`, `${r2/comm}:${r1/comm}`, `${r1/comm + 1}:${r2/comm}`, `None of these`];
          explanation = `Using the allegation rule: Ratio of quantity = (Price of dearer - Mean price) : (Mean price - Price of cheaper) = (${p2} - ${target}) : (${target} - ${p1}) = ${r1}:${r2} = ${r1/comm}:${r2/comm}.`;
        } else if (title === 'Sequence & Series') {
          const a = 2 + (i % 5);
          const d = 3 + (i % 3);
          const termNum = 10 + (i % 5);
          const ansVal = a + (termNum - 1) * d;
          q = `Find the ${termNum}th term of the arithmetic progression (AP) series: ${a}, ${a+d}, ${a+2*d}, ...`;
          options = [`${ansVal}`, `${ansVal + d}`, `${ansVal - d}`, `${ansVal * 2}`];
          explanation = `The nth term of an AP is a + (n - 1) * d. Here a = ${a}, d = ${d}, n = ${termNum}. Term = ${a} + (${termNum} - 1) * ${d} = ${ansVal}.`;
        } else if (title === 'Simplification' || title === 'Surds & Indices') {
          const val = 2 + (i % 4);
          const ansVal = Math.pow(val, 3);
          q = `If x^(1/3) = ${val}, what is the value of x?`;
          options = [`${ansVal}`, `${ansVal - 1}`, `${ansVal + 1}`, `${val * 3}`];
          explanation = `Cubing both sides: (x^(1/3))^3 = ${val}^3 => x = ${ansVal}.`;
        } else if (title === 'Quadratic Equations') {
          const root1 = 2 + (i % 3);
          const root2 = 5 + (i % 3);
          const b = root1 + root2;
          const c = root1 * root2;
          q = `Find the roots of the quadratic equation x² - ${b}x + ${c} = 0.`;
          options = [`${root1} and ${root2}`, `${root1 - 1} and ${root2 + 1}`, `${-root1} and ${-root2}`, `None of these`];
          explanation = `The equation factors as (x - ${root1})(x - ${root2}) = 0. Therefore, the roots are x = ${root1} and x = ${root2}.`;
        } else {
          const base = i * 2;
          q = `Solve the following company-specific aptitude problem for ${title}: A product is sold for Rs. ${base * 10}. If it was bought for Rs. ${base * 8}, what is the percentage markup?`;
          options = ['25%', '20%', '30%', 'None of these'];
          explanation = `Markup = (Selling Price - Cost Price) / Cost Price = (${base * 10} - ${base * 8}) / (${base * 8}) = 2/8 = 25%.`;
        }
      } else if (category === 'logical') {
        if (title === 'Blood Relations') {
          const rels = [
            { q: `Pointing to a photo, ${nameA} said, "He is the son of the only son of my grandfather." How is the person related to ${nameA}?`, ans: 'Brother', opts: ['Brother', 'Uncle', 'Cousin', 'Father'] },
            { q: `If A is the brother of B, B is the sister of C, and C is the father of D, how is A related to D?`, ans: 'Uncle', opts: ['Uncle', 'Brother', 'Grandfather', 'Father'] },
            { q: `Introducing a man, a woman says, "His wife is the only daughter of my father." How is the man related to the woman?`, ans: 'Husband', opts: ['Husband', 'Brother', 'Father-in-law', 'Uncle'] }
          ];
          const rObj = rels[i % rels.length];
          q = rObj.q;
          options = rObj.opts;
          explanation = `Based on blood relationship deduction tree, the relation is ${rObj.ans}.`;
        } else if (title === 'Coding & Decoding') {
          const codes = [
            { w: 'CAT', c: 'ECV', t: 'DOG', ca: 'FQI', opts: ['FQI', 'FPG', 'EQH', 'GRI'] },
            { w: 'TAP', c: 'SZO', t: 'PIN', ca: 'OHM', opts: ['OHM', 'QJO', 'OIN', 'NIM'] },
            { w: 'GOLD', c: 'HPME', t: 'SILVER', ca: 'TJMWFS', opts: ['TJMWFS', 'TJKWFS', 'THKVER', 'RHKUDQ'] }
          ];
          const cObj = codes[i % codes.length];
          q = `If in a code language, '${cObj.w}' is written as '${cObj.c}', how will '${cObj.t}' be written?`;
          options = cObj.opts;
          explanation = `Each letter is shifted by a standard constant offset (e.g. +1 or -1 or +2) in the alphabet. Evaluating '${cObj.t}' gives '${cObj.ca}'.`;
        } else if (title === 'Direction Sense') {
          const dist1 = 5 + (i % 5);
          const dist2 = 12 + (i % 3);
          const hyp = Math.round(Math.sqrt(dist1*dist1 + dist2*dist2));
          q = `${nameA} goes ${dist1} km North, turns left and goes ${dist2} km. How far is he from the starting point?`;
          options = [`${hyp} km`, `${hyp + 2} km`, `${hyp - 1} km`, 'None of these'];
          explanation = `Using Pythagoras theorem: distance = sqrt(${dist1}^2 + ${dist2}^2) = sqrt(${dist1*dist1} + ${dist2*dist2}) = ${hyp} km.`;
        } else if (title === 'Number Series') {
          const diff = 2 + (i % 4);
          const term1 = 5;
          const term2 = term1 + diff;
          const term3 = term2 + diff;
          const term4 = term3 + diff;
          const term5 = term4 + diff;
          q = `Find the next term in the series: ${term1}, ${term2}, ${term3}, ${term4}, ...`;
          options = [`${term5}`, `${term5 + 1}`, `${term5 - 1}`, `${term5 + diff}`];
          explanation = `This is an arithmetic progression with common difference of ${diff}. The next term is ${term4} + ${diff} = ${term5}.`;
        } else if (title === 'Alphabet Series') {
          q = `Find the next letters in the alphabet series: Z, X, V, T, R, ...`;
          options = [`P`, `Q`, `O`, `S`];
          explanation = `The letters are moving backwards skipping one letter: Z(-2)->X(-2)->V(-2)->T(-2)->R(-2)->P.`;
        } else if (title === 'Syllogism') {
          q = `Statements:
All dogs are birds.
All birds are cats.
Conclusions:
I. All dogs are cats.
II. Some cats are dogs.`;
          options = [`Both I and II follow`, `Only I follows`, `Only II follows`, `Neither I nor II follows`];
          explanation = `Since all dogs are birds and all birds are cats, it follows that all dogs are cats (Conclusion I). Also, since all dogs are cats, some cats must be dogs (Conclusion II). Thus, both follow.`;
        } else if (title === 'Venn Diagrams') {
          q = `In a group of students, 15 study Python, 10 study Java, and 5 study both. How many students study at least one of these languages?`;
          options = [`20`, `25`, `30`, `15`];
          explanation = `Using Venn diagram: Total = Python + Java - Both = 15 + 10 - 5 = 20.`;
        } else if (title === 'Seating Arrangement') {
          q = `Five friends A, B, C, D, E are sitting in a row facing North. A is to the left of B but right of C. D is to the right of B but left of E. Who is sitting in the middle?`;
          options = [`B`, `A`, `C`, `D`];
          explanation = `The order from left to right is: C, A, B, D, E. The person in the middle is B.`;
        } else if (title === 'Clocks & Calendars') {
          q = `If today is Thursday, what was the day 3 days before yesterday?`;
          options = [`Sunday`, `Saturday`, `Monday`, `Friday`];
          explanation = `Today is Thursday. Yesterday was Wednesday. 3 days before Wednesday was Sunday.`;
        } else if (title === 'Cubes & Dice') {
          q = `A standard dice is rolled. What is the probability of rolling a number greater than 4?`;
          options = [`1/3`, `1/2`, `2/3`, `1/6`];
          explanation = `Favorable outcomes are 5 and 6 (2 outcomes). Total outcomes = 6. Probability = 2/6 = 1/3.`;
        } else if (title === 'Mirror & Water Images') {
          q = `Find the correct mirror image of the word "MERN" when the mirror is placed to its right.`;
          options = [`ИЯƎM`, `MERN`, `NREM`, `WERN`];
          explanation = `The letters are reversed horizontally and individual letters are also mirrored: M->M, E->Ǝ, R->Я, N->И. From right to left, this gives: ИЯƎM.`;
        } else if (title === 'Analogy') {
          q = `Complete the analogy: Clock : Time :: Thermometer : ?`;
          options = [`Temperature`, `Heat`, `Mercury`, `Fever`];
          explanation = `A clock measures time, while a thermometer measures temperature.`;
        } else if (title === 'Classification') {
          q = `Choose the word which is different from the rest.`;
          options = [`Carrot`, `Apple`, `Mango`, `Banana`];
          explanation = `Apple, Mango, and Banana are fruits that grow on trees/plants, while Carrot is a root vegetable.`;
        } else if (title === 'Ranking & Order') {
          const pos = 5 + (i % 15);
          q = `${nameA} is ${pos}th from the start and ${pos + 5}th from the end in a row of students. How many students are there in the row?`;
          options = [`${2 * pos + 4}`, `${2 * pos + 5}`, `${2 * pos + 3}`, `${pos + 5}`];
          explanation = `Total students = Position from start + Position from end - 1 = ${pos} + ${pos + 5} - 1 = ${2 * pos + 4}.`;
        } else {
          q = `Identify the logical pattern for ${title}: Which of the following numbers fits the classification logic? Pattern sequence: ${i}, ${i*3}, ${i*9}, ...`;
          options = [`${i*27}`, `${i*18}`, `${i*36}`, `${i*12}`];
          explanation = `Each term is multiplied by 3 to get the next term. ${i*9} * 3 = ${i*27}.`;
        }
      } else { // Category: verbal
        if (title === 'Synonyms & Antonyms') {
          const db = [
            { w: 'CANDID', q: 'Choose the word nearest in meaning to: "CANDID"', ans: 'Frank', opts: ['Frank', 'Devious', 'Silent', 'Arrogant'], exp: 'Candid means truthful and straightforward; frank.' },
            { w: 'OBSTINATE', q: 'Choose the word opposite in meaning to: "OBSTINATE"', ans: 'Flexible', opts: ['Flexible', 'Stubborn', 'Rigid', 'Firm'], exp: 'Obstinate means stubborn; the opposite is flexible.' },
            { w: 'ABSTAIN', q: 'Choose the word nearest in meaning to: "ABSTAIN"', ans: 'Refrain', opts: ['Refrain', 'Indulge', 'Pursue', 'Begin'], exp: 'Abstain means to choose not to do something; refrain.' },
            { w: 'AMICABLE', q: 'Choose the word opposite in meaning to: "AMICABLE"', ans: 'Hostile', opts: ['Hostile', 'Friendly', 'Harmful', 'Kind'], exp: 'Amicable means friendly; the opposite is hostile.' },
            { w: 'BENEVOLENT', q: 'Choose the word nearest in meaning to: "BENEVOLENT"', ans: 'Kind', opts: ['Kind', 'Malevolent', 'Cruel', 'Greedy'], exp: 'Benevolent means kind and well-meaning.' }
          ];
          const item = db[(i - 1) % db.length];
          q = item.q;
          options = item.opts;
          explanation = item.exp;
        } else if (title === 'One Word Substitution') {
          const db = [
            { q: 'Give a one-word substitution for: "A person who does not believe in God"', ans: 'Atheist', opts: ['Atheist', 'Theist', 'Agnostic', 'Monotheist'], exp: 'An atheist is a person who disbelieves or lacks belief in the existence of God.' },
            { q: 'Give a one-word substitution for: "A person who is unable to pay his debts"', ans: 'Insolvent', opts: ['Insolvent', 'Lender', 'Broker', 'Debtor'], exp: 'An insolvent person is unable to pay debts owed.' },
            { q: 'Give a one-word substitution for: "One who knows many languages"', ans: 'Polyglot', opts: ['Polyglot', 'Linguist', 'Bilingual', 'Translator'], exp: 'A polyglot is someone who knows or uses several languages.' },
            { q: 'Give a one-word substitution for: "A study of ancient things"', ans: 'Archaeology', opts: ['Archaeology', 'Anthropology', 'History', 'Ethnology'], exp: 'Archaeology is the study of human history and prehistory through excavation of sites.' }
          ];
          const item = db[(i - 1) % db.length];
          q = item.q;
          options = item.opts;
          explanation = item.exp;
        } else if (title === 'Idioms & Phrases') {
          const db = [
            { q: 'What is the meaning of the idiom: "Spill the beans"?', ans: 'Reveal a secret', opts: ['Reveal a secret', 'Spill food', 'Cook beans', 'Apostatize'], exp: 'To "spill the beans" is a colloquial idiom meaning to reveal secret information.' },
            { q: 'What is the meaning of the idiom: "Beat around the bush"?', ans: 'Avoid the main topic', opts: ['Avoid the main topic', 'Cut down bushes', 'Play music', 'Run fast'], exp: 'To "beat around the bush" means to discuss a matter without coming to the point.' },
            { q: 'What is the meaning of the idiom: "Burn the midnight oil"?', ans: 'Work or study late into the night', opts: ['Work or study late into the night', 'Waste fuel', 'Light a lamp', 'Sleep early'], exp: 'To "burn the midnight oil" means to read or work late into the night.' }
          ];
          const item = db[(i - 1) % db.length];
          q = item.q;
          options = item.opts;
          explanation = item.exp;
        } else if (title === 'Spell Check') {
          const db = [
            { q: 'Choose the correctly spelled word.', ans: 'Accommodation', opts: ['Accommodation', 'Accomodation', 'Acomodation', 'Acommocation'], exp: 'The correct spelling is ACCOMMODATION (with double c and double m).' },
            { q: 'Choose the correctly spelled word.', ans: 'Necessary', opts: ['Necessary', 'Neccessary', 'Necassary', 'Nessesary'], exp: 'The correct spelling is NECESSARY (with single c and double s).' },
            { q: 'Choose the correctly spelled word.', ans: 'Committee', opts: ['Committee', 'Comitee', 'Commitee', 'Committe'], exp: 'The correct spelling is COMMITTEE (double m, double t, double e).' }
          ];
          const item = db[(i - 1) % db.length];
          q = item.q;
          options = item.opts;
          explanation = item.exp;
        } else if (title === 'Prepositions') {
          const db = [
            { q: 'She is fond ___ classical music.', ans: 'of', opts: ['of', 'to', 'for', 'with'], exp: 'The adjective "fond" is followed by the preposition "of".' },
            { q: 'He has been suffering ___ fever since yesterday.', ans: 'from', opts: ['from', 'with', 'by', 'of'], exp: 'We say "suffering from" a disease or pain.' },
            { q: 'Please listen ___ me.', ans: 'to', opts: ['to', 'for', 'with', 'at'], exp: 'The verb "listen" takes the preposition "to".' },
            { q: 'She congratulated him ___ his success.', ans: 'on', opts: ['on', 'for', 'at', 'with'], exp: 'Congratulate is followed by "on".' }
          ];
          const item = db[(i - 1) % db.length];
          q = item.q;
          options = item.opts;
          explanation = item.exp;
        } else if (title === 'Articles') {
          const db = [
            { q: 'He is ___ honorable man.', ans: 'an', opts: ['an', 'a', 'the', 'no article'], exp: '"Honorable" starts with a silent "h" and a vowel sound, so it takes "an".' },
            { q: 'Copper is ___ useful metal.', ans: 'a', opts: ['a', 'an', 'the', 'no article'], exp: '"Useful" starts with a consonant sound "yoo", so it takes "a".' },
            { q: '___ sun rises in the east.', ans: 'The', opts: ['The', 'A', 'An', 'no article'], exp: 'Unique celestial bodies like the sun take the definite article "the".' }
          ];
          const item = db[(i - 1) % db.length];
          q = item.q;
          options = item.opts;
          explanation = item.exp;
        } else if (title === 'Reading Comprehension') {
          q = `Based on the passage below, answer the question:
"Artificial Intelligence is rapidly transforming modern industries. While it automates repetitive tasks, it also creates high-yield jobs in software engineering and data analysis."
What is a key effect of Artificial Intelligence according to the passage?`;
          options = [`Automating repetitive tasks and creating software jobs`, `Replacing all human labor`, `Decreasing software productivity`, `None of these`];
          explanation = `The passage directly states that AI automates repetitive tasks and creates software engineering jobs.`;
        } else if (title === 'Error Spotting') {
          q = `Find the grammatically incorrect part in the sentence:
"Each of the students (A) / are required (B) / to submit (C) / their assignment (D)"`;
          options = [`are required (B)`, `Each of the students (A)`, `to submit (C)`, `their assignment (D)`];
          explanation = `"Each" is a singular pronoun and takes a singular verb. "are required" should be "is required".`;
        } else if (title === 'Active & Passive Voice') {
          q = `Convert the sentence to Passive Voice: "The chef cooked the delicious meal."`;
          options = [`The delicious meal was cooked by the chef.`, `The chef was cooking the delicious meal.`, `The delicious meal is cooked by the chef.`, `The chef had cooked the delicious meal.`];
          explanation = `In passive voice, the object "The delicious meal" becomes the subject, followed by "was cooked" and the agent "by the chef".`;
        } else if (title === 'Direct & Indirect Speech') {
          q = `Convert the sentence to Indirect Speech: She said, "I am writing a letter."`;
          options = [`She said that she was writing a letter.`, `She said that she is writing a letter.`, `She said that I was writing a letter.`, `She says she writes a letter.`];
          explanation = `In indirect speech, the present continuous "am writing" shifts back to past continuous "was writing", and the pronoun "I" shifts to "she".`;
        } else {
          q = `Fill in the blank with appropriate word for ${title}: The teacher was so ____ with the class's behaviour that she cancelled the field trip.`;
          options = ['displeased', 'delighted', 'indifferent', 'excited'];
          explanation = `The context implies a negative reaction resulting in a punishment, making "displeased" the only logical choice.`;
        }
      }
      
      const shift = (i % 4);
      const shuffledOptions = [];
      for (let s = 0; s < 4; s++) {
        shuffledOptions[(s + shift) % 4] = options[s];
      }
      const correctIdx = shift;

      questions.push({
        q,
        options: shuffledOptions,
        correctIdx,
        explanation
      });
    }

    return questions;
  };

  const topicsData = [];

  for (const catId of Object.keys(listCategories)) {
    const list = listCategories[catId];
    for (let i = 0; i < list.length; i++) {
      const title = list[i];
      const shuffled = [...companiesList].sort(() => 0.5 - Math.random());
      const tags = shuffled.slice(0, 3);

      const concepts = generateDetailedTextbook(catId, title);
      const shortcuts = [
        `Shortcut Trick A: Always read standard formulations carefully.`,
        `Shortcut Trick B: Solve using successive ratios or direct value assumptions.`,
        `Shortcut Trick C: Draw family trees, Venn diagrams, or timelines for logical topics.`
      ];

      topicsData.push({
        category: catId,
        title,
        difficulty: i % 3 === 0 ? 'Easy' : i % 3 === 1 ? 'Medium' : 'Hard',
        desc: `Learn the concepts, shortcuts, and solve high-yield practice questions for ${title}.`,
        questionsCount: 50,
        shortcutsCount: shortcuts.length,
        duration: `${30 + (i % 3) * 10} min`,
        tags,
        concepts,
        shortcuts,
        quizQuestions: generateQuizQuestions(catId, title, 50),
        xpReward: 50,
        order: i + 1,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        year_level: ['1st', '2nd', '3rd', '4th'],
        target_role: 'Software Engineer',
        is_placement_prep: true
      });
    }
  }

  await AptitudeTopic.deleteMany({});
  await AptitudeTopic.insertMany(topicsData);
  console.log(`Seeded ${topicsData.length} aptitude topics successfully.`);
};

const runTheoryAptitudeSeeder = async () => {
  await seedTheoryData();
  await seedAptitudeData();
};

module.exports = runTheoryAptitudeSeeder;
