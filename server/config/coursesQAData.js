// Comprehensive Technical Interview Q&As and Rich Textbooks for Operating Systems, DBMS, and Computer Networks

const osLessons = [
  {
    title: "Operating System Basics & Architectures",
    order: 1,
    content: `### Operating System Tutorial: Basics & Architectures

An **Operating System (OS)** is a software system that manages computer hardware, software resources, and provides common services for computer programs. It acts as an intermediate interface between user applications and the hardware, making the computer convenient and efficient to use.

#### Visual Architecture Diagram:
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

#### Types of Operating Systems
- **Batch Operating System**: Programs and data are collected in batches before execution begins. No direct interaction between user and CPU. Examples include payroll systems.
- **Multiprogramming System**: Keeps multiple jobs in main memory simultaneously. If the active job waits for I/O, the CPU switches to another job, maximizing CPU utilization.
- **Multitasking (Time-Sharing) System**: An extension of multiprogramming where CPU switches between jobs so rapidly that users can interact with each program while it runs. Uses CPU scheduling and time slices.
- **Real-Time Operating System (RTOS)**: Used in systems where strict timing constraints are mandatory (e.g., flight control, pacemakers). Divided into Hard RTOS (deadlines strictly enforced) and Soft RTOS (deadlines preferred but not fatal if missed).
- **Distributed Operating System**: Manages a group of independent computers and makes them appear to be a single system. Communication occurs via networks.

#### Key OS Functions:
- **Process Management**: CPU scheduling, creation, synchronization, and termination. Handles inter-process communication (IPC) and deadlocks.
- **Memory Management**: Keeps track of primary memory, allocating and deallocating memory blocks to processes as they start and stop.
- **I/O Device Management**: Interfacing with drivers, buffering, caching, spooling, and resource virtualization to provide uniform device access.
- **File System Management**: Storing, organizing, retrieving, and securing files. Tracks file directories, access permissions, and storage sectors.
- **Security & Protection**: Guarding memory segments, limiting physical device access, and managing user authentication/rights.

#### Kernel Architectures: Monolithic vs. Microkernel
- **Monolithic Kernel**: All operating system services (Virtual Memory, File System, CPU Scheduling) run inside a single large kernel address space. It provides high performance but is vulnerable (a crash in any service crashes the whole system). Examples: Linux, Unix.
- **Microkernel**: Only minimal essential services (IPC, basic scheduling) run in the kernel space, while others run in user space as servers. It is highly stable and secure, but context switches make it slower. Example: Mach, L4.

#### Dual-Mode Operation
- **User Mode (Mode Bit = 1)**: Executing user applications. Direct access to hardware or restricted instructions is blocked.
- **Kernel Mode (Mode Bit = 0)**: Privileged execution mode where the OS kernel executes with unrestricted access to memory and physical hardware. A mode switch occurs via traps or interrupts.`,
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

**CPU Scheduling** is the process by which the operating system decides which process in the ready queue gets access to the CPU for execution. It is the basis of multi-programmed operating systems.

#### Process State Diagram:
\`\`\`
+-----------------------------------------------------------+
|                                                           |
|       [New] ---(Admitted)---> [Ready]                     |
|                                 |   ^                     |
|                                 |   | (Time Slice Exited) |
|                            (Schedule)                     |
|                                 v   |                     |
|                              [Running] ---> [Terminated]  |
|                                 |                         |
|                             (I/O event)                   |
|                                 v                         |
|                              [Waiting]                    |
|                                 |                         |
|                        (I/O Completed)                    |
|                                 v                         |
|                          (back to Ready)                  |
+-----------------------------------------------------------+
\`\`\`

#### Scheduling Criteria
To compare scheduling algorithms, we use several metrics:
- **CPU Utilization**: The percentage of time the CPU is busy.
- **Throughput**: The number of processes completed per unit time.
- **Turnaround Time**: The total time from submission of a process to its completion.
- **Waiting Time**: The total time spent waiting in the ready queue.
- **Response Time**: The time from submission to the first response/execution block.

#### Fundamental CPU Scheduling Algorithms:
- **First-Come, First-Served (FCFS)**: Non-preemptive. The process that requests the CPU first gets the CPU first. Suffers from the **Convoy Effect** (short processes wait indefinitely behind a very long CPU-bound process).
- **Shortest Job First (SJF)**: Schedules the process with the shortest next CPU burst. It is optimal because it gives the minimum average waiting time. Can be preemptive (Shortest Remaining Time First - SRTF) or non-preemptive.
- **Round Robin (RR)**: Preemptive. Each process gets a fixed time unit called a **Time Quantum** (or time slice). Great for time-sharing systems. If the quantum is too large, it behaves like FCFS; if too small, it causes massive context-switching overhead.
- **Priority Scheduling**: CPU is allocated to the process with the highest priority. Starvation of low-priority processes is resolved using **Aging** (gradually increasing the priority of processes waiting in the queue).
- **Multilevel Feedback Queue (MLFQ)**: Separates the ready queue into multiple priority queues. Processes can move between queues based on their execution behavior (CPU-bound processes drop down, I/O-bound processes stay high), preventing starvation.`,
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

**Memory Management** is the functionality of an operating system which handles or manages primary memory and moves processes back and forth between main memory and disk during execution.

#### Logical vs. Physical Address Space
- **Logical Address**: Address generated by the CPU during program execution (also called virtual address).
- **Physical Address**: Address actually seen by the memory unit (RAM chips).
- **Memory Management Unit (MMU)**: The hardware device that performs run-time mapping of logical/virtual addresses to physical RAM addresses.

#### Paging Architecture
Paging is a non-contiguous memory allocation scheme.
- Main memory is divided into fixed-size blocks called **Frames**.
- Logical memory is divided into blocks of the same size called **Pages**.
- A **Page Table** maps pages to frames, solving the external fragmentation issue.
- **Translation Lookaside Buffer (TLB)**: A fast, associative cache storing active page-table translations to avoid double memory access overhead.

#### Page Table Mapping:
\`\`\`
+---------------------------------------------+
| Logical Address: [ Page Number | Offset ]   |
|                        |                    |
|                        v                    |
|                 (Look up Page Table)        |
|                        |                    |
|                        v                    |
| Physical Address: [ Frame Number | Offset ] |
+---------------------------------------------+
\`\`\`

#### Virtual Memory & Demand Paging
Virtual Memory allows the execution of processes that are not completely in main memory.
- **Demand Paging**: Pages are loaded into memory only when they are requested/needed during execution.
- **Page Fault**: Occurs when a process tries to access a page that is not currently loaded in RAM. The OS intercepts the fault, loads the page from disk, updates the page table, and restarts the instruction.
- **Page Replacement Algorithms**: When RAM is full, the OS must select a page to replace.
  1. *FIFO*: Replaces the oldest page. Suffers from **Belady's Anomaly** (page faults can increase when memory frames increase).
  2. *Optimal*: Replaces the page that will not be used for the longest period of time. Minimum page faults, but impossible to implement in practice because it requires future knowledge.
  3. *Least Recently Used (LRU)*: Replaces the page that has not been used for the longest time. Highly effective and widely used.
- **Thrashing**: A state where the CPU spends more time swapping pages in and out of disk than executing instructions. Caused by overallocation of processes, resolved by allocating processes their minimum working set.`,
    interviewQuestions: [
      { question: "What is the difference between Logical and Physical addresses?", answer: "A logical address is generated by the CPU during process compilation and execution. A physical address corresponds to a physical address location in the RAM hardware register. The MMU handles translation." },
      { question: "What is Paging and how does it prevent external fragmentation?", answer: "Paging divides logical memory into Pages and physical memory into Frames of identical size. Because memory is allocated in fixed-size blocks, external fragmentation is eliminated." },
      { question: "What is the Translation Lookaside Buffer (TLB)?", answer: "The TLB is a fast associative cache on the CPU chip. It stores recent page-to-frame translations. By matching page numbers in TLB first, the CPU avoids reading page tables from main RAM, cutting access times." },
      { question: "Explain the differences between Internal and External Fragmentation.", answer: "Internal Fragmentation occurs when a process is allocated a memory block larger than requested, leaving unused space inside the block. External Fragmentation occurs when total free space exists to satisfy a request, but it is split into non-contiguous blocks." },
      { question: "What is Virtual Memory?", answer: "Virtual memory is a storage allocation scheme that creates the illusion of a much larger main memory by using disk space as a temporary overflow, enabling programs to run even if they exceed physical RAM size." },
      { question: "What is a Page Fault and how does the OS handle it?", answer: "A page fault occurs when a program accesses a page marked 'invalid' in the page table (not in RAM). The CPU trap triggers the OS kernel, which fetches the page from disk swap space, updates the table, and resumes execution." },
      { question: "What is Belady's Anomaly and in which algorithm does it occur?", answer: "Belady's Anomaly is the phenomenon where increasing the number of physical page frames results in an increase in page faults. It occurs in the First-In-First-Out (FIFO) algorithm." },
      { question: "Explain the Least Recently Used (LRU) page replacement algorithm.", answer: "LRU replaces the page that has not been referenced for the longest time, based on the assumption that pages heavily used recently will likely be used again soon." },
      { question: "What is Thrashing?", answer: "Thrashing is a state of high paging activity where the system spends almost all its time swapping pages in and out of disk rather than executing instructions, causing system performance to drop to near zero." },
      { question: "How can the OS prevent Thrashing?", answer: "Thrashing can be prevented by reducing the degree of multiprogramming, using the Working-Set Model to allocate sufficient frames to active processes, or upgrading physical RAM." },
      { question: "What is Segmentation?", answer: "Segmentation is a memory management scheme that divides logical memory into variable-sized segments representing logical program divisions (e.g. main, method, stack, global variables), matching the user view of memory." },
      { question: "What is Swap Space?", answer: "Swap Space is a reserved partition on the hard drive or SSD used by the operating system to temporarily store idle process memory pages when physical RAM is full." },
      { question: "What is the difference between Paging and Segmentation?", answer: "Paging divides memory into fixed-sized blocks (invisible to the programmer). Segmentation divides memory into variable-sized segments corresponding to logical divisions (defined by the programmer)." },
      { question: "Explain the concept of Copy-on-Write (COW).", answer: "COW is an optimization where child and parent processes initially share the same memory pages after a fork(). A separate copy of a page is created only when one of the processes modifies it." },
      { question: "What is a Translation Lookaside Buffer (TLB) hit and miss?", answer: "A TLB hit occurs when the page translation is found in the TLB cache. A TLB miss occurs when it is not, forcing the CPU to read the page tables from RAM and update the TLB." },
      { question: "Explain Dynamic Loading.", answer: "Dynamic Loading is a mechanism where a software routine is not loaded into memory until it is explicitly called by the program, saving physical RAM space." },
      { question: "Explain Dynamic Linking vs Static Linking.", answer: "In Static Linking, all library modules are combined into the binary executable at compile time. In Dynamic Linking, the library routines are linked at run-time, saving disk space and memory." },
      { question: "What is an Inverted Page Table?", answer: "An inverted page table has one entry for each physical frame in memory instead of each logical page. It tracks which process owns the frame, saving significant memory space in systems with large address spaces." },
      { question: "What is Segmented Paging?", answer: "Segmented Paging is a hybrid memory scheme where logical memory is divided into segments, and each segment is subdivided into pages, combining the logical benefits of segmentation with the physical benefits of paging." },
      { question: "What is Memory Compaction?", answer: "Memory Compaction is a technique used to resolve external fragmentation by shifting all active allocated memory blocks to one side, consolidating all free space into one large contiguous block." }
    ]
  },
  {
    title: "Deadlocks & Concurrency Control",
    order: 4,
    content: `### Deadlocks & Concurrency Control

A **Deadlock** is a state in which a set of processes are blocked because each process holds a resource and waits for another resource held by some other process in the set.

#### Deadlock Wait-For Graph:
\`\`\`
+-----------------------------------------------------------+
|                                                           |
|    [Process P1] ---(Requests)---> [Resource R1]           |
|         ^                               |                 |
|         |                            (Held By)            |
|         |                               v                 |
|     (Requests)                     [Process P2]           |
|         |                                                 |
|         +-------------------------------+                 |
|                                                           |
+-----------------------------------------------------------+
\`\`\`

#### Four Necessary Conditions for Deadlock (Coffman Conditions):
1. **Mutual Exclusion**: At least one resource must be held in non-shareable mode (only one process can use it at a time).
2. **Hold and Wait**: A process must hold at least one resource and wait to acquire others that are currently held by other processes.
3. **No Preemption**: Resources cannot be forcibly taken from a process; they must be released voluntarily.
4. **Circular Wait**: A closed chain of processes exists where each process requests a resource held by the next process in the chain.

#### Deadlock Management:
- **Deadlock Prevention**: Structural policies that eliminate at least one of the four necessary conditions (e.g., forcing all resources to be requested at once to prevent hold-and-wait).
- **Deadlock Avoidance**: Dynamically checks resource request safety. The system allocates resources only if it leaves the system in a **Safe State** (e.g., **Banker's Algorithm**).
- **Deadlock Detection & Recovery**: Allows deadlocks to happen, runs detection algorithms (Resource Allocation Graphs), and recovers by terminating processes or preempting resources.

#### Concurrency and Race Conditions
- **Critical Section**: A block of code accessing shared resources. Any solution must satisfy: **Mutual Exclusion**, **Progress**, and **Bounded Waiting**.
- **Semaphores**: Variables used to control concurrent resource access.
  1. *Binary Semaphore*: Values can only be 0 or 1 (acts like a lock).
  2. *Counting Semaphore*: Can take arbitrary values, representing available resource pools.`,
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
      { question: "What is livelock?", answer: "A livelock is a situation where two or more processes continuously change their states in response to each other without performing any physical work, remaining active but stuck." },
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

A **Database Management System (DBMS)** is software designed to store, retrieve, define, and manage data in databases. It provides data independence, security, integrity, and transaction crash recovery.

#### Database Architecture: Three-Schema Architecture
Designed to separate the user applications from the physical database:
1. **External Schema**: Individual user views of the database.
2. **Conceptual Schema**: Logical structure, entities, relationships, constraints.
3. **Internal Schema**: Physical storage structure, file allocation, indexes.

#### ER Model Components:
- **Entity**: An object or concept that exists in the real world (represented as a Rectangle).
- **Attribute**: Properties of an entity (represented as an Ellipse).
- **Relationship**: Associations among entities (represented as a Diamond).

#### Attribute Categories
- **Key Attribute**: Uniquely identifies an entity (Underlined).
- **Composite Attribute**: Can be subdivided into smaller parts (e.g., Name -> First, Last).
- **Multi-valued Attribute**: Can have multiple values (represented as Double Ellipse, e.g., Phone).
- **Derived Attribute**: Calculated dynamically from other attributes (Dashed Ellipse, e.g., Age from DOB).

#### Cardinality Ratios
- **One-to-One (1:1)**: An entity in A is associated with at most one entity in B.
- **One-to-Many (1:N)**: An entity in A is associated with any number of entities in B.
- **Many-to-Many (N:M)**: Multiple entities in A can associate with multiple entities in B.`,
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

#### Super, Candidate, and Primary Keys:
\`\`\`
+-----------------------------------------------------------+
|                                                           |
|     +-----------------------------------------------+     |
|     |  Super Key (Any set of attributes that        |     |
|     |  uniquely identifies a tuple)                 |     |
|     |     +-----------------------------------+     |     |
|     |     |  Candidate Key (Minimal super key)|     |     |
|     |     |     +-----------------------+     |     |     |
|     |     |     |  Primary Key          |     |     |     |
|     |     |     |  (Selected Candidate) |     |     |     |
|     |     |     +-----------------------+     |     |     |
|     |     +-----------------------------------+     |     |
|     +-----------------------------------------------+     |
|                                                           |
+-----------------------------------------------------------+
\`\`\`

#### Database Keys
- **Super Key**: A set of one or more attributes that taken collectively allows us to identify uniquely a tuple in the relation.
- **Candidate Key**: A minimal super key (a super key with no redundant attributes).
- **Primary Key**: The candidate key selected by the database designer to uniquely identify tuples in a relation. Cannot contain NULL values.
- **Alternate Key**: Candidate keys that were not chosen as the primary key.
- **Foreign Key**: An attribute in a relation that references the primary key of another relation, enforcing **Referential Integrity**.

#### Relational Algebra Operations
Relational algebra is a procedural query language.
- **Selection (σ)**: Filters rows based on a predicate. (e.g., σ_salary>50000 (Employee))
- **Projection (π)**: Selects specific columns, discarding others. (e.g., π_name, id (Employee))
- **Union (∪)**: Combines tuples from two relations. Relations must be union-compatible.
- **Set Difference (-)**: Tuples in relation A but not in B.
- **Cartesian Product (X)**: Combines all tuples of A with all tuples of B.
- **Natural Join (⋈)**: Joins tables based on matching values in common attributes.`,
    interviewQuestions: [
      { question: "What is a relation, tuple, and attribute in RDBMS?", answer: "In RDBMS, a relation corresponds to a 2D table, a tuple corresponds to a row containing data records, and an attribute corresponds to a column defining data properties." },
      { question: "Explain Super Key, Candidate Key, and Primary Key.", answer: "A Super Key is any set of columns that uniquely identifies a row. A Candidate Key is a minimal super key (no redundant attributes). A Primary Key is the candidate key selected to uniquely identify tuples." },
      { question: "What is a Foreign Key and what integrity constraint does it enforce?", answer: "A Foreign Key is a field in one table that references the Primary Key of another. It enforces Referential Integrity, ensuring that relationships between tables remain consistent." },
      { question: "Explain the difference between Primary Key and Unique Key.", answer: "A Primary Key uniquely identifies a row, cannot accept NULL values, and there can be only one per table. A Unique Key also enforces uniqueness, allows one NULL value, and there can be multiple per table." },
      { question: "What is Referential Integrity?", answer: "Referential Integrity is a database constraint ensuring that a foreign key value must always reference a valid, existing primary key in the parent table, preventing orphaned records." },
      { question: "Explain Cascade Delete and Cascade Update.", answer: "These are referential actions. Cascade Delete automatically deletes dependent child rows when the referenced parent row is deleted. Cascade Update automatically updates child foreign keys when the parent primary key changes." },
      { question: "What are the fundamental operations in Relational Algebra?", answer: "The fundamental operations are: Selection (σ), Projection (π), Union (∪), Set Difference (-), Cartesian Product (X), and Rename (ρ)." },
      { question: "What is a Natural Join in Relational Algebra?", answer: "A Natural Join (⋈) is a join operation that combines tuples from two relations that have equal values on all common attributes, automatically projecting out duplicate join columns." },
      { question: "What is the difference between relational algebra and relational calculus?", answer: "Relational Algebra is a procedural query language describing *how* to retrieve data step-by-step. Relational Calculus is a non-procedural (declarative) language describing *what* data to retrieve." },
      { question: "What is Union Compatibility in relations?", answer: "Two relations are Union Compatible if they have the same number of attributes (degree) and the data types of corresponding attributes are identical in order." },
      { question: "What is the degree and cardinality of a relation?", answer: "The degree of a relation is the number of attributes (columns). The cardinality of a relation is the number of tuples (rows)." },
      { question: "What is a Domain Constraint?", answer: "A Domain Constraint restricts the values that can be entered into a column to a specific data type, size, range, or set of values (e.g. Integer only)." },
      { question: "What is Entity Integrity Constraint?", answer: "Entity Integrity is a rule stating that no primary key attribute can contain a NULL value, ensuring every row is identifiable." },
      { question: "What is Key Constraint?", answer: "Key Constraint states that in a relation, no two distinct tuples can have the same values for all attributes in the key, enforcing uniqueness." },
      { question: "Explain the difference between Theta Join and Equi Join.", answer: "A Theta Join combines tuples from two relations based on any arbitrary comparison operator (<, >, =, !=). An Equi Join is a specific subset of Theta Join that uses only the equality (=) operator." },
      { question: "What is an Outer Join? Name the three types.", answer: "An Outer Join retrieves matching rows from both tables, plus unmatched rows from one or both tables (padded with NULLs). Types: Left, Right, and Full Outer Joins." },
      { question: "Explain Division operation in Relational Algebra.", answer: "The Division operation (÷) is used for queries involving 'all' or 'every' relationships, returning tuples of relation A that are associated with all tuples of relation B." },
      { question: "What is a composite primary key?", answer: "A composite primary key is a primary key consisting of two or more attributes/columns to guarantee uniqueness." },
      { question: "Can a foreign key reference a candidate key?", answer: "Yes, a foreign key can reference either a primary key or any unique candidate key in the referenced parent table." },
      { question: "What is a null value in databases?", answer: "A NULL value represents missing, unknown, or non-applicable data. It is distinct from an empty string or a zero value." }
    ]
  },
  {
    title: "SQL Queries, Joins & Subqueries",
    order: 3,
    content: `### SQL Queries, Joins & Subqueries

**SQL (Structured Query Language)** is the standard language for relational database management. It is divided into DDL (Data Definition), DML (Data Manipulation), DCL (Data Control), and TCL (Transaction Control).

#### Types of SQL Joins:
- **INNER JOIN**: Returns records that have matching values in both tables.
- **LEFT JOIN**: Returns all records from the left table, and the matched records from the right table. Unmatched right rows are padded with NULL.
- **RIGHT JOIN**: Returns all records from the right table, and the matched records from the left table.
- **FULL OUTER JOIN**: Returns all records when there is a match in either left or right table.

#### SQL Aggregate Functions
Functions that perform a calculation on a set of values and return a single value:
- \`COUNT()\`, \`SUM()\`, \`AVG()\`, \`MAX()\`, \`MIN()\`
- Used with **GROUP BY** to group results by one or more columns.
- **HAVING** is used instead of **WHERE** to filter groups after aggregation.

#### Subqueries vs. Correlated Subqueries
- **Nested Subquery**: An independent query nested inside another query. The inner query executes first and passes its result to the outer query.
- **Correlated Subquery**: A subquery that references columns of the outer query. The inner query executes repeatedly, once for each row processed by the outer query. Slows down execution.`,
    interviewQuestions: [
      { question: "What is SQL and what are its components?", answer: "SQL is Structured Query Language. Components include: DDL (Data Definition: CREATE, ALTER), DML (Data Manipulation: SELECT, INSERT), DCL (Data Control: GRANT), and TCL (Transaction: COMMIT, ROLLBACK)." },
      { question: "Explain the difference between WHERE and HAVING clauses.", answer: "WHERE filters rows before group aggregation is performed. HAVING filters groups after aggregate operations (GROUP BY) have been executed." },
      { question: "Explain the difference between LEFT JOIN and INNER JOIN.", answer: "INNER JOIN returns only the rows with matching keys in both tables. LEFT JOIN returns all rows from the left table, and matched rows from the right table (NULL if no match)." },
      { question: "What is a subquery and what are its types?", answer: "A subquery is a query nested inside another query. Types include: Single-Row subqueries, Multi-Row subqueries, and Correlated subqueries." },
      { question: "What is a Correlated Subquery?", answer: "A correlated subquery is a nested query that depends on the outer query for its values, executing once for each candidate row evaluated by the outer query." },
      { question: "Explain the difference between UNION and UNION ALL.", answer: "UNION combines the results of two SELECT queries, automatically removing duplicate rows. UNION ALL combines the results but retains duplicate rows, executing faster." },
      { question: "What are SQL constraints? Name common ones.", answer: "Constraints enforce rules on data. Common constraints: NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, CHECK, and DEFAULT." },
      { question: "Explain the difference between DELETE, TRUNCATE, and DROP.", answer: "DELETE is a DML command that deletes specified rows (can be rolled back). TRUNCATE is a DDL command that deletes all rows from a table (cannot be rolled back, faster). DROP deletes the entire table structure." },
      { question: "What is an Index in SQL and how does it speed up queries?", answer: "An Index is a physical structure (usually B/B+ Tree) that stores pointers to rows. It speeds up data search by avoiding full table scans, though it slows down write operations." },
      { question: "Explain Clustered vs Non-Clustered Indexes.", answer: "A Clustered Index physical sorts and stores the data rows of the table based on the key (only one per table). A Non-Clustered Index stores index keys pointing to physical row locations (multiple per table)." },
      { question: "What is a View in SQL?", answer: "A View is a virtual table representing the result of a saved SELECT query. It does not store physical data itself and is used for security or simplifying queries." },
      { question: "What is a Trigger in databases?", answer: "A Trigger is a special stored procedure that automatically executes ('fires') in response to specific events (INSERT, UPDATE, DELETE) on a table." },
      { question: "What is ACID property in database transactions?", answer: "ACID properties ensure transaction reliability: Atomicity (all or nothing), Consistency (preserves database rules), Isolation (independent execution), and Durability (permanent changes)." },
      { question: "Explain transaction Isolation Levels.", answer: "Isolation levels prevent concurrency anomalies. Levels in order: Read Uncommitted, Read Committed, Repeatable Read, and Serializable." },
      { question: "What is the difference between database commit and rollback?", answer: "COMMIT saves all transaction modifications permanently to the database. ROLLBACK undoes all changes made during the current transaction, returning the database to its previous state." },
      { question: "Explain Dirty Read, Non-Repeatable Read, and Phantom Read.", answer: "Dirty Read: reading uncommitted data. Non-Repeatable Read: reading different values for the same row during a transaction. Phantom Read: new query rows appearing mid-transaction." },
      { question: "What is a Stored Procedure?", answer: "A Stored Procedure is a compiled batch of SQL statements stored in the database database that can be executed repeatedly, reducing network traffic." },
      { question: "What is SQL Injection and how can it be prevented?", answer: "SQL Injection is a security exploit where an attacker inputs malicious SQL code into form fields. Prevented using Parameterized Queries (Prepared Statements) or Input Validation." },
      { question: "What is the difference between group functions and scalar functions?", answer: "Group (aggregate) functions operate on a set of rows to return a single value (e.g. SUM). Scalar functions operate on a single input value to return a single value (e.g. ROUND, UPPER)." },
      { question: "What are Window Functions in SQL?", answer: "Window functions perform calculations across a set of table rows related to the current row (e.g. ROW_NUMBER(), RANK(), LEAD(), LAG()) using the OVER clause." }
    ]
  },
  {
    title: "Normalization (1NF, 2NF, 3NF, BCNF)",
    order: 4,
    content: `### Database Normalization

**Normalization** is a systematic process of organizing data in a database to reduce data redundancy (duplication) and eliminate undesirable anomalies (Insertion, Deletion, and Update anomalies).

#### Functional Dependency (FD)
- A relationship between attributes: $X \rightarrow Y$ means the value of attribute $X$ uniquely determines the value of attribute $Y$.

#### Normal Forms Progression:
1. **First Normal Form (1NF)**: A relation is in 1NF if all attribute values are atomic (no multi-valued or composite attributes).
2. **Second Normal Form (2NF)**: Must be in 1NF. Also, no **Partial Dependency** exists (no non-prime attribute depends on a proper subset of any candidate key).
3. **Third Normal Form (3NF)**: Must be in 2NF. Also, no **Transitive Dependency** exists. For any functional dependency $X \rightarrow Y$, either $X$ is a super key or $Y$ is a prime attribute.
4. **Boyce-Codd Normal Form (BCNF)**: Stricter than 3NF. For any functional dependency $X \rightarrow Y$, $X$ must be a super key.

#### Normal Forms Summary Table:
| Normal Form | Rule Constraint | Eliminates |
|-------------|-----------------|------------|
| 1NF         | Atomic values   | Multi-valued values |
| 2NF         | No Partial FD   | Partial redundancy  |
| 3NF         | No Transitive FD| Transitive anomalies|
| BCNF        | X must be Super Key | Non-key FDs |`,
    interviewQuestions: [
      { question: "What is Database Normalization?", answer: "Normalization is the process of structuring relational database columns to minimize redundancy and eliminate insert, update, and delete anomalies." },
      { question: "What are database Insertion, Deletion, and Update anomalies?", answer: "Anomalies are database inconsistencies. Insertion: unable to add data due to missing fields. Deletion: losing unrelated data when deleting a record. Update: updating duplicate data in one place but not another." },
      { question: "What is Functional Dependency?", answer: "A functional dependency X -> Y is a constraint stating that the value of attribute set X uniquely determines the value of attribute set Y." },
      { question: "Explain First Normal Form (1NF).", answer: "A relation is in 1NF if and only if the domain of each attribute contains only atomic (indivisible) values, and there are no repeating groups." },
      { question: "Explain Second Normal Form (2NF) and Partial Dependency.", answer: "A relation is in 2NF if it is in 1NF and no partial dependency exists. A partial dependency occurs when a non-prime attribute is functionally dependent on a part of a candidate key." },
      { question: "Explain Third Normal Form (3NF) and Transitive Dependency.", answer: "A relation is in 3NF if it is in 2NF and has no transitive dependencies. A transitive dependency occurs when a non-prime attribute depends on another non-prime attribute." },
      { question: "What is Boyce-Codd Normal Form (BCNF) and how does it differ from 3NF?", answer: "BCNF is a stronger version of 3NF. A relation is in BCNF if for every functional dependency X -> Y, X is a super key. In 3NF, Y could be a prime attribute, which BCNF prohibits." },
      { question: "What is a Lossless-Join Decomposition?", answer: "Decomposition is lossless if joining the decomposed tables using a natural join reconstructs the original relation without creating spurious (fake) tuples." },
      { question: "What is Dependency Preservation in normalization?", answer: "Dependency preservation ensures that all functional dependencies in the original relation can be checked using only the individual decomposed tables." },
      { question: "What is a Prime and Non-Prime attribute?", answer: "A Prime attribute is an attribute that is a member of at least one candidate key. A Non-Prime attribute is an attribute that is not part of any candidate key." },
      { question: "Explain Trivial Functional Dependency.", answer: "A functional dependency X -> Y is trivial if Y is a subset of X (e.g. {ID, Name} -> ID)." },
      { question: "What is Fourth Normal Form (4NF)?", answer: "A relation is in 4NF if it is in BCNF and has no Multi-Valued Dependencies (where an attribute determines a set of values independently of other columns)." },
      { question: "What is Fifth Normal Form (5NF) / Join Dependency?", answer: "5NF deals with cases where a relation cannot be decomposed further without losing information, unless the join is based on candidate keys." },
      { question: "What is Denormalization and when is it used?", answer: "Denormalization is the intentional process of adding redundancy back to a database to optimize read performance and avoid expensive join queries." },
      { question: "Explain candidate key vs prime attribute.", answer: "A candidate key is a minimal set of attributes identifying a row. A prime attribute is any single attribute belonging to any candidate key." },
      { question: "How do you find the Candidate Key of a relation?", answer: "Candidate keys are found by computing attribute closures. Find attributes that do not appear on the right side of functional dependencies; their closure must yield all relation attributes." },
      { question: "What is Attribute Closure?", answer: "Attribute Closure (written as X+) is the set of all attributes that are functionally determined by attribute set X based on functional dependencies." },
      { question: "Explain the term 'Spurious Tuples'.", answer: "Spurious tuples are extra, incorrect rows generated when relations are joined back together after an invalid/lossy decomposition." },
      { question: "What are Armstrong's Axioms for functional dependencies?", answer: "Armstrong's axioms are rules to infer new FDs: Reflexivity (if Y⊆X then X->Y), Augmentation (if X->Y then XZ->YZ), and Transitivity (if X->Y and Y->Z then X->Z)." },
      { question: "What is the closure of a set of functional dependencies?", answer: "The closure of FDs (written as F+) is the complete set of all functional dependencies that can be logically inferred from the initial set F." }
    ]
  }
];

const cnLessons = [
  {
    title: "OSI & TCP/IP Reference Models",
    order: 1,
    content: `### OSI & TCP/IP Reference Models

Computer networks communicate using structured layered architectures. The two primary models are the **OSI Model** (7 layers) and the **TCP/IP Model** (4/5 layers).

#### OSI vs. TCP/IP Layer Matching:
| OSI Model Layer | TCP/IP Model Layer | Protocols / Standards |
|-----------------|--------------------|-----------------------|
| 7. Application  | Application        | HTTP, DNS, SMTP, FTP  |
| 6. Presentation | Application        | SSL, JPEG, ASCII      |
| 5. Session      | Application        | NetBIOS, RPC          |
| 4. Transport    | Transport          | TCP, UDP              |
| 3. Network      | Internet           | IP, ICMP, OSPF        |
| 2. Data Link    | Network Access     | Ethernet, Wi-Fi, ARP  |
| 1. Physical     | Network Access     | Fiber, Cables, Hubs   |

#### OSI Layers & Functions:
- **Application Layer**: Provides network services directly to user applications (HTTP, SMTP).
- **Presentation Layer**: Handles data formatting, encryption, decryption, and compression (SSL/TLS).
- **Session Layer**: Establishes, manages, and terminates communication sessions between systems.
- **Transport Layer**: End-to-end communication, segmentation, flow control, error recovery (TCP, UDP).
- **Network Layer**: Handles routing, logical addressing (IP), and packet forwarding.
- **Data Link Layer**: Node-to-node framing, physical addressing (MAC), and error control.
- **Physical Layer**: Transmits raw bits over physical copper/fiber media.`,
    interviewQuestions: [
      { question: "What is the OSI Model and what does it stand for?", answer: "OSI stands for Open Systems Interconnection. It is a conceptual 7-layer reference model defined by ISO that standardizes communication functions across networks." },
      { question: "List the 7 layers of the OSI model in order.", answer: "The layers from bottom to top are: 1. Physical Layer, 2. Data Link Layer, 3. Network Layer, 4. Transport Layer, 5. Session Layer, 6. Presentation Layer, and 7. Application Layer." },
      { question: "Explain the difference between the OSI Model and the TCP/IP Model.", answer: "The OSI model is a theoretical 7-layer model. The TCP/IP model is a practical 4 or 5-layer model used in internet engineering, combining OSI application, presentation, and session layers into a single Application layer." },
      { question: "What is data encapsulation and decapsulation?", answer: "Encapsulation is the process of adding protocol headers (and footers) to data as it moves down the sender's network layers. Decapsulation is the reverse process of stripping headers as data moves up the receiver's layers." },
      { question: "What are the Protocol Data Units (PDUs) at different layers?", answer: "The PDUs are: Application/Presentation/Session: Data; Transport Layer: Segment (TCP) or Datagram (UDP); Network Layer: Packet; Data Link Layer: Frame; Physical Layer: Bits." },
      { question: "What is the primary function of the Transport Layer?", answer: "The Transport Layer handles end-to-end communication, flow control, congestion control, segmentation, and error checking using TCP or UDP." },
      { question: "Explain the difference between TCP and UDP.", answer: "TCP (Transmission Control Protocol) is connection-oriented, reliable, guarantees packet ordering, and performs flow control. UDP (User Datagram Protocol) is connectionless, unreliable, faster, and used for live streaming/DNS." },
      { question: "What is the function of the Network Layer?", answer: "The Network Layer is responsible for logical addressing (IP addresses) and routing packets across multiple hops from source to destination." },
      { question: "What is the difference between a MAC address and an IP address?", answer: "A MAC address is a permanent, 48-bit physical address burned into the network interface card (NIC). An IP address is a 32-bit (IPv4) or 128-bit (IPv6) logical address assigned dynamically for routing." },
      { question: "What is the ARP protocol and how does it work?", answer: "ARP (Address Resolution Protocol) resolves a known logical IP address into a physical MAC address on a local area network by broadcasting an ARP Request and receiving an ARP Reply." },
      { question: "Explain the difference between Hubs, Switches, and Routers.", answer: "A Hub operates at Layer 1 and broadcasts all traffic to all ports. A Switch operates at Layer 2 and forwards frames selectively using MAC address tables. A Router operates at Layer 3 and forwards packets using IP routing tables." },
      { question: "What is the Presentation Layer responsible for?", answer: "The Presentation Layer handles data translation, serialization, character encoding, compression, and encryption/decryption (SSL/TLS)." },
      { question: "What is multiplexing and demultiplexing in transport protocols?", answer: "Multiplexing is the process of gathering data from multiple application sockets and sending it through a single link. Demultiplexing is delivering received segments to the correct application socket using port numbers." },
      { question: "What is the Session Layer responsible for?", answer: "The Session Layer establishes, coordinates, maintains, and terminates dialogs and sessions between applications on remote machines." },
      { question: "Explain Flow Control.", answer: "Flow Control is a transport/datalink technique that prevents a fast sender from overwhelming a slow receiver by negotiating buffer capacities (e.g. sliding window)." },
      { question: "Explain Congestion Control.", answer: "Congestion control is a network/transport mechanism that prevents overallocation of network capacity, reducing transmission rates when packet losses occur." },
      { question: "What is the difference between half-duplex and full-duplex?", answer: "In half-duplex, communication can flow in both directions but only one direction at a time. In full-duplex, communication can flow in both directions simultaneously." },
      { question: "What is a gateway?", answer: "A gateway is a network node that connects two completely different networks using different protocols, performing protocol conversions." },
      { question: "What is the MTU (Maximum Transmission Unit)?", answer: "MTU is the largest packet or frame size, in bytes, that can be transmitted across a physical network medium without fragmentation (typically 1500 bytes for Ethernet)." },
      { question: "What is ICMP protocol?", answer: "ICMP (Internet Control Message Protocol) is a network layer protocol used by routers and hosts to send error messages and operational information (e.g. Ping diagnostics)." }
    ]
  },
  {
    title: "IP Addressing & Subnetting",
    order: 2,
    content: `### IP Addressing & Subnetting

**IP Addressing** is the logical mapping of systems in a network. IPv4 addresses are 32-bit numbers represented in dotted-decimal format (e.g., 192.168.1.1).

#### IPv4 Classful Addressing Classes
- **Class A**: Range 1.0.0.0 to 126.0.0.0. Subnet Mask 255.0.0.0 (8 Network bits). Used for huge networks.
- **Class B**: Range 128.0.0.0 to 191.255.0.0. Subnet Mask 255.255.0.0 (16 Network bits). Medium networks.
- **Class C**: Range 192.0.0.0 to 223.255.255.0. Subnet Mask 255.255.255.0 (24 Network bits). Small local networks.
- **Class D**: Range 224.0.0.0 to 239.255.255.255. Reserved for Multicasting.
- **Class E**: Range 240.0.0.0 to 255.255.255.255. Reserved for Experimental use.

#### Subnetting & CIDR
Subnetting divides a large physical network into smaller logical subnetworks (subnets).
- **CIDR (Classless Inter-Domain Routing)**: Uses variable-length subnet masks (VLSM). Written as IP/Prefix (e.g., 192.168.1.0/26 means 26 bits are network bits, leaving 6 bits for host addresses).
- **Host Calculation**: A subnet with $H$ host bits can accommodate $2^H - 2$ hosts (subtracting the Network ID and Broadcast ID).

#### CIDR/26 Subnet Example:
+-----------------------------------------------------------+
| IP: 192.168.1.0/26                                        |
| Network Bits: 26  | Host Bits: 6                          |
| Total Hosts = 2^6 = 64                                    |
| Usable Hosts = 64 - 2 = 62                                |
| Subnet Mask: 255.255.255.192                              |
+-----------------------------------------------------------+`,
    interviewQuestions: [
      { question: "What is an IP address and how does IPv4 differ from IPv6?", answer: "An IP address is a logical network identifier. IPv4 uses 32-bit addresses (dotted-decimal), providing ~4.3 billion addresses. IPv6 uses 128-bit addresses (hexadecimal), solving address exhaustion." },
      { question: "Explain Classful Addressing classes and their ranges.", answer: "Class A: 1-126 (Mask 255.0.0.0); Class B: 128-191 (Mask 255.255.0.0); Class C: 192-223 (Mask 255.255.255.0); Class D: 224-239 (Multicast); Class E: 240-254 (Experimental)." },
      { question: "What is Subnetting and why is it used?", answer: "Subnetting splits a large network into smaller sub-networks. It reduces broadcast traffic, enhances security, improves routing efficiency, and prevents address wastage." },
      { question: "What is CIDR (Classless Inter-Domain Routing)?", answer: "CIDR is an addressing scheme replacing classful masks with a slash prefix (e.g., /24), allowing allocation of arbitrary size blocks based on requirement." },
      { question: "Why do we subtract 2 when calculating usable host addresses in a subnet?", answer: "We subtract 2 because the first address is reserved as the Network ID (represents the subnet itself) and the last address is reserved as the Broadcast ID." },
      { question: "Given the subnet IP 192.168.1.0/26, calculate the subnet mask and total usable hosts.", answer: "A /26 prefix means 26 network bits. Subnet mask is 255.255.255.192. Host bits H = 32 - 26 = 6. Usable hosts = 2^6 - 2 = 62 hosts." },
      { question: "What is a loopback IP address?", answer: "A loopback address (127.0.0.1 in IPv4, ::1 in IPv6) is a special address used by a host to send network traffic to itself, testing the local protocol stack." },
      { question: "What is a Private IP address? Name the ranges.", answer: "Private IP addresses are not routable on the public internet, reserved for local networks. Ranges: 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16." },
      { question: "What is NAT (Network Address Translation)?", answer: "NAT is a mechanism that maps private local IP addresses to a single public IP address on a router, allowing multiple LAN devices to share one internet connection." },
      { question: "What is DHCP (Dynamic Host Configuration Protocol)?", answer: "DHCP is an application layer protocol that dynamically assigns IP addresses, subnet masks, default gateways, and DNS servers to client nodes." },
      { question: "What are the four steps of the DHCP allocation handshake?", answer: "The DORA process: 1. DHCP Discover (Client broadcast), 2. DHCP Offer (Server response), 3. DHCP Request (Client selection), 4. DHCP Acknowledgment (Server confirmation)." },
      { question: "What is APIPA (Automatic Private IP Addressing)?", answer: "APIPA is an OS feature that automatically assigns an IP in the range 169.254.0.0/16 when a client fails to obtain an IP from a DHCP server." },
      { question: "What is a Default Gateway?", answer: "A Default Gateway is the router interface connecting a local area network to external networks, routing traffic outside the local subnet." },
      { question: "Explain the difference between unicast, broadcast, and multicast.", answer: "Unicast: one-to-one communication. Broadcast: one-to-all hosts on local subnet. Multicast: one-to-many specific group of hosts." },
      { question: "What is anycast routing?", answer: "Anycast is a routing scheme where traffic is sent to the nearest node (based on routing distance metrics) in a group of receivers sharing the same IP address." },
      { question: "What is a subnet mask?", answer: "A subnet mask is a 32-bit number that masks an IP address, dividing the IP address into network address bits and host address bits." },
      { question: "Can we use a subnet mask like 255.255.255.250?", answer: "No, a subnet mask must have contiguous 1s from the left followed by contiguous 0s. 250 in binary is 11111010, which violates this rule." },
      { question: "What is the IPv6 representation format?", answer: "IPv6 is written in 8 groups of 4 hexadecimal characters separated by colons (e.g. 2001:0db8:85a3:0000:0000:8a2e:0370:7334), with double colons (::) replacing zero blocks." },
      { question: "Explain the difference between classless and classful routing protocols.", answer: "Classless routing protocols send subnet mask information in routing updates (supporting VLSM/CIDR). Classful routing protocols do not transmit subnet masks, assuming default masks." },
      { question: "What is packet fragmentation in IP layers?", answer: "IP fragmentation is a process that breaks packets into smaller pieces if they exceed the Maximum Transmission Unit (MTU) of the physical link, reassembling them at the destination." }
    ]
  },
  {
    title: "Routing Protocols & Algorithms",
    order: 3,
    content: `### Routing Protocols & Algorithms

**Routing** is the process of selecting paths in a network along which to send network traffic. It is performed by dedicated Layer 3 devices called routers.

#### Routing Algorithms
- **Distance Vector Routing**: Routers share their entire routing table with immediate neighbors periodically. Uses the **Bellman-Ford Algorithm** to find shortest paths. Suffers from the **Count-to-Infinity Problem** (mitigated by Split Horizon and Route Poisoning). Example: RIP.
- **Link State Routing**: Routers flood information about their immediate link states to all nodes. Each router builds a complete network topology map and runs **Dijkstra's Algorithm** to compute shortest paths. Example: OSPF.

#### Distance Vector vs. Link State Routing:
| Feature | Distance Vector (RIP) | Link State (OSPF) |
|---------|-----------------------|-------------------|
| Algorithm | Bellman-Ford | Dijkstra |
| Topology Map | Knows only neighbors | Knows entire network map |
| Convergence | Slow | Fast |
| Bandwidth Used| Low updates, but periodic | High during flooding |

#### TCP Connection Lifecycle
- **Three-way Handshake (Establishment)**:
  1. Sender sends a **SYN** packet (Synchronize sequence numbers).
  2. Receiver responds with a **SYN-ACK** packet.
  3. Sender sends an **ACK** packet (Acknowledge connection).
- **Four-way Teardown (Termination)**:
  - Consists of two pairs of **FIN** and **ACK** exchanges from each side to close communication unidirectionally.`,
    interviewQuestions: [
      { question: "What is Routing?", answer: "Routing is the process of finding the optimal path for forwarding IP packets from a source host to a destination host across networks using a routing table." },
      { question: "Explain Distance Vector Routing and name its algorithm.", answer: "Distance Vector Routing periodically shares entire routing tables with direct neighbors. It uses the Bellman-Ford algorithm to compute shortest paths based on hop counts." },
      { question: "Explain Link State Routing and name its algorithm.", answer: "Link State Routing floods state updates to all routers in the network. Each router constructs the entire topology graph and runs Dijkstra's algorithm to compute shortest paths." },
      { question: "What is the Count-to-Infinity problem and how is it fixed?", answer: "Count-to-Infinity is a routing loop issue in Distance Vector protocols when a link fails. Fixed using: Split Horizon (don't advertise routes back to source) and Route Poisoning (advertise infinite cost)." },
      { question: "What is the difference between RIP and OSPF?", answer: "RIP is a Distance Vector protocol, limited to 15 hops (slow convergence). OSPF is a Link State protocol, uses bandwidth as metric, supports infinite networks, and converges fast." },
      { question: "What is BGP (Border Gateway Protocol)?", answer: "BGP is the core path-vector routing protocol of the public internet, used to route traffic between different Autonomous Systems (AS)." },
      { question: "Explain the TCP 3-way handshake process.", answer: "1. Client sends SYN (sync request), 2. Server responds with SYN-ACK (sync acknowledgment), 3. Client sends ACK (acknowledgment). The connection is established." },
      { question: "Explain the TCP 4-way connection teardown process.", answer: "1. Active side sends FIN, 2. Passive side responds with ACK. 3. Passive side completes data transmission and sends FIN, 4. Active side sends ACK, enters TIME-WAIT, and closes." },
      { question: "Explain TCP Flow Control via Sliding Window.", answer: "The receiver advertises a 'receive window' size in its headers, indicating how much data it can buffer. The sender limits its unacknowledged data to this size." },
      { question: "Explain the four phases of TCP Congestion Control.", answer: "1. Slow Start (exponential window growth), 2. Congestion Avoidance (additive increase), 3. Fast Retransmit (detect loss via 3 duplicate ACKs), 4. Fast Recovery." },
      { question: "What is the difference between Routing and Forwarding?", answer: "Routing is the network-wide process of building routing tables. Forwarding is the router-local action of transferring a packet from an input port to the correct output port." },
      { question: "What is a Routing Loop?", answer: "A routing loop is an anomaly where packets circulate continuously between a set of routers, consuming bandwidth until the packet Time-To-Live (TTL) expires." },
      { question: "What is Autonomous System (AS)?", answer: "An Autonomous System is a collection of IP networks managed by a single administrative entity (e.g. ISPs) running a unified routing policy." },
      { question: "Explain the difference between IGP and EGP.", answer: "IGP (Interior Gateway Protocol) routes traffic inside an Autonomous System (e.g. OSPF, RIP). EGP (Exterior Gateway Protocol) routes traffic between separate Autonomous Systems (e.g. BGP)." },
      { question: "What is the hop count in routing?", answer: "Hop count is the number of routers a packet must pass through from source to destination. In RIP, a hop count of 16 is considered unreachable." },
      { question: "What is Administrative Distance (AD)?", answer: "AD is a reliability rating assigned to routing sources. Lower AD values indicate higher trust (e.g. Direct route AD = 0, OSPF AD = 110)." },
      { question: "What is the role of Time-To-Live (TTL) in IP headers?", answer: "TTL is an 8-bit counter decremented by 1 at each router hop. When TTL reaches 0, the packet is discarded, preventing infinite routing loop cycles." },
      { question: "What is OSPF area 0?", answer: "OSPF area 0 (Backbone Area) is the core area of an OSPF network. All other OSPF areas must connect directly to Area 0 to route traffic." },
      { question: "What is Dijkstra's algorithm used for in networks?", answer: "Dijkstra's algorithm is used by Link State routing protocols to calculate the shortest path tree from the local router to all other nodes in the network." },
      { question: "What is a packet buffer in a router?", answer: "A packet buffer is queue memory in router ports used to temporarily store packets when output transmission links are congested." }
    ]
  },
  {
    title: "Network Security & Cryptography",
    order: 4,
    content: `### Network Security & Cryptography

**Network Security** involves policies and practices adopted to prevent and monitor unauthorized access, misuse, modification, or denial of a computer network and network-accessible resources.

#### Cryptography Foundations
- **Symmetric Cryptography**: Uses the **same key** for both encryption and decryption. Very fast. Example: AES, DES.
- **Asymmetric Cryptography**: Uses a **public key** (shared with everyone for encryption) and a **private key** (kept secret for decryption). Slow. Example: RSA.

#### Asymmetric Key Handshake Diagram:
\`\`\`
+-----------------------------------------------------------+
|                                                           |
|    [Sender] ---(Encrypts with Public Key)---> [Ciphertext] |
|                                                    |      |
|                                                (Transmit) |
|                                                    v      |
|    [Receiver] <---(Decrypts with Private Key)------+      |
|                                                           |
+-----------------------------------------------------------+
\`\`\`

#### Key Security Protocols:
- **HTTPS (HyperText Transfer Protocol Secure)**: Encrypts standard HTTP requests/responses. Runs over **SSL/TLS**.
- **SSL/TLS Handshake**:
  1. Client sends "Client Hello" with supported encryption methods.
  2. Server responds with Certificate containing its Public Key.
  3. Client verifies certificate, generates a random symmetric session key, encrypts it with server's public key, and sends it.
  4. Server decrypts using its Private Key. Subsequent communication uses this Symmetric session key.
- **DNS (Domain Name System)**: Resolves human-readable domain names into IP addresses. Runs on UDP port 53.`,
    interviewQuestions: [
      { question: "What is Network Security and what is the CIA Triad?", answer: "Network Security protects network integrity and resources. The CIA triad represents: Confidentiality (data privacy), Integrity (unaltered data), and Availability (reliable access)." },
      { question: "Explain Symmetric vs Asymmetric encryption.", answer: "Symmetric encryption uses a single key for both encryption and decryption (fast, e.g. AES). Asymmetric uses a public key for encryption and a private key for decryption (secure, e.g. RSA)." },
      { question: "How does the SSL/TLS Handshake work?", answer: "The client verifies the server's certificate. The client generates a random session key, encrypts it with the server's public key, and sends it. The server decrypts it. Both sides use this symmetric key for session traffic." },
      { question: "Explain the role of a Certificate Authority (CA).", answer: "A CA is a trusted third-party organization that validates identities and issues digital certificates, guaranteeing that public keys belong to their respective owners." },
      { question: "What is DNS and why is it called the phonebook of the internet?", answer: "DNS (Domain Name System) translates human-readable domain names (e.g. google.com) into physical machine-routable IP addresses, running on UDP port 53." },
      { question: "Explain the difference between asymmetric digital signatures and encryption.", answer: "Encryption hides data (encrypt with receiver's public key, decrypt with private key). Digital signatures verify authenticity (encrypt hash with sender's private key, decrypt with public key)." },
      { question: "What is a Firewall?", answer: "A Firewall is a security system that monitors and controls incoming and outgoing network traffic based on predetermined rules, acting as a barrier between secure and unsecure networks." },
      { question: "Explain DDoS (Distributed Denial of Service) attack.", answer: "A DDoS attack attempts to make a server or network resource unavailable to users by flooding it with traffic from multiple compromised computer systems (botnets)." },
      { question: "What is ARP Spoofing?", answer: "ARP Spoofing is an attack where malicious ARP packets associate the attacker's MAC address with a target host's IP address, intercepting network traffic (Man-in-the-Middle)." },
      { question: "What is a VPN (Virtual Private Network)?", answer: "A VPN creates a secure, encrypted tunnel over a public network, masking the user's physical location and protecting data transmission from interceptors." },
      { question: "What is the difference between SSL and TLS?", answer: "TLS (Transport Layer Security) is the updated, more secure cryptographic protocol succeeding SSL (Secure Sockets Layer), though they are often used interchangeably." },
      { question: "What is a cookie in web browsing?", answer: "A cookie is a small text file stored on the client's machine by the web browser, containing session IDs or user preferences to maintain state across pages." },
      { question: "Explain cross-site scripting (XSS).", answer: "XSS is a vulnerability where an attacker injects malicious client-side scripts into web pages viewed by other users, stealing session cookies or redirecting users." },
      { question: "What is port scanning?", answer: "Port scanning is a reconnaissance technique that sends requests to various server port numbers to identify active services and discover open entry points." },
      { question: "What is a packet sniffer?", answer: "A packet sniffer (e.g. Wireshark) is software or hardware that intercepts and logs network traffic passing through a network interface card." },
      { question: "Explain IP Spoofing.", answer: "IP Spoofing is a technique where an attacker sends IP packets with a forged source IP address to masquerade as a trusted network host." },
      { question: "What is a cryptographic hash function? Name examples.", answer: "A hash function maps arbitrary data to a fixed-size string, is one-way (non-reversible), and collision-resistant. Examples: SHA-256, MD5." },
      { question: "What is a Man-in-the-Middle (MitM) attack?", answer: "A MitM attack is where a malicious actor secretly intercepts, relays, and alters communication between two nodes who believe they are communicating directly." },
      { question: "What is Phishing?", answer: "Phishing is a social engineering attack that tricks users into revealing sensitive data (credentials, keys) by mimicking trusted organizations in emails or websites." },
      { question: "What is IPSec?", answer: "IPSec (Internet Protocol Security) is a protocol suite that secures IP communications by encrypting and authenticating each IP packet in a session." }
    ]
  }
];

module.exports = {
  osLessons,
  dbmsLessons,
  cnLessons
};
