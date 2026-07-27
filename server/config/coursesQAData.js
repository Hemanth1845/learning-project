// Comprehensive Technical Interview Q&As for Operating Systems, DBMS, and Computer Networks

const osLessons = [
  {
    title: "Operating System Basics & Architectures",
    order: 1,
    content: `### Operating System Tutorial: Basics & Architectures

An **Operating System (OS)** is a software system that manages computer hardware, software resources, and provides common services for computer programs. It acts as an intermediate interface between user applications and the hardware.

#### Visual Architecture Diagram:
\`\`\`
+---------------------------------------------+
|               User Applications             |
|        (Browser, Code Editor, Games)        |
+---------------------------------------------+
|                 System Calls                |
|        (fork, exec, read, write, open)       |
+---------------------------------------------+
|             Operating System Kernel         |
|      (Process, Memory, I/O, File System)    |
+---------------------------------------------+
|               Computer Hardware             |
|             (CPU, RAM, Disk, I/O)           |
+---------------------------------------------+
\`\`\`

#### Key OS Functions:
- **Process Management**: CPU scheduling, creation, synchronization, and termination.
- **Memory Management**: RAM allocation, deallocation, page table translation, and swapping.
- **I/O Device Management**: Interfacing with drivers, buffering, and resource virtualization.
- **File System Management**: Storing, organizing, retrieving, and securing files.
- **Security & Protection**: Guarding memory segments and user access rights.`,
    interviewQuestions: [
      { question: "What is an Operating System and what are its core functions?", answer: "An Operating System (OS) is a software interface that manages hardware resources and coordinates application execution. Core functions include: Process Management, Memory Management, Device Management, File System Management, and Security Control." },
      { question: "Explain the difference between a Monolithic Kernel and a Microkernel.", answer: "In a Monolithic Kernel, all operating system services (Virtual Memory, File System, CPU Scheduling) run inside the kernel space. In a Microkernel, only minimal essential services (IPC, basic scheduling) run in the kernel space, while others run in user space, communicating via messages. Monolithic is faster, but Microkernel is more secure and stable." },
      { question: "What is a System Call and how does it work?", answer: "A system call is a programmatic mechanism by which a user-space application requests a privileged service from the operating system kernel. When a system call is made, a trap instruction is executed, switching the CPU from user mode to kernel mode, executing the kernel routine, and switching back." },
      { question: "What is the difference between User Mode and Kernel Mode?", answer: "User Mode is a restricted execution mode where applications run, preventing direct hardware access. Kernel Mode is a privileged mode where the OS kernel executes with unrestricted access to memory and physical hardware. A mode switch occurs via traps or interrupts." },
      { question: "Explain context switching and its performance overhead.", answer: "Context switching is the process of saving the execution state (CPU registers, program counter) of a running process and loading the state of another process to resume its execution. Its overhead includes saving/loading PCB states, cache invalidation, and TLB flushes." },
      { question: "What is a Process Control Block (PCB)?", answer: "A PCB is a data structure in kernel memory representing a process. It contains process state, process ID (PID), program counter (PC), CPU register contents, CPU scheduling details, memory limits, and I/O status info." },
      { question: "What is booting and what happens during the bootstrap process?", answer: "Booting is the startup sequence of a computer. The CPU loads a tiny program called bootstrap loader from ROM (or BIOS/UEFI), which initializes hardware, loads the OS kernel into memory from disk, and starts the initial init process." },
      { question: "Explain the difference between multitasking and multiprocessing.", answer: "Multitasking refers to a single CPU rapidly switching between multiple processes to give the illusion of concurrent execution. Multiprocessing is the physical execution of multiple processes at the same time on a system with multiple physical CPUs." },
      { question: "What is an interrupt and how is it handled?", answer: "An interrupt is a hardware or software signal sent to the CPU indicating an event needs attention. The CPU pauses current execution, saves its state, looks up the Interrupt Vector Table (IVT), runs the corresponding Interrupt Service Routine (ISR), and then resumes original execution." },
      { question: "What is spooling (Simultaneous Peripheral Operations On-Line)?", answer: "Spooling is a buffer mechanism where data is stored temporarily in a queue on disk or RAM before being processed by slow peripheral devices like printers, preventing faster devices from waiting." },
      { question: "What are Unix system calls: fork(), exec(), and wait()?", answer: "fork() creates a child process by duplicating the parent. exec() replaces the current process image with a new executable program. wait() causes the parent process to suspend execution until its child terminates." },
      { question: "What does the fork() system call return?", answer: "To the parent process, fork() returns the PID of the newly created child process. To the child process, it returns 0. If it fails, it returns -1." },
      { question: "What is a dual-mode operation in hardware?", answer: "Dual-mode operation provides hardware-level protection by separating user-space applications from kernel services using a mode bit (0 for kernel, 1 for user) in the CPU status register." },
      { question: "Explain the concept of an Orphan Process.", answer: "An orphan process is a running child process whose parent process has terminated. In Unix-like systems, orphan processes are automatically adopted by the system's root init process (PID 1), which reaps their termination status." },
      { question: "Explain the concept of a Zombie Process.", answer: "A zombie process is a process that has completed execution but still has an entry in the process table because its parent has not yet read its exit status using wait(). It consumes process identifiers (PIDs)." },
      { question: "What is a Daemon process?", answer: "A daemon process is a background, non-interactive service process that runs continuously (usually starting at boot) to handle periodic requests, such as print queue services, mail routing, or web requests." },
      { question: "What is the difference between a process and a thread?", answer: "A process is an executing program instance with its own independent memory workspace (Code, Data, Heap). A thread is a lightweight unit of execution within a process that shares the process's code, data, and resources, but maintains its own program counter and stack." },
      { question: "What is IPC (Inter-Process Communication)? Name common mechanisms.", answer: "IPC refers to mechanisms that allow separate processes to exchange data. Common mechanisms include Shared Memory, Message Queuing, Pipes, Named Pipes (FIFOs), and Sockets." },
      { question: "Explain the difference between a pipe and a socket.", answer: "A pipe is a unidirectional communication channel between related processes (parent-child) on the same machine. A socket is a bidirectional communication channel that can connect unrelated processes across different machines via network protocols." },
      { question: "What is a Clustered System?", answer: "A clustered system consists of multiple physical computer nodes working together as a single system. They share storage networks, provide high availability, and can be active-active (load-sharing) or active-passive (failover)." }
    ]
  },
  {
    title: "Process Management & CPU Scheduling",
    order: 2,
    content: `### CPU Scheduling in Operating Systems

**CPU Scheduling** is the process by which the operating system decides which process in the ready queue gets access to the CPU for execution. 

#### Process State Diagram:
\`\`\`
  [New] 
    |  (Admitted)
    v
[Ready] <--------- (Time Quantum Expired) --------- [Running] ---> [Terminated]
    ^                                                    |
    |------- (I/O or Event Completed) ------ [Waiting] <-| (I/O or Event)
\`\`\`

#### Fundamental CPU Scheduling Algorithms:
1. **First-Come, First-Served (FCFS)**: Non-preemptive. Suffers from the *Convoy Effect* (long process blocks short ones).
2. **Shortest Job First (SJF)**: Gives optimal average wait times. SJF can be preemptive (Shortest Remaining Time First - SRTF).
3. **Round Robin (RR)**: Preemptive. Allocates CPU for a fixed time quantum. Great for time-sharing systems.
4. **Priority Scheduling**: Allocates CPU based on static/dynamic priority levels. Starvation can be solved via **Aging**.`,
    interviewQuestions: [
      { question: "What is CPU scheduling and why is it needed?", answer: "CPU scheduling is the task of choosing which ready process runs on the CPU. It is essential to maximize CPU utilization, throughput, and minimize turnaround, response, and waiting times." },
      { question: "Explain preemptive vs non-preemptive scheduling.", answer: "In non-preemptive scheduling, a process retains control of the CPU until it voluntarily terminates or blocks for I/O. In preemptive scheduling, the OS kernel can interrupt a running process and reallocate the CPU to another process at any time." },
      { question: "What is the Convoy Effect in FCFS scheduling?", answer: "The Convoy Effect occurs when a CPU-bound process takes the CPU first, forcing several short, I/O-bound processes to wait in the ready queue. This severely degrades CPU utilization and average waiting time." },
      { question: "Explain Shortest Job First (SJF) and how it is optimal.", answer: "SJF schedules the process with the shortest next CPU burst time first. It is mathematically optimal because it achieves the lowest average waiting time for a given set of processes." },
      { question: "How does Round Robin scheduling work?", answer: "Round Robin allocates a small unit of CPU time called a time quantum (slice) to each process in turn. If a process doesn't finish within the quantum, it is preempted and put at the back of the ready queue." },
      { question: "How does the choice of Time Quantum affect Round Robin?", answer: "If the time quantum is extremely large, RR behaves exactly like FCFS. If it is extremely small, RR causes massive context-switching overhead, degrading CPU performance." },
      { question: "What is Starvation in scheduling and how is it resolved?", answer: "Starvation occurs when low-priority processes wait indefinitely because high-priority processes keep arriving. It is resolved using Aging, which gradually increases the priority of processes waiting in the ready queue." },
      { question: "What is the difference between turnaround time and waiting time?", answer: "Turnaround Time is the total time elapsed from process submission to its completion. Waiting Time is the total duration a process spends waiting in the ready queue." },
      { question: "What is a Multilevel Queue scheduling?", answer: "Multilevel Queue scheduling partitions the ready queue into separate queues (e.g., interactive, batch) based on process properties. Each queue has its own scheduling algorithm, and there is scheduling between the queues." },
      { question: "Explain Multilevel Feedback Queue (MLFQ) scheduling.", answer: "MLFQ is a dynamic variant of Multilevel Queue where processes can move between queues. It degrades processes that use too much CPU time and promotes processes that wait too long, preventing starvation." },
      { question: "What are CPU-bound and I/O-bound processes?", answer: "A CPU-bound process spends most of its time doing computations. An I/O-bound process spends most of its time waiting for I/O requests to complete, using the CPU only briefly." },
      { question: "What is a Dispatcher?", answer: "The dispatcher is the OS module that gives control of the CPU to the process selected by the short-term scheduler. It handles context switches, mode switches, and jumps to the proper location in the program." },
      { question: "What is CPU Utilization?", answer: "CPU utilization is the percentage of time that the CPU is busy executing user or kernel tasks. In general, OS designs aim to keep CPU utilization as close to 100% as possible." },
      { question: "Explain the term 'Throughput'.", answer: "Throughput is the number of processes completed per unit of time. High throughput indicates a highly productive scheduling algorithm." },
      { question: "Explain Response Time in scheduling.", answer: "Response Time is the time elapsed from process submission to the first response or execution output. It is crucial in interactive systems." },
      { question: "What is Thread Scheduling?", answer: "Thread scheduling is the allocation of CPU time to active threads. In systems with user-level threads, the user library schedules them. In kernel-level thread systems, the OS kernel directly schedules threads." },
      { question: "What is Real-Time CPU Scheduling?", answer: "Real-Time scheduling is used in systems with strict timing constraints (deadlines). It includes Rate-Monotonic (static priority based on periods) and Earliest Deadline First (dynamic priority based on deadlines)." },
      { question: "Explain Rate-Monotonic Scheduling (RMS).", answer: "RMS is a static-priority scheduling algorithm for real-time systems. Priorities are assigned inversely proportional to their execution periods; shorter periods get higher priority." },
      { question: "Explain Earliest Deadline First (EDF) scheduling.", answer: "EDF is a dynamic real-time scheduling algorithm. It assigns priorities based on deadlines; the process with the closest deadline gets the highest priority." },
      { question: "What is Symmetric Multiprocessing (SMP) scheduling?", answer: "SMP scheduling allocates CPU processes across multiple processors. Each processor handles its own scheduling or shares a common ready queue, requiring synchronization to avoid dual scheduling." }
    ]
  },
  {
    title: "Memory Management & Virtual Memory",
    order: 3,
    content: `### Memory Management & Virtual Memory

**Memory Management** is the system function that tracks, allocates, and coordinates physical memory (RAM).

#### Paging Model:
\`\`\`
   Logical Address: [Page Number (p) | Offset (d)]
                            |
                            v
                    +---------------+
                    |  Page Table   | ---> Physical Frame Number (f)
                    +---------------+
                            |
                            v
   Physical Address: [Frame Number (f) | Offset (d)]
\`\`\`

#### Key Memory Concepts:
- **Fragmentation**: 
  - *Internal*: Unused space inside an allocated partition (common in Paging).
  - *External*: Dynamic memory space is broken into small, unusable holes (solved by Segment consolidation or Paging).
- **Paging**: Breaks logical memory into fixed-size **pages** and physical memory into **frames**.
- **Virtual Memory**: Allows programs to execute with a virtual address space larger than physical RAM by mapping logical memory to secondary disk storage.
- **Page Replacement**: Algorithms (FIFO, LRU, Optimal) that decide which page to swap out when a Page Fault occurs. Belady's Anomaly exists in FIFO.`,
    interviewQuestions: [
      { question: "Explain the difference between Paging and Segmentation.", answer: "Paging divides logical memory into fixed-size blocks called pages, and physical memory into frames. Segmentation divides memory into variable-sized logical segments based on modules (code, stack, heap). Paging avoids external fragmentation, while Segmentation can suffer from it." },
      { question: "What is a Page Table and where is it stored?", answer: "A page table is a data structure in kernel memory that maps logical page numbers to physical frame numbers. Each process has its own page table, referenced by the Page Table Base Register (PTBR)." },
      { question: "What is the Translation Lookaside Buffer (TLB)?", answer: "The TLB is a high-speed hardware cache located inside the CPU memory management unit (MMU). It stores recent page-to-frame translations, reducing memory lookup overhead." },
      { question: "Explain Page Fault and how the OS handles it.", answer: "A page fault occurs when a process tries to access a page mapped to virtual memory that is not currently loaded in physical RAM. The MMU traps to the OS, which loads the page from disk, updates the page table, and restarts the instruction." },
      { question: "What is Virtual Memory?", answer: "Virtual Memory is a storage allocation scheme that maps logical addresses to physical RAM and secondary disk storage, enabling execution of processes that exceed physical memory limits." },
      { question: "Explain internal and external fragmentation.", answer: "Internal fragmentation occurs when memory partitions are fixed-size, leaving unused bytes inside an allocated memory block. External fragmentation occurs when free memory is divided into tiny non-contiguous blocks, unable to satisfy a large memory request." },
      { question: "What is Belady's Anomaly?", answer: "Belady's Anomaly is a phenomenon where the page fault rate increases as physical memory frames are added. It occurs in FIFO page replacement, but not in stack-based algorithms like LRU." },
      { question: "Explain FIFO, LRU, and Optimal page replacement.", answer: "FIFO replaces the oldest page loaded. LRU replaces the page that has not been used for the longest duration. Optimal replaces the page that will not be used for the longest time in the future (theoretical baseline)." },
      { question: "What is Thrashing and how can it be resolved?", answer: "Thrashing occurs when a system spends more time paging (swapping pages in/out of disk) than executing instructions. It is resolved by reducing the degree of multiprogramming or allocating more RAM." },
      { question: "What is Compaction in memory management?", answer: "Compaction is a technique used to resolve external fragmentation by shifting all active memory segments to one end, consolidating free memory holes into a single large block." },
      { question: "What is the working-set model?", answer: "The working-set model tracks the set of pages actively used by a process during a specific execution window to prevent thrashing by allocating enough frames to cover its working set." },
      { question: "Explain the difference between logical and physical addresses.", answer: "A logical address is generated by the CPU during code execution. A physical address is the actual location in the physical memory chips (RAM), translated by the MMU." },
      { question: "What is a Memory Management Unit (MMU)?", answer: "The MMU is a physical hardware component inside the CPU that translates virtual/logical addresses to physical addresses at runtime." },
      { question: "What is Dynamic Loading?", answer: "Dynamic Loading is a technique where routines are not loaded into memory until they are called, saving physical memory space." },
      { question: "What is Dynamic Linking?", answer: "Dynamic Linking postpones linking shared system libraries until execution time, reducing executable file sizes and memory footprints." },
      { question: "What is the page table size overhead?", answer: "With large address spaces, page tables can consume massive memory. This overhead is resolved using hierarchical paging, hashed page tables, or inverted page tables." },
      { question: "Explain Inverted Page Tables.", answer: "An inverted page table has one entry per physical frame in RAM, containing the virtual page address and process ID, dramatically reducing page table memory footprints." },
      { question: "What is a page fault frequency (PFF) scheme?", answer: "PFF is a mechanism that controls thrashing by adjusting frame allocations dynamically based on measured page fault rates of individual processes." },
      { question: "What is demand paging?", answer: "Demand paging is a virtual memory mechanism where pages are loaded into memory only when they are requested (on-demand) during execution, rather than pre-loading the entire program." },
      { question: "Explain the copy-on-write (COW) technique.", answer: "COW allows parent and child processes to share the same physical memory pages initially after fork(). If either process modifies a page, a physical copy of that page is created." }
    ]
  },
  {
    title: "Deadlocks & Concurrency Control",
    order: 4,
    content: `### Deadlocks & Concurrency Control

A **Deadlock** is a state in which a set of processes are blocked because each process holds a resource and waits for another resource held by some other process in the set.

#### Deadlock Wait-For Graph:
\`\`\`
[Process P1] ---(Requests)---> [Resource R1] ---(Held By)---> [Process P2]
     ^                                                             |
     |----------------------(Requests/Waiting)---------------------|
\`\`\`

#### Four Necessary Conditions for Deadlock (Coffman Conditions):
1. **Mutual Exclusion**: At least one resource must be held in non-shareable mode.
2. **Hold and Wait**: A process must hold resources and wait for others.
3. **No Preemption**: Resources cannot be forcibly taken from a process.
4. **Circular Wait**: A closed chain of processes where each requests a resource held by the next.

#### Deadlock Management:
- **Prevention**: Disallow one of the four necessary conditions.
- **Avoidance**: Check safety state dynamically (e.g., **Banker's Algorithm**).
- **Detection & Recovery**: Allow deadlocks to occur, detect them, and terminate processes or preallocate resources to recover.`,
    interviewQuestions: [
      { question: "What is a Deadlock?", answer: "A deadlock is a situation where a set of processes are permanently blocked because each process holds a resource and waits to acquire another resource held by another process in the same set." },
      { question: "List the four necessary conditions for a deadlock to occur.", answer: "The four Coffman conditions are: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait." },
      { question: "What is the difference between Deadlock Prevention and Deadlock Avoidance?", answer: "Deadlock Prevention prevents deadlocks by designing static policies that guarantee at least one Coffman condition cannot hold. Deadlock Avoidance dynamically checks resource requests and executes them only if the system remains in a safe state (e.g., Banker's Algorithm)." },
      { question: "How does the Banker's Algorithm work?", answer: "The Banker's Algorithm simulates resource allocation for request processes. It checks if allocating the resource leads to a safe state where all processes can eventually complete. If not, the request is delayed." },
      { question: "What is a Safe State in deadlock avoidance?", answer: "A state is safe if there exists a safe sequence of processes such that all processes can run to completion by executing in that sequence, even if they request all their maximum resources." },
      { question: "What is the difference between Starvation and Deadlock?", answer: "A deadlock is a mutual block of processes that cannot resolve without external intervention. Starvation is a process waiting indefinitely for a resource due to scheduling biases, though the system itself is running." },
      { question: "What is a Resource Allocation Graph (RAG)?", answer: "A RAG is a directed graph depicting resource allocations and requests. Vertices represent processes and resources. Directed edges show allocations (Resource -> Process) and requests (Process -> Resource)." },
      { question: "Does a cycle in a Resource Allocation Graph always indicate a deadlock?", answer: "If resources have single instances, a cycle implies a deadlock. If resources have multiple instances, a cycle is a necessary condition but does not guarantee a deadlock." },
      { question: "Explain the difference between Mutex and Semaphore.", answer: "A Mutex is a locking mechanism used to synchronize access to a resource, owned by the thread that locks it. A Semaphore is a signaling mechanism using a counter to control access to multiple resource instances." },
      { question: "Explain Binary Semaphore vs Counting Semaphore.", answer: "A Binary Semaphore can have values only 0 or 1. A Counting Semaphore can have arbitrary non-negative integer values, representing available resource pools." },
      { question: "What is Critical Section and what are the requirements for a solution?", answer: "The critical section is a code block where shared resources are accessed. A valid solution must satisfy: Mutual Exclusion, Progress (no unrelated process blocks entry), and Bounded Waiting (no indefinite delay)." },
      { question: "What is a Race Condition?", answer: "A race condition is an undesirable situation where the system output depends on the execution sequence or timing of concurrent threads, resulting in inconsistent data." },
      { question: "Explain the Producer-Consumer problem.", answer: "The Producer-Consumer is a classic multi-process synchronization problem. Producers place data in a shared buffer and consumers retrieve it, requiring synchronization to avoid buffer overflow/underflow." },
      { question: "Explain the Dining Philosophers problem.", answer: "The Dining Philosophers problem models resource allocation challenges among concurrent processes, illustrating deadlocks and starvation when sharing forks (resources)." },
      { question: "Explain the Readers-Writers problem.", answer: "The Readers-Writers problem focuses on synchronizing access to a shared resource. Multiple readers can access concurrently, but writers require exclusive access." },
      { question: "What are spinlocks?", answer: "A spinlock is a lock where a thread loops continuously ('spins') waiting for the lock to become free, avoiding context switches but consuming CPU cycles." },
      { question: "What is livelock?", answer: "A livelock is a situation where two or more processes continuously change their states in response to each other without performing any productive work, remaining active but stuck." },
      { question: "How does the OS recover from a detected deadlock?", answer: "Recovery methods include terminating one or more deadlocked processes, aborting processes one by one until the cycle breaks, or preempting resources from processes." },
      { question: "What is a monitor in concurrency?", answer: "A monitor is an object-oriented high-level synchronization construct that encapsulates shared variables and procedures, guaranteeing only one thread executes inside the monitor at any time." },
      { question: "What is a barrier in concurrent programming?", answer: "A barrier is a synchronization point where a group of threads must wait until all threads in the group have arrived before proceeding." }
    ]
  }
];

const dbmsLessons = [
  {
    title: "Introduction to DBMS & ER Diagrams",
    order: 1,
    content: `### Database Management Systems & ER Models

A **Database Management System (DBMS)** is software designed to store, retrieve, define, and manage data in databases.

#### ER Model Components:
- **Entity**: An object or concept that exists independently (represented as a Rectangle).
- **Attribute**: Properties of an entity (represented as an Ellipse).
- **Relationship**: Association among entities (represented as a Diamond).

#### Attribute Types:
- **Key Attribute**: Uniquely identifies an entity (Underlined).
- **Composite Attribute**: Can be subdivided into smaller parts (e.g., Name -> First, Last).
- **Multi-valued Attribute**: Can have multiple values (represented as Double Ellipse, e.g., Phone).
- **Derived Attribute**: Calculated from other attributes (dashed Ellipse, e.g., Age from DOB).`,
    interviewQuestions: [
      { question: "What is a DBMS and what are its advantages over file systems?", answer: "A DBMS is software for database management. Advantages over file systems include: elimination of data redundancy, data consistency, easier data access, security controls, transaction management, and crash recovery." },
      { question: "Explain the three-schema architecture.", answer: "The three-schema architecture defines database views at three levels: Internal Level (physical storage structure), Conceptual Level (database design and relationships), and External Level (individual user views)." },
      { question: "What is logical and physical data independence?", answer: "Logical data independence is the ability to modify the conceptual schema without changing the external schema. Physical data independence is the ability to modify the physical schema (storage structure) without changing the conceptual schema." },
      { question: "What is an Entity Relationship (ER) Model?", answer: "An ER Model is a conceptual database design tool representing real-world entities, their properties (attributes), and the relationships/associations between those entities." },
      { question: "Explain different types of attributes in an ER diagram.", answer: "Attributes include: Key (unique identifier), Simple (indivisible), Composite (divisible), Multi-valued (multiple values), and Derived (calculated from other attributes)." },
      { question: "What is a Weak Entity Set and how is it represented?", answer: "A weak entity set is an entity set that does not possess a primary key and depends on an identifying relationship with a strong owner entity set. Represented as a double rectangle." },
      { question: "What is cardinality ratio in relationships?", answer: "Cardinality ratio defines the number of entity instances that can participate in a relationship: One-to-One (1:1), One-to-Many (1:N), Many-to-One (N:1), or Many-to-Many (N:M)." },
      { question: "Explain the difference between Total and Partial participation.", answer: "Total participation means every entity instance must participate in the relationship (represented as double lines). Partial participation means only some entity instances participate (single line)." },
      { question: "What is a Data Dictionary?", answer: "A data dictionary (metadata repository) stores information about the database itself, including tables, columns, indexes, constraints, views, and access permissions." },
      { question: "What is Data Redundancy and what are its problems?", answer: "Data Redundancy is the duplication of data across multiple database files, leading to storage waste, update anomalies, and data inconsistency." },
      { question: "What is an anomaly in databases? Name the three types.", answer: "An anomaly is an inconsistency resulting from database operations. The three types are: Insertion Anomaly, Deletion Anomaly, and Update Anomaly." },
      { question: "Explain the difference between DDL, DML, and DCL commands.", answer: "DDL (Data Definition) defines database structures (CREATE, ALTER, DROP). DML (Data Manipulation) handles data records (INSERT, UPDATE, SELECT, DELETE). DCL (Data Control) handles authorization (GRANT, REVOKE)." },
      { question: "What is physical storage indexing?", answer: "Physical storage indexing is a method to speed up data retrieval by creating pointers to data records based on index key values, bypassing full table scans." },
      { question: "What are the components of a database engine?", answer: "Components include: Query Processor (parser, optimizer, compiler), Storage Manager (buffer manager, transaction manager), and Data files." },
      { question: "What is a Relational Database Management System (RDBMS)?", answer: "An RDBMS is a DBMS based on the relational model introduced by E.F. Codd, where data is organized in 2-dimensional tables (relations) with keys." },
      { question: "What are Codd's Rules? Name a few.", answer: "Codd's rules are 12 rules that define a true relational database system. Examples: Rule 1 (Information Rule: all data in tables), Rule 2 (Guaranteed Access: primary keys + column names)." },
      { question: "What is the difference between a database schema and a database state?", answer: "A database schema is the static, logical structure defined during design. A database state is the actual data populated in the database at a specific point in time." },
      { question: "What is metadata?", answer: "Metadata is 'data about data', describing database structural definitions, constraints, file directories, tables, and attributes." },
      { question: "What is a self-referential relationship?", answer: "A self-referential (unary) relationship occurs when an entity set has a relationship with itself (e.g., an Employee manages other Employees)." },
      { question: "What is generalization and specialization in ER models?", answer: "Generalization is a bottom-up process of combining low-level entity sets sharing properties into a high-level entity. Specialization is a top-down process of splitting an entity into sub-entities." }
    ]
  },
  {
    title: "Relational Model & Key Constraints",
    order: 2,
    content: `### Relational Database Model & Key Constraints

In the **Relational Model**, data is organized into tables (relations) composed of rows (tuples) and columns (attributes).

#### Key Hierarchy Diagram:
\`\`\`
       [Super Key]
            |
            v
     [Candidate Key]
      /           \\
     v             v
[Primary Key]  [Alternate Key]
\`\`\`

#### Key Concept Definitions:
- **Super Key**: Any set of attributes that uniquely identifies a row.
- **Candidate Key**: A minimal Super Key (no subset is a super key).
- **Primary Key**: The Candidate Key chosen by the database designer to uniquely identify records (cannot be NULL).
- **Foreign Key**: An attribute that references the Primary Key of another table, enforcing referential integrity.`,
    interviewQuestions: [
      { question: "What is a Super Key?", answer: "A super key is a set of one or more attributes whose values collectively uniquely identify a tuple (row) within a relation." },
      { question: "What is a Candidate Key?", answer: "A candidate key is a minimal super key, meaning it has no proper subset that can also act as a super key to identify tuples." },
      { question: "What is a Primary Key?", answer: "A primary key is the candidate key selected by the designer to uniquely identify rows in a table. It cannot contain NULL values and must be unique." },
      { question: "What is an Alternate Key?", answer: "An alternate key is a candidate key that was not chosen as the primary key of the table." },
      { question: "What is a Foreign Key and what is its purpose?", answer: "A foreign key is an attribute or set of attributes in a table that references the primary key of another table, establishing a link and enforcing referential integrity constraints." },
      { question: "What is Entity Integrity Constraint?", answer: "Entity integrity constraint states that no primary key attribute can contain NULL values, ensuring every row can be uniquely identified." },
      { question: "What is Referential Integrity Constraint?", answer: "Referential integrity constraint states that any value of a foreign key attribute must match an existing primary key value in the referenced table, or be NULL." },
      { question: "Explain ON DELETE CASCADE.", answer: "ON DELETE CASCADE is a referential action where deleting a row in the parent table automatically deletes all associated referencing rows in the child table." },
      { question: "Explain ON DELETE SET NULL.", answer: "ON DELETE SET NULL is an action where deleting a row in the parent table sets the referencing foreign key fields in the child table to NULL." },
      { question: "What is a Composite Key?", answer: "A composite key is a primary or candidate key that consists of two or more attributes rather than a single attribute." },
      { question: "What is a Surrogate Key?", answer: "A surrogate key is a unique system-generated identifier (such as an auto-incrementing integer) added to a table, carrying no real-world business meaning." },
      { question: "What is the difference between primary key and unique key?", answer: "A primary key uniquely identifies rows and cannot contain NULLs. A unique key also enforces uniqueness but can accept a single NULL value (in SQL standards)." },
      { question: "Explain Domain Constraints.", answer: "Domain constraints specify the set of permissible values for an attribute, defining data types, range bounds, and formatting rules." },
      { question: "What is a relation schema and relation instance?", answer: "A relation schema is the logical definition of a table (name and columns). A relation instance is the set of data rows populated in that table at any given time." },
      { question: "What is relational algebra?", answer: "Relational algebra is a formal query language consisting of operations that take relations as input and produce new relations as output." },
      { question: "Explain Selection (σ) and Projection (π) operators.", answer: "Selection (σ) selects a subset of rows satisfying a condition. Projection (π) selects specific columns, removing duplicates." },
      { question: "What is the Cartesian Product (x) in relational algebra?", answer: "The Cartesian Product combines all rows of the first relation with all rows of the second relation, resulting in a table with size N x M." },
      { question: "Explain Natural Join (⋈).", answer: "Natural Join combines rows from two relations that have equal values on all common attributes, automatically projecting out duplicate join columns." },
      { question: "Explain Left Outer Join, Right Outer Join, and Full Outer Join.", answer: "Left Join returns all rows from the left table and matched rows from the right (padding misses with NULLs). Right Join does the opposite. Full Join returns all rows from both tables, padded with NULLs where matches fail." },
      { question: "What is a view and is it physical?", answer: "A view is a virtual table defined by a SQL query. It does not store physical data; its rows are computed dynamically at query execution time." }
    ]
  },
  {
    title: "Normalization (1NF, 2NF, 3NF, BCNF)",
    order: 3,
    content: `### Database Normalization

**Normalization** is a systematic database design process that organizes tables to minimize data redundancy and prevent update, insertion, and deletion anomalies.

#### Normal Forms Hierarchy:
\`\`\`
[1NF: Atomic values only]
      |
      v
[2NF: No Partial Dependencies (depends on whole primary key)]
      |
      v
[3NF: No Transitive Dependencies (non-key cannot determine non-key)]
      |
      v
[BCNF: For every dependency X -> Y, X must be a Super Key]
\`\`\`

#### Key Definitions:
- **Functional Dependency (FD)**: A constraint where attribute X uniquely determines attribute Y (written as X -> Y).
- **Partial Dependency**: A non-prime attribute depends on a *subset* of a candidate primary key.
- **Transitive Dependency**: A non-prime attribute determines another non-prime attribute.`,
    interviewQuestions: [
      { question: "What is Normalization and why is it needed?", answer: "Normalization is the process of structuring relational database tables to reduce redundancy and eliminate update anomalies. It divides tables to ensure dependencies make logical sense." },
      { question: "Explain First Normal Form (1NF).", answer: "1NF requires that all attribute values in a relation are atomic (indivisible) and that there are no repeating groups of columns." },
      { question: "Explain Second Normal Form (2NF).", answer: "A relation is in 2NF if it is in 1NF and every non-prime attribute is fully functionally dependent on the entire primary key, eliminating partial dependencies." },
      { question: "Explain Third Normal Form (3NF).", answer: "A relation is in 3NF if it is in 2NF and there are no transitive dependencies (no non-prime attribute determines another non-prime attribute)." },
      { question: "What is Boyce-Codd Normal Form (BCNF)?", answer: "BCNF is a stricter version of 3NF. A relation is in BCNF if, for every functional dependency X -> Y, X is a super key." },
      { question: "Explain the difference between 3NF and BCNF.", answer: "BCNF is stricter than 3NF. If X -> Y is an FD where Y is a prime attribute and X is not a super key, the relation can be in 3NF but violates BCNF." },
      { question: "What is a Functional Dependency (FD)?", answer: "A Functional Dependency X -> Y is a constraint between two sets of attributes in a relation, stating that if two rows agree on X, they must agree on Y." },
      { question: "What is a trivial functional dependency?", answer: "An FD X -> Y is trivial if Y is a subset of X (Y ⊆ X)." },
      { question: "What is a prime and non-prime attribute?", answer: "A prime attribute is any attribute that is a member of at least one candidate key. A non-prime attribute is an attribute that does not participate in any candidate key." },
      { question: "What is a partial dependency?", answer: "A partial dependency occurs when a non-prime attribute is functionally dependent on only a part of a composite primary key, violating 2NF." },
      { question: "What is a transitive dependency?", answer: "A transitive dependency occurs when a non-prime attribute Y is determined by a prime key X, and Y in turn determines another non-prime attribute Z (X -> Y and Y -> Z)." },
      { question: "What is lossless-join decomposition?", answer: "Decomposition is lossless if joining the decomposed tables back together yields the exact original table without generating spurious rows." },
      { question: "What is dependency preservation?", answer: "Dependency preservation ensures that all functional dependencies defined on the original table can be checked using the decomposed tables without executing joins." },
      { question: "What is Fourth Normal Form (4NF)?", answer: "4NF is in BCNF and contains no multi-valued dependencies (where one key independently determines multiple sets of values)." },
      { question: "What is Fifth Normal Form (5NF)?", answer: "5NF (Project-Join Normal Form) deals with cases where tables cannot be decomposed further without losing information upon reconstruction." },
      { question: "What is Denormalization and when is it used?", answer: "Denormalization is the deliberate introduction of redundancy in a normalized database to optimize query performance and reduce expensive join operations." },
      { question: "Explain Armstrong's Axioms.", answer: "Armstrong's Axioms are rules used to infer functional dependencies: Reflexivity (if Y ⊆ X, then X -> Y), Augmentation (if X -> Y, then XZ -> YZ), and Transitivity (if X -> Y and Y -> Z, then X -> Z)." },
      { question: "What is the closure of an attribute set?", answer: "The closure of an attribute set X (written as X+) is the set of all attributes that can be functionally determined by X under a given set of FDs." },
      { question: "What is canonical cover?", answer: "A canonical cover is a minimal set of functional dependencies equivalent to the original set, containing no redundant dependencies or extraneous attributes." },
      { question: "What is a multi-valued dependency?", answer: "A multi-valued dependency X ->> Y exists when the presence of a row implies the presence of other rows, representing an independent 1-to-many relationship." }
    ]
  },
  {
    title: "Transactions & Concurrency Control",
    order: 4,
    content: `### Transactions & Concurrency Control in DBMS

A **Transaction** is a logical unit of database processing that includes a sequence of database operations.

#### Transaction State Transition Diagram:
\`\`\`
   [Active] ---> [Partially Committed] ---> [Committed]
      |                  |
      v                  v
   [Failed] --------> [Aborted]
\`\`\`

#### ACID Properties:
- **Atomicity**: Either all transaction operations execute, or none do (managed by Transaction Log/Recovery).
- **Consistency**: The database moves from one valid state to another valid state.
- **Isolation**: Concurrent transactions execute without interfering (managed by Lock protocols).
- **Durability**: Committed changes are permanent, surviving system crashes (managed by Checkpoints/Logs).

#### Concurrency Problems:
1. **Dirty Read (Write-Read Conflict)**: Reading uncommitted changes.
2. **Unrepeatable Read (Read-Write Conflict)**: Rereading data finds modifications by another transaction.
3. **Lost Update (Write-Write Conflict)**: Overwriting another transaction's updates.`,
    interviewQuestions: [
      { question: "What is a database transaction?", answer: "A transaction is a logical unit of database operations that must be executed completely or not at all, transitioning the database from one consistent state to another." },
      { question: "Explain ACID properties.", answer: "ACID stands for: Atomicity (all-or-nothing execution), Consistency (maintains integrity rules), Isolation (independent concurrent execution), and Durability (persistence of committed changes)." },
      { question: "What are the states of a transaction?", answer: "Transaction states are: Active (executing), Partially Committed (final statement run), Committed (saved to disk), Failed (error discovered), and Aborted (rolled back)." },
      { question: "What is a Dirty Read?", answer: "A dirty read occurs when a transaction reads data that has been modified by another concurrent transaction but not yet committed. If that transaction rolls back, the read data is invalid." },
      { question: "What is an Unrepeatable Read?", answer: "An unrepeatable read occurs when a transaction reads the same row twice but gets different values because another transaction modified and committed the row in between." },
      { question: "What is a Phantom Read?", answer: "A phantom read occurs when a transaction executes a query returning a set of rows, and another transaction inserts or deletes rows in the range, causing the first transaction to get a different set of rows upon re-execution." },
      { question: "What is Conflict Serializability?", answer: "A schedule is conflict serializable if it is conflict equivalent to a serial schedule (having the same transaction execution order), meaning we can swap non-conflicting actions to transform it into a serial schedule." },
      { question: "Explain the Two-Phase Locking (2PL) Protocol.", answer: "2PL is a concurrency control protocol consisting of two phases: the Growing Phase (locks are acquired, none released) and the Shrinking Phase (locks are released, none acquired). It guarantees conflict serializability." },
      { question: "What is the difference between Strict 2PL and Rigorous 2PL?", answer: "Strict 2PL requires that all exclusive (write) locks be held until the transaction commits or aborts. Rigorous 2PL requires that all locks (shared and exclusive) be held until the transaction finishes." },
      { question: "What is a database deadlock in transactions?", answer: "A deadlock occurs when two or more transactions are in a circular wait state, each holding a lock that the other needs to proceed." },
      { question: "Explain the Wait-Die and Wound-Wait deadlock prevention schemes.", answer: "Both use timestamps. In Wait-Die: an older transaction waits for a younger one, but a younger transaction dies (rolls back) when requesting a lock held by an older one. In Wound-Wait: an older transaction wounds (preempts/rolls back) a younger one, while a younger transaction waits." },
      { question: "What is the purpose of Log-Based Recovery?", answer: "Log-based recovery uses a transaction log containing write histories to reconstruct consistent database states after a crash via UNDO (reversing uncommitted transactions) and REDO (re-executing committed transactions) operations." },
      { question: "What is a Checkpoint in database recovery?", answer: "A checkpoint is a recovery mechanism where the DBMS flushes all dirty memory buffers to disk. During recovery, transactions committed before the checkpoint do not need to be REDONE, speeding up restart times." },
      { question: "What is a Shadow Paging recovery scheme?", answer: "Shadow paging is an alternative recovery mechanism where the database maintains two page tables: a current page table and a shadow page table. Updates are written to new pages, and recovery involves discarding the current page table." },
      { question: "Explain Shared Lock (S) and Exclusive Lock (X).", answer: "A Shared Lock (S) allows a transaction to read a record, permitting multiple concurrent readers. An Exclusive Lock (X) allows a transaction to write/update a record, blocking all other readers and writers." },
      { question: "What is Lock Granularity?", answer: "Lock granularity refers to the size of database objects that can be locked (e.g., Database, Table, Page, Row). Finer granularity (Row-level) increases concurrency but increases lock management overhead." },
      { question: "What is Intent Locking?", answer: "Intent locks (IS, IX) are lock modes used in multiple-granularity locking protocols. They indicate that a transaction plans to acquire a lock at a lower level of the hierarchy, preventing conflicts at higher levels." },
      { question: "What is the Write-Ahead Logging (WAL) protocol?", answer: "WAL protocol states that log records representing database updates must be written to stable storage (disk) before the actual data pages are modified on disk." },
      { question: "What is transaction starvation?", answer: "Starvation occurs when a transaction waits indefinitely to acquire a lock because other arriving transactions are continuously granted locks ahead of it." },
      { question: "Explain Timestamp-Ordering Protocol.", answer: "Timestamp ordering is a lock-free concurrency control mechanism that schedules transaction executions based on unique monotonically increasing timestamps assigned at transaction start." }
    ]
  }
];

const cnLessons = [
  {
    title: "Computer Networks & OSI 7-Layer Model",
    order: 1,
    content: `### Computer Networks & OSI Model

A **Computer Network** is a group of interconnected computers that can communicate and share resources.

#### OSI 7-Layer Model:
\`\`\`
+-----------------------+---------------------------------------+
|        Layer          |               Function                |
+-----------------------+---------------------------------------+
| 7. Application Layer  | User interface, network services      |
| 6. Presentation Layer | Data translation, encryption, compression |
| 5. Session Layer      | Manages sessions, dialog control      |
| 4. Transport Layer    | End-to-end reliability, segmentation  |
| 3. Network Layer      | Routing, IP addressing, packet delivery|
| 2. Data Link Layer    | Framing, MAC addressing, hop delivery |
| 1. Physical Layer     | Bits transmission over physical media |
+-----------------------+---------------------------------------+
\`\`\`

#### Key Hardware Devices:
- **Hub**: Physical layer broadcast device; broadcasts packets to all ports.
- **Switch**: Data Link layer device; inspects MAC addresses to route frames.
- **Router**: Network layer device; routes packets between networks using IP addresses.`,
    interviewQuestions: [
      { question: "What is the OSI Model and name its 7 layers in order?", answer: "The Open Systems Interconnection (OSI) model is a conceptual framework that standardizes network communications. The 7 layers are: Physical, Data Link, Network, Transport, Session, Presentation, and Application." },
      { question: "Explain the difference between the OSI Model and the TCP/IP Model.", answer: "OSI is a generic 7-layer theoretical reference model. TCP/IP is a practical 4-layer (or 5-layer) implementation model used in the real-world internet, combining Session/Presentation into the Application layer." },
      { question: "What is the difference between a Hub, a Switch, and a Router?", answer: "A Hub operates at the Physical layer and broadcasts incoming data to all ports. A Switch operates at the Data Link layer and forwards frames selectively using MAC addresses. A Router operates at the Network layer and routes packets between networks using IP addresses." },
      { question: "Explain the difference between MAC address and IP address.", answer: "A MAC address is a physical, 48-bit hardware address assigned to a network interface card (NIC) at the factory. An IP address is a logical, 32-bit (IPv4) or 128-bit (IPv6) address assigned dynamically to identify host networks on the internet." },
      { question: "What is ARP (Address Resolution Protocol) and how does it work?", answer: "ARP resolves a known IP address to its corresponding physical MAC address. A host broadcasts an ARP request containing the target IP, and the target machine replies with its MAC address." },
      { question: "Explain the difference between half-duplex and full-duplex communication.", answer: "In half-duplex, data can be transmitted in both directions, but not simultaneously (e.g., walkie-talkie). In full-duplex, data can be transmitted in both directions at the same time (e.g., telephone)." },
      { question: "What is encapsulation and decapsulation?", answer: "Encapsulation is the process of adding protocol control headers/trailers to data as it moves down the protocol stack. Decapsulation is the reverse process of stripping headers as data moves up the receiver's stack." },
      { question: "What are the common transmission media types?", answer: "Media includes: Guided (Coaxial cable, Twisted pair copper wire, Fiber-optic cable) and Unguided (Radio waves, Microwaves, Infrared satellite transmission)." },
      { question: "Explain the difference between unicast, multicast, and broadcast.", answer: "Unicast sends data from one sender to one receiver. Multicast sends data from one sender to a specific group of receivers. Broadcast sends data from one sender to all hosts on the local network." },
      { question: "What is a Gateway?", answer: "A Gateway is a network node that joins two networks using different base protocols, translating data formats and managing security entry/exit boundaries." },
      { question: "What is bandwidth and throughput?", answer: "Bandwidth is the maximum theoretical capacity of a channel to carry data per second. Throughput is the actual measure of data successfully transmitted over that channel in practice." },
      { question: "What is network latency and round-trip time (RTT)?", answer: "Latency is the total delay for data to travel from source to destination. RTT is the time it takes for a data packet to travel to the destination and return a confirmation reply." },
      { question: "What is a collision domain?", answer: "A collision domain is a network segment where simultaneous packet transmissions can collide. Switches partition collision domains on every port, whereas hubs share a single collision domain." },
      { question: "What is a broadcast domain?", answer: "A broadcast domain is a logical division of a computer network where all nodes can reach each other by broadcast. Routers block broadcasts, partitioning broadcast domains." },
      { question: "Explain the function of the Physical Layer.", answer: "The Physical layer handles the hardware mechanics of transmitting raw unstructured bitstreams over physical mediums, defining voltages, cable layouts, and pin specifications." },
      { question: "Explain the function of the Presentation Layer.", answer: "The Presentation layer handles data formatting, syntax translation, compression, encryption, and decryption, ensuring data is readable by the Application layer." },
      { question: "Explain the function of the Session Layer.", answer: "The Session layer establishes, manages, maintains, synchronizes, and terminates communication sessions/dialogs between applications." },
      { question: "What is a topology? Name some types.", answer: "A network topology is the physical/logical arrangement of nodes. Types include: Bus, Star, Ring, Mesh, Tree, and Hybrid." },
      { question: "Explain the mesh topology and its cabling formula.", answer: "In a mesh topology, every node is connected to every other node. For N nodes, the total number of physical duplex links needed is N(N-1)/2." },
      { question: "What is VPN (Virtual Private Network)?", answer: "A VPN extends a private network across a public network (internet) using encryption protocols, enabling secure data exchange as if devices were directly connected to the private network." }
    ]
  },
  {
    title: "Data Link Layer & Sliding Window Protocols",
    order: 2,
    content: `### Data Link Layer & Sliding Window Protocols

The **Data Link Layer (DLL)** is responsible for node-to-node frame delivery, error control, and flow control.

#### Protocol Efficiency Comparison:
- **Stop-and-Wait**: Sender transmits one frame and waits for an acknowledgment (ACK) before sending the next. Low efficiency.
- **Go-Back-N (GBN)**: Sender can transmit multiple frames (up to window size N) without waiting for ACKs. If a frame is lost, it retransmits *all* frames starting from the lost one.
- **Selective Repeat (SR)**: Sender can transmit multiple frames. If a frame is lost, *only* the lost frame is retransmitted. Requires buffer memory on both sides.

#### Key DLL Functions:
- **Framing**: Packaging network packets into DLL frames with headers/trailers.
- **Error Control**: Detecting and correcting bit errors (using parity, checksum, or **CRC**).
- **Flow Control**: Throttling sender speeds to prevent overwhelming slow receivers.`,
    interviewQuestions: [
      { question: "What are the primary functions of the Data Link Layer?", answer: "Functions include: Framing, Physical addressing (MAC), Flow control, Error control, and Media Access Control (MAC sublayer)." },
      { question: "Explain the difference between flow control and error control.", answer: "Flow control coordinates sender speeds to prevent overwhelming a slow receiver. Error control detects and corrects transmission bit errors using checksums, parity, or CRC." },
      { question: "How does the Stop-and-Wait protocol work?", answer: "The sender transmits a single frame, starts a timer, and stops. It waits for an ACK from the receiver. If the ACK arrives before timer expiration, it sends the next frame. Otherwise, it retransmits." },
      { question: "What is the sliding window concept?", answer: "A sliding window is a flow control mechanism where the sender can transmit multiple frames up to a defined window size without waiting for immediate ACKs, improving channel utilization." },
      { question: "Explain the difference between Go-Back-N and Selective Repeat protocols.", answer: "In Go-Back-N, if a frame is lost, the sender retransmits all frames starting from the lost frame. In Selective Repeat, the receiver buffers out-of-order frames, and the sender retransmits only the single lost frame." },
      { question: "What is Cyclic Redundancy Check (CRC)?", answer: "CRC is a polynomial-division-based error detection method. The sender divides data bits by a generator polynomial, appends the remainder (checksum) to the frame, and the receiver performs the same division to check for remainders." },
      { question: "What is CSMA/CD and where is it used?", answer: "CSMA/CD (Carrier Sense Multiple Access with Collision Detection) is an access control protocol for shared mediums (like Ethernet). Nodes listen before transmitting; if a collision occurs, they stop, send a jam signal, and retry after a random backoff time." },
      { question: "What is CSMA/CA and how does it differ from CSMA/CD?", answer: "CSMA/CA (Collision Avoidance) is used in wireless networks (Wi-Fi) where collision detection is difficult. It uses handshakes (RTS/CTS) and reservation slots to actively avoid collisions." },
      { question: "Explain framing and name common framing methods.", answer: "Framing is the grouping of physical bitstreams into logical packets. Methods include: Character Count, Character/Byte Stuffing, and Bit Stuffing." },
      { question: "What is Byte Stuffing and Bit Stuffing?", answer: "Byte stuffing inserts a special escape byte before flags appearing in data. Bit stuffing inserts a '0' bit after five consecutive '1' bits to prevent flags from appearing in payload data." },
      { question: "What is ALOHA and explain its types.", answer: "ALOHA is a random access protocol. Pure ALOHA lets nodes transmit immediately, causing collisions (efficiency ~18.4%). Slotted ALOHA divides time into intervals, permitting transmissions only at slot starts (efficiency ~36.8%)." },
      { question: "What is a piggback ACK?", answer: "Piggybacking is the technique of temporarily delaying an ACK so it can be sent inside an outgoing data frame travelling in the opposite direction, saving bandwidth." },
      { question: "Explain Hamming Code.", answer: "Hamming Code is an error-correcting code that inserts redundant parity bits at specific positions (powers of 2) in a data block, enabling detection and correction of single-bit errors." },
      { question: "What is the maximum efficiency of Stop-and-Wait?", answer: "Efficiency is given by 1 / (1 + 2a), where a = Propagation Delay / Transmission Delay. If propagation delay is high, efficiency is very low." },
      { question: "What is the window size constraint in Go-Back-N?", answer: "For GBN using m sequence bits, the maximum sender window size is (2^m) - 1, and the receiver window size is always 1." },
      { question: "What is the window size constraint in Selective Repeat?", answer: "For SR using m sequence bits, the maximum sender and receiver window sizes are 2^(m-1), ensuring sender and receiver windows do not overlap during timeouts." },
      { question: "Explain the Preamble in an Ethernet Frame.", answer: "The Preamble is a 7-byte pattern of alternating 1s and 0s at the start of an Ethernet frame, used to synchronize receiver hardware clocks." },
      { question: "What is a Start Frame Delimiter (SFD)?", answer: "The SFD is a 1-byte field (value 10101011) directly following the Ethernet preamble, signaling the start of actual addressing data." },
      { question: "Explain the Hidden Terminal Problem.", answer: "The hidden terminal problem occurs in wireless networks when a node can communicate with an access point but cannot see another node communicating with the same access point, causing collisions." },
      { question: "How does CSMA/CA solve the Hidden Terminal problem?", answer: "CSMA/CA solves it using RTS (Request to Send) and CTS (Clear to Send) handshake frames to reserve the wireless channel before actual data transmission." }
    ]
  },
  {
    title: "Network Layer, Subnetting & Routing",
    order: 3,
    content: `### Network Layer & Routing

The **Network Layer** handles host-to-host packet delivery, logical addressing (IP), and routing.

#### IP Address Format:
- **IPv4**: 32-bit address, represented in dotted-decimal format (e.g., \`192.168.1.1\`).
- **IPv6**: 128-bit address, represented in hexadecimal format (e.g., \`2001:db8::ff00:42:8329\`).

#### CIDR & Subnetting:
Classless Inter-Domain Routing (CIDR) uses a slash notation to denote subnet masks (e.g., \`192.168.1.0/24\`). The \`/24\` indicates that the first 24 bits are network bits, and the remaining 8 bits are host bits (yielding $2^8 - 2 = 254$ assignable host addresses).

#### Routing Protocols:
1. **Intra-Domain (IGP)**:
   - *Distance Vector*: Uses hop counts (e.g., **RIP**). Suffers from the *Count-to-Infinity* problem.
   - *Link State*: Uses global topology maps and Dijkstra's algorithm (e.g., **OSPF**).
2. **Inter-Domain (EGP)**: Path-vector routing (e.g., **BGP**).`,
    interviewQuestions: [
      { question: "What are the primary functions of the Network Layer?", answer: "Functions include: Routing packets from source to destination, Logical addressing (IP), Packet fragmentation/reassembly, and Congestion control." },
      { question: "Explain the difference between IPv4 and IPv6.", answer: "IPv4 is a 32-bit address system written in dotted-decimal format. IPv6 is a 128-bit address system written in hexadecimal format, providing a vastly larger address space, built-in security (IPsec), and autoconfiguration." },
      { question: "What is Classless Inter-Domain Routing (CIDR)?", answer: "CIDR is an IP addressing scheme that replaces traditional Classful (Class A, B, C) networks. It uses variable-length subnet masking (VLSM) and a slash notation (e.g., /24) to allocate IP addresses efficiently." },
      { question: "What is Subnetting and why is it used?", answer: "Subnetting is the logical division of a large single network into smaller sub-networks (subnets). It improves routing efficiency, enhances security, and reduces broadcast traffic." },
      { question: "Explain Distance Vector Routing and the Count-to-Infinity problem.", answer: "Distance Vector routing (like RIP) shares routing tables with direct neighbors periodically, measuring costs in hops. The Count-to-Infinity problem is a routing loop that occurs when a link fails and neighbors update each other with outdated routes, incrementing hop counts infinitely. Solved via split horizon and route poisoning." },
      { question: "Explain Link State Routing.", answer: "Link State routing (like OSPF) requires every router to broadcast its local link states to all routers in the domain. Routers build a complete topology map and run Dijkstra's algorithm to calculate shortest paths." },
      { question: "What is OSPF (Open Shortest Path First)?", answer: "OSPF is an IGP link-state routing protocol for IP networks. It uses Dijkstra's algorithm to find shortest paths, supports VLSM, and converges quickly." },
      { question: "What is BGP (Border Gateway Protocol)?", answer: "BGP is the core routing protocol of the internet. It is an exterior path-vector protocol used to exchange routing info between different Autonomous Systems (AS)." },
      { question: "Explain IP Packet Fragmentation.", answer: "IP fragmentation is the process of breaking a packet into smaller pieces (fragments) so they can pass through a link with a smaller Maximum Transmission Unit (MTU). Reassembly is performed at the final destination host." },
      { question: "What is ICMP (Internet Control Message Protocol)?", answer: "ICMP is a network-layer auxiliary protocol used by hosts and routers to send error messages and operational information (e.g., ping utility, destination unreachable, TTL expired)." },
      { question: "Explain the DORA process in DHCP.", answer: "DORA stands for Discovery, Offer, Request, and Acknowledgment. It is the 4-step UDP sequence a client uses to dynamically obtain an IP address from a DHCP server." },
      { question: "What is NAT (Network Address Translation)?", answer: "NAT is a method of mapping private local IP addresses inside a local network to a single public IP address before forwarding packets to the public internet, conserving IP addresses." },
      { question: "What is the difference between a router and a layer-3 switch?", answer: "A router connects different networks and routes packets using software-based tables. A Layer-3 Switch routes packets at hardware speed using specialized ASIC chips, primarily used inside LAN environments." },
      { question: "Explain the TTL (Time to Live) field in an IP header.", answer: "TTL is an 8-bit field decremented by 1 at every router hop. If TTL reaches 0, the packet is discarded and an ICMP 'Time Exceeded' message is sent, preventing packets from looping infinitely." },
      { question: "What is the Loopback Address in IPv4?", answer: "The loopback address is 127.0.0.1, used by a host to send network packets to itself for testing network software stacks locally without transmitting data over hardware." },
      { question: "Explain split horizon.", answer: "Split horizon is a routing loop prevention method in distance-vector protocols, stating that a router must not advertise a route back out the same interface it learned it from." },
      { question: "What is route poisoning?", answer: "Route poisoning is a method to declare a link failed in distance-vector routing by immediately advertising its metric as infinity (e.g., 16 hops for RIP) to all neighbors." },
      { question: "What is multicast routing?", answer: "Multicast routing distributes data packets to a group of interested receivers rather than broadcasting, managed by protocols like IGMP." },
      { question: "What is an Autonomous System (AS)?", answer: "An AS is a collection of connected IP routing prefixes under the control of a single administrative entity (like an ISP or university) presenting a common routing policy." },
      { question: "What is the maximum size of an IPv4 packet?", answer: "The maximum size of an IPv4 packet is 65,535 bytes, determined by the 16-bit Total Length field in the IP header." }
    ]
  },
  {
    title: "Transport & Application Layers (TCP, UDP, HTTP, DNS)",
    order: 4,
    content: `### Transport & Application Layers

The **Transport Layer** manages process-to-process delivery, reliability, and flow control. The **Application Layer** provides user-facing network services.

#### TCP vs UDP Comparison:
- **TCP (Transmission Control Protocol)**: Connection-oriented, reliable (ACKs), byte-stream, slow, guarantees packet ordering. Uses **3-Way Handshake**.
- **UDP (User Datagram Protocol)**: Connectionless, unreliable, packet-stream, fast, no ordering guarantees. Ideal for streaming and DNS.

#### TCP 3-Way Handshake:
\`\`\`
Client                                                  Server
  | ------------[ SYN (Seq=x) ]------------->             |
  | <------[ SYN-ACK (Seq=y, Ack=x+1) ]------             |
  | ------------[ ACK (Ack=y+1) ]----------->             |
\`\`\`

#### Key Application Protocols:
- **HTTP/HTTPS**: Hypertext Transfer Protocol. HTTPS uses SSL/TLS for encryption.
- **DNS**: Domain Name System. Translates domain names to IP addresses (runs over UDP/53).
- **DHCP**: Dynamically assigns IP addresses (runs over UDP/67,68).`,
    interviewQuestions: [
      { question: "Compare TCP and UDP.", answer: "TCP is connection-oriented, reliable, guarantees packet delivery and ordering, performs flow/congestion control, and is slower. UDP is connectionless, unreliable, fast, has no order guarantees, and is lightweight (used in DNS, streaming)." },
      { question: "Explain the TCP 3-Way Handshake process.", answer: "1. Client sends SYN (Synchronize) packet with initial sequence number x. 2. Server replies with SYN-ACK packet containing acknowledgement number x+1 and sequence number y. 3. Client sends ACK packet with acknowledgement number y+1." },
      { question: "Explain TCP Connection Termination (4-way handshake).", answer: "1. Active closer sends FIN. 2. Other side receives FIN and sends ACK (enters CLOSE_WAIT). 3. Other side finishes sending data, then sends its own FIN. 4. Active closer receives FIN, sends ACK, and waits 2 MSL (Time-Wait) before fully closing." },
      { question: "What is Congestion Control in TCP?", answer: "TCP congestion control prevents network collapse using four algorithms: Slow Start (exponential window growth), Congestion Avoidance (additive increase), Fast Retransmit (retransmit on 3 duplicate ACKs), and Fast Recovery." },
      { question: "What is DNS (Domain Name System) and what port does it use?", answer: "DNS resolves human-readable domain names to machine-readable IP addresses. It operates on Port 53, using UDP for queries and TCP for zone transfers." },
      { question: "Explain the difference between HTTP and HTTPS.", answer: "HTTP transmits data in plain text, vulnerable to sniffing. HTTPS wraps HTTP inside an encrypted SSL/TLS tunnel, securing communications on Port 443." },
      { question: "What is the difference between persistent and non-persistent HTTP?", answer: "In non-persistent HTTP, a new TCP connection is opened for every single object request. In persistent HTTP, a single TCP connection is kept open to transfer multiple files, reducing connection handshake overheads." },
      { question: "Explain the DORA process in DHCP.", answer: "DHCP client broadcasts Discover, Server unicasts/broadcasts Offer, Client broadcasts Request for the offer, Server sends Acknowledgment confirming lease." },
      { question: "What is socket programming?", answer: "Socket programming is API access to network protocols, enabling developers to build bidirectional network connections between processes using IP addresses and ports." },
      { question: "What is the purpose of the PORT number?", answer: "A port number is a 16-bit identifier that directs network packets to specific target processes/applications executing on a host." },
      { question: "Name a few standard port numbers.", answer: "HTTP: 80, HTTPS: 443, DNS: 53, SSH/SFTP: 22, FTP: 20/21, SMTP: 25, DHCP: 67/68." },
      { question: "What is Flow Control in TCP?", answer: "TCP flow control prevents a fast sender from overwhelming a slow receiver. It uses a Sliding Window (Advertised Window) header field where the receiver informs the sender of its available buffer size." },
      { question: "What is the Nagle Algorithm in TCP?", answer: "Nagle's algorithm improves network efficiency by buffering small outgoing packets and sending them together when an ACK for previous data arrives." },
      { question: "What is Silly Window Syndrome?", answer: "Silly Window Syndrome is a TCP degradation where the sender transmits data in tiny segments (e.g., 1 byte) because the receiver advertisement window opens in tiny increments, resolved by Clark's solution or Nagle's algorithm." },
      { question: "Explain the difference between a GET and POST request in HTTP.", answer: "GET requests data from a resource, appending parameters to the URL (cached and logged). POST submits data to be processed, enclosing parameters in the request body (secure and unlimited size)." },
      { question: "What is a cookie in web protocols?", answer: "A cookie is a small key-value data snippet stored by the browser, sent along with every subsequent HTTP request to help servers maintain session states." },
      { question: "What is the difference between Symmetric and Asymmetric Cryptography?", answer: "Symmetric uses a single shared secret key for encryption and decryption. Asymmetric uses a mathematically linked key pair: a public key for encryption and a private key for decryption." },
      { question: "What happens in a TLS/SSL handshake?", answer: "Client and server exchange hello messages, negotiate cipher suites, authenticate the server certificate, exchange a pre-master secret key encrypted with the public key, and generate session keys for symmetric encryption." },
      { question: "What is FTP (File Transfer Protocol) and its connection types?", answer: "FTP transfers files using two separate channels: Port 21 for Control Commands and Port 20 for actual Data Transfer." },
      { question: "What is SMTP, POP3, and IMAP?", answer: "SMTP is used to send/forward emails between mail servers. POP3 downloads emails from a server to a local client, deleting them from the server. IMAP synchronizes emails across multiple devices, keeping them stored on the mail server." }
    ]
  }
];

module.exports = {
  osLessons,
  dbmsLessons,
  cnLessons
};
