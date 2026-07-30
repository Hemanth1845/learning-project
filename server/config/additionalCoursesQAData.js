// Comprehensive Textbook-Quality Course Lessons and Interview Q&As for the remaining 9 subjects.
// Matches W3Schools & GeeksforGeeks clarity levels.

const additionalLessons = {
  "SQL": [
    {
      title: "Introduction to Relational Databases & Basic Queries",
      order: 1,
      content: `### SQL Tutorial: Basics & Relational Database Queries

A **Database** is an organized collection of data. A **Relational Database** stores data in tables (relations) which are linked based on data common to each. **SQL (Structured Query Language)** is the standard language to communicate with databases.

#### Visual Relational Table Structure:
\`\`\`
+-------------------------------------------------------+
|                       EMPLOYEES                       |
+-------------+---------------+-------------+-----------+
| employee_id |     name      | department  |  salary   |
+-------------+---------------+-------------+-----------+
|     101     | Alice Johnson | Engineering |   85000   |
|     102     | Bob Smith     | Marketing   |   60000   |
|     103     | Charlie Brown | Engineering |   90000   |
+-------------+---------------+-------------+-----------+
\`\`\`

#### Core SQL SELECT Syntax
The basic select query retrieves columns from a table:
- **SELECT**: Specifies the columns to fetch (use \`*\` for all).
- **FROM**: Identifies the source table.
- **WHERE**: Filters rows based on a comparison check.
- **ORDER BY**: Sorts rows in ascending (\`ASC\`) or descending (\`DESC\`) order.

#### Basic Query Example:
\`\`\`sql
SELECT name, salary 
FROM employees 
WHERE department = 'Engineering' 
ORDER BY salary DESC;
\`\`\``,
      interviewQuestions: [
        { question: "What is SQL?", answer: "SQL stands for Structured Query Language. It is the standard language used to interact, query, modify, and manage relational database systems (RDBMS)." },
        { question: "Explain the difference between SELECT * and specifying column names.", answer: "SELECT * fetches all columns from a table, which increases network overhead and breaks application code if table schemas change. Specifying columns fetches only required data, optimizing performance." },
        { question: "What does the WHERE clause do?", answer: "The WHERE clause is used to filter records in a query. It extracts only those rows that satisfy a specified boolean condition." },
        { question: "How do you sort results in descending order in SQL?", answer: "Use the ORDER BY clause followed by the DESC keyword. E.g., ORDER BY salary DESC;" },
        { question: "What is the difference between SQL and MySQL?", answer: "SQL is a query language used to manage databases. MySQL is a popular Relational Database Management System (RDBMS) that implements SQL." }
      ]
    },
    {
      title: "Filtering, Aggregation & Grouping",
      order: 2,
      content: `### Filtering & Aggregating Data in SQL

When dealing with large databases, you need to summarize information and filter groups.

#### Logical & Comparison Operators
- **AND / OR / NOT**: Combines multiple search conditions.
- **IN**: Matches values against a list of options.
- **LIKE**: Matches patterns using wildcards (\`%\` for multi-character, \`_\` for single character).
- **BETWEEN**: Filters values within a range (inclusive).

#### SQL Aggregate Functions
- **COUNT()**: Returns the number of matching rows.
- **SUM()**: Computes the sum of a numeric column.
- **AVG()**: Computes the average value of a numeric column.
- **MIN() / MAX()**: Returns the smallest / largest value.

#### GROUP BY & HAVING Clauses
- **GROUP BY**: Groups rows that have the same values into summary rows.
- **HAVING**: Filters groups created by GROUP BY (used instead of WHERE because WHERE cannot be applied to aggregate functions).

#### Example Aggregation Query:
\`\`\`sql
SELECT department, COUNT(*), AVG(salary) 
FROM employees 
WHERE salary > 40000 
GROUP BY department 
HAVING AVG(salary) > 60000;
\`\`\``,
      interviewQuestions: [
        { question: "What is the difference between WHERE and HAVING?", answer: "WHERE is used to filter individual database rows before any grouping is performed. HAVING is used to filter grouped rows after the GROUP BY clause has run." },
        { question: "Name the five standard aggregate functions in SQL.", answer: "COUNT(), SUM(), AVG(), MIN(), and MAX()." },
        { question: "How does the LIKE operator work with wildcards?", answer: "The LIKE operator is used in a WHERE clause to search for a specified pattern. '%' matches zero or more characters, while '_' matches exactly one character." },
        { question: "Explain the GROUP BY clause.", answer: "GROUP BY partitions data rows into groups based on matching values in one or more columns, allowing aggregate functions to calculate summaries for each group." },
        { question: "Can we use aggregate functions in a WHERE clause?", answer: "No, aggregate functions cannot be used in a WHERE clause because WHERE filters rows individually before aggregates are calculated. You must use HAVING instead." }
      ]
    },
    {
      title: "Database Joins & Set Operations",
      order: 3,
      content: `### Master SQL Joins & Set Operations

In a normalized database, data is split into multiple tables. **JOINs** allow you to query records by combining columns from two or more tables based on a related column.

#### Visual Join Venn Diagrams:
\`\`\`
  INNER JOIN       LEFT JOIN        RIGHT JOIN       FULL JOIN
    [A ∩ B]         [A (∩ B)]        [(A ∩) B]        [A ∪ B]
\`\`\`

#### Types of SQL Joins
- **INNER JOIN**: Returns rows with matching values in both tables.
- **LEFT (OUTER) JOIN**: Returns all rows from the left table, and matching rows from the right table. If no match, NULL is returned.
- **RIGHT (OUTER) JOIN**: Returns all rows from the right table, and matching rows from the left table.
- **FULL (OUTER) JOIN**: Returns rows when there is a match in either the left or right table.

#### SQL Set Operations
- **UNION**: Combines distinct rows of two query results.
- **UNION ALL**: Combines all rows of two query results (includes duplicates).
- **INTERSECT**: Returns rows common to both query results.
- **EXCEPT / MINUS**: Returns rows from the first query that are not in the second.

#### Join Example:
\`\`\`sql
SELECT emp.name, dept.dept_name 
FROM employees emp 
INNER JOIN departments dept 
ON emp.dept_id = dept.id;
\`\`\``,
      interviewQuestions: [
        { question: "What is a JOIN in SQL?", answer: "A JOIN is an operation used to query and combine records from two or more tables based on a logical relationship between columns in those tables." },
        { question: "Explain the difference between INNER JOIN and LEFT JOIN.", answer: "INNER JOIN returns only rows that have matching values in both tables. LEFT JOIN returns all rows from the left table, along with matching rows from the right table (filling with NULL if no match exists)." },
        { question: "What is the difference between UNION and UNION ALL?", answer: "UNION combines the results of two queries, removing duplicate rows. UNION ALL combines the results but retains all duplicates, making it faster to execute." },
        { question: "What is a Self Join?", answer: "A Self Join is a regular join in which a table is joined with itself (e.g., matching employees to their managers within the same employee table)." },
        { question: "What is a Cross Join?", answer: "A Cross Join returns the Cartesian product of the two tables, matching every row of the first table with every row of the second table." }
      ]
    },
    {
      title: "Subqueries, CTEs, and Indexing",
      order: 4,
      content: `### SQL Advanced: Subqueries, Common Table Expressions, & Indexing

Optimize your queries and write readable query structures.

#### SQL Subqueries
A **Subquery** (or nested query) is a query within another SQL query (inside SELECT, INSERT, UPDATE, or DELETE).
- **Correlated Subquery**: A subquery that references columns of the outer query. It executes once for each candidate row evaluated by the outer query.

#### Common Table Expressions (CTEs)
A **CTE** is a temporary result set defined within the execution scope of a single SELECT, INSERT, UPDATE, or DELETE statement. Defined using the \`WITH\` clause.
- Improves readability compared to nested subqueries.

#### Database Indexes
An **Index** is a data structure (typically a B-Tree or Hash Table) created on table columns to speed up data retrieval.
- **Clustered Index**: Determines the physical order of data rows in a table (only 1 per table - usually primary key).
- **Non-Clustered Index**: Stores pointers to physical data rows (multiple allowed).
- *Trade-off*: Indexes speed up SELECT queries but slow down INSERT, UPDATE, and DELETE operations.

#### CTE Example:
\`\`\`sql
WITH HighEarners AS (
  SELECT id, name, salary 
  FROM employees 
  WHERE salary > 80000
)
SELECT * FROM HighEarners;
\`\`\``,
      interviewQuestions: [
        { question: "What is a Common Table Expression (CTE)?", answer: "A CTE is a temporary, named result set defined using the WITH clause. It simplifies complex queries, replaces subqueries, and can be recursive." },
        { question: "Explain what an Index is and its advantages.", answer: "An Index is a structure created on columns to optimize search speeds. It bypasses full table scans, reducing retrieval times from O(N) to O(log N)." },
        { question: "Why do indexes slow down database writes?", answer: "Whenever data is inserted, updated, or deleted, the RDBMS must also write to and reorganize the corresponding indexes, adding I/O overhead." },
        { question: "What is a Correlated Subquery?", answer: "A correlated subquery is a nested query that depends on values from the outer query. It is evaluated once for each row processed by the outer query, which can make it slower." },
        { question: "Explain the difference between a clustered and non-clustered index.", answer: "A clustered index defines the physical storage order of rows in the table (1 per table). A non-clustered index is a separate structure containing key values and pointers to data locations (multiple allowed)." }
      ]
    }
  ],

  "C Programming": [
    {
      title: "C Syntax, Data Types, and Operators",
      order: 1,
      content: `### C Programming: Fundamentals & Data Types

C is a structured, procedural programming language developed by Dennis Ritchie at Bell Labs. It serves as the foundation for modern compilers, operating systems (Linux kernel), and embedded systems.

#### Core C Program Structure:
\`\`\`c
#include <stdio.h> // Preprocessor directive

int main() {
    printf("Hello, World!\\n");
    return 0; // Exit status
}
\`\`\`

#### Data Types in C
- **char**: Stores single character (1 byte).
- **int**: Stores integer values (usually 2 or 4 bytes).
- **float**: Stores single-precision decimal values (4 bytes).
- **double**: Stores double-precision decimal values (8 bytes).

#### Logical & Bitwise Operators
- **Logical**: \`&&\` (AND), \`||\` (OR), \`!\` (NOT).
- **Bitwise**: \`&\` (AND), \`|\` (OR), \`^\` (XOR), \`~\` (NOT), \`<<\` (Left shift), \`>>\` (Right shift).`,
      interviewQuestions: [
        { question: "What is C and why is it called a mid-level language?", answer: "C is a structural programming language. It is called mid-level because it combines high-level language readability with low-level direct hardware assembly operations (like pointers)." },
        { question: "What is the role of the #include preprocessor directive?", answer: "#include instructs the preprocessor to paste the contents of a system header file (like stdio.h) into the code file before actual compilation." },
        { question: "Explain compilation phases in C.", answer: "C code compilation goes through four stages: Preprocessing (expands macros/directives), Compilation (creates assembly), Assembly (creates object code), and Linking (combines object files with libraries into an executable)." },
        { question: "What is the difference between post-increment (i++) and pre-increment (++i)?", answer: "Pre-increment (++i) increments the value first and then returns it. Post-increment (i++) returns the current value first and then increments it." },
        { question: "How many bytes does an integer consume in C?", answer: "The size of an int is compiler and machine dependent, typically occupying 4 bytes on modern 32-bit and 64-bit systems." }
      ]
    },
    {
      title: "Decision Making, Loops, and Functions",
      order: 2,
      content: `### C Control Flow: Conditions, Loops & Functional Blocks

Control structural statements steer program execution flow based on conditions.

#### Decision Statements
- **if / else if / else**: Evaluates boolean conditions.
- **switch-case**: Matches a variable against constant values. Requires \`break;\` to prevent fall-through.

#### Loop Statements
- **for loop**: Best when the number of iterations is known beforehand.
- **while loop**: Runs while a condition is true. Check condition at the beginning.
- **do-while loop**: Runs at least once because the condition is evaluated at the end.

#### Functions: Parameter Passing
Functions are modular blocks of reusable code.
- **Call by Value**: Passes a copy of the actual argument. Changes inside the function do not affect the caller.
- **Call by Reference**: Passes the memory address of the argument (using pointers). Changes affect the caller's variables directly.`,
      interviewQuestions: [
        { question: "Why do we need a break statement inside a switch-case?", answer: "Without a break statement, execution will continue into the subsequent case blocks (called case fall-through) regardless of whether they match." },
        { question: "What is the difference between a while loop and a do-while loop?", answer: "A while loop checks the condition before execution. A do-while loop checks the condition after executing the body, guaranteeing it runs at least once." },
        { question: "Explain Call by Value vs Call by Reference in C.", answer: "Call by value passes copies of variables, keeping caller variables isolated. Call by reference passes pointers to caller memory, allowing functions to mutate caller values directly." },
        { question: "What is a recursive function?", answer: "A recursive function is a function that calls itself, either directly or indirectly, to solve a problem. It must have a defined base case to prevent stack overflow." },
        { question: "What does the static keyword do when applied to a local variable inside a function?", answer: "A static local variable retains its value across multiple function calls, residing in data memory instead of stack memory." }
      ]
    },
    {
      title: "Pointers, Memory Address, and Dynamic Memory Allocation",
      order: 3,
      content: `### C Pointers & Dynamic Memory Management (Heap vs. Stack)

A **Pointer** is a variable that stores the memory address of another variable.

#### Pointers Notation
- **Address-of Operator (\`&\`)**: Returns the memory address of a variable.
- **Dereference Operator (\`*\`)**: Accesses the value stored at the pointer's target address.

\`\`\`c
int num = 10;
int *ptr = &num; // ptr stores address of num
printf("%d", *ptr); // prints 10 (dereferencing)
\`\`\`

#### Dynamic Memory Allocation (stdlib.h)
Standard variables allocate memory on the **Stack** automatically. Dynamic memory allocates block headers on the **Heap at run-time**:
- **malloc(size)**: Allocates raw uninitialized memory block of specified bytes. Returns \`void*\`.
- **calloc(num, size)**: Allocates memory and initializes all bits to zero.
- **realloc(ptr, new_size)**: Resizes a previously allocated memory block.
- **free(ptr)**: Deallocates heap memory back to the system, preventing **Memory Leaks**.
- **Dangling Pointer**: A pointer pointing to a memory address that has already been deallocated/freed.`,
      interviewQuestions: [
        { question: "What is a Pointer in C?", answer: "A pointer is a special variable that stores the memory address of another variable as its value, rather than a raw data value." },
        { question: "Explain the difference between malloc() and calloc().", answer: "malloc() allocates a single block of raw memory and leaves it uninitialized (containing garbage values). calloc() allocates multiple blocks and initializes all of them to zero." },
        { question: "What is a Memory Leak and how do you prevent it?", answer: "A memory leak occurs when heap memory is allocated dynamically but never released using free(). It is prevented by invoking free(ptr) once the memory is no longer needed." },
        { question: "What is a Dangling Pointer?", answer: "A dangling pointer is a pointer that points to a memory address that has been deallocated (freed) or scope-cleared. Accessing it causes undefined behavior." },
        { question: "What is a NULL pointer?", answer: "A NULL pointer is a pointer that points to nothing (value 0/void), indicating that it does not point to any valid memory address." }
      ]
    },
    {
      title: "Structures, Unions, Typedef, and File I/O",
      order: 4,
      content: `### Structures, Unions, and File Operations in C

Define custom user data structures and handle external files.

#### Structures vs. Unions
- **Structure (struct)**: A user-defined data type that groups variables of different types. Each member has its own memory slot (total size = sum of member sizes + padding).
- **Union**: Groups variables of different types, but all members share the same memory location (total size = size of the largest member). Modifying one member overrides others.

#### Typedef Keyword
Creates aliases for existing types, simplifying code structure declaration:
\`\`\`c
typedef struct Student {
    int id;
    char name[50];
} Student;

Student s1; // No need to write 'struct Student'
\`\`\`

#### File Access operations (FILE*)
- **fopen("filename", "mode")**: Opens a file. Modes: \`"r"\` (read), \`"w"\` (write), \`"a"\` (append).
- **fclose(file_pointer)**: Closes file stream buffers.
- **fprintf() / fscanf()**: Writes/reads formatted data from files.`,
      interviewQuestions: [
        { question: "What is the difference between a Struct and a Union?", answer: "In a Struct, every member has its own memory location, and all members can be used concurrently. In a Union, all members share the same memory block, and only one member can contain a value at any given time." },
        { question: "What does typedef do?", answer: "typedef is a C keyword used to define a new developer-friendly alias name for an existing data type (such as struct declarations)." },
        { question: "How do you open and write text to a file in C?", answer: "Use FILE* fp = fopen('file.txt', 'w'); and check for NULL. Write using fprintf(fp, 'text'); then close it using fclose(fp);" },
        { question: "What is structure padding?", answer: "Structure padding is the insertion of empty byte segments by the compiler to align structural members with word boundary locations, optimizing memory access speed." },
        { question: "What is the arrow operator (->) used for in C?", answer: "The arrow operator is used to access structure members when using a pointer to a structure variable. E.g., ptr->name instead of (*ptr).name;" }
      ]
    }
  ],

  "Python": [
    {
      title: "Python Basics, Dynamic Typing, and Built-in Collections",
      order: 1,
      content: `### Python Tutorial: Dynamic Typing & Core Collections

Python is an interpreted, high-level, dynamically typed language created by Guido van Rossum. It is highly valued for clean readability and developer productivity.

#### Dynamic Typing
Unlike C or Java, Python variables do not require explicit type declarations. The interpreter determines types at run-time.
\`\`\`python
x = 10 # int
x = "Hello" # string (variable type updated dynamically)
\`\`\`

#### Built-in Data Collections
- **List**: Ordered, mutable sequence of items. Declared using square brackets \`[]\`.
- **Tuple**: Ordered, immutable sequence of items. Declared using parentheses \`()\`. Cannot be modified after creation.
- **Set**: Unordered collection of unique items. Declared using curly braces \`{}\`. Excellent for membership testing.
- **Dictionary (dict)**: Unordered key-value store. Declared using curly braces with colons \`{key: value}\`. Keys must be immutable and unique.`,
      interviewQuestions: [
        { question: "What is the difference between a List and a Tuple in Python?", answer: "Lists are mutable (can be altered, appended, or resized) and declared with []. Tuples are immutable (cannot be modified after creation) and declared with (), making them memory-efficient." },
        { question: "Explain Dynamic Typing in Python.", answer: "Dynamic typing means that variable types are bound at run-time. You do not need to declare a variable's data type, and the same variable name can refer to different types over its execution." },
        { question: "What is a Python Dictionary?", answer: "A Dictionary (dict) is a mutable, hashed key-value map. Keys must be unique and immutable (such as strings, numbers, or tuples)." },
        { question: "How do you handle unique values in Python?", answer: "Use a Set collection. Adding duplicates to a set automatically filters them, keeping only unique instances." },
        { question: "What is PEP 8?", answer: "PEP 8 is Python's official style guide, outlining formatting standards (indentation, naming styles) to ensure code readability across projects." }
      ]
    },
    {
      title: "Control Flow, Functions, Lambdas, and Modules",
      order: 2,
      content: `### Python Control Flow & Lambda Functions

Leverage Pythonic loops, functional parameters, and modular structuring.

#### Indentation Rule
Python does not use curly braces \`{}\` for code blocks. It relies strictly on **Whitespace Indentation** (usually 4 spaces).

#### Loops: For & While
- **for item in collection**: Iterates over any iterable object (lists, sets, strings).
- **List Comprehensions**: Elegant one-line syntax to build lists:
\`\`\`python
squares = [x**2 for x in range(10) if x % 2 == 0]
\`\`\`

#### Python Functions & Lambdas
- **Def Statement**: Standard function definition. Supports positional, default, keyword, and variable-length arguments (\`*args\`, \`**kwargs\`).
- **Lambda Functions**: Small, anonymous one-line functions defined using the \`lambda\` keyword:
\`\`\`python
add = lambda a, b: a + b
print(add(3, 5)) # prints 8
\`\`\``,
      interviewQuestions: [
        { question: "What are List Comprehensions?", answer: "List comprehensions offer a concise syntax to create new lists from existing iterables. E.g., [x*2 for x in list] replaces multi-line for-loops." },
        { question: "What is a Lambda function in Python?", answer: "A lambda function is a small, anonymous, one-line function defined without a name using the lambda keyword." },
        { question: "Explain *args and **kwargs parameter tokens.", answer: "*args allows a function to accept any number of positional arguments as a tuple. **kwargs allows it to accept any number of keyword arguments as a dictionary." },
        { question: "What is the purpose of the pass statement?", answer: "pass is a null operation placeholder. It is used when syntax requires a code block but no code logic needs to execute." },
        { question: "Explain range() function.", answer: "range() returns an immutable sequence of numbers, commonly used for looping a specific number of times. It evaluates values lazily." }
      ]
    },
    {
      title: "Object-Oriented Python",
      order: 3,
      content: `### Object-Oriented Programming (OOP) in Python

Implement object design principles, inheritance structures, and special magic methods.

#### Classes & Objects
In Python, everything is an object. Classes are defined using the \`class\` keyword:
- **__init__**: The constructor method, initialized when an object is instantiated.
- **self**: Represents the active instance of the class (must be passed explicitly as the first parameter to methods).

\`\`\`python
class Dog:
    def __init__(self, name):
        self.name = name # Instance attribute
        
    def bark(self):
        return f"{self.name} says Woof!"
\`\`\`

#### Inheritance & Polymorphism
- Supports multiple inheritance. Use \`super()\` to access methods from parent classes.

#### Dunder (Double Underscore) Methods
Special methods that start and end with double underscores, allowing integration with operators:
- **__str__(self)**: Defines user-friendly string representation of objects.
- **__len__(self)**: Intercepts the global \`len()\` call.`,
      interviewQuestions: [
        { question: "What is __init__ in Python?", answer: "__init__ is the constructor method in Python classes, automatically called to initialize instance attributes when a new object is created." },
        { question: "What is the purpose of the self parameter?", answer: "self represents the specific object instance being created or manipulated, allowing instance methods to access instance properties and other class structures." },
        { question: "Does Python support Multiple Inheritance?", answer: "Yes, Python support multiple inheritance. The Method Resolution Order (MRO) is computed dynamically using the C3 Linearization algorithm." },
        { question: "What are Dunder methods?", answer: "Dunder (double underscore) methods (like __str__, __add__, __len__) are special built-in methods used to override default operator and built-in behaviors." },
        { question: "How do you access parent methods in Python?", answer: "Use the super() function, which returns a proxy object delegating method calls to parent or sibling classes." }
      ]
    },
    {
      title: "Exception Handling, Decorators, and Data Science Libraries",
      order: 4,
      content: `### Advanced Python: Decorators, Exception Handling, & Core Data Libraries

` +
`Optimize AI behavior through weights adjustment and semantic search.

#### Exception Handling
Capture runtime faults using try-except blocks:
- **try**: Runs code block.
- **except**: Captures and processes errors.
- **else**: Executes if NO exceptions occur in try block.
- **finally**: Executed always, commonly used to release resource locks or file descriptors.

#### Python Decorators
A **Decorator** is a design pattern that allows developers to add new functionality to an existing function or class structure without modifying its structure. It wraps functions.
\`\`\`python
def my_decorator(func):
    def wrapper():
        print("Before function execution.")
        func()
        print("After function execution.")
    return wrapper

@my_decorator
def greet():
    print("Hello!")
\`\`\`

#### Data Science Core Libraries
- **NumPy**: Provides support for large, multi-dimensional arrays and matrices, along with mathematical functions.
- **Pandas**: Provides fast, flexible data structures (\`DataFrame\`, \`Series\`) designed for structured data analysis.`,
      interviewQuestions: [
        { question: "What is a Decorator in Python?", answer: "A decorator is a design function that takes another function as an argument, extends its behavior without modifying it, and returns the modified wrapper function." },
        { question: "Explain the block structure: try, except, else, finally.", answer: "try holds code to monitor. except catches errors. else runs if no error occurred. finally always runs, cleaning up resources." },
        { question: "What is the difference between a list and a NumPy array?", answer: "NumPy arrays store elements of homogeneous types in contiguous memory locations, enabling fast vectorised operations, whereas lists store heterogeneous pointers." },
        { question: "What is a DataFrame in Pandas?", answer: "A DataFrame is a 2-dimensional, labeled, tabular data structure with columns of potentially different types, resembling an SQL table or Excel sheet." },
        { question: "What is the difference between append() and extend() on Python lists?", answer: "append() adds its argument as a single element to the end of the list. extend() iterates over its argument, adding each item to the list individually." }
      ]
    }
  ],

  "Java": [
    {
      title: "Java Basics, Platform Independence, and JVM/JRE/JDK Architecture",
      order: 1,
      content: `### Java Basics & Virtual Machine (JVM) Architecture

Java is a class-based, object-oriented programming language designed by James Gosling at Sun Microsystems. Its core mantra is **"Write Once, Run Anywhere" (WORA)**.

#### Platform Independence
Java source files (\`.java\`) are compiled by \`javac\` into platform-independent intermediate **Bytecode** (\`.class\`). This bytecode runs on any system equipped with a **Java Virtual Machine (JVM)**, which interprets or compiles it to native machine instructions at run-time.

#### JVM vs. JRE vs. JDK:
\`\`\`
+-----------------------------------------------------------+
| JDK (Development Kit: Compiler, Debugger, JRE)            |
|  +-----------------------------------------------------+  |
|  | JRE (Runtime Environment: Libraries, JVM)           |  |
|  |  +-----------------------------------------------+  |  |
|  |  | JVM (Virtual Machine: Interpreter, JIT, GC)   |  |  |
|  |  +-----------------------------------------------+  |  |
|  +-----------------------------------------------------+  |
+-----------------------------------------------------------+
\`\`\`

#### Core Components
- **JDK (Java Development Kit)**: Complete toolkit for developers. Includes compiler (\`javac\`), debugger, and the JRE.
- **JRE (Java Runtime Environment)**: Provides libraries and the environment needed to run Java programs.
- **JVM (Java Virtual Machine)**: The core engine that loads bytecode, verifies code safety, manages memory, executes instructions, and handles **Garbage Collection (GC)**.`,
      interviewQuestions: [
        { question: "What makes Java platform independent?", answer: "Java is compiled to intermediate bytecode (.class files) rather than native machine code. The bytecode runs on any system containing a JVM tailored for that OS, achieving platform independence." },
        { question: "Explain the differences between JVM, JRE, and JDK.", answer: "JVM is the execution engine for bytecode. JRE contains the JVM plus runtime libraries to run applications. JDK is the full development kit containing JRE plus compilers and debuggers." },
        { question: "What is the Just-In-Time (JIT) compiler?", answer: "The JIT compiler is a JVM component that compiles frequently executed bytecode blocks ('hotspots') directly into native machine code at run-time to speed up execution." },
        { question: "Why is Java not a 100% pure object-oriented language?", answer: "Java is not 100% pure because it supports primitive data types (like int, char, float) that are not objects, though wrapper classes exist for them." },
        { question: "What is garbage collection in Java?", answer: "Garbage collection is the automated process by which the JVM identifies and deletes unreferenced objects from the heap memory to reclaim space." }
      ]
    },
    {
      title: "Object-Oriented Java",
      order: 2,
      content: `### Java OOP Pillars: Class Design, Interfaces, & Abstract Classes

Java enforces strict object-oriented design patterns.

#### The Four OOP Pillars in Java
1. **Encapsulation**: Hiding internal details and exposing access via public getters/setters. Enforced using access modifiers (\`private\`, \`protected\`, \`public\`).
2. **Inheritance**: Subclasses inherit attributes and methods from a parent class using the \`extends\` keyword. Multiple class inheritance is not supported.
3. **Polymorphism**:
   - *Method Overloading* (Compile-time): Same method name, different parameters within the same class.
   - *Method Overriding* (Run-time): Subclass redefines a parent method. Annotated with \`@Override\`.
4. **Abstraction**: Hiding structural implementation. Achieved using abstract classes and interfaces.

#### Abstract Classes vs. Interfaces
- **Abstract Class**: Can contain both abstract (without body) and concrete methods. Can hold instance variables. Classes extend it.
- **Interface**: A structural contract. Historically could only hold abstract methods (now supports \`default\` and \`static\` methods in Java 8+). Fields are implicitly \`public static final\`. Classes implement it.`,
      interviewQuestions: [
        { question: "Explain the difference between method overloading and method overriding.", answer: "Overloading occurs at compile-time within the same class (same name, different arguments). Overriding occurs at run-time when a subclass redefines a parent class method with the same signature." },
        { question: "Why does Java not support multiple class inheritance?", answer: "To prevent the 'Diamond Problem' where ambiguity arises if a subclass inherits different implementations of a method from multiple parent classes." },
        { question: "What is an abstract class and how is it different from an interface?", answer: "An abstract class can have instance states and concrete methods, supporting single inheritance. An interface defines a behavioral contract, supports multiple implementations, and has no instance variables." },
        { question: "What do the access modifiers private, default, protected, and public mean?", answer: "private restricts access to the declaring class. default (no modifier) permits package access. protected permits package and subclass access. public allows unrestricted system access." },
        { question: "What is the final keyword used for in Java?", answer: "When applied to a class, it prevents inheritance. When applied to a method, it prevents overriding. When applied to a variable, it makes it a constant (immutable reference)." }
      ]
    },
    {
      title: "Exception Handling and Multithreading",
      order: 3,
      content: `### Java Concurrency: Exception Handling & Multithreading

Build crash-resilient and high-concurrency enterprise applications.

#### Exception Hierarchy
All exception types inherit from the \`Throwable\` class:
- **Checked Exceptions**: Checked at compile-time (e.g., \`IOException\`). Must be handled using \`try-catch\` or declared with \`throws\`.
- **Unchecked Exceptions (Runtime)**: Checked at run-time (e.g., \`NullPointerException\`). Usually indicate programming logic faults.

#### Multithreading in Java
A thread is a lightweight unit of execution. Created via two patterns:
1. **Extending Thread Class**:
\`\`\`java
class MyThread extends Thread {
    public void run() { System.out.println("Running!"); }
}
\`\`\`
2. **Implementing Runnable Interface** (Preferred because it leaves class inheritance open):
\`\`\`java
class MyRunnable implements Runnable {
    public void run() { System.out.println("Running!"); }
}
\`\`\`

#### Synchronization
Use the \`synchronized\` keyword to lock objects/methods, preventing race conditions when multiple threads access shared resources.`,
      interviewQuestions: [
        { question: "What is the difference between Checked and Unchecked exceptions?", answer: "Checked exceptions are verified at compile-time and must be explicitly handled. Unchecked exceptions occur at run-time and compile without explicit handlers (e.g. division by zero)." },
        { question: "Why is implementing Runnable preferred over extending Thread?", answer: "Because Java supports single class inheritance. Implementing Runnable leaves the class free to extend another parent class, promoting modular design." },
        { question: "What is the synchronized keyword used for?", answer: "synchronized ensures that only one thread can execute a block or method at any time by acquiring a lock on the target object, preventing race conditions." },
        { question: "Explain the difference between sleep() and wait() methods.", answer: "sleep() is static to Thread, pauses the thread, and does NOT release locks. wait() is on Object, suspends the thread, and releases acquired locks until notified." },
        { question: "What is a deadlock in Java multithreading?", answer: "A deadlock occurs when two or more threads are blocked indefinitely, each waiting for locks held by the other, stalling program execution." }
      ]
    },
    {
      title: "Java Collections Framework and Stream API",
      order: 4,
      content: `### Java Collections Framework & Modern Streams (Java 8+)

Manage memory data structures and process data pipelines cleanly.

#### Collections Framework Directory
- **List**: Ordered list of elements (allows duplicates). Core implementations: \`ArrayList\` (resizable array) and \`LinkedList\` (double-linked lists).
- **Set**: Unordered collection of unique items. Core implementations: \`HashSet\` (hash-table backings, O(1) searches) and \`TreeSet\` (sorted order, O(log N) searches).
- **Map**: Key-Value pairs. Core implementations: \`HashMap\` (allows null keys/values, unsorted) and \`TreeMap\` (sorted keys).

#### Java 8 Stream API
Streams allow declarative processing of collections (filtering, mapping, reducing) using functional lambda expressions:
\`\`\`java
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
List<String> filtered = names.stream()
                             .filter(s -> s.startsWith("A"))
                             .collect(Collectors.toList());
// filtered contains ["Alice"]
\`\`\``,
      interviewQuestions: [
        { question: "Explain ArrayList vs LinkedList in Java.", answer: "ArrayList uses a dynamic array, giving O(1) read speeds but slow O(N) middle insertions. LinkedList uses a doubly-linked structure, giving O(N) access speeds but fast O(1) node updates." },
        { question: "How does HashMap work internally in Java?", answer: "HashMap uses hashing. It invokes hashCode() to determine bucket index. If collisions occur, items are stored in linked lists (or self-balancing red-black trees in Java 8+)." },
        { question: "What is the difference between HashMap and Hashtable?", answer: "HashMap is non-synchronized (not thread-safe), permits one null key, and is fast. Hashtable is synchronized (thread-safe), does not allow null keys, and is slower." },
        { question: "What is the Java Stream API?", answer: "Streams process collections in a declarative, functional manner, offering pipelines of intermediate operations (filter, map) and terminal operations (collect, reduce)." },
        { question: "Explain the difference between HashSet and TreeSet.", answer: "HashSet is backed by a hash table, providing unsorted O(1) performance. TreeSet is backed by a red-black tree, providing sorted O(log N) operations." }
      ]
    }
  ],

  "Generative AI": [
    {
      title: "Introduction to LLMs, Deep Learning Foundations, and Prompt Engineering",
      order: 1,
      content: `### Generative AI: Deep Learning & Large Language Model Foundations

**Large Language Models (LLMs)** are deep learning models trained on massive text corpora to predict the next word in a sequence. They form the core of modern conversational AI (Gemini, ChatGPT).

#### The Transformer Architecture
Developed in 2017 ("Attention Is All You Need"), Transformers replaced sequential RNNs:
- **Self-Attention Mechanism**: Allows the model to evaluate the importance of different words in a sentence, regardless of their distance.
- **Encoder-Decoder Structure**: Encoder reads input text; Decoder generates output tokens.

#### Prompt Engineering
The practice of structuring prompts to guide LLMs toward accurate and contextually relevant outputs:
- **Zero-Shot Prompting**: Asking the model a question without examples.
- **Few-Shot Prompting**: Providing a few input-output examples in the prompt to define output schemas.
- **Chain of Thought (CoT)**: Instructing the model to break down its reasoning step-by-step before outputting the final answer.`,
      interviewQuestions: [
        { question: "What is a Transformer architecture in deep learning?", answer: "Transformers use a self-attention mechanism to process input sequences in parallel, capturing long-range relationships between words, replacing sequential RNNs." },
        { question: "Explain the difference between zero-shot and few-shot prompting.", answer: "Zero-shot prompting asks the model to perform a task with no examples. Few-shot prompting provides multiple input-output examples to teach the model the desired pattern." },
        { question: "What is Chain of Thought prompting?", answer: "Chain of Thought prompting encourages LLMs to output intermediate reasoning steps before delivering a final answer, improving success rates in complex math and logic tasks." },
        { question: "What is LLM hallucination?", answer: "Hallucination is when an LLM generates text that is grammatically correct and confident, but factually false or nonsensical." },
        { question: "What are tokens in LLMs?", answer: "Tokens are the basic semantic units (characters, sub-words, or words) into which text is split before being processed by an LLM." }
      ]
    },
    {
      title: "Retrieval-Augmented Generation (RAG) Architecture & Vector Search",
      order: 2,
      content: `### Retrieval-Augmented Generation (RAG) & Vector Databases

LLMs are constrained by their training cutoff dates and lack access to private datasets. **RAG** resolves this.

#### RAG Architecture Workflow
\`\`\`
+-----------------------------------------------------------+
| Query ---> [Embedder] ---> Search Vector DB ---> Context  |
|                                                     |     |
|                                                     v     |
| Prompt + Context ---> [LLM Engine] ---> Verified Answer   |
+-----------------------------------------------------------+
\`\`\`

#### How RAG Works
1. **Ingest**: Private documents are divided into chunks.
2. **Embed**: Chunks are processed by an Embedding Model to generate numeric coordinates (**Vectors**).
3. **Store**: Vectors are stored in a **Vector Database** (ChromaDB, FAISS, Pinecone).
4. **Retrieve**: When a user queries, the query is embedded, and the DB retrieves semantically similar document chunks.
5. **Generate**: Retrieved context is appended to the user prompt, guiding the LLM to write a factually accurate response.`,
      interviewQuestions: [
        { question: "What is RAG (Retrieval-Augmented Generation)?", answer: "RAG is a framework that retrieves relevant context from external databases and appends it to user prompts, enabling LLMs to answer using private or up-to-date data without retraining." },
        { question: "What is a Vector Database?", answer: "A Vector Database stores data as multi-dimensional mathematical vectors, enabling semantic similarity search based on distance metrics (e.g., Cosine Similarity) instead of keywords." },
        { question: "Why do we partition documents into chunks in RAG?", answer: "Because LLMs have context window limits, and chunking ensures that only the most relevant, high-density text fragments are retrieved, reducing noise and API costs." },
        { question: "Explain the role of Cosine Similarity in vector search.", answer: "Cosine Similarity calculates the cosine of the angle between two multi-dimensional vectors, measuring how semantically close the corresponding concepts are." },
        { question: "How does RAG solve LLM hallucinations?", answer: "By providing explicit, referenceable source facts in the prompt context, grounding the LLM's response in verified data." }
      ]
    },
    {
      title: "Fine-tuning LLMs, Embeddings, and Semantic Similarity",
      order: 3,
      content: `### Fine-Tuning Models vs. Vector Embeddings

Optimize AI behavior through weights adjustment and semantic search.

#### Vector Embeddings
An **Embedding** maps high-dimensional semantic ideas into a low-dimensional numerical coordinate vector space:
- Related concepts (e.g., "King" and "Queen") sit physically close to each other in this vector space.

#### Fine-Tuning LLMs
The process of taking a pre-trained base model and training it further on a smaller, specific dataset to update its weights:
- **Supervised Fine-Tuning (SFT)**: Teaching the model specific formatting, tone, or style.
- **LoRA (Low-Rank Adaptation)**: An efficient parameter-efficient fine-tuning (PEFT) method that freezes base model weights and trains a small subset of adapter layers, reducing memory usage by 90%.

#### Comparison Matrix: RAG vs. Fine-Tuning
| Metric | RAG | Fine-Tuning |
|--------|-----|-------------|
| Knowledge Access | Dynamic, external DB | Static, embedded in weights |
| Custom Style/Tone | Low capability | High capability |
| Hallucination Risk | Minimal | Moderate |
| Computing Cost | Low (API queries) | High (GPU training sessions) |`,
      interviewQuestions: [
        { question: "What is the difference between RAG and Fine-Tuning?", answer: "RAG retrieves external reference data to feed into prompts dynamically. Fine-Tuning retrains model weights to learn specific domains, tones, or formatting structures statically." },
        { question: "What is LoRA (Low-Rank Adaptation)?", answer: "LoRA is a Parameter-Efficient Fine-Tuning (PEFT) method that freezes the base LLM weights and adds rank-decomposition matrices to optimize, lowering GPU memory requirements." },
        { question: "What is an embedding model?", answer: "An embedding model converts text strings into arrays of floating-point numbers representing semantic coordinates in high-dimensional space." },
        { question: "What is PEFT?", answer: "PEFT (Parameter-Efficient Fine-Tuning) is a collection of techniques to adapt pre-trained LLMs to specific tasks while updating only a fraction of their parameters." },
        { question: "When would you choose RAG over Fine-Tuning?", answer: "Choose RAG when data changes frequently (needs real-time updates), when access permissions apply, or when GPU training budgets are limited." }
      ]
    },
    {
      title: "Building Intelligent Agents with Gemini API & LangChain",
      order: 4,
      content: `### Building AI Applications: LangChain & Agentic Workflows

Build complete autonomous systems utilizing LLM tools and memory modules.

#### LangChain Framework
An open-source orchestration library designed to build LLM-powered applications:
- **Chains**: Combine LLMs, prompt templates, and data parsers into execution sequences.
- **Memory**: Maintains chat history across stateless API calls.

#### AI Agents
Unlike standard chat systems, an **Agent** uses the LLM as a reasoning engine to decide which actions/tools (e.g., executing Python scripts, searching Google, querying DBs) to call to solve a goal.

#### Agentic Reasoning Cycle (ReAct)
1. **Thought**: Agent reasons about the user's prompt.
2. **Action**: Agent calls a specific tool (e.g., Calculator).
3. **Observation**: Agent reads tool output.
4. **Repeat**: Continues until it reaches the final answer.`,
      interviewQuestions: [
        { question: "What is LangChain?", answer: "LangChain is a framework designed to simplify building applications with LLMs by providing modules for prompts, vector stores, memory, and chains." },
        { question: "What is an AI Agent?", answer: "An AI Agent is an autonomous system that uses an LLM to decide on a sequence of actions, invoking external tools dynamically to solve a user's task." },
        { question: "Explain the ReAct framework in agent design.", answer: "ReAct stands for Reason and Act. It guides agents to alternate between generating reasoning thoughts ('Thoughts') and executing tool actions ('Actions/Observations') to complete tasks." },
        { question: "How do you maintain chat history in stateless LLM APIs?", answer: "By capturing conversation history in a list and appending past user inputs and assistant responses to each new API query." },
        { question: "What is tool-calling in modern LLM APIs?", answer: "Tool-calling (or function calling) is an API capability where the LLM outputs a structured JSON object containing argument values to invoke client-side functions, rather than raw text." }
      ]
    }
  ],

  "Full-Stack Web Development (HTML, CSS, JS, React, Node)": [
    {
      title: "HTML5 Semantics & CSS3 Layouts",
      order: 1,
      content: `### Modern Web: HTML5 Semantics & Layout Design

Build search-engine optimized (SEO) and fully responsive layouts.

#### HTML5 Semantic Tags
Use tags that describe their meaning to search engines and screen readers, rather than generic \`<div>\` containers:
- \`<header>\`, \`<nav>\`, \`<main>\`, \`<section>\`, \`<article>\`, \`<aside>\`, \`<footer>\`.

#### CSS Layout Engines
- **Flexbox (1D)**: Ideal for aligning items along a single axis (either row or column). Excellent for headers and list items.
- **CSS Grid (2D)**: Ideal for complex grid structures containing rows and columns. Excellent for dashboard cards.

#### Responsive Web Design (RWD)
Using CSS media queries to dynamically adjust layouts based on screen resolutions:
\`\`\`css
/* Responsive Grid wrapper */
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
@media (max-width: 768px) {
  .sidebar { display: none; }
}
\`\`\``,
      interviewQuestions: [
        { question: "What are semantic tags in HTML5?", answer: "Semantic tags clearly describe their content meaning to browsers, search engines, and screen readers (e.g. <article>, <section>) rather than acting as basic containers (<divs>)." },
        { question: "Explain Flexbox vs CSS Grid.", answer: "Flexbox is one-dimensional (handles layout along a row or column). Grid is two-dimensional (handles layouts containing both rows and columns concurrently)." },
        { question: "What is a CSS media query?", answer: "A media query is a CSS technique used to apply specific styling rules only when device viewports meet target characteristics (like widths < 768px)." },
        { question: "What is mobile-first design?", answer: "Mobile-first design is the practice of writing CSS styles for small screen layouts first, and then adding media queries to expand designs for desktops." },
        { question: "What is the viewport meta tag used for?", answer: "The viewport meta tag (<meta name='viewport' content='width=device-width, initial-scale=1.0'>) controls mobile viewport dimensions and scaling, preventing mobile browsers from scaling pages down." }
      ]
    },
    {
      title: "Modern JavaScript (ES6+, Promises, Async)",
      order: 2,
      content: `### Modern JavaScript (ES6+), Promises, & Async Workflows

JavaScript is a single-threaded, non-blocking asynchronous language.

#### Core ES6+ Features
- **Arrow Functions**: Syntactically shorter function syntax. Do not bind their own \`this\`.
- **Destructuring**: Extract values from arrays or objects easily:
\`\`\`javascript
const user = { name: "Bob", age: 25 };
const { name, age } = user;
\`\`\`
- **Spread/Rest (\`...\`)**: Expands elements or collects arguments.

#### Asynchronous Operations
Because JS is single-threaded, slow operations (network requests) run asynchronously to prevent freezing the UI.
- **Promises**: Represents the eventual completion (or failure) of an asynchronous operation. States: *Pending*, *Fulfilled*, *Rejected*.
- **Async/Await**: Syntactic sugar over promises, allowing asynchronous code to be written in a synchronous style.

\`\`\`javascript
async function fetchData(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}
\`\`\``,
      interviewQuestions: [
        { question: "Explain event loop in JavaScript.", answer: "JavaScript is single-threaded. The event loop manages code execution: synchronous tasks run in call stack; asynchronous web APIs (callbacks) go to task queues. When the stack is empty, callbacks run." },
        { question: "What is a Promise in JavaScript?", answer: "A Promise is an object representing the eventual success or failure of an asynchronous process. It has states: Pending, Fulfilled, and Rejected." },
        { question: "Explain Async/Await.", answer: "Async/Await is cleaner syntax to work with Promises, replacing nested .then() and .catch() chains with readable try-catch blocks." },
        { question: "What is the difference between let, const, and var?", answer: "var is function-scoped and hoisted. let and const are block-scoped. const variables cannot be reassigned after initialization." },
        { question: "What is closures in JavaScript?", answer: "A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment), allowing access to outer scopes from inner functions." }
      ]
    },
    {
      title: "React.js Fundamentals, State, & Hooks",
      order: 3,
      content: `### Frontend Architecture: React Component Design & State Hooks

React is a declarative component-driven library developed by Meta.

#### Virtual DOM
Instead of updating the slow physical browser DOM directly, React maintains a **Virtual DOM** in memory. When state updates occur:
1. React builds a new Virtual DOM.
2. Compares it with the previous version (**Diffing**).
3. Batches updates and applies only the modified nodes to the physical DOM (**Reconciliation**).

#### React Hooks
- **useState**: Maintains state variables in functional components.
- **useEffect**: Performs side effects (data fetching, subscriptions, DOM mutations) in components.
- **useContext**: Shares global states (like active theme or user login tokens) without manual prop drilling.

\`\`\`jsx
import React, { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = 'Clicked ' + count + ' times';
  }, [count]); // Dependency array

  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
\`\`\``,
      interviewQuestions: [
        { question: "What is the Virtual DOM in React?", answer: "The Virtual DOM is a lightweight memory copy of the real DOM. React diffs it against the old state and updates only changed nodes in the real DOM, optimizing rendering speed." },
        { question: "Explain the useEffect dependency array.", answer: "The dependency array dictates when useEffect runs. An empty array [] means it runs once on mount. Omitting it runs it on every render. Listing variables [var] triggers it only when those change." },
        { question: "What is prop drilling and how do you resolve it?", answer: "Prop drilling is passing props through deeply nested components that do not need them. Resolved using React Context API or state management tools like Redux." },
        { question: "Explain the difference between state and props.", answer: "State is internal, mutable data managed by the component itself. Props are read-only configuration variables passed down from parent components." },
        { question: "Why do react keys matter in list rendering?", answer: "Keys provide stable identities to list elements, helping React identify which items changed, were added, or were removed, optimizing reconciliation." }
      ]
    },
    {
      title: "Backend with Node.js & Express APIs",
      order: 4,
      content: `### Backend Architecture: Node.js, Express, & MongoDB Integrations

Create REST APIs using Node.js, Express routing, and MongoDB.

#### Node.js Runtime
An asynchronous, event-driven JavaScript runtime built on Chrome's V8 engine, designed for high-throughput, non-blocking I/O network programs.

#### Express.js Framework
A minimalist web application framework providing routing, request handling, and middleware integration.
- **Middleware**: Functions that execute during the lifecycle of a request to the server, having access to request (\`req\`), response (\`res\`), and the \`next()\` trigger.

#### Database Integration (Mongoose)
Use **Mongoose** as an Object Data Modeling (ODM) library to enforce schemas and communicate with MongoDB:
\`\`\`javascript
const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json()); // Built-in parser middleware

const UserSchema = new mongoose.Schema({ name: String, email: String });
const User = mongoose.model('User', UserSchema);

app.post('/api/users', async (req, res) => {
  const newUser = await User.create(req.body);
  res.status(201).json(newUser);
});

app.listen(5000);
\`\`\``,
      interviewQuestions: [
        { question: "What is Node.js and how does it handle non-blocking I/O?", answer: "Node.js is a runtime that handles I/O operations asynchronously by delegating slow system operations to the OS kernel or thread pools, returning callbacks once complete." },
        { question: "What is middleware in Express?", answer: "Middleware is a function executed during the request-response cycle, used for logging, auth checks, parsing, or modifying request/response objects before reaching routes." },
        { question: "What is the difference between SQL and NoSQL databases?", answer: "SQL databases are relational, structured (schemas), and ACID compliant. NoSQL (like MongoDB) is document-based, schema-less, and scalable, storing JSON-like documents." },
        { question: "What is Mongoose?", answer: "Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js, managing relationships, schemas, validations, and query execution." },
        { question: "What does app.use(express.json()) do?", answer: "It is a built-in Express middleware that parses incoming request payloads formatted as JSON, exposing the parsed data on req.body." }
      ]
    }
  ],

  "Data Structures & Algorithms with Java": [
    {
      title: "Time and Space Complexity (Big O) & Arrays/Strings",
      order: 1,
      content: `### DSA Basics: Big O Complexity & Linear Arrays

A **Data Structure** is a structured way of organizing data in computer memory. An **Algorithm** is a step-by-step procedure to solve a problem.

#### Big O Complexity Notation
Describes how algorithm execution time or memory footprint scales relative to input size \`N\`:
- **O(1)**: Constant Time (Direct array lookup).
- **O(log N)**: Logarithmic Time (Binary Search).
- **O(N)**: Linear Time (Single array traversal).
- **O(N log N)**: Logarithmic Linear (Merge Sort).
- **O(N^2)**: Quadratic Time (Double nested loops).

#### Arrays & Strings in Java
Arrays store homogeneous items in contiguous memory:
\`\`\`java
int[] arr = new int[5]; // Allocated in Heap
\`\`\`
- *Trade-off*: Access is fast (\`O(1)\` via index), but insertion/deletion at arbitrary positions is slow (\`O(N)\` due to shifting).
- **Java Strings**: Strings in Java are **Immutable**. Modifying a string creates a new string object in the String Constant Pool, making \`StringBuilder\` preferred for frequent updates.`,
      interviewQuestions: [
        { question: "What is Big O notation?", answer: "Big O notation measures the worst-case time or space complexity of an algorithm, describing how resource usage grows as input size increases." },
        { question: "Explain why Java Strings are immutable.", answer: "For security, caching in the String Pool, and thread-safety. If strings were mutable, shared reference strings could be modified maliciously." },
        { question: "When would you use StringBuilder instead of String?", answer: "Use StringBuilder when making repetitive modifications (concatenations, loops) to avoid creating multiple temporary String objects in memory." },
        { question: "What is the time complexity to insert an element in the middle of an array?", answer: "O(N) because subsequent elements must be shifted in memory to accommodate the new item." },
        { question: "What is the difference between space complexity and auxiliary space?", answer: "Space complexity is the total memory space utilized relative to input size. Auxiliary space is the temporary extra memory allocated by the algorithm itself, excluding input sizes." }
      ]
    },
    {
      title: "Linked Lists, Stacks, and Queues",
      order: 2,
      content: `### Linear Data Structures: Linked Lists, Stacks, & Queues

Build dynamic structures using pointers and nodes.

#### Linked Lists
Nodes containing a data value and a pointer (reference) to the next node:
- **Singly Linked**: Node points only to the next node.
- **Doubly Linked**: Node points to both the previous and next nodes.
- *Advantage*: Dynamic sizing and fast insertions/deletions (\`O(1)\`) when pointers are known.

#### Stacks (LIFO - Last In, First Out)
Restricted access structure: elements can only be added/removed from the top.
- **push(x)**: Adds to the top.
- **pop()**: Removes and returns from the top.
- **peek()**: Looks at the top element without removing it.

#### Queues (FIFO - First In, First Out)
Elements are added at the **Rear** and removed from the **Front**.
- **enqueue(x)**: Adds to rear.
- **dequeue()**: Removes from front.`,
      interviewQuestions: [
        { question: "Explain the difference between Array and Linked List.", answer: "Arrays store elements in contiguous memory (static size, fast reads). Linked Lists use pointers to connect nodes scattered in memory (dynamic size, fast insertions)." },
        { question: "How do you detect a cycle in a Linked List?", answer: "Using Floyd's Cycle-Finding Algorithm (Hare and Tortoise), which uses two pointers moving at different speeds (1 step and 2 steps). If they meet, a cycle exists." },
        { question: "What are the core applications of a Stack?", answer: "Function call execution stacks, balancing parentheses checks in compilers, undo/redo logs, and depth-first search (DFS) traversals." },
        { question: "Explain Queue overflow and underflow.", answer: "Overflow is trying to enqueue to a full queue. Underflow is trying to dequeue from an empty queue." },
        { question: "How do you implement a Queue using two Stacks?", answer: "By pushing items onto Stack 1 for enqueuing. For dequeuing, pop all elements from Stack 1 to Stack 2 (reversing order) and pop from Stack 2. If Stack 2 is empty, shift elements again." }
      ]
    },
    {
      title: "Binary Trees, Binary Search Trees, and Heap Data Structures",
      order: 3,
      content: `### Hierarchical Structures: Binary Trees, BSTs, & Heaps

Optimize data access and sorting using tree models.

#### Binary Trees
A hierarchical structure where each node has at most two children:
- **Binary Search Tree (BST)**: For any node, left child values are smaller, and right child values are larger.
- **In-order traversal** of a BST yields sorted elements.

#### Binary Tree Traversals
- **Pre-order**: Root -> Left -> Right.
- **In-order**: Left -> Root -> Right.
- **Post-order**: Left -> Right -> Root.

#### Heap Data Structure (Priority Queue)
A complete binary tree satisfying the heap property:
- **Max Heap**: Parent value is greater than or equal to child values. Root holds the maximum element.
- **Min Heap**: Parent value is less than or equal to child values. Root holds the minimum element.
- *Performance*: Insert/Delete is \`O(log N)\`, peeking root is \`O(1)\`.`,
      interviewQuestions: [
        { question: "What is a Binary Search Tree (BST)?", answer: "A BST is a node-based binary tree where the left subtree contains only values less than the node key, and the right subtree contains only values greater than the node key." },
        { question: "What is the time complexity of searching in a balanced BST vs an unbalanced BST?", answer: "O(log N) in a balanced tree. In a worst-case unbalanced tree (skewed tree), it degrades to O(N)." },
        { question: "Explain In-order, Pre-order, and Post-order traversals.", answer: "In-order traverses Left-Root-Right. Pre-order traverses Root-Left-Right. Post-order traverses Left-Right-Root." },
        { question: "What is a Binary Heap?", answer: "A Binary Heap is a complete binary tree that maintains the heap property: either parent >= children (Max-Heap) or parent <= children (Min-Heap)." },
        { question: "What is the time complexity to insert an element into a Heap?", answer: "O(log N) because after inserting at the bottom, the element must be bubbled up to restore the heap property." }
      ]
    },
    {
      title: "Graph Representations (BFS, DFS) & Intro to Dynamic Programming",
      order: 4,
      content: `### Advanced Algorithms: Graph Traversals & Dynamic Programming

Solve complex network and optimization problems.

#### Graph Representations
A **Graph** consists of vertices (V) connected by edges (E):
- **Adjacency Matrix**: A 2D array where \`matrix[i][j] = 1\` indicates an edge. Space complexity: \`O(V^2)\`.
- **Adjacency List**: An array of lists where \`list[i]\` contains all neighbors of vertex \`i\`. Space complexity: \`O(V + E)\`.

#### Graph Traversals
- **Breadth-First Search (BFS)**: Explores neighbors level-by-level using a **Queue**. Finds the shortest path in unweighted graphs.
- **Depth-First Search (DFS)**: Explores as deep as possible along each branch before backtracking, using a **Stack** (or recursion).

#### Dynamic Programming (DP)
An algorithmic paradigm that solves complex problems by breaking them down into simpler subproblems, solving each subproblem once, and storing their solutions (to avoid redundant calculations).
- **Memoization** (Top-Down): Solves recursively, caching results.
- **Tabulation** (Bottom-Up): Fills a table iteratively from base cases.`,
      interviewQuestions: [
        { question: "Explain Breadth-First Search (BFS) vs Depth-First Search (DFS).", answer: "BFS explores neighbors level-by-level using a Queue. DFS explores branches deeply using a Stack or recursion. BFS is optimal for shortest paths; DFS uses less memory in deep trees." },
        { question: "How do you represent a graph in code?", answer: "Using an Adjacency Matrix (2D array, fast edge checks) or an Adjacency List (array of linked lists, memory efficient)." },
        { question: "What is Dynamic Programming?", answer: "An optimization technique that solves complex problems by breaking them into overlapping subproblems, storing results to avoid redundant calculations." },
        { question: "Explain Memoization vs Tabulation in DP.", answer: "Memoization is a top-down recursive approach that caches results. Tabulation is a bottom-up iterative approach that builds a table starting from base cases." },
        { question: "What is a topological sort?", answer: "A topological sort is a linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge U -> V, vertex U comes before V in the ordering." }
      ]
    }
  ],

  "Database Management Systems (DBMS) & SQL Masterclass": [
    {
      title: "Relational Schema Design & ER diagram mapping",
      order: 1,
      content: `### Database Masterclass: Schema Design & ER Mapping

Translate conceptual designs into physical database tables.

#### Database Schemas
A **Schema** represents the logical design of the database.

#### ER to Relational Mapping Rules
1. **Strong Entities**: Map directly to tables. The primary key of the entity becomes the primary key of the table.
2. **Weak Entities**: Map to a table. The primary key becomes the combination of the owner's primary key plus the weak entity's discriminator.
3. **1:N Relationships**: Take the primary key of the '1' side and add it as a foreign key in the 'N' side table.
4. **N:M Relationships**: Create a new junction table containing the primary keys of both participating tables as a composite primary key.`,
      interviewQuestions: [
        { question: "How do you map a Many-to-Many (N:M) relationship to tables?", answer: "By creating a new junction (association) table containing the primary keys of both entities as foreign keys, forming a composite primary key." },
        { question: "What is a database schema?", answer: "A database schema is the skeleton structure representing the logical layout of tables, columns, relations, views, and constraints." },
        { question: "How is a weak entity mapped to a relational table?", answer: "Create a table for the weak entity. Its primary key is a composite key consisting of the identifying parent table's primary key plus the weak entity's partial key (discriminator)." },
        { question: "What is a primary key constraint?", answer: "A primary key constraint uniquely identifies each record in a table, requiring values to be unique and non-null." },
        { question: "Explain the difference between logical schema and physical schema.", answer: "Logical schema defines the logical structure of tables and constraints. Physical schema defines how those tables are stored physically on disk (file structures, indexes)." }
      ]
    },
    {
      title: "Relational Integrity constraints & Keys",
      order: 2,
      content: `### Database Integrity Constraints & Keys

Ensure data accuracy and consistency across tables.

#### Types of Integrity Constraints
- **Domain Constraint**: Specifies the permissible values for an attribute (data types, ranges).
- **Entity Integrity**: Specifies that no primary key value can be NULL.
- **Referential Integrity**: Specifies that a foreign key value must exist in the referenced parent table, or be NULL.
- **Key Constraint**: Specifies that candidate keys must uniquely identify tuples.

#### Database Keys hierarchy:
\`\`\`
[Super Key] -> Any unique identifier set
  ↳ [Candidate Key] -> Minimal unique identifier
      ↳ [Primary Key] -> Chosen candidate key
      ↳ [Alternate Key] -> Remaining candidate keys
\`\`\``,
      interviewQuestions: [
        { question: "What is Entity Integrity?", answer: "Entity integrity is a constraint specifying that the primary key of a table cannot be NULL, ensuring every row is identifiable." },
        { question: "What is Referential Integrity?", answer: "A constraint ensuring that foreign key values must match a valid primary key in the parent table, or be NULL, maintaining consistent relationships." },
        { question: "What is a Domain Constraint?", answer: "Domain constraints restrict the values a column can accept (e.g. data type checks, positive value constraints)." },
        { question: "Explain Candidate Key vs Super Key.", answer: "A Super Key is any set of columns that uniquely identifies a row. A Candidate Key is a minimal super key with no redundant columns." },
        { question: "What is a composite primary key?", answer: "A primary key composed of two or more columns to uniquely identify a record (commonly used in junction tables)." }
      ]
    },
    {
      title: "Database Normalization",
      order: 3,
      content: `### Database Normalization: 1NF, 2NF, 3NF, and BCNF

Normalization is a systematic process of organizing database columns and tables to minimize **Data Redundancy** and avoid insertion, deletion, and update **Anomalies**.

#### Normal Forms
1. **First Normal Form (1NF)**:
   - All attribute values must be atomic (no multi-valued attributes or nested lists).
2. **Second Normal Form (2NF)**:
   - Must be in 1NF.
   - Eliminates **Partial Dependencies**: No non-prime attribute should depend on a proper subset of a composite candidate key.
3. **Third Normal Form (3NF)**:
   - Must be in 2NF.
   - Eliminates **Transitive Dependencies**: No non-prime attribute should depend on another non-prime attribute.
4. **Boyce-Codd Normal Form (BCNF)**:
   - Stronger than 3NF.
   - For every functional dependency \`X -> Y\`, \`X\` must be a super key.`,
      interviewQuestions: [
        { question: "What is database Normalization?", answer: "Normalization is the process of organizing database tables to reduce data redundancy, ensure dependency mapping, and prevent operational anomalies." },
        { question: "Explain the three main update anomalies.", answer: "Insertion Anomaly (cannot insert data without other facts), Deletion Anomaly (deleting records deletes unrelated facts), and Update Anomaly (updating values requires updates in multiple rows)." },
        { question: "What is a Partial Dependency?", answer: "A partial dependency occurs when a non-key column depends on only part of a composite primary key, violating 2NF." },
        { question: "What is a Transitive Dependency?", answer: "A transitive dependency occurs when a non-key column depends on another non-key column (e.g., A -> B and B -> C), violating 3NF." },
        { question: "Why is BCNF stricter than 3NF?", answer: "Because BCNF requires that for every functional dependency X -> Y, X must be a super key, whereas 3NF allows Y to be a prime attribute." }
      ]
    },
    {
      title: "Transaction management, ACID properties, and Concurrency control",
      order: 4,
      content: `### Database Transactions, ACID, & Concurrency Control

Maintain data consistency in multi-user environments.

#### Database Transactions
A logical unit of database processing consisting of a sequence of database operations.

#### ACID Properties
- **Atomicity**: The entire transaction completes, or none of it does ("all or nothing").
- **Consistency**: The database remains in a valid state before and after the transaction.
- **Isolation**: Concurrent transactions execute without interfering with each other.
- **Durability**: Once committed, changes are permanent, surviving system crashes.

#### Transaction States:
\`\`\`
[Active] ---> [Partially Committed] ---> [Committed]
   |                     |
   v                     v
[Failed] ----------> [Aborted]
\`\`\`

#### Concurrency Anomalies
- **Dirty Read**: Transaction reads uncommitted data modified by another transaction.
- **Non-Repeatable Read**: Transaction re-reads data and finds it has been modified by another transaction.
- **Phantom Read**: Transaction re-runs a query and finds new rows added by another transaction.

#### Concurrency Control Protocols
- **Two-Phase Locking (2PL)**: Guarantees serializability by acquiring locks in a growing phase and releasing them in a shrinking phase.
- **ACID Isolation Levels**: Read Uncommitted, Read Committed, Repeatable Read, Serializable.`,
      interviewQuestions: [
        { question: "Explain ACID properties in databases.", answer: "ACID stands for: Atomicity (all or nothing), Consistency (preserves rules), Isolation (independent concurrent execution), and Durability (survives crashes)." },
        { question: "What is a Dirty Read?", answer: "A dirty read occurs when a transaction reads data that has been modified by another concurrent transaction but not yet committed. If that transaction rolls back, the data is invalid." },
        { question: "Explain Two-Phase Locking (2PL).", answer: "2PL is a concurrency protocol that ensures serializability by splitting locking into two phases: Growing (acquiring locks, releasing none) and Shrinking (releasing locks, acquiring none)." },
        { question: "What is the difference between Shared and Exclusive locks?", answer: "A Shared Lock (Read lock) allows multiple transactions to read a record simultaneously. An Exclusive Lock (Write lock) allows only one transaction to modify the record, blocking others." },
        { question: "What are the four SQL isolation levels?", answer: "Read Uncommitted, Read Committed, Repeatable Read, and Serializable (highest isolation, lowest concurrency)." }
      ]
    }
  ],

  "Core CS Fundamentals (OS, Networks, System Design)": [
    {
      title: "OS Core Concepts (Processes, Memory paging, Deadlocks)",
      order: 1,
      content: `### Core CS review: Operating System Essentials

Review key operating system principles for campus interviews.

#### Process vs. Thread
- **Process**: Independent program instance with isolated memory space.
- **Thread**: Lightweight execution unit within a process, sharing code/data segments.

#### Virtual Memory Paging
Virtual memory decouples logical address space from physical RAM:
- Divide logical memory into **Pages** and physical memory into **Frames**.
- **Page Fault**: Occurs when a page requested by the CPU is not loaded in RAM. The OS loads it from disk.
- **TLB**: A fast cache on the CPU that stores page-table mappings to speed up translation.

#### Deadlocks
A state of mutual block where processes wait for resources held by each other. Necessary conditions:
1. Mutual Exclusion
2. Hold and Wait
3. No Preemption
4. Circular Wait`,
      interviewQuestions: [
        { question: "What is a process context switch?", answer: "The process of saving the execution state of a running process and loading the state of another, which involves updating registers, program counters, and flushing caches." },
        { question: "What is the Translation Lookaside Buffer (TLB)?", answer: "A high-speed CPU cache that stores recent page-to-frame translations to avoid double memory access overhead during paging." },
        { question: "Explain the four necessary conditions for deadlock.", answer: "Mutual Exclusion (non-shareable resources), Hold & Wait (holding one resource while waiting for another), No Preemption (cannot force release), and Circular Wait (closed wait loop)." },
        { question: "How does the OS handle a Page Fault?", answer: "The CPU traps to the OS kernel. The kernel checks the page table, finds the page on disk, loads it into a free RAM frame, updates the page table, and restarts the instruction." },
        { question: "What is thrashing in OS?", answer: "A state of high paging activity where the system spends almost all its time swapping pages in and out of disk rather than executing instructions, causing performance to collapse." }
      ]
    },
    {
      title: "Computer Network Fundamentals (TCP/IP layers, routing, DNS)",
      order: 2,
      content: `### Core CS review: Computer Networks Essentials

Review protocols and routing structures that connect the Internet.

#### TCP/IP Model Layers
1. **Application Layer**: User interaction (HTTP, FTP, DNS, SMTP).
2. **Transport Layer**: End-to-end communication (TCP - reliable/connection-oriented, UDP - fast/connectionless).
3. **Internet Layer**: Host-to-host routing (IP protocol, routers).
4. **Network Access Layer**: Physical media, MAC addresses.

#### TCP 3-Way Handshake
Establishes a reliable connection:
1. **SYN**: Client sends SYN packet (Synchronize sequence numbers).
2. **SYN-ACK**: Server responds with SYN and ACK packet.
3. **ACK**: Client responds with ACK packet.

#### DNS Resolution Workflow
Translates human-readable domains (e.g. google.com) to machine IP addresses:
1. Browser checks local cache.
2. Queries the Recursive Resolver.
3. Resolver queries Root Nameserver (\`.\`), then TLD Nameserver (\`.com\`), and finally the Authoritative Nameserver to fetch the IP address.`,
      interviewQuestions: [
        { question: "Explain the TCP 3-Way Handshake.", answer: "The client sends a SYN packet to synchronize sequence numbers. The server responds with SYN-ACK to acknowledge and sync. The client sends an ACK packet to confirm, establishing the connection." },
        { question: "What is the difference between TCP and UDP?", answer: "TCP is connection-oriented, reliable (guarantees packet delivery and order), performs flow control, and is slower. UDP is connectionless, fast, does not guarantee delivery, and has lower overhead." },
        { question: "What is DNS?", answer: "DNS (Domain Name System) translates human-readable domain names into IP addresses, operating on UDP port 53." },
        { question: "Explain the difference between IPv4 and IPv6.", answer: "IPv4 uses 32-bit addresses (4.3 billion limit, formatted as 192.168.1.1). IPv6 uses 128-bit addresses (virtually unlimited, formatted in hexadecimal)." },
        { question: "What is the purpose of the ARP protocol?", answer: "ARP (Address Resolution Protocol) translates a known IP address (logical) into its corresponding MAC address (physical) within a local network." }
      ]
    },
    {
      title: "Introduction to System Design (Scalability, Load Balancers, Caching)",
      order: 3,
      content: `### System Design: Scalability, Load Balancers & Caching

Build large-scale applications capable of handling millions of users.

#### Scalability Patterns
- **Vertical Scaling** (Scale Up): Adding more resource capacity (CPU, RAM) to a single server. Limited by hardware caps and introduces a single point of failure.
- **Horizontal Scaling** (Scale Out): Adding more servers to the system pool. Highly scalable and reliable.

#### Load Balancer (LB)
A device that distributes incoming network traffic across a cluster of backend servers, preventing overloading on any single server:
- Algorithms: Round Robin, Least Connections, IP Hash.

#### System Caching (Redis/Memcached)
A cache is a high-speed temporary data storage layer (typically in-memory) used to store frequently accessed data:
- Bypasses slow database queries.
- *Cache Eviction Policies*: LRU (Least Recently Used), LFU (Least Frequently Used).
- *Cache Issues*: Cache Penetration, Cache Avalanche.`,
      interviewQuestions: [
        { question: "What is the difference between Horizontal and Vertical scaling?", answer: "Vertical scaling increases the CPU/RAM capacity of a single server. Horizontal scaling adds more machines to the resource pool, which is generally more resilient and scalable." },
        { question: "What does a Load Balancer do?", answer: "A load balancer distributes incoming network requests across a pool of backend servers to prevent overloading, maximize throughput, and ensure high availability." },
        { question: "Explain how Caching improves system performance.", answer: "Caching stores frequently accessed data in fast in-memory stores (like Redis), avoiding slower disk reads or complex database queries, reducing latency." },
        { question: "What is the difference between cache penetration and cache avalanche?", answer: "Cache penetration occurs when requests query keys that do not exist in either the cache or the database, forcing database checks. Cache avalanche is when a large number of cached keys expire at the same time, overloading the database." },
        { question: "Explain CDN (Content Delivery Network).", answer: "A CDN is a geographically distributed network of proxy servers that cache static assets (images, CSS, JS) closer to users, reducing latency and load on the origin server." }
      ]
    },
    {
      title: "Design Case Studies (URL Shortener, Chat Server)",
      order: 4,
      content: `### System Design Case Studies: TinyURL & Chat Systems

Apply system design concepts to real-world architectures.

#### Case Study 1: URL Shortener (TinyURL)
- **Goal**: Convert a long URL into a short alias (e.g. tinyurl.com/a7b9c2).
- **Key Requirements**:
  - High availability, low latency redirection.
  - Generating unique short codes (Base 62 encoding: \`[a-z, A-Z, 0-9]\`).
- **Architecture**:
  1. User posts a long URL.
  2. The application uses a unique ID generator (e.g., Snowflake) to get a numeric ID and encodes it to Base 62.
  3. Saves the mapping \`[Short Code -> Long URL]\` in a database (NoSQL/SQL).
  4. Redirections are cached in Redis to achieve sub-millisecond lookups.

#### URL Shortener Architecture:
\`\`\`
+-----------------------------------------------------------+
| User ---> [Load Balancer] ---> [Web Server] ---> [Cache]  |
|                                                     |     |
|                                                     v     |
|                                                 [Database]|
+-----------------------------------------------------------+
\`\`\`

#### Case Study 2: Real-time Chat System (WhatsApp)
- **Goal**: Support low-latency message delivery and online status indicators.
- **Key Challenge**: Standard HTTP is client-pull (unidirectional). Chat requires server-push (bidirectional).
- **Solution**: **WebSockets** or Long Polling. WebSockets establish a persistent, bidirectional TCP connection between the client and chat servers.`,
      interviewQuestions: [
        { question: "How does a URL Shortener handle URL redirection?", answer: "The user requests the short URL. The system looks up the short code in the cache (or database), retrieves the original long URL, and returns an HTTP 302 Found (or 301 Moved Permanently) redirect." },
        { question: "Why is WebSockets preferred over HTTP for real-time chat systems?", answer: "WebSockets establish a persistent, bidirectional TCP connection, allowing real-time message transfer with minimal header overhead, unlike stateless client-pulled HTTP." },
        { question: "What is Base 62 encoding in URL shortening?", answer: "Base 62 uses characters [A-Z, a-z, 0-9] to represent numbers. A 6-character code generates 62^6 (56.8 billion) unique values, perfect for URL aliases." },
        { question: "How do you generate unique IDs in distributed systems without collisions?", answer: "Using distributed ID generators like Twitter Snowflake, which combine timestamps, worker node IDs, and sequence numbers to generate collision-free unique IDs." },
        { question: "How do you scale a chat system to support millions of concurrent connections?", answer: "By using a gateway load balancer, maintaining connection states on distinct WebSocket servers, and using a message broker (like Kafka/RabbitMQ) to route messages between servers." }
      ]
    }
  ]
};

module.exports = { additionalLessons };
