const osTheoryChapters = {
  "Operating System Introduction": {
    content: `### Operating System Introduction

An **Operating System (OS)** is the core software that manages all the hardware and software resources in a computer system. It acts as an intermediary between the user and the computer hardware, enabling you to run applications, manage files, and perform other computing tasks seamlessly. Without an OS, you’d have to directly handle each hardware component yourself, which would be extremely tedious and prone to errors.

---

> [!ANALOGY]
> Think of an OS like the event coordinator at a big concert: The coordinator (OS) ensures that each performer (application) has the required resources (stage, microphones, instruments). They also manage the crowd flow (CPU and memory) to prevent chaos. They handle behind-the-scenes logistics like security and scheduling (system security and process management).

---

### Core Components of an Operating System
When the OS loads into memory, it provides several core features that make computing convenient and efficient:

* **Process Management**: Creates, schedules, and terminates processes (running programs).
* **Memory Management**: Allocates and deallocates memory space, ensuring each program gets what it needs without interfering with others.
* **File System Management**: Organizes data in files and folders on storage devices for easy access and management.
* **Device Management**: Communicates with hardware components (like keyboards, printers, and disks) via device drivers.
* **Security & Protection**: Prevents unauthorized access to data and system resources.

---

### Abstract Representation of System Layers:
\`\`\`
+-------------------------------------------------+
|                   USERS                         |
+-------------------------------------------------+
|                APPLICATIONS                     |
+-------------------------------------------------+
|             OPERATING SYSTEM                    |
|  [Process Mgr] [Memory Mgr] [File/Device Mgr]   |
+-------------------------------------------------+
|                 HARDWARE                        |
|        [CPU] [RAM] [I/O Devices] [Disk]         |
+-------------------------------------------------+
\`\`\``,
    codeExamples: [
      { language: "cpp", code: `// C++ system call to check system uptime (Unix/Linux)
#include <iostream>
#include <sys/sysinfo.h>
using namespace std;

int main() {
    struct sysinfo s_info;
    if (sysinfo(&s_info) == 0) {
        cout << "System Uptime: " << s_info.uptime << " seconds" << endl;
        cout << "Total RAM: " << s_info.totalram / (1024 * 1024) << " MB" << endl;
    }
    return 0;
}` },
      { language: "java", code: `// Java code to inspect system runtime details
public class SystemDetails {
    public static void main(String[] args) {
        Runtime runtime = Runtime.getRuntime();
        System.out.println("Available Processors: " + runtime.availableProcessors());
        System.out.println("Free Memory: " + runtime.freeMemory() / (1024 * 1024) + " MB");
    }
}` },
      { language: "python", code: `# Python platform check utility
import os
import platform

print("Operating System:", platform.system())
print("OS Release version:", platform.release())
print("Logical CPU count:", os.cpu_count())` }
    ],
    interviewTips: "Begin OS questions by stating the primary goal: providing an abstraction layer over hardware and managing system resources efficiently.",
    commonMistakes: "Confusing system utility applications (like compilers or text editors) with the core operating system kernel.",
    realInterviewQuestions: [
      { question: "What is the difference between an Operating System and a Kernel?", answer: "The Kernel is the core component of the OS that directly interacts with the hardware (handles memory, processes, and CPU scheduling). The OS includes the kernel plus system utilities, GUI shells, and default user applications." }
    ],
    companyFAQs: [
      { companyName: "TCS", questionText: "Define OS and list its main responsibilities." },
      { companyName: "Infosys", questionText: "What is the role of system calls in an OS?" }
    ]
  },

  "Process, Program, and Thread": {
    content: `### Process, Program, and Thread

Understanding the distinction between a Program, a Process, and a Thread is fundamental to understanding concurrent execution.

### Key Concepts & Definitions

1. **Program**: A passive entity. It is a file containing a list of instructions stored on disk (e.g., an executable file like \`chrome.exe\`).
2. **Process**: An active entity. It is a program in execution. When a program is loaded into memory, it becomes a process, containing its own address space, PCB, and resources.
3. **Thread**: The smallest unit of execution within a process. A single process can have multiple threads sharing the same code segment, data segment, and OS resources, but having their own stack and registers.

---

> [!ANALOGY]
> **Program**: A cooking recipe printed in a book (passive, on disk).
> **Process**: A chef actively cooking the dish in a kitchen (active, in memory, using resources).
> **Thread**: Assistant chefs helping the main chef in the same kitchen to chop vegetables, boil water, and plate the dish simultaneously (sharing kitchen resources but working on sub-tasks).

---

### Memory Segments of a Process:
\`\`\`
+---------------------------------------------+
|    Stack (Local variables, parameters)      |
|              |                              |
|              v (Grows downward)             |
|                                             |
|              ^ (Grows upward)               |
|              |                              |
|    Heap (Dynamically allocated memory)      |
+---------------------------------------------+
|    Data Segment (Global & static variables) |
+---------------------------------------------+
|    Text Segment (Compiled machine code)    |
+---------------------------------------------+
\`\`\``,
    codeExamples: [
      { language: "cpp", code: `// C++ process creation demo (Unix fork)
#include <iostream>
#include <unistd.h>
using namespace std;

int main() {
    pid_t pid = fork();
    if (pid == 0) {
        cout << "Child Process PID: " << getpid() << endl;
    } else if (pid > 0) {
        cout << "Parent Process PID: " << getpid() << endl;
    }
    return 0;
}` },
      { language: "java", code: `// Java thread creation demo
class HelperThread extends Thread {
    public void run() {
        System.out.println("Thread running: " + Thread.currentThread().getName());
    }
}

public class Main {
    public static void main(String[] args) {
        HelperThread t = new HelperThread();
        t.start();
    }
}` },
      { language: "python", code: `# Python multi-threading example
import threading

def print_hello():
    print("Hello from thread:", threading.current_thread().name)

t = threading.Thread(target=print_hello)
t.start()` }
    ],
    interviewTips: "Always highlight that threads share the heap and data segments of their parent process but maintain their own registers and program counter.",
    commonMistakes: "Believing that child processes share the same physical memory space as the parent after fork() without realizing it uses Copy-on-Write (COW).",
    realInterviewQuestions: [
      { question: "Why is context-switching between threads faster than between processes?", answer: "Threads share the same virtual address space, memory pages, and open descriptors, so switching threads doesn't require reloading page tables or flushing TLBs, whereas process switches do." }
    ],
    companyFAQs: [
      { companyName: "Amazon", questionText: "Differentiate between multiprocessing and multithreading." },
      { companyName: "Cognizant", questionText: "Explain the memory layout of a process." }
    ]
  },

  "Types of Operating System": {
    content: `### Types of Operating System

Operating systems have evolved through several phases to meet changing hardware capabilities and user demands.

### Major Classifications

* **Batch OS**: Users submit jobs to an operator who batches similar jobs together. CPU idle time is high because input/output operations are slow.
* **Multiprogramming OS**: Keeps multiple jobs in main memory simultaneously. If the active job blocks for I/O, the OS switches to another job, maximizing CPU utilization.
* **Multitasking/Time-Sharing OS**: An extension of multiprogramming. The CPU executes multiple jobs by switching between them frequently (using small time quantums), creating an interactive experience for users.
* **Multiprocessing OS**: Utilizes two or more physical CPUs within a single system to run processes in parallel.
* **Real-Time OS (RTOS)**: Designed for systems where tasks must be executed within strict, deterministic time limits (e.g., flight control, medical devices).
* **Distributed OS**: Coordinates independent computers connected via networks, appearing to users as a single unified system.

---

### Evolutionary Roadmap of Operating Systems:
\`\`\`
+--------------+     +-------------------+     +---------------------+
|   Batch OS   | --> | Multiprogramming  | --> |   Multitasking OS   |
| (Cards/Tape) |     | (RAM allocation)  |     | (Time Slice/Shared) |
+--------------+     +-------------------+     +---------------------+
                                                          |
                                                          v
                                               +---------------------+
                                               |  Multiprocessing &  |
                                               |  Real-Time Systems  |
                                               +---------------------+
\`\`\``,
    codeExamples: [
      { language: "cpp", code: `// C++ CPU time calculation
#include <iostream>
#include <ctime>
using namespace std;

int main() {
    clock_t start = clock();
    // Simulate some computation workload
    double sum = 0;
    for (int i = 0; i < 10000000; i++) sum += i;
    clock_t end = clock();
    cout << "Workload execution time: " << double(end - start) / CLOCKS_PER_SEC << " seconds" << endl;
    return 0;
}` },
      { language: "java", code: `// Java thread sleep demo (simulating time-sharing schedules)
public class TimeShare {
    public static void main(String[] args) throws InterruptedException {
        System.out.println("Running Task 1");
        Thread.sleep(100); // Give processor time to other threads
        System.out.println("Running Task 2");
    }
}` },
      { language: "python", code: `# Python time measurement utility
import time

t0 = time.perf_counter()
time.sleep(0.5)
print("Slept for:", time.perf_counter() - t0, "seconds")` }
    ],
    interviewTips: "Be ready to explain how time-sharing is built on top of multiprogramming by introducing a clock interrupt timer.",
    commonMistakes: "Confusing multiprogramming (keeping multiple programs in memory) with multiprocessing (using multiple CPUs).",
    realInterviewQuestions: [
      { question: "What is the difference between hard and soft real-time systems?", answer: "Hard real-time systems guarantee that critical tasks complete on time, and missing a deadline results in system failure. Soft real-time systems prioritize critical tasks, but missing a deadline only degrades performance without catastrophic failure." }
    ],
    companyFAQs: [
      { companyName: "Wipro", questionText: "What is a Time-Sharing Operating System?" },
      { companyName: "TCS", questionText: "List three advantages of multiprogramming." }
    ]
  },

  "Batch OS, Multiprogramming OS and Multitasking OS": {
    content: `### Batch OS, Multiprogramming OS and Multitasking OS

Let's do a deep dive comparison of these three foundational modes of operating systems.

### 1. Batch Operating System
* **Concept**: Jobs are punched on cards or magnetic tapes and submitted in groups (batches) to an operator. The CPU executes one batch after another.
* **Bottleneck**: If a job waits for I/O, the CPU sits idle. There is no direct interaction between the user and the executing program.

### 2. Multiprogramming Operating System
* **Concept**: Keeps multiple programs in memory (RAM). When the current program goes to wait for I/O (like writing to disk or reading input), the CPU immediately switches to another program.
* **Goal**: Maximize CPU utilization. CPU is almost never idle.

### 3. Multitasking (Time-Sharing) Operating System
* **Concept**: Multiple tasks run in memory. The CPU switches between them rapidly, allocating a small time slot (time slice / quantum) to each task.
* **Goal**: Minimize response time. User feels that all programs are running simultaneously in parallel.

---

### Detailed Mode Comparison Table:

| Attribute | Batch OS | Multiprogramming OS | Multitasking OS |
|---|---|---|---|
| **CPU Utilization** | Low | Very High | High |
| **Response Time** | Hours/Days | Moderate | Milliseconds (Interactive) |
| **Scheduling Rule** | FCFS (Sequential) | Priority / Ready Check | Round Robin (Time-Slice) |
| **User Interaction**| None | Minimal | High (Interactive) |

---

### Visual Comparison of CPU Execution:
\`\`\`
Batch OS (Sequential, CPU waits for I/O):
[Job 1 (CPU)] ---> [Job 1 (I/O) - CPU IDLE] ---> [Job 2 (CPU)]

Multiprogramming OS (CPU switches on I/O block):
[Job 1 (CPU)] ---> [Job 1 blocks -> Job 2 (CPU)] ---> [Job 2 blocks -> Job 1 resumes]

Multitasking OS (CPU switches on time quantum):
[Job 1 (10ms)] ---> [Job 2 (10ms)] ---> [Job 3 (10ms)] ---> [Job 1 (10ms)]
\`\`\``,
    codeExamples: [
      { language: "cpp", code: `// C++ simulation of task switching
#include <iostream>
#include <vector>
#include <string>
using namespace std;

struct Task {
    string name;
    int remainingTime;
};

int main() {
    vector<Task> readyQueue = {{"Task A", 25}, {"Task B", 15}, {"Task C", 10}};
    int quantum = 10;
    while (!readyQueue.empty()) {
        Task current = readyQueue[0];
        readyQueue.erase(readyQueue.begin());
        int runTime = min(current.remainingTime, quantum);
        cout << "Running " << current.name << " for " << runTime << " ms" << endl;
        current.remainingTime -= runTime;
        if (current.remainingTime > 0) {
            readyQueue.push_back(current);
        } else {
            cout << current.name << " finished execution." << endl;
        }
    }
    return 0;
}` },
      { language: "java", code: `// Java thread time-slice scheduler simulation
public class TaskSwitchSimulation {
    public static void main(String[] args) {
        System.out.println("Scheduler simulated via system loops.");
    }
}` },
      { language: "python", code: `# Python generator showing co-routine yield (cooperative multitasking)
def task_runner(name, steps):
    for i in range(1, steps + 1):
        print(f"{name} running step {i}")
        yield

t1 = task_runner("Task 1", 3)
t2 = task_runner("Task 2", 2)

tasks = [t1, t2]
while tasks:
    t = tasks.pop(0)
    try:
        next(t)
        tasks.push(t) if hasattr(t, '__next__') else None
        tasks.append(t)
    except StopIteration:
        pass` }
    ],
    interviewTips: "Highlight that Multitasking is a logical extension of Multiprogramming where the CPU switch is triggered by time slice timeouts rather than just IO blocks.",
    commonMistakes: "Thinking that multitasking requires multiple processor chips. It actually runs on a single CPU via time division multiplexing.",
    realInterviewQuestions: [
      { question: "What is Spooling and how does it relate to batch systems?", answer: "SPOOL stands for Simultaneous Peripheral Operations On-Line. It is a buffer system that stores card inputs and printer outputs on disk, allowing the CPU to read/write from disk fast rather than slow card readers/printers directly, paving the way for batch queuing." }
    ],
    companyFAQs: [
      { companyName: "Infosys", questionText: "Define multitasking. How does it improve user response time?" },
      { companyName: "Mindtree", questionText: "Compare multiprogramming and time sharing systems." }
    ]
  },

  "Multiprocessing OS and Real-time OS": {
    content: `### Multiprocessing OS and Real-time OS

This chapter explores Multiprocessing architectures and Real-Time systems in detail.

### Multiprocessing Operating System
A Multiprocessing Operating System allows multiple processors (CPUs) to work together to execute multiple processes simultaneously. It enhances system performance, speed, and reliability by distributing tasks among several CPUs.

### In a multiprocessing system
The processors share resources like memory, input/output devices, etc. They can work on different tasks simultaneously, increasing efficiency and reducing task completion time.

---

> [!TIP]
> **Benefits of Multiprocessing**
> * **Increased Performance**: Multiple processors divide the workload, resulting in faster task execution.
> * **Reliability**: If one processor fails, others can continue to function (fault tolerance in distributed systems).
> * **Scalability**: Additional processors can be added to handle more tasks (in SMP and distributed systems).

---

### Types of Multiprocessing

1. **Symmetric Multiprocessing (SMP)**:
   * Every processor runs an identical copy of the operating system. They share the physical memory space and communicate with each other over the system bus.
   * **Analogy**: Imagine a group of chefs in a kitchen where all chefs have the same skill set. They can cook any dish and share the same kitchen resources (like ingredients and tools). Each chef works on their assigned task, speeding up the meal preparation.

2. **Asymmetric Multiprocessing (AMP)**:
   * Processors are assigned specific duties (Master-Slave architecture). A master processor allocates tasks to the slave processors.

3. **Distributed Multiprocessing**:
   * **Analogy**: This is like a group of remote freelancers working on a shared project. Each freelancer has their own workspace and tools but communicates through email or chat to divide the workload and ensure everyone's tasks align.
   * In distributed systems, multiple processors are located in different physical locations and communicate via a network to work on tasks.
   * **Characteristics**: Each processor has its own memory and operating system. Tasks are divided and executed across multiple systems.
   * **Advantages**: High fault tolerance and scalability. Ideal for large-scale systems.
   * **Disadvantages**:
     * *Complexity and Overhead*: Network Dependency, i.e., failure of network can disturb operations.

---

### Real-Time Operating System
A **Real-Time Operating System (RTOS)** is an operating system designed to process data and execute tasks within a strict time frame. Unlike general-purpose operating systems (like Windows or Linux), where delays are acceptable, an RTOS prioritizes the timely execution of tasks, ensuring deterministic behavior.

---

> [!ANALOGY]
> Imagine a restaurant kitchen as an RTOS: The head chef (RTOS) ensures tasks (orders) are completed on time. Orders must be served within a specific time limit to satisfy customers, otherwise, the meal is rejected.

---

### Real-Time Scheduling Priority:
\`\`\`
+---------------------+
| Critical Interrupt  |  =====> Immediate Switch (No buffering delay)
+---------------------+
|   High Priority RT  |  =====> Task preemption (Displaces lower tasks)
+---------------------+
|   Standard Process  |  =====> Runs only when CPU is fully idle
+---------------------+
\`\`\``,
    codeExamples: [
      { language: "cpp", code: `// C++ check CPU affinity mask (Linux scheduler affinity)
#include <iostream>
#include <sched.h>
#include <pthread.h>
using namespace std;

int main() {
    cpu_set_t cpuset;
    CPU_ZERO(&cpuset);
    pthread_getaffinity_np(pthread_self(), sizeof(cpu_set_t), &cpuset);
    cout << "CPUs currently assigned to this process thread: ";
    for (int i = 0; i < CPU_SETSIZE; i++) {
        if (CPU_ISSET(i, &cpuset)) {
            cout << i << " ";
        }
    }
    cout << endl;
    return 0;
}` },
      { language: "java", code: `// Java thread priority check
public class ThreadPriorityDemo {
    public static void main(String[] args) {
        Thread t = new Thread(() -> System.out.println("Real-time task running"));
        t.setPriority(Thread.MAX_PRIORITY); // Requests maximum scheduler urgency
        t.start();
    }
}` },
      { language: "python", code: `# Python multiprocessing module demo
import multiprocessing

def square(num):
    print(f"Process {multiprocessing.current_process().name} reports: {num} squared is {num * num}")

if __name__ == "__main__":
    processes = []
    for i in range(4):
        p = multiprocessing.Process(target=square, args=(i,))
        processes.append(p)
        p.start()` }
    ],
    interviewTips: "Emphasize that the key property of an RTOS is 'determinism' (reproducibility of response latency) rather than just raw system throughput speed.",
    commonMistakes: "Thinking that asymmetric multiprocessing (AMP) is more scalable than symmetric multiprocessing (SMP), when SMP is actually much better balanced and widely used.",
    realInterviewQuestions: [
      { question: "What is a critical section in multiprocessing contexts?", answer: "A critical section is a segment of code where shared resources (memory, variables) are accessed by multiple CPUs. It must be protected via synchronization mechanisms (like mutexes) to prevent race conditions." }
    ],
    companyFAQs: [
      { companyName: "Qualcomm", questionText: "Explain Symmetric Multiprocessing (SMP) architecture." },
      { companyName: "Boeing", questionText: "Why is an RTOS required in flight navigation software?" }
    ]
  },

  "Distributed, Clustured, Embedded OS": {
    content: `### Distributed, Clustured, Embedded OS

Let's review these specialized OS models.

### 1. Distributed OS
* **Concept**: Loose coupling of autonomous hardware units. System resources are distributed across network nodes, managed by a single distributed OS.
* **Advantage**: High processing capacity, load sharing, and location transparency.
* **Disadvantage**: Security risks, high network transmission delays, database synchronization complexities.

### 2. Clustered OS
* **Concept**: Combines multiple independent systems (nodes) sharing a common storage area network (SAN) or high-speed interconnect.
* **Goal**: Provide high availability and failover management. If one node fails, another node takes over immediately.
* **Types**: Asymmetric clustering (one standby node does nothing but wait to failover) vs. Symmetric clustering (all nodes run applications simultaneously).

### 3. Embedded OS
* **Concept**: Special-purpose operating system designed for dedicated hardware chips (e.g., in microwave ovens, automobiles, smartwatches, IoT chips).
* **Goal**: High code density, low power consumption, and minimal memory usage.

---

### Clustered Storage Scheme:
\`\`\`
+-----------+    +-----------+    +-----------+
|  Node 1   |    |  Node 2   |    |  Node 3   |
| (Active)  |    | (Active)  |    | (Standby) |
+-----------+    +-----------+    +-----------+
      \\               |               /
       +--------------+--------------+
                      | (Shared storage interface)
                      v
             [ Storage Area Network ]
             [    (Shared Disk)     ]
\`\`\``,
    codeExamples: [
      { language: "cpp", code: `// C++ check hostname in distributed nodes
#include <iostream>
#include <unistd.h>
using namespace std;

int main() {
    char hostname[256];
    if (gethostname(hostname, sizeof(hostname)) == 0) {
        cout << "Node Hostname: " << hostname << endl;
    }
    return 0;
}` },
      { language: "java", code: `// Java network socket setup (distributed message pass)
import java.net.*;
import java.io.*;

public class DistributedNode {
    public static void main(String[] args) throws IOException {
        System.out.println("Node starting listening on port 8080...");
        try (ServerSocket server = new ServerSocket(8080)) {
            // Socket listening loop...
        }
    }
}` },
      { language: "python", code: `# Python remote request simulator
import urllib.request

try:
    response = urllib.request.urlopen('http://localhost:8080/status', timeout=1)
    print("Node check response status:", response.status)
except Exception as e:
    print("Node unreachable:", e)` }
    ],
    interviewTips: "Distinguish between Clustered systems (nodes share a storage array) and Distributed systems (nodes have their own separate independent disks).",
    commonMistakes: "Thinking that clustered systems cannot perform load balancing, whereas they frequently balance parallel tasks across nodes.",
    realInterviewQuestions: [
      { question: "What is failover in clustered systems?", answer: "Failover is the process of automatically switching applications from a failed node to a healthy standby node, ensuring continuous application availability without user intervention." }
    ],
    companyFAQs: [
      { companyName: "HP", questionText: "Differentiate between asymmetric and symmetric clustering." },
      { companyName: "Deloitte", questionText: "What are the advantages of a Distributed OS?" }
    ]
  },

  "Process and Its State": {
    content: `### Process and Its State

A process changes its state dynamically as it undergoes execution.

### The 5-State Process Model

1. **New**: The process is being created.
2. **Ready**: The process is loaded in memory and waiting to be assigned to a processor.
3. **Running**: Instructions are being executed by the CPU.
4. **Waiting / Blocked**: The process is waiting for some event to occur (such as I/O completion).
5. **Terminated**: The process has finished execution.

---

### Process State Diagram:
\`\`\`
   [New]
     |
     v (Admitted)
   [Ready] <------------------+
     |   ^                    |
     |   | (Time slice)       |
     |   |                    |
     v   |                    | (I/O complete)
   [Running]                  |
     |   \\                    |
     |    +--> [Terminated]   |
     v                        |
   [Waiting] -----------------+
\`\`\``,
    codeExamples: [
      { language: "cpp", code: `// C++ process state display utility (Linux proc file reader)
#include <iostream>
#include <fstream>
#include <string>
using namespace std;

int main() {
    ifstream statusFile("/proc/self/status");
    string line;
    while (getline(statusFile, line)) {
        if (line.rfind("State:", 0) == 0) {
            cout << "Current Process State: " << line << endl;
            break;
        }
    }
    return 0;
}` },
      { language: "java", code: `// Java thread state display
public class ThreadStates {
    public static void main(String[] args) {
        Thread t = new Thread(() -> {
            try { Thread.sleep(100); } catch (Exception e) {}
        });
        System.out.println("State on creation: " + t.getState()); // NEW
        t.start();
        System.out.println("State on start: " + t.getState()); // RUNNABLE
    }
}` },
      { language: "python", code: `# Python process checker (via psutil library)
import psutil
import os

p = psutil.Process(os.getpid())
print("My Process Status state:", p.status())` }
    ],
    interviewTips: "Draw the state diagram immediately when asked about process state transitions. Clearly mark transition triggers (Admitted, Scheduler Dispatch, Interrupt, I/O wait, I/O complete).",
    commonMistakes: "Believing a process can transition directly from the Waiting state to the Running state, whereas it must always go back to the Ready queue first.",
    realInterviewQuestions: [
      { question: "What is the difference between a process state block and thread state block?", answer: "Process states are managed at the OS level (Ready, Waiting, Running) to allocate RAM and scheduling blocks. Thread states are lighter and managed inside JVM/runtime contexts, though mapped to kernel states if using kernel threads." }
    ],
    companyFAQs: [
      { companyName: "Amazon", questionText: "Draw and explain the 5-state process diagram." },
      { companyName: "L&T", questionText: "What triggers a transition from Running to Ready?" }
    ]
  },

  "Process Control Block": {
    content: `### Process Control Block

The **Process Control Block (PCB)** is a data structure maintained by the operating system for each process. It is also called a Task Control Block.

### Information Stored in PCB

* **Process State**: Current state of the process (New, Ready, Running, etc.).
* **Program Counter (PC)**: Indicates the address of the next instruction to be executed for this process.
* **CPU Registers**: Includes accumulators, stack pointers, and general-purpose registers that must be saved during context switches.
* **CPU Scheduling Information**: Process priority, pointers to scheduling queues.
* **Memory Management Information**: Page tables, segment tables, limit registers.
* **Accounting Information**: CPU time used, time limits, process numbers.
* **I/O Status Information**: List of open files, I/O devices allocated.

---

### Structure of a PCB:
\`\`\`
+-----------------------------------+
|            Process ID             |
|           Process State           |
+-----------------------------------+
|      Program Counter (Addr)       |
+-----------------------------------+
|      CPU Registers (Saved)        |
+-----------------------------------+
|     Memory Allocation Limits      |
+-----------------------------------+
|        List of Open Files         |
+-----------------------------------+
|      Scheduling Priority / Info   |
+-----------------------------------+
\`\`\``,
    codeExamples: [
      { language: "cpp", code: `// C++ representation of a simple Process PCB struct
#include <iostream>
#include <string>
using namespace std;

struct PCB {
    int processID;
    string processState;
    int programCounter;
    int priority;
    double cpuTimeUsed;
};

void printPCB(const PCB& pbc) {
    cout << "PID: " << pbc.processID << " | State: " << pbc.processState << " | PC: " << pbc.programCounter << endl;
}

int main() {
    PCB process1 = {101, "Ready", 0x7FFF00, 3, 0.0};
    printPCB(process1);
    return 0;
}` },
      { language: "java", code: `// Java simulation of a process control block registry
import java.util.HashMap;

class PCB {
    int pid;
    String state;
    int pc;
    PCB(int pid) { this.pid = pid; this.state = "NEW"; this.pc = 0; }
}

public class PCBRegistry {
    public static void main(String[] args) {
        HashMap<Integer, PCB> registry = new HashMap<>();
        registry.put(101, new PCB(101));
        System.out.println("Process registered: " + registry.get(101).pid);
    }
}` },
      { language: "python", code: `# Python class mimicking a Task control block
class TaskControlBlock:
    def __init__(self, tid, priority=1):
        self.tid = tid
        self.state = "READY"
        self.registers = {"R1": 0, "R2": 0, "SP": 0xFF}
        self.priority = priority` }
    ],
    interviewTips: "Describe the PCB as the 'manifest' or 'identity card' of a process. Emphasize that the OS uses it to pause and resume processes safely.",
    commonMistakes: "Thinking that user applications can modify their own PCB fields directly. PCBs are stored in secure kernel memory space to prevent corruption.",
    realInterviewQuestions: [
      { question: "Where is the PCB stored?", answer: "The PCB is stored in secure kernel memory space. It is allocated when a process starts and is freed when the process terminates." }
    ],
    companyFAQs: [
      { companyName: "TCS", questionText: "What are the components of a PCB?" },
      { companyName: "Mindtree", questionText: "Explain how the OS uses program counters in PCB." }
    ]
  },

  "Context Switching": {
    content: `### Context Switching

A **Context Switch** is the mechanism by which the CPU saves the state of an active process (in its PCB) and loads the state of another process to resume its execution.

### Steps in Context Switching

1. The OS suspends the executing process $P_0$.
2. The values of the CPU registers (accumulators, PC, SP) for $P_0$ are saved into its PCB ($PCB_0$).
3. The OS updates $PCB_0$ state to Ready or Waiting.
4. The OS selects a new process $P_1$ from the ready queue.
5. The OS loads the register values and PC address of $P_1$ from its PCB ($PCB_1$).
6. The CPU resumes execution of $P_1$ at the restored instruction address.

---

> [!WARNING]
> **Context Switching Overhead**
> Context switching is pure overhead! The CPU does no useful work while saving and restoring registers. It depends on hardware support (multiple register sets) and operating system design to minimize context switch time.

---

### Context Switch Flow Diagram:
\`\`\`
       Process P0                     OS Kernel                     Process P1
      (Executing)
          |
  [ Clock Interrupt ]
          |
          v (Save registers)
          +----------------------> PCB_0 saved
                                         |
                                (Select next process)
                                         |
                                         v
                                   PCB_1 loaded
                                         |
                                         +-----------------------> (Load registers)
                                                                        |
                                                                        v
                                                                   (Executing)
\`\`\``,
    codeExamples: [
      { language: "cpp", code: `// C++ checking context switch counts in Linux (/proc/stat reader)
#include <iostream>
#include <fstream>
#include <string>
using namespace std;

int main() {
    ifstream statFile("/proc/stat");
    string line;
    while (getline(statFile, line)) {
        if (line.rfind("ctxt", 0) == 0) {
            cout << "Context Switches since boot: " << line << endl;
            break;
        }
    }
    return 0;
}` },
      { language: "java", code: `// Java thread yielding simulator (yield forces context check)
public class ThreadYield {
    public static void main(String[] args) {
        Thread t1 = new Thread(() -> {
            for (int i = 0; i < 5; i++) {
                System.out.println("A: " + i);
                Thread.yield(); // Request CPU yield to other threads
            }
        });
        t1.start();
    }
}` },
      { language: "python", code: `# Python yielding control flow
import time

def process_a():
    print("Process A starts")
    time.sleep(0.01) # Yields processor
    print("Process A finishes")` }
    ],
    interviewTips: "Mention that hardware registers, page tables, cache directories, and TLBs must be updated or flushed during process context switches, which makes it computationally expensive.",
    commonMistakes: "Assuming that context switching increases system throughput. It actually decreases pure CPU efficiency; it is done purely to enable interactive multiprogramming.",
    realInterviewQuestions: [
      { question: "What factors affect context-switching time?", answer: "Hardware architectural support (number of register sets), operating system complexity, and cache/TLB invalidation overhead." }
    ],
    companyFAQs: [
      { companyName: "Oracle", questionText: "Describe the steps of context switching." },
      { companyName: "Cognizant", questionText: "What is context switch overhead?" }
    ]
  },

  "User Mode and Kernel Mode": {
    content: `### User Mode and Kernel Mode

Operating systems use hardware-supported dual modes to protect system integrity and prevent user processes from disrupting other processes or crashing the system.

### The Dual Modes

1. **User Mode (Mode bit = 1)**:
   * Execution mode for user applications. Hardware restricts access to memory and direct hardware communication. User programs must make system calls to access hardware resources.
2. **Kernel Mode / System Mode (Mode bit = 0)**:
   * Execution mode for the core operating system kernel. Has complete access to hardware and system memory. Can execute privileged instructions.

---

### Privilege Transitions:
\`\`\`
   User Process (User Mode, bit = 1)
        |
        v [ System Call / Interrupt ] (Mode bit switches to 0)
   Kernel Code executed (Kernel Mode, bit = 0)
        |
        v [ Return from Syscall ] (Mode bit switches back to 1)
   Resume User Process (User Mode, bit = 1)
\`\`\``,
    codeExamples: [
      { language: "cpp", code: `// C++ file write (triggers privilege shift to Kernel Mode)
#include <iostream>
#include <fstream>
using namespace std;

int main() {
    // Opening file requires kernel access to disk controller
    ofstream myFile("test.txt");
    myFile << "Writing via system call" << endl;
    myFile.close();
    return 0;
}` },
      { language: "java", code: `// Java trigger of system call via Garbage Collector call
public class GCCall {
    public static void main(String[] args) {
        // Requesting GC triggers privilege interaction with kernel memory management
        System.gc();
        System.out.println("GC requested");
    }
}` },
      { language: "python", code: `# Python raw socket binding (triggers privilege check)
import socket
import sys

try:
    # Binding to ports below 1024 requires admin/kernel privilege
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.bind(('localhost', 80))
except PermissionError as e:
    print("Failed: Bind port 80 requires privileged mode:", e)` }
    ],
    interviewTips: "Be clear that system calls act as the secure entry points to transition from user mode to kernel mode.",
    commonMistakes: "Believing that compile-time checks can enforce dual mode security. Mode transition is strictly checked by the CPU hardware circuit at runtime.",
    realInterviewQuestions: [
      { question: "What are privileged instructions?", answer: "Instructions that can only be executed in kernel mode, such as direct I/O control, disabling interrupts, changing base/limit registers, and switching mode bits." }
    ],
    companyFAQs: [
      { companyName: "Cisco", questionText: "Differentiate between User Mode and Kernel Mode." },
      { companyName: "Infosys", questionText: "Why is dual-mode execution necessary?" }
    ]
  },

  "Scheduling Queues and Schedulers in OS": {
    content: `### Scheduling Queues and Schedulers in OS

The operating system manages processes using several queues and specialized schedulers.

### 1. Scheduling Queues
* **Job Queue**: Set of all processes in the system.
* **Ready Queue**: Set of all processes in main memory (RAM) waiting to run.
* **Device Queue**: Set of processes waiting for a specific I/O device.

### 2. Types of Schedulers
* **Long-Term Scheduler (Job Scheduler)**:
   * Selects processes from disk and loads them into RAM (ready queue). It controls the **degree of multiprogramming** (total processes in memory).
* **Short-Term Scheduler (CPU Scheduler)**:
   * Selects process from ready queue and allocates CPU to it. Runs extremely fast.
* **Medium-Term Scheduler**:
   * Swaps processes out of RAM to disk (virtual memory/swapping) to reduce the degree of multiprogramming during resource crunch.

---

### Queue and Scheduler Interaction Flow:
\`\`\`
+-----------+                    +-----------+                     +-----+
|   Disk    | ==[Long-Term]===>  |   Ready   | ===[Short-Term]===> | CPU |
| Job Queue |                    |  Queue    |                     +-----+
+-----------+                    +-----------+                        |
      ^                                |                              | (I/O block)
      | (Swap-In)                      | (Swap-Out)                   v
      +======[Medium-Term Scheduler]===+                      +--------------+
                                                              | Device Queue |
                                                              +--------------+
\`\`\``,
    codeExamples: [
      { language: "cpp", code: `// C++ simple queue class representation
#include <iostream>
#include <queue>
#include <string>
using namespace std;

int main() {
    queue<string> readyQueue;
    readyQueue.push("Process 1");
    readyQueue.push("Process 2");
    while (!readyQueue.empty()) {
        cout << "Scheduling: " << readyQueue.front() << endl;
        readyQueue.pop();
    }
    return 0;
}` },
      { language: "java", code: `// Java ready queue simulation
import java.util.LinkedList;
import java.util.Queue;

public class SchedulerSimulation {
    public static void main(String[] args) {
        Queue<Integer> queue = new LinkedList<>();
        queue.add(1001); // Process PID 1001
        System.out.println("Scheduled PID: " + queue.poll());
    }
}` },
      { language: "python", code: `# Python simple priority scheduling queue
import heapq

ready_queue = []
heapq.heappush(ready_queue, (1, "Process 1 (High Priority)"))
heapq.heappush(ready_queue, (3, "Process 2 (Low Priority)"))
heapq.heappush(ready_queue, (2, "Process 3 (Medium Priority)"))

while ready_queue:
    p = heapq.heappop(ready_queue)
    print("Running:", p[1])` }
    ],
    interviewTips: "Explain that the long-term scheduler must maintain a good balance of CPU-bound processes (doing computation) and I/O-bound processes (doing I/O).",
    commonMistakes: "Believing that the long-term scheduler runs on every clock cycle. It runs infrequently (only when a process finishes or enters the system).",
    realInterviewQuestions: [
      { question: "What is degree of multiprogramming?", answer: "The maximum number of processes kept in main memory simultaneously. Managed by the Long-Term Scheduler." }
    ],
    companyFAQs: [
      { companyName: "Amazon", questionText: "Differentiate between short-term, medium-term, and long-term schedulers." },
      { companyName: "TCS", questionText: "What is swapping? Which scheduler handles it?" }
    ]
  },

  "Process Scheduling Algorithms, Preemptive vs. Non-Preemptive": {
    content: `### Process Scheduling Algorithms, Preemptive vs. Non-Preemptive

CPU scheduling algorithms can be classified into two major categories: Preemptive and Non-Preemptive.

### 1. Non-Preemptive Scheduling
* **Rule**: Once the CPU is allocated to a process, it holds the CPU until it either terminates or yields (blocks for I/O).
* **Pros**: Simple, low overhead (no clock interrupt routines needed).
* **Cons**: Short processes wait indefinitely behind long processes (Convoy Effect).
* **Examples**: First-Come First-Served (FCFS), Non-preemptive Shortest Job First (SJF).

### 2. Preemptive Scheduling
* **Rule**: The OS can interrupt a running process and reallocate the CPU to another process at any time (usually triggered by time-slice interrupts or priority changes).
* **Pros**: Responsive, suitable for interactive systems.
* **Cons**: Context-switching overhead, complex concurrency issues.
* **Examples**: Round Robin (RR), Shortest Remaining Time First (SRTF), Preemptive Priority.

---

### Conceptual State Transitions:
\`\`\`
Non-Preemptive Transition:
[Running] ================> Terminated or I/O Wait (Voluntary)

Preemptive Transition:
[Running] ==[Interrupt]===> Ready Queue (Involuntary)
\`\`\``,
    codeExamples: [
      { language: "cpp", code: `// C++ preemptive scheduler simulation logic skeleton
#include <iostream>
#include <vector>
using namespace std;

struct Process {
    int pid;
    int burstTime;
    int remainingTime;
};

void runPreemptiveTick(Process& p) {
    if (p.remainingTime > 0) {
        p.remainingTime--;
        cout << "PID " << p.pid << " runs (remaining: " << p.remainingTime << " ticks)" << endl;
    }
}` },
      { language: "java", code: `// Java thread interrupt demonstration
public class PreemptThread extends Thread {
    public void run() {
        while (!isInterrupted()) {
            // Task loop
        }
        System.out.println("Thread preempted and stopped.");
    }
}` },
      { language: "python", code: `# Python signal simulator mimicking preemptive timer ticks
import signal
import time

def handle_timer(signum, frame):
    print("Timer Tick: Context Switch Triggered!")

signal.signal(signal.SIGALRM, handle_timer)
signal.alarm(1) # Send tick after 1 second
time.sleep(2)` }
    ],
    interviewTips: "Clearly define preemption as the 'involuntary removal of CPU access from a process'. Mention clock interrupts as the hardware basis for preemption.",
    commonMistakes: "Assuming that Round Robin is a non-preemptive algorithm, when it is the classic preemptive time-sharing scheduling algorithm.",
    realInterviewQuestions: [
      { question: "What is the Convoy Effect?", answer: "The Convoy Effect is an anomaly in FCFS scheduling where a single long CPU-bound process blocks multiple short processes, causing overall waiting times to spike." }
    ],
    companyFAQs: [
      { companyName: "Infosys", questionText: "Differentiate between preemptive and non-preemptive scheduling." },
      { companyName: "Amazon", questionText: "Why is preemptive scheduling preferred in GUI-based operating systems?" }
    ]
  },

  "Scheduling Algorithms (FCFS, SJF, SRTF)": {
    content: `### Scheduling Algorithms (FCFS, SJF, SRTF)

Let's study the core CPU scheduling algorithms.

### 1. First-Come, First-Served (FCFS)
* **Rule**: Process that requests the CPU first gets it first. Non-preemptive.
* **Drawback**: Suffers from the Convoy Effect.

### 2. Shortest Job First (SJF)
* **Rule**: Schedules the process with the shortest next CPU burst time.
* **Note**: It is **optimal** because it guarantees the minimum average waiting time for a set of processes.
* **Limitation**: Hard to implement in practice because predicting the next CPU burst time is difficult. It is estimated using exponential averaging.

### 3. Shortest Remaining Time First (SRTF)
* **Rule**: Preemptive version of SJF. When a new process arrives, its remaining burst time is compared with the remaining time of the running process. If the new process is shorter, it preempts the running process.

---

### Solved Gantt Chart Example (SRTF):
Let's evaluate processes:
* P1: Arrival = 0ms, Burst = 8ms
* P2: Arrival = 1ms, Burst = 4ms
* P3: Arrival = 2ms, Burst = 9ms
* P4: Arrival = 3ms, Burst = 5ms

\`\`\`
Gantt Chart:
+-----+-----+-----+-----+
| P1  | P2  | P4  | P1  | ... P3
+-----+-----+-----+-----+
0     1     5     10    17    26
\`\`\`
* At t=1: P2 arrives (burst 4). P1 remaining is 7. P2 preempts P1.
* At t=5: P2 finishes. Remaining: P1 (7), P3 (9), P4 (5). P4 runs.
* At t=10: P4 finishes. Remaining: P1 (7), P3 (9). P1 runs.
* At t=17: P1 finishes. P3 runs.`,
    codeExamples: [
      { language: "cpp", code: `// C++ FCFS average waiting time solver
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> burst = {10, 5, 8};
    int n = burst.size();
    vector<int> wt(n, 0);
    for (int i = 1; i < n; i++) {
        wt[i] = wt[i-1] + burst[i-1];
    }
    double avgWT = 0;
    for (int w : wt) avgWT += w;
    cout << "Average Waiting Time (FCFS): " << avgWT / n << " ms" << endl;
    return 0;
}` },
      { language: "java", code: `// Java SJF simulator skeleton
public class SJFScheduler {
    public static void main(String[] args) {
        System.out.println("SJF prioritizes minimum burst processes.");
    }
}` },
      { language: "python", code: `# Python SRTF (Shortest Remaining Time First) scheduler tick simulator
def run_srtf_sim():
    processes = [{"pid": "P1", "rem": 8}, {"pid": "P2", "rem": 4}]
    # Run loop checking minimum 'rem' time...
    pass` }
    ],
    interviewTips: "Be ready to write a quick Gantt chart and compute Average Waiting Time (AWT) and Average Turnaround Time (ATT) for any scheduling algorithm in interviews.",
    commonMistakes: "Using arrival times incorrectly in Gantt charts, e.g. scheduling a process at t=0 when it only arrives at t=2.",
    realInterviewQuestions: [
      { question: "How is the next CPU burst time predicted in SJF?", answer: "Using exponential averaging: t_{n+1} = a * t_n + (1 - a) * t_n, where t_n is actual burst time of the last run and t_n is predicted burst time." }
    ],
    companyFAQs: [
      { companyName: "Amazon", questionText: "Show that SJF is the optimal scheduling algorithm." },
      { companyName: "TCS", questionText: "Draw a Gantt chart for FCFS with 3 processes." }
    ]
  },

  "Scheduling Algorithms (HRRN, RR, PBS, MLQ)": {
    content: `### Scheduling Algorithms (HRRN, RR, PBS, MLQ)

Let's study advanced scheduling algorithms.

### 1. Highest Response Ratio Next (HRRN)
* **Rule**: Non-preemptive scheduling where the next process is selected based on its **Response Ratio (RR)**.
* **Formula**:
\`\`\`
Response Ratio = (Waiting Time + Burst Time) / Burst Time
\`\`\`
* **Benefits**:
  * **Fairness**: Long processes waiting for a long time eventually get a high Response Ratio, preventing **Starvation**.
  * **Efficiency**: Shorter processes (smaller denominator) still get prioritized if waiting times are similar.

---

> [!ANALOGY]
> **Real-Life Analogy**: At a bank ticket counter, customers who have been waiting longer are prioritized, but customers with quick tasks are still cleared rapidly.

---

### 2. Round Robin (RR)
* **Rule**: Preemptive scheduling designed for time-sharing systems. The CPU is allocated to each process for a fixed time quantum.
* **Quantum Trade-off**:
  * If quantum is too large $\rightarrow$ Behaves like FCFS.
  * If quantum is too small $\rightarrow$ Leads to high context-switching overhead.

### 3. Priority Based Scheduling (PBS)
* **Rule**: CPU is allocated to the process with the highest priority (preemptive or non-preemptive).
* **Starvation**: Low priority processes may wait indefinitely. Resolved using **Aging** (gradually increasing priority of waiting processes).

### 4. Multilevel Queue Scheduling (MLQ)
* **Rule**: Partition ready queue into separate queues based on process type (e.g., system processes, interactive processes, batch jobs). Each queue runs its own scheduling algorithm.

---

### Multilevel Queue Architecture:
\`\`\`
+------------------------------------+
|  System Processes (FCFS)           | ====> Highest Priority Queue
+------------------------------------+
|  Interactive Processes (Round Robin)| ====> Medium Priority Queue
+------------------------------------+
|  Batch Jobs (FCFS)                 | ====> Lowest Priority Queue
+------------------------------------+
\`\`\``,
    codeExamples: [
      { language: "cpp", code: `// C++ Round Robin scheduling queue simulation
#include <iostream>
#include <queue>
using namespace std;

struct Process {
    int pid;
    int burst;
    int rem;
};

int main() {
    queue<Process> q;
    q.push({1, 10, 10});
    q.push({2, 4, 4});
    int quantum = 3;
    while (!q.empty()) {
        Process p = q.front();
        q.pop();
        int taken = min(p.rem, quantum);
        p.rem -= taken;
        cout << "P" << p.pid << " runs for " << taken << " ms" << endl;
        if (p.rem > 0) q.push(p);
    }
    return 0;
}` },
      { language: "java", code: `// Java HRRN Response Ratio check logic
class ProcessHRRN {
    int pid;
    int waitingTime;
    int burstTime;
    double getResponseRatio() {
        return (double)(waitingTime + burstTime) / burstTime;
    }
}` },
      { language: "python", code: `# Python simple priority aging simulation
def run_aging():
    processes = [{"pid": "P1", "priority": 10, "wait": 100}]
    # Increase priority as wait time ticks
    for p in processes:
        if p["wait"] > 50:
            p["priority"] -= 1 # 0 is highest priority
    print("New Priorities:", processes)` }
    ],
    interviewTips: "Always highlight 'Aging' as the standard solution for starvation in Priority systems, and 'Response Ratio calculation' as the solution in HRRN.",
    commonMistakes: "Forgetting to add waiting times during response ratio calculations in HRRN.",
    realInterviewQuestions: [
      { question: "What is Multilevel Feedback Queue (MLFQ)?", answer: "Unlike MLQ where processes are permanently assigned to a queue, MLFQ allows processes to move between queues based on their execution history. If a process uses too much CPU, it is demoted; if it waits too long, it is promoted (aging)." }
    ],
    companyFAQs: [
      { companyName: "Qualcomm", questionText: "What is a time slice? How does it affect context switch rates?" },
      { companyName: "Amazon", questionText: "Explain the difference between MLQ and MLFQ." }
    ]
  },

  "Threads in Operating System": {
    content: `### Threads in Operating System

A **Thread** is the basic unit of CPU utilization, comprising a thread ID, a program counter, a register set, and a stack.

### Why Use Threads?

* **Responsiveness**: Allows an application to continue running even if part of it is blocked or performing a long calculation.
* **Resource Sharing**: Threads share the memory and resources of the process they belong to, avoiding the overhead of IPC.
* **Economy**: Creating and context-switching threads is much cheaper than creating processes.
* **Utilization of Multiprocessor Architectures**: A single multithreaded process can run its threads in parallel across multiple CPUs.

---

### Thread Memory Map inside a Process:
\`\`\`
+-----------------------------------------------------------+
|  Process Shared Memory Space:                             |
|  [ Code Segment ] [ Data Segment ] [ Open Files List ]     |
|                                                           |
|  +----------------+  +----------------+  +----------------+ |
|  | Thread 1       |  | Thread 2       |  | Thread 3       | |
|  |  Registers     |  |  Registers     |  |  Registers     | |
|  |  Stack         |  |  Stack         |  |  Stack         | |
|  +----------------+  +----------------+  +----------------+ |
+-----------------------------------------------------------+
\`\`\``,
    codeExamples: [
      { language: "cpp", code: `// C++ POSIX thread creation demo
#include <iostream>
#include <pthread.h>
using namespace std;

void* threadFunc(void* arg) {
    cout << "Hello from POSIX thread!" << endl;
    return NULL;
}

int main() {
    pthread_t threadId;
    pthread_create(&threadId, NULL, threadFunc, NULL);
    pthread_join(threadId, NULL); // Wait for thread to finish
    return 0;
}` },
      { language: "java", code: `// Java Runnable thread creation
public class RunnableThread implements Runnable {
    public void run() {
        System.out.println("Thread running via Runnable interface");
    }
    public static void main(String[] args) {
        Thread t = new Thread(new RunnableThread());
        t.start();
    }
}` },
      { language: "python", code: `# Python target thread execution arguments passing
import threading

def worker(num):
    print(f"Worker {num} starting...")

threads = []
for i in range(3):
    t = threading.Thread(target=worker, args=(i,))
    threads.append(t)
    t.start()` }
    ],
    interviewTips: "Confirm that you understand that while threads share the process heap, they maintain a private stack to support separate execution functions.",
    commonMistakes: "Assuming that thread variables on the stack are globally accessible to other threads without explicit pointer references.",
    realInterviewQuestions: [
      { question: "What is a race condition?", answer: "A race condition is an undesirable situation that occurs when multiple threads attempt to read and write shared data concurrently, and the final value depends on the execution order." }
    ],
    companyFAQs: [
      { companyName: "Google", questionText: "What memory components do threads share?" },
      { companyName: "Wipro", questionText: "Differentiate between process and thread." }
    ]
  },

  "Multithreading Models: User-Level vs. Kernel-Level": {
    content: `### Multithreading Models: User-Level vs. Kernel-Level

Operating systems support threads in either user space or kernel space.

### 1. User-Level Threads (ULT)
* **Concept**: Thread management is done by a user-space thread library without kernel awareness.
* **Pros**: Super fast creation and switching (no mode transitions).
* **Cons**: If one ULT blocks for a system call (like I/O), the entire process blocks because the kernel only sees the single parent process.
* **Examples**: Green Threads in early Java.

### 2. Kernel-Level Threads (KLT)
* **Concept**: Thread management is performed directly by the operating system kernel.
* **Pros**: True concurrency. If one KLT blocks, the kernel can schedule another thread of the process.
* **Cons**: Slower, thread operations require system calls.
* **Examples**: Windows threads, Linux threads (NPTL).

---

### Multithreading Mapping Models:

* **Many-to-One Model**: Many ULTs map to a single KLT. Fast, but lacks concurrency.
* **One-to-One Model**: Each ULT maps to its own KLT. High concurrency, but resource intensive.
* **Many-to-Many Model**: Multiplexes many ULTs to a smaller or equal number of KLTs.

---

### Mapping Models Schema:
\`\`\`
Many-to-One:           One-to-One:            Many-to-Many:
[ULT] [ULT] [ULT]      [ULT]  [ULT]  [ULT]    [ULT] [ULT] [ULT]
   \\   |   /          |      |      |         \\   / \\   /
     v v v            v      v      v           v v   v v
    [ KLT ]          [KLT]  [KLT]  [KLT]       [KLT] [KLT]
\`\`\``,
    codeExamples: [
      { language: "cpp", code: `// C++ thread limit count demo (Unix/Linux pthread limit)
#include <iostream>
#include <pthread.h>
#include <cstring>
using namespace std;

void* dummy(void*) { return NULL; }

int main() {
    int count = 0;
    pthread_t thread;
    while (pthread_create(&thread, NULL, dummy, NULL) == 0) {
        count++;
    }
    cout << "Maximum concurrent threads created successfully: " << count << endl;
    return 0;
}` },
      { language: "java", code: `// Java Virtual Threads demo (Available in Java 21+)
public class VirtualThreadsDemo {
    public static void main(String[] args) throws InterruptedException {
        // Virtual threads are user-level JVM multiplexed threads mapping to KLT carrier threads
        Thread vt = Thread.ofVirtual().start(() -> System.out.println("Running in virtual thread"));
        vt.join();
    }
}` },
      { language: "python", code: `# Python GIL (Global Interpreter Lock) check
# GIL allows only one thread to execute Python bytecode at a time
# effectively making multi-threading Many-to-One on multi-core CPUs
import sys
print("Interpreter recursion limit check:", sys.getrecursionlimit())` }
    ],
    interviewTips: "Use the Python GIL or Java Virtual Threads as modern examples of thread multiplexing models when discussing user vs kernel threads.",
    commonMistakes: "Believing that KLTs don't require any kernel mode switches, when KLT scheduling is completely managed by system calls.",
    realInterviewQuestions: [
      { question: "Explain the Many-to-Many thread model.", answer: "It multiplexes user-level threads to a smaller or equal number of kernel-level threads, combining the speed of ULT switching with the parallel scheduling capacity of KLTs." }
    ],
    companyFAQs: [
      { companyName: "Qualcomm", questionText: "Compare user-level and kernel-level threads." },
      { companyName: "Oracle", questionText: "What is thread mapping model?" }
    ]
  }
};

module.exports = { osTheoryChapters };
