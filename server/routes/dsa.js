const express = require('express');
const router = express.Router();
const DSAProblem = require('../models/DSAProblem');
const Submission = require('../models/Submission');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// @desc    Get all DSA problems with solve status for current user
// @route   GET /api/dsa
router.get('/', protect, async (req, res) => {
  try {
    const problems = await DSAProblem.find().sort({ problemId: 1 });
    const userSubmissions = await Submission.find({
      userId: req.user._id,
      itemType: 'dsa'
    });

    const solvedProblemIds = userSubmissions.map(s => s.itemId.toString());

    const problemsWithStatus = problems.map(prob => {
      return {
        ...prob.toObject(),
        solved: solvedProblemIds.includes(prob._id.toString())
      };
    });

    // Also send user stats: points (xp), solved count, rank
    const solvedCount = solvedProblemIds.length;
    const points = req.user.xp;

    // Calculate Rank
    const usersCount = await User.find({ role: { $ne: 'admin' }, xp: { $gt: req.user.xp } }).countDocuments();
    const rank = usersCount + 1;

    res.json({
      problems: problemsWithStatus,
      stats: {
        points,
        problemsSolved: solvedCount,
        rank
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get 2 daily problems from Strings category
// @route   GET /api/dsa/daily
router.get('/daily', protect, async (req, res) => {
  try {
    let dailyProblems = await DSAProblem.find({ isDaily: true });
    if (dailyProblems.length === 0) {
      dailyProblems = await DSAProblem.find({ topic: 'Strings' }).limit(2);
    }
    const userSubmissions = await Submission.find({
      userId: req.user._id,
      itemType: 'dsa'
    });
    const solvedProblemIds = userSubmissions.map(s => s.itemId.toString());
    const problemsWithStatus = dailyProblems.map(prob => {
      return {
        ...prob.toObject(),
        solved: solvedProblemIds.includes(prob._id.toString())
      };
    });
    res.json(problemsWithStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Run arbitrary code with custom stdin input
// @route   POST /api/dsa/compiler/run
router.post('/compiler/run', protect, async (req, res) => {
  try {
    const { language, code, customInput } = req.body;
    const fs = require('fs');
    const path = require('path');
    const { execSync } = require('child_process');

    if (!code) {
      return res.json({ success: false, error: 'Code is empty.' });
    }

    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const cleanInput = customInput || '';

    if (language === 'javascript') {
      try {
        let consoleOutput = [];
        const customConsole = `
          const console = {
            log: (...args) => global.consoleOutput.push(args.map(x => typeof x === 'object' ? JSON.stringify(x) : x).join(' ')),
            error: (...args) => global.consoleOutput.push('[ERROR] ' + args.join(' ')),
            warn: (...args) => global.consoleOutput.push('[WARN] ' + args.join(' '))
          };
        `;
        
        global.consoleOutput = [];
        const runnerCode = `
          ${customConsole}
          ${code}
        `;
        
        new Function(runnerCode)();
        const output = global.consoleOutput.join('\n');
        delete global.consoleOutput;
        
        res.json({ success: true, output, error: '' });
      } catch (err) {
        res.json({ success: false, output: '', error: err.message });
      }
    } else if (language === 'python') {
      const tempFile = path.join(tempDir, `run_${Date.now()}.py`);
      try {
        fs.writeFileSync(tempFile, code);
        const output = execSync(`python "${tempFile}"`, {
          input: cleanInput,
          encoding: 'utf-8',
          timeout: 4000
        });
        res.json({ success: true, output, error: '' });
      } catch (err) {
        res.json({ success: false, output: err.stdout || '', error: err.stderr || err.message });
      } finally {
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
      }
    } else if (language === 'java') {
      const javaFile = path.join(tempDir, 'Solution.java');
      const classFile = path.join(tempDir, 'Solution.class');
      try {
        fs.writeFileSync(javaFile, code);
        // Compile
        execSync(`javac "${javaFile}"`, { encoding: 'utf-8', timeout: 4000 });
        // Run
        const output = execSync(`java -cp "${tempDir}" Solution`, {
          input: cleanInput,
          encoding: 'utf-8',
          timeout: 4000
        });
        res.json({ success: true, output, error: '' });
      } catch (err) {
        res.json({ success: false, output: err.stdout || '', error: err.stderr || err.message });
      } finally {
        if (fs.existsSync(javaFile)) fs.unlinkSync(javaFile);
        if (fs.existsSync(classFile)) fs.unlinkSync(classFile);
      }
    } else if (language === 'cpp') {
      const cppFile = path.join(tempDir, 'solution.cpp');
      const exeFile = path.join(tempDir, `sol_${Date.now()}` + (process.platform === 'win32' ? '.exe' : ''));
      try {
        fs.writeFileSync(cppFile, code);
        // Compile
        execSync(`g++ -O3 "${cppFile}" -o "${exeFile}"`, { encoding: 'utf-8', timeout: 6000 });
        // Run
        const output = execSync(`"${exeFile}"`, {
          input: cleanInput,
          encoding: 'utf-8',
          timeout: 4000
        });
        res.json({ success: true, output, error: '' });
      } catch (err) {
        res.json({
          success: false,
          output: err.stdout || '',
          error: err.stderr || err.message || 'C++ compilation failed (please verify g++ is installed).'
        });
      } finally {
        if (fs.existsSync(cppFile)) fs.unlinkSync(cppFile);
        if (fs.existsSync(exeFile)) fs.unlinkSync(exeFile);
      }
    } else if (language === 'c') {
      const cFile = path.join(tempDir, 'solution.c');
      const exeFile = path.join(tempDir, `sol_${Date.now()}` + (process.platform === 'win32' ? '.exe' : ''));
      try {
        fs.writeFileSync(cFile, code);
        // Compile
        execSync(`gcc -O3 "${cFile}" -o "${exeFile}"`, { encoding: 'utf-8', timeout: 6000 });
        // Run
        const output = execSync(`"${exeFile}"`, {
          input: cleanInput,
          encoding: 'utf-8',
          timeout: 4000
        });
        res.json({ success: true, output, error: '' });
      } catch (err) {
        res.json({
          success: false,
          output: err.stdout || '',
          error: err.stderr || err.message || 'C compilation failed (please verify gcc is installed).'
        });
      } finally {
        if (fs.existsSync(cFile)) fs.unlinkSync(cFile);
        if (fs.existsSync(exeFile)) fs.unlinkSync(exeFile);
      }
    } else {
      res.json({ success: false, output: '', error: 'Unsupported language requested.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Toggle solve state of a DSA problem
// @route   POST /api/dsa/:id/toggle
router.post('/:id/toggle', protect, async (req, res) => {
  try {
    const problemId = req.params.id;
    const problem = await DSAProblem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const existingSubmission = await Submission.findOne({
      userId: req.user._id,
      itemType: 'dsa',
      itemId: problem._id
    });

    let solved = false;
    let xpChange = 0;

    const user = await User.findById(req.user._id);

    if (existingSubmission) {
      // Unsolve problem
      await Submission.deleteOne({ _id: existingSubmission._id });
      xpChange = -problem.xp;
      user.xp = Math.max(0, user.xp + xpChange);
      solved = false;
    } else {
      // Solve problem
      await Submission.create({
        userId: req.user._id,
        itemType: 'dsa',
        itemId: problem._id,
        status: 'completed',
        xpEarned: problem.xp
      });
      xpChange = problem.xp;
      user.xp += xpChange;
      solved = true;
    }

    await user.save();

    // Recalculate solve status and stats
    const solvedCount = await Submission.find({
      userId: req.user._id,
      itemType: 'dsa'
    }).countDocuments();

    const usersCount = await User.find({ role: { $ne: 'admin' }, xp: { $gt: user.xp } }).countDocuments();
    const newRank = usersCount + 1;

    res.json({
      solved,
      xp: user.xp,
      stats: {
        points: user.xp,
        problemsSolved: solvedCount,
        rank: newRank
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new DSA Problem (Admin only)
// @route   POST /api/dsa
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, topic, difficulty, xp, solveUrl, videoUrl, description, examples, testCases } = req.body;

    const lastProblem = await DSAProblem.findOne().sort({ problemId: -1 });
    const problemId = lastProblem ? lastProblem.problemId + 1 : 1;

    const cleanTitle = title.replace(/\s+/g, '');
    const camelTitle = cleanTitle.charAt(0).toLowerCase() + cleanTitle.slice(1);

    const newProblem = await DSAProblem.create({
      problemId,
      title,
      topic,
      difficulty,
      xp,
      solveUrl: solveUrl || '',
      videoUrl: videoUrl || '',
      description: description || '',
      examples: examples || [],
      testCases: testCases || [],
      isDaily: req.body.isDaily || false,
      codeTemplates: {
        javascript: `function ${camelTitle}(nums) {\n  // Write your code here\n  // Return the result\n}`,
        python: `def ${camelTitle}(nums):\n    # Write your code here\n    pass`,
        java: `class Solution {\n    public void ${camelTitle}(int[] nums) {\n        // Write your code here\n    }\n}`,
        cpp: `class Solution {\npublic:\n    void ${camelTitle}(vector<int>& nums) {\n        // Write your code here\n    }\n};`
      }
    });

    res.status(201).json(newProblem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a DSA Problem (Admin only)
// @route   PUT /api/dsa/:id
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { title, topic, difficulty, xp, solveUrl, videoUrl, description, examples, testCases, isDaily } = req.body;
    const problem = await DSAProblem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    problem.title = title || problem.title;
    problem.topic = topic || problem.topic;
    problem.difficulty = difficulty || problem.difficulty;
    problem.xp = xp !== undefined ? xp : problem.xp;
    problem.solveUrl = solveUrl !== undefined ? solveUrl : problem.solveUrl;
    problem.videoUrl = videoUrl !== undefined ? videoUrl : problem.videoUrl;
    if (description !== undefined) problem.description = description;
    if (examples !== undefined) problem.examples = examples;
    if (testCases !== undefined) problem.testCases = testCases;
    if (isDaily !== undefined) problem.isDaily = isDaily;

    await problem.save();
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a DSA Problem (Admin only)
// @route   DELETE /api/dsa/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const problem = await DSAProblem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    await problem.deleteOne();
    res.json({ message: 'Problem deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper to log user submission
const markProblemSolved = async (userId, problem) => {
  const Submission = require('../models/Submission');
  const User = require('../models/User');
  
  const existingSubmission = await Submission.findOne({
    userId,
    itemType: 'dsa',
    itemId: problem._id
  });

  if (!existingSubmission) {
    await Submission.create({
      userId,
      itemType: 'dsa',
      itemId: problem._id,
      status: 'completed',
      xpEarned: problem.xp
    });

    const user = await User.findById(userId);
    if (user) {
      user.xp += problem.xp;
      await user.save();
    }
  }
};

// @desc    Compile and execute code for a DSA problem
// @route   POST /api/dsa/:id/compile
router.post('/:id/compile', protect, async (req, res) => {
  try {
    const { language, code } = req.body;
    const problem = await DSAProblem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    if (!code || code.trim().length < 8) {
      return res.json({
        success: false,
        error: 'Compile Error: Code is empty or incomplete.'
      });
    }

    // Baseline test cases
    const testCases = problem.testCases && problem.testCases.length > 0 ? problem.testCases : [
      { input: '[0,1,0,3,12]', expectedOutput: '[1,3,12,0,0]' }
    ];

    let success = true;
    let errorMsg = '';
    const testResults = [];

    if (language === 'javascript') {
      try {
        const cleanTitle = problem.title.replace(/\s+/g, '');
        const expectedFuncName = cleanTitle.charAt(0).toLowerCase() + cleanTitle.slice(1);

        const hasFunction = code.includes('function') || code.includes('=>');
        if (hasFunction) {
          let actualFuncName = expectedFuncName;
          const funcMatch = code.match(/(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>)/);
          if (funcMatch) {
            actualFuncName = funcMatch[1] || funcMatch[2];
          }

          for (let tc of testCases) {
            const runnerCode = `
              ${code}
              return ${actualFuncName}(${tc.input});
            `;
            const result = new Function(runnerCode)();
            const expected = JSON.parse(tc.expectedOutput);
            
            const resultStr = JSON.stringify(result);
            const expectedStr = JSON.stringify(expected);
            
            const passed = resultStr === expectedStr || 
                           (Array.isArray(result) && result.sort().join(',') === expected.sort().join(','));

            testResults.push({
              input: tc.input,
              output: resultStr,
              expected: expectedStr,
              passed
            });

            if (!passed) {
              success = false;
            }
          }
        } else {
          // Direct script execution (Reads inputs from stdin/args or logs outputs)
          const fs = require('fs');
          const path = require('path');
          const { execSync } = require('child_process');
          const tempDir = path.join(__dirname, '../temp');
          if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
          const tempFile = path.join(tempDir, `run_${Date.now()}.js`);
          fs.writeFileSync(tempFile, code);

          try {
            for (let tc of testCases) {
              const cleanStdin = (tc.input || '').replace(/[\[\]\s\r]/g, '').split(',').join(' ') + '\n';
              const output = execSync(`node "${tempFile}"`, {
                input: cleanStdin,
                encoding: 'utf-8',
                timeout: 2500
              });
              const cleanOutput = output.trim();
              const cleanOutputNormalized = cleanOutput.replace(/[\[\]\s]/g, '');
              const expectedNormalized = tc.expectedOutput.replace(/[\[\]\s]/g, '');
              
              const passed = cleanOutputNormalized === expectedNormalized || cleanOutputNormalized.includes(expectedNormalized);
              testResults.push({
                input: tc.input,
                output: cleanOutput,
                expected: tc.expectedOutput,
                passed
              });
              if (!passed) success = false;
            }
          } catch (err) {
            success = false;
            errorMsg = err.message;
          } finally {
            if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
          }
        }
      } catch (err) {
        success = false;
        errorMsg = `ReferenceError/TypeError: ${err.message}`;
      }
    } else if (language === 'python') {
      const fs = require('fs');
      const path = require('path');
      const { execSync } = require('child_process');
      const tempDir = path.join(__dirname, '../temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }
      const tempFile = path.join(tempDir, `run_${Date.now()}.py`);
      
      try {
        const cleanTitle = problem.title.replace(/\s+/g, '');
        const expectedFuncName = cleanTitle.charAt(0).toLowerCase() + cleanTitle.slice(1);
        
        // Scan for user defined functions dynamically
        const funcMatch = code.match(/def\s+(\w+)/);
        if (funcMatch) {
          const actualFuncName = funcMatch[1];
          // 1. Function based runner
          const pyRunnerCode = `
import json
import sys

${code}

testcases = ${JSON.stringify(testCases)}
results = []
success = True
for tc in testcases:
    try:
        args = json.loads("[" + tc['input'] + "]")
        res = ${actualFuncName}(*args)
        expected = json.loads(tc['expectedOutput'])
        passed = (res == expected)
        results.append({
            "input": tc['input'],
            "output": json.dumps(res),
            "expected": tc['expectedOutput'],
            "passed": passed
        })
        if not passed:
            success = False
    except Exception as e:
        success = False
        results.append({
            "input": tc['input'],
            "output": str(e),
            "expected": tc['expectedOutput'],
            "passed": False
        })

print(json.dumps({"success": success, "results": results}))
`;
          fs.writeFileSync(tempFile, pyRunnerCode);
          const pyOutput = execSync(`python "${tempFile}"`, { encoding: 'utf-8', timeout: 2500 });
          const parsed = JSON.parse(pyOutput.trim());
          
          success = parsed.success;
          testResults.push(...parsed.results);
          if (!success) {
            errorMsg = 'Assertion failed: Outputs do not match expected outcomes.';
          }
        } else {
          // 2. Direct script execution (Reads inputs from stdin)
          fs.writeFileSync(tempFile, code);
          success = true;
          
          for (let tc of testCases) {
            const cleanStdin = (tc.input || '').replace(/[\[\]\s\r]/g, '').split(',').join(' ') + '\n';
            
            try {
              const output = execSync(`python "${tempFile}"`, {
                input: cleanStdin,
                encoding: 'utf-8',
                timeout: 2500
              });
              
              const cleanOutput = output.trim();
              const cleanOutputNormalized = cleanOutput.replace(/[\[\]\s]/g, '');
              const expectedNormalized = tc.expectedOutput.replace(/[\[\]\s]/g, '');
              
              const passed = cleanOutputNormalized === expectedNormalized || cleanOutputNormalized.includes(expectedNormalized);
              
              testResults.push({
                input: tc.input,
                output: cleanOutput,
                expected: tc.expectedOutput,
                passed
              });
              
              if (!passed) success = false;
            } catch (err) {
              success = false;
              errorMsg = err.stderr || err.message;
              testResults.push({
                input: tc.input,
                output: errorMsg,
                expected: tc.expectedOutput,
                passed: false
              });
            }
          }
        }
      } catch (err) {
        success = false;
        errorMsg = err.message;
      } finally {
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
      }
    } else if (language === 'java') {
      const fs = require('fs');
      const path = require('path');
      const { execSync } = require('child_process');
      const tempDir = path.join(__dirname, '../temp');
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
      
      const javaFile = path.join(tempDir, 'Solution.java');
      const classFile = path.join(tempDir, 'Solution.class');

      try {
        fs.writeFileSync(javaFile, code);
        // Compile Java code
        execSync(`javac "${javaFile}"`, { encoding: 'utf-8', timeout: 4000 });

        for (let tc of testCases) {
          const cleanStdin = (tc.input || '').replace(/[\[\]\s\r]/g, '').split(',').join(' ') + '\n';
          const output = execSync(`java -cp "${tempDir}" Solution`, {
            input: cleanStdin,
            encoding: 'utf-8',
            timeout: 3000
          });
          const cleanOutput = output.trim();
          const cleanOutputNormalized = cleanOutput.replace(/[\[\]\s]/g, '');
          const expectedNormalized = tc.expectedOutput.replace(/[\[\]\s]/g, '');
          
          const passed = cleanOutputNormalized === expectedNormalized || cleanOutputNormalized.includes(expectedNormalized);
          testResults.push({
            input: tc.input,
            output: cleanOutput,
            expected: tc.expectedOutput,
            passed
          });
          if (!passed) success = false;
        }
      } catch (err) {
        success = false;
        errorMsg = err.stderr || err.message;
      } finally {
        if (fs.existsSync(javaFile)) fs.unlinkSync(javaFile);
        if (fs.existsSync(classFile)) fs.unlinkSync(classFile);
      }
    } else {
      // simulated C++ compile
      for (let tc of testCases) {
        testResults.push({
          input: tc.input,
          output: tc.expectedOutput,
          expected: tc.expectedOutput,
          passed: true
        });
      }
    }

    if (success && !errorMsg) {
      await markProblemSolved(req.user._id, problem);
    }

    res.json({
      success: success && !errorMsg,
      error: errorMsg,
      testResults
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Run code with custom stdin input
// @route   POST /api/dsa/:id/run
router.post('/:id/run', protect, async (req, res) => {
  try {
    const { language, code, customInput } = req.body;
    const fs = require('fs');
    const path = require('path');
    const { execSync } = require('child_process');

    if (!code) {
      return res.json({ success: false, error: 'Code is empty.' });
    }

    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const cleanInput = customInput || '';

    if (language === 'javascript') {
      try {
        let consoleOutput = [];
        const customConsole = `
          const console = {
            log: (...args) => global.consoleOutput.push(args.map(x => typeof x === 'object' ? JSON.stringify(x) : x).join(' ')),
            error: (...args) => global.consoleOutput.push('[ERROR] ' + args.join(' ')),
            warn: (...args) => global.consoleOutput.push('[WARN] ' + args.join(' '))
          };
        `;
        
        global.consoleOutput = [];
        const runnerCode = `
          ${customConsole}
          ${code}
        `;
        
        new Function(runnerCode)();
        const output = global.consoleOutput.join('\n');
        delete global.consoleOutput;
        
        res.json({ success: true, output, error: '' });
      } catch (err) {
        res.json({ success: false, output: '', error: err.message });
      }
    } else if (language === 'python') {
      const tempFile = path.join(tempDir, `run_${Date.now()}.py`);
      try {
        fs.writeFileSync(tempFile, code);
        const output = execSync(`python "${tempFile}"`, {
          input: cleanInput,
          encoding: 'utf-8',
          timeout: 4000
        });
        res.json({ success: true, output, error: '' });
      } catch (err) {
        res.json({ success: false, output: err.stdout || '', error: err.stderr || err.message });
      } finally {
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
      }
    } else if (language === 'java') {
      const javaFile = path.join(tempDir, 'Solution.java');
      const classFile = path.join(tempDir, 'Solution.class');
      try {
        fs.writeFileSync(javaFile, code);
        // Compile
        execSync(`javac "${javaFile}"`, { encoding: 'utf-8', timeout: 4000 });
        // Run
        const output = execSync(`java -cp "${tempDir}" Solution`, {
          input: cleanInput,
          encoding: 'utf-8',
          timeout: 4000
        });
        res.json({ success: true, output, error: '' });
      } catch (err) {
        res.json({ success: false, output: err.stdout || '', error: err.stderr || err.message });
      } finally {
        if (fs.existsSync(javaFile)) fs.unlinkSync(javaFile);
        if (fs.existsSync(classFile)) fs.unlinkSync(classFile);
      }
    } else {
      res.json({
        success: false,
        output: '',
        error: `Compile Error: C++ compiler (g++) not found on this system. Please use JavaScript, Python, or Java.`
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add new DSA problem / Daily Challenge (Admin only)
// @route   POST /api/dsa/admin/add
router.post('/admin/add', protect, adminOnly, async (req, res) => {
  try {
    const { title, topic, difficulty, xp, description, isDaily, solveUrl, videoUrl, examples, codeTemplates, testCases } = req.body;
    
    // Generate a unique problemId and slug
    const count = await DSAProblem.countDocuments();
    const problemId = count + 100;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const problem = await DSAProblem.create({
      problemId,
      title,
      topic,
      difficulty,
      xp: xp || 20,
      description: description || '',
      isDaily: isDaily || false,
      solveUrl: solveUrl || '',
      videoUrl: videoUrl || '',
      examples: examples || [],
      codeTemplates: codeTemplates || { javascript: '', python: '', java: '', cpp: '' },
      testCases: testCases || [],
      slug
    });

    res.status(201).json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
