const mongoose = require('mongoose');
const DSAProblem = require('./models/DSAProblem');

const MONGO_URI = 'mongodb://127.0.0.1:27017/placement_prep';

const arraysProblems = [
  {
    problemId: 1,
    title: 'Move Zeroes',
    topic: 'Arrays',
    difficulty: 'Easy',
    xp: 10,
    solveUrl: 'https://leetcode.com/problems/move-zeroes/',
    description: 'Given an integer array `nums`, move all 0\'s to the end of it while maintaining the relative order of the non-zero elements. Note that you must do this in-place without making a copy of the array.',
    examples: [
      {
        input: 'nums = [0,1,0,3,12]',
        output: '[1,3,12,0,0]',
        explanation: 'The zeroes are moved to the end while preserving the relative order of 1, 3, and 12.'
      }
    ],
    codeTemplates: {
      javascript: `function moveZeroes(nums) {\n  let writePointer = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (nums[i] !== 0) {\n      nums[writePointer] = nums[i];\n      writePointer++;\n    }\n  }\n  for (let i = writePointer; i < nums.length; i++) {\n    nums[i] = 0;\n  }\n  return nums;\n}`,
      python: `def moveZeroes(nums):\n    # Write your code here\n    pass`,
      java: `class Solution {\n    public void moveZeroes(int[] nums) {\n        // Write your code here\n    }\n}`,
      cpp: `class Solution {\npublic:\n    void moveZeroes(vector<int>& nums) {\n        // Write your code here\n    }\n};`
    },
    testCases: [
      { input: '[0,1,0,3,12]', expectedOutput: '[1,3,12,0,0]' },
      { input: '[0]', expectedOutput: '[0]' }
    ]
  },
  {
    problemId: 2,
    title: 'Squares of a Sorted Array',
    topic: 'Arrays',
    difficulty: 'Easy',
    xp: 10,
    solveUrl: 'https://leetcode.com/problems/squares-of-a-sorted-array/',
    description: 'Given an integer array `nums` sorted in non-decreasing order, return an array of the squares of each number sorted in non-decreasing order.',
    examples: [
      {
        input: 'nums = [-4,-1,0,3,10]',
        output: '[0,1,9,16,100]',
        explanation: 'After squaring, the array becomes [16,1,0,9,100]. After sorting, it becomes [0,1,9,16,100].'
      }
    ],
    codeTemplates: {
      javascript: `function squaresOfaSortedArray(nums) {\n  return nums.map(x => x * x).sort((a, b) => a - b);\n}`,
      python: `def sortedSquares(nums):\n    pass`,
      java: `class Solution {\n    public int[] sortedSquares(int[] nums) {\n        \n    }\n}`,
      cpp: `class Solution {\npublic:\n    vector<int> sortedSquares(vector<int>& nums) {\n        \n    }\n};`
    },
    testCases: [
      { input: '[-4,-1,0,3,10]', expectedOutput: '[0,1,9,16,100]' },
      { input: '[-7,-3,2,3,11]', expectedOutput: '[4,9,9,49,121]' }
    ]
  },
  {
    problemId: 3,
    title: 'Remove Duplicates from Sorted Array',
    topic: 'Arrays',
    difficulty: 'Easy',
    xp: 15,
    solveUrl: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/',
    description: 'Given an integer array `nums` sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same. Then return the number of unique elements in `nums`.',
    examples: [
      {
        input: 'nums = [1,1,2]',
        output: '2, nums = [1,2,_]',
        explanation: 'Your function should return k = 2, with the first two elements of nums being 1 and 2 respectively.'
      }
    ],
    codeTemplates: {
      javascript: `function removeDuplicatesfromSortedArray(nums) {\n  if (nums.length === 0) return 0;\n  let k = 1;\n  for (let i = 1; i < nums.length; i++) {\n    if (nums[i] !== nums[i - 1]) {\n      nums[k] = nums[i];\n      k++;\n    }\n  }\n  return k;\n}`,
      python: `def removeDuplicates(nums):\n    pass`,
      java: `class Solution {\n    public int removeDuplicates(int[] nums) {\n        \n    }\n}`,
      cpp: `class Solution {\npublic:\n    int removeDuplicates(vector<int>& nums) {\n        \n    }\n};`
    },
    testCases: [
      { input: '[1,1,2]', expectedOutput: '2' },
      { input: '[0,0,1,1,1,2,2,3,3,4]', expectedOutput: '5' }
    ]
  },
  {
    problemId: 4,
    title: 'Majority Element',
    topic: 'Arrays',
    difficulty: 'Easy',
    xp: 10,
    solveUrl: 'https://leetcode.com/problems/majority-element/',
    description: 'Given an array `nums` of size `n`, return the majority element. The majority element is the element that appears more than `⌊n / 2⌋` times. You may assume that the majority element always exists in the array.',
    examples: [
      {
        input: 'nums = [3,2,3]',
        output: '3',
        explanation: '3 appears twice, which is greater than n/2 = 1.5 times.'
      }
    ],
    codeTemplates: {
      javascript: `function majorityElement(nums) {\n  let candidate = null;\n  let count = 0;\n  for (let num of nums) {\n    if (count === 0) {\n      candidate = num;\n    }\n    count += (num === candidate) ? 1 : -1;\n  }\n  return candidate;\n}`,
      python: `def majorityElement(nums):\n    pass`,
      java: `class Solution {\n    public int majorityElement(int[] nums) {\n        \n    }\n}`,
      cpp: `class Solution {\npublic:\n    int majorityElement(vector<int>& nums) {\n        \n    }\n};`
    },
    testCases: [
      { input: '[3,2,3]', expectedOutput: '3' },
      { input: '[2,2,1,1,1,2,2]', expectedOutput: '2' }
    ]
  },
  {
    problemId: 5,
    title: 'Best Time to Buy and Sell Stock',
    topic: 'Arrays',
    difficulty: 'Easy',
    xp: 10,
    solveUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
    description: 'You are given an array `prices` where `prices[i]` is the price of a given stock on the `i-th` day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.',
    examples: [
      {
        input: 'prices = [7,1,5,3,6,4]',
        output: '5',
        explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.'
      }
    ],
    codeTemplates: {
      javascript: `function bestTimeToBuyandSellStock(prices) {\n  let minPrice = Infinity;\n  let maxProfit = 0;\n  for (let price of prices) {\n    if (price < minPrice) {\n      minPrice = price;\n    } else if (price - minPrice > maxProfit) {\n      maxProfit = price - minPrice;\n    }\n  }\n  return maxProfit;\n}`,
      python: `def maxProfit(prices):\n    pass`,
      java: `class Solution {\n    public int maxProfit(int[] prices) {\n        \n    }\n}`,
      cpp: `class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        \n    }\n};`
    },
    testCases: [
      { input: '[7,1,5,3,6,4]', expectedOutput: '5' },
      { input: '[7,6,4,3,1]', expectedOutput: '0' }
    ]
  },
  {
    problemId: 10,
    title: '3Sum',
    topic: 'Arrays',
    difficulty: 'Medium',
    xp: 30,
    solveUrl: 'https://leetcode.com/problems/3sum/',
    description: 'Given an integer array nums, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`. Notice that the solution set must not contain duplicate triplets.',
    examples: [
      {
        input: 'nums = [-1,0,1,2,-1,-4]',
        output: '[[-1,-1,2],[-1,0,1]]',
        explanation: 'nums[0] + nums[1] + nums[3] = (-1) + 0 + 2 = 1. nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.'
      }
    ],
    codeTemplates: {
      javascript: `function threeSum(nums) {\n  nums.sort((a, b) => a - b);\n  const triplets = [];\n  for (let i = 0; i < nums.length - 2; i++) {\n    if (i > 0 && nums[i] === nums[i - 1]) continue;\n    let left = i + 1;\n    let right = nums.length - 1;\n    while (left < right) {\n      const sum = nums[i] + nums[left] + nums[right];\n      if (sum === 0) {\n        triplets.push([nums[i], nums[left], nums[right]]);\n        while (left < right && nums[left] === nums[left + 1]) left++;\n        while (left < right && nums[right] === nums[right - 1]) right--;\n        left++;\n        right--;\n      } else if (sum < 0) {\n        left++;\n      } else {\n        right--;\n      }\n    }\n  }\n  return triplets;\n}`,
      python: `def threeSum(nums):\n    pass`,
      java: `class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        \n    }\n}`,
      cpp: `class Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        \n    }\n};`
    },
    testCases: [
      { input: '[-1,0,1,2,-1,-4]', expectedOutput: '[[-1,-1,2],[-1,0,1]]' },
      { input: '[0,1,1]', expectedOutput: '[]' }
    ]
  },
  {
    problemId: 9,
    title: 'Kth Largest Element in an Array',
    topic: 'Arrays', // Map it to Arrays since the user is targeting it in the Arrays list!
    difficulty: 'Medium',
    xp: 30,
    solveUrl: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
    description: 'Given an integer array `nums` and an integer `k`, return the `k-th` largest element in the array.',
    examples: [
      {
        input: 'nums = [3,2,1,5,6,4], k = 2',
        output: '5',
        explanation: 'The sorted elements are [1,2,3,4,5,6], and the 2nd largest element is 5.'
      }
    ],
    codeTemplates: {
      javascript: `function kthLargestElementinAnArray(nums, k) {\n  nums.sort((a, b) => b - a);\n  return nums[k - 1];\n}`,
      python: `def findKthLargest(nums, k):\n    pass`,
      java: `class Solution {\n    public int findKthLargest(int[] nums, int k) {\n        \n    }\n}`,
      cpp: `class Solution {\npublic:\n    int findKthLargest(vector<int>& nums, int k) {\n        \n    }\n};`
    },
    testCases: [
      { input: '[3,2,1,5,6,4], 2', expectedOutput: '5' },
      { input: '[3,2,3,1,2,4,5,5,6], 4', expectedOutput: '4' }
    ]
  },
  {
    problemId: 21,
    title: 'Maximum Subarray',
    topic: 'Arrays',
    difficulty: 'Medium',
    xp: 30,
    solveUrl: 'https://leetcode.com/problems/maximum-subarray/',
    description: 'Given an integer array `nums`, find the subarray with the largest sum, and return its sum.',
    examples: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: 'The subarray [4,-1,2,1] has the largest sum = 6.'
      }
    ],
    codeTemplates: {
      javascript: `function maximumSubarray(nums) {\n  let maxSoFar = nums[0];\n  let currMax = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    currMax = Math.max(nums[i], currMax + nums[i]);\n    maxSoFar = Math.max(maxSoFar, currMax);\n  }\n  return maxSoFar;\n}`,
      python: `def maxSubArray(nums):\n    pass`,
      java: `class Solution {\n    public int maxSubArray(int[] nums) {\n        \n    }\n}`,
      cpp: `class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        \n    }\n};`
    },
    testCases: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6' },
      { input: '[1]', expectedOutput: '1' }
    ]
  },
  {
    problemId: 22,
    title: 'First Missing Positive',
    topic: 'Arrays',
    difficulty: 'Hard',
    xp: 50,
    solveUrl: 'https://leetcode.com/problems/first-missing-positive/',
    description: 'Given an unsorted integer array `nums`, return the smallest missing positive integer.',
    examples: [
      {
        input: 'nums = [1,2,0]',
        output: '3',
        explanation: 'The numbers in the range [1,2] are present, but 3 is missing.'
      }
    ],
    codeTemplates: {
      javascript: `function firstMissingPositive(nums) {\n  const set = new Set(nums);\n  let i = 1;\n  while (set.has(i)) {\n    i++;\n  }\n  return i;\n}`,
      python: `def firstMissingPositive(nums):\n    pass`,
      java: `class Solution {\n    public int firstMissingPositive(int[] nums) {\n        \n    }\n}`,
      cpp: `class Solution {\npublic:\n    int firstMissingPositive(vector<int>& nums) {\n        \n    }\n};`
    },
    testCases: [
      { input: '[1,2,0]', expectedOutput: '3' },
      { input: '[3,4,-1,1]', expectedOutput: '2' }
    ]
  }
];

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB to seed Array problem details.');
    // Clear existing problems to prevent unique index clashes
    await DSAProblem.deleteMany({});
    console.log('Cleared existing DSA problems.');

    for (let p of arraysProblems) {
      await DSAProblem.create(p);
      console.log(`Created problem: ${p.title}`);
    }
    console.log('Seeding finished successfully.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Seeding error:', err);
    process.exit(1);
  });
