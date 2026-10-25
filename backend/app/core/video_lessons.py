"""
Video-style Slide Lessons with Narration Scripts
Georgia standards aligned slide lessons with interactive checkpoints.
"""

from typing import Dict, Any, List

VIDEO_LESSONS: Dict[str, Dict[str, Any]] = {
    "g5-fractions": {
        "topic_id": "g5-fractions",
        "title": "Adding Fractions with Like Denominators",
        "total_slides": 6,
        "slides": [
            {
                "slide_id": 1,
                "title": "Welcome to Fraction Adventure!",
                "visual_concept": "Imagine a fresh pizza cut into 8 equal slices. Each single slice is 1/8 of the whole pizza.",
                "narration_text": "Hello Math Adventurer! Today we are learning how to add fractions that share a common denominator. Imagine you have a fresh, warm pizza divided into eight equal slices. Each single slice represents one eighth of the whole pizza.",
                "key_takeaway": "The denominator tells us how many equal parts make up one whole unit."
            },
            {
                "slide_id": 2,
                "title": "The Golden Rule: Denominators Tell the Size",
                "visual_concept": "Numerator (top) = How many parts you have. Denominator (bottom) = Total equal parts in 1 whole.",
                "narration_text": "Look closely at a fraction. The top number, called the numerator, counts how many parts you actually have. The bottom number, the denominator, names the size of each slice. When the denominators match, the slices are already the exact same size!",
                "key_takeaway": "Never add denominators together! They simply name the size of each part."
            },
            {
                "slide_id": 3,
                "title": "Worked Example: 2/8 + 3/8",
                "visual_concept": "First you take 2 slices (2/8). Then your friend shares 3 more slices (3/8). How many slices do you have in total?",
                "narration_text": "Let us solve an example together. You start with two slices out of eight, which is two eighths. Then a friend gives you three more slices, which is three eighths. Together, you have two plus three slices.",
                "key_takeaway": "Keep denominator 8: add numerators 2 + 3 = 5."
            },
            {
                "slide_id": 4,
                "title": "Step-by-Step Mathematical Solution",
                "visual_concept": "2/8 + 3/8 = (2 + 3) / 8 = 5/8 of the pizza.",
                "narration_text": "Step one: Notice that both denominators are eight. Step two: Keep eight as the bottom denominator. Step three: Add the top numbers together: two plus three equals five. Your total is five eighths of the pizza!",
                "key_takeaway": "Formula: a/d + b/d = (a + b) / d."
            },
            {
                "slide_id": 5,
                "title": "Quick Interactive Check",
                "visual_concept": "What is 1/5 + 2/5? Think of five equal garden plots.",
                "narration_text": "Now test your intuition! What is one fifth plus two fifths? Since the bottom numbers are both five, add one plus two to get three fifths. You got it!",
                "key_takeaway": "1/5 + 2/5 = 3/5.",
                "interactive_check": {
                    "question": "What is 1/5 + 2/5?",
                    "options": ["3/10", "3/5", "2/25", "1/5"],
                    "correct": "3/5"
                }
            },
            {
                "slide_id": 6,
                "title": "Adventure Milestone Unlocked!",
                "visual_concept": "Great job completing this lesson! You are now fully prepared for adaptive practice.",
                "narration_text": "Fantastic work! You have mastered adding fractions with common denominators. Now take on the adaptive quiz challenge, earn quest points, and unlock special badges!",
                "key_takeaway": "You are ready for practice! Keep leveling up your skills."
            }
        ]
    },
    "g5-decimals": {
        "topic_id": "g5-decimals",
        "title": "Understanding Decimal Place Value",
        "total_slides": 5,
        "slides": [
            {
                "slide_id": 1,
                "title": "Decimals in the Real World",
                "visual_concept": "Coins: 1 dollar = 1.00, 1 dime = 0.10 (tenth), 1 penny = 0.01 (hundredth).",
                "narration_text": "Welcome to Decimal Place Value! Every time you spend money or measure length, you use decimals. One dollar is a whole unit. One dime is one tenth of a dollar, written as zero point one. One penny is one hundredth, written as zero point zero one.",
                "key_takeaway": "Decimals represent fractional parts based on groups of ten."
            },
            {
                "slide_id": 2,
                "title": "The Power of the Decimal Point",
                "visual_concept": "Left of decimal: Ones, Tens, Hundreds. Right of decimal: Tenths, Hundredths, Thousandths.",
                "narration_text": "The decimal point is like an anchor. Everything to the left is a whole number: ones, tens, and hundreds. Everything to the right represents smaller pieces: tenths, hundredths, and thousandths.",
                "key_takeaway": "Each step to the right is ten times smaller."
            },
            {
                "slide_id": 3,
                "title": "Lining Up Decimals to Add",
                "visual_concept": "4.75 + 1.25 -> Line up the decimal point vertically like buttons on a shirt!",
                "narration_text": "When adding decimals, the most crucial trick is to always line up the decimal points vertically, just like the buttons on your shirt. That ensures you add tenths to tenths and hundredths to hundredths.",
                "key_takeaway": "Always line up decimal points before adding or subtracting."
            },
            {
                "slide_id": 4,
                "title": "Solving 4.75 + 1.25",
                "visual_concept": "5 hundredths + 5 hundredths = 10 hundredths (regroup 1). 7 + 2 + 1 = 10 tenths (regroup 1). 4 + 1 + 1 = 6.",
                "narration_text": "Let us add four point seven five and one point two five. Adding hundredths: five plus five is ten. Regroup one into tenths. Seven plus two plus one is ten. Regroup one into wholes. Four plus one plus one is six point zero zero!",
                "key_takeaway": "4.75 + 1.25 = 6.00 or simply 6."
            },
            {
                "slide_id": 5,
                "title": "Ready for Action!",
                "visual_concept": "You are ready to conquer decimal operations in your practice quests!",
                "narration_text": "Superb work! You now know how decimal place values work and how to line them up cleanly. Head over to the practice arena to test your skills!",
                "key_takeaway": "Practice builds confidence and mastery."
            }
        ]
    },
    "g6-ratios": {
        "topic_id": "g6-ratios",
        "title": "Ratios & Rates: Comparing Quantities",
        "total_slides": 5,
        "slides": [
            {
                "slide_id": 1,
                "title": "What is a Ratio?",
                "visual_concept": "Comparing 2 apples to 3 oranges. Notation: 2 to 3, 2:3, or 2/3.",
                "narration_text": "Welcome to Ratios and Rates! A ratio is a mathematical comparison of two quantities. For example, if you have two red apples for every three green apples, your ratio is two to three.",
                "key_takeaway": "A ratio compares two quantities using division or colon notation."
            },
            {
                "slide_id": 2,
                "title": "Equivalent Ratios",
                "visual_concept": "2:3 is equivalent to 4:6 and 6:9 (multiply both by the same factor).",
                "narration_text": "Just like equivalent fractions, you can scale ratios up or down by multiplying or dividing both sides by the exact same number. Two to three becomes four to six, or six to nine.",
                "key_takeaway": "Scaling keeps the comparison relationship identical."
            },
            {
                "slide_id": 3,
                "title": "Unit Rates in Daily Life",
                "visual_concept": "180 miles in 3 hours -> 180 / 3 = 60 miles in 1 single hour (unit rate).",
                "narration_text": "A unit rate compares a quantity to one single unit. If a car drives one hundred eighty miles in three hours, dividing one hundred eighty by three tells you the speed: sixty miles per hour.",
                "key_takeaway": "Unit rate = Total Quantity divided by Total Units."
            },
            {
                "slide_id": 4,
                "title": "Check Your Knowledge",
                "visual_concept": "Simplify the ratio 6:9.",
                "narration_text": "Can you simplify the ratio six to nine? Divide both numbers by three. Six divided by three is two, and nine divided by three is three. The simplified ratio is two to three!",
                "key_takeaway": "6:9 simplifies to 2:3."
            },
            {
                "slide_id": 5,
                "title": "Next Step: Adventure Practice!",
                "visual_concept": "Level up your ratio mastery in the MathQuest practice mode.",
                "narration_text": "You are equipped with ratio knowledge! Let us begin the adaptive challenge and test your problem solving skills.",
                "key_takeaway": "Mastery through purposeful practice."
            }
        ]
    },
    "g5-place-value": {
        "topic_id": "g5-place-value",
        "title": "Indian vs. International Place Value System",
        "total_slides": 5,
        "slides": [
            {
                "slide_id": 1,
                "title": "Two Global Ways to Read Large Numbers",
                "visual_concept": "Indian System: Ones, Thousands, Lakhs, Crores. International: Ones, Thousands, Millions, Billions.",
                "narration_text": "Welcome Math Adventurer! Did you know people around the world read big numbers differently? In India, we group numbers using Lakhs and Crores. Internationally, groups of three digits are called Thousands, Millions, and Billions.",
                "key_takeaway": "Comma grouping: Indian is 3, then 2, 2. International is 3, 3, 3."
            },
            {
                "slide_id": 2,
                "title": "The Comma Rule Explained",
                "visual_concept": "Indian: 25,40,000 (25 Lakhs, 40 Thousand). International: 2,540,000 (2 Million 540 Thousand).",
                "narration_text": "Observe the commas. In the Indian system, the first comma appears after three digits from the right, and then every two digits. In the International system, commas appear every three digits.",
                "key_takeaway": "One Million equals Ten Lakhs (1,000,000 = 10,00,000)."
            },
            {
                "slide_id": 3,
                "title": "Worked Example: Convert 1 Million to Lakhs",
                "visual_concept": "1 Million has 6 zeros: 1,000,000. Regrouped in Indian system: 10,00,000 = 10 Lakhs.",
                "narration_text": "Let us convert one million into lakhs. One million is a one followed by six zeros. When we write that with Indian commas, it becomes ten comma double zero comma triple zero: exactly ten lakhs!",
                "key_takeaway": "10 Lakhs = 1 Million; 1 Crore = 10 Million."
            },
            {
                "slide_id": 4,
                "title": "Interactive Check",
                "visual_concept": "How many Lakhs are in 5 Million?",
                "narration_text": "Quick quiz! If one million is ten lakhs, how many lakhs are in five million? Multiply five by ten to get fifty lakhs! Super work!",
                "key_takeaway": "5 Million = 50 Lakhs.",
                "interactive_check": {
                    "question": "How many Lakhs equal 5 Million?",
                    "options": ["5 Lakhs", "50 Lakhs", "500 Lakhs", "25 Lakhs"],
                    "correct": "50 Lakhs"
                }
            },
            {
                "slide_id": 5,
                "title": "Place Value Adventure Complete!",
                "visual_concept": "You are now ready to tackle number comparisons and word problems.",
                "narration_text": "Brilliant! You can now effortlessly decode large numbers across both Indian and international contexts. Jump into the practice quest to earn bonus XP!",
                "key_takeaway": "Confidence with global number systems unlocked!"
            }
        ]
    },
    "g5-factors-multiples": {
        "topic_id": "g5-factors-multiples",
        "title": "Unlocking HCF & LCM with Factor Rainbows",
        "total_slides": 5,
        "slides": [
            {
                "slide_id": 1,
                "title": "Factors vs. Multiples",
                "visual_concept": "Factors divide evenly into a number. Multiples are what you get when multiplying.",
                "narration_text": "Hello Explorer! Factors are numbers that multiply together to give another number. For example, three and four are factors of twelve. Multiples are the skip-counting numbers: twelve, twenty-four, thirty-six.",
                "key_takeaway": "Factors are smaller or equal; Multiples are larger or equal."
            },
            {
                "slide_id": 2,
                "title": "Highest Common Factor (HCF / GCD)",
                "visual_concept": "Factors of 12: 1, 2, 3, 4, 6, 12. Factors of 18: 1, 2, 3, 6, 9, 18. Common = 1, 2, 3, 6. Greatest = 6.",
                "narration_text": "To find the Highest Common Factor of twelve and eighteen, list all factors. Common factors are one, two, three, and six. The greatest one is six, so the HCF is six!",
                "key_takeaway": "HCF is the largest number that divides both numbers evenly."
            },
            {
                "slide_id": 3,
                "title": "Lowest Common Multiple (LCM)",
                "visual_concept": "Multiples of 4: 4, 8, 12, 16. Multiples of 6: 6, 12, 18. Lowest Common = 12.",
                "narration_text": "Now for Lowest Common Multiple. List multiples of four: four, eight, twelve. Multiples of six: six, twelve. The very first common number is twelve, so LCM is twelve!",
                "key_takeaway": "LCM is the smallest positive number that is a multiple of both."
            },
            {
                "slide_id": 4,
                "title": "Quick Interactive Check",
                "visual_concept": "What is the HCF of 8 and 12?",
                "narration_text": "Test yourself: What is the Highest Common Factor of eight and twelve? Factors of eight are one, two, four, eight. Factors of twelve include four. The greatest common factor is four!",
                "key_takeaway": "HCF(8, 12) = 4.",
                "interactive_check": {
                    "question": "What is the HCF (Highest Common Factor) of 8 and 12?",
                    "options": ["2", "4", "6", "8"],
                    "correct": "4"
                }
            },
            {
                "slide_id": 5,
                "title": "Quest Ready: Conquer Factors!",
                "visual_concept": "You are ready to solve prime factorization and word problems in MathQuest.",
                "narration_text": "Outstanding work! You have mastered HCF and LCM fundamentals. Let us take on the gamified quiz challenge now!",
                "key_takeaway": "Level up your number mastery!"
            }
        ]
    },
    "g5-geometry": {
        "topic_id": "g5-geometry",
        "title": "2D Geometry: Polygons & Perimeter",
        "total_slides": 5,
        "slides": [
            {
                "slide_id": 1,
                "title": "What is Perimeter?",
                "visual_concept": "Walking all the way around the outside fence of a garden.",
                "narration_text": "Welcome to Geometry! Perimeter is the total distance around the boundary of a two-dimensional shape. Think of it like putting up a fence around your garden.",
                "key_takeaway": "Perimeter = Sum of all outer side lengths."
            },
            {
                "slide_id": 2,
                "title": "Triangles: Scalene, Isosceles, Equilateral",
                "visual_concept": "Equilateral (all 3 sides equal), Isosceles (2 equal sides), Scalene (no equal sides).",
                "narration_text": "Triangles come in three main varieties. Equilateral triangles have three equal sides. Isosceles triangles have two equal sides. Scalene triangles have all different side lengths.",
                "key_takeaway": "Classify by sides: Equilateral, Isosceles, or Scalene."
            },
            {
                "slide_id": 3,
                "title": "Worked Example: Rectangle Perimeter",
                "visual_concept": "Length = 8 cm, Width = 5 cm. P = 8 + 5 + 8 + 5 = 26 cm.",
                "narration_text": "Let us find the perimeter of a rectangle with length eight centimeters and width five centimeters. Add all four sides: eight plus five plus eight plus five equals twenty-six centimeters!",
                "key_takeaway": "Formula: P = 2 * (length + width)."
            },
            {
                "slide_id": 4,
                "title": "Interactive Check",
                "visual_concept": "What is the perimeter of a square with side 6 cm?",
                "narration_text": "Quick checkpoint! If a square has sides of six centimeters, what is its perimeter? Multiply six by four sides to get twenty-four centimeters!",
                "key_takeaway": "Perimeter of square = 4 * side.",
                "interactive_check": {
                    "question": "What is the perimeter of a square with 6 cm sides?",
                    "options": ["12 cm", "24 cm", "36 cm", "18 cm"],
                    "correct": "24 cm"
                }
            },
            {
                "slide_id": 5,
                "title": "Geometry Adventure Complete!",
                "visual_concept": "You are ready to solve polygon and angle challenges in MathQuest.",
                "narration_text": "Superb work! You now understand perimeter and polygon classification. Step into the practice arena to test your skills!",
                "key_takeaway": "Mastery through geometric visualization."
            }
        ]
    },
    "g5-measurement-area": {
        "topic_id": "g5-measurement-area",
        "title": "Perimeter vs. Area: How Many Squares?",
        "total_slides": 5,
        "slides": [
            {
                "slide_id": 1,
                "title": "Perimeter vs. Area",
                "visual_concept": "Perimeter = Border fence (length). Area = Floor tiles filling the inside space (square units).",
                "narration_text": "Many students confuse perimeter and area! Perimeter is the outer boundary line. Area is the flat space inside, measured by counting square tiles that cover the surface completely.",
                "key_takeaway": "Perimeter measures boundary; Area measures surface coverage."
            },
            {
                "slide_id": 2,
                "title": "The Area Formula for Rectangles",
                "visual_concept": "Grid with 6 rows of 4 squares = 6 * 4 = 24 square units.",
                "narration_text": "Instead of counting every tiny square, multiply the length by the width. A room six meters long and four meters wide has an area of six times four: twenty-four square meters!",
                "key_takeaway": "Area = Length * Width."
            },
            {
                "slide_id": 3,
                "title": "Worked Example: Square Garden",
                "visual_concept": "A square garden has side 7 m. Area = 7 * 7 = 49 sq m.",
                "narration_text": "Consider a square garden with seven-meter sides. Since all sides of a square are equal, multiply seven by seven to get forty-nine square meters of fertile soil!",
                "key_takeaway": "Area of square = side * side."
            },
            {
                "slide_id": 4,
                "title": "Interactive Check",
                "visual_concept": "Rectangle: Length = 9 cm, Width = 3 cm. What is the area?",
                "narration_text": "Test your knowledge! A rectangle is nine centimeters long and three centimeters wide. Multiply nine by three to find twenty-seven square centimeters!",
                "key_takeaway": "9 * 3 = 27 sq cm.",
                "interactive_check": {
                    "question": "What is the area of a rectangle with length 9 cm and width 3 cm?",
                    "options": ["12 sq cm", "24 sq cm", "27 sq cm", "30 sq cm"],
                    "correct": "27 sq cm"
                }
            },
            {
                "slide_id": 5,
                "title": "Measurement Quest Ready!",
                "visual_concept": "You can now solve practical tiling, carpeting, and perimeter problems.",
                "narration_text": "Outstanding work! You have mastered calculating boundaries and unit square areas. Jump into the practice quest to level up!",
                "key_takeaway": "Precision in measurement unlocked!"
            }
        ]
    },
    "g5-volume-powers": {
        "topic_id": "g5-volume-powers",
        "title": "3D Volume & Powers of Ten",
        "total_slides": 5,
        "slides": [
            {
                "slide_id": 1,
                "title": "Stepping into the 3rd Dimension",
                "visual_concept": "1D: Line (length). 2D: Flat Square (length * width). 3D: Solid Box (length * width * height).",
                "narration_text": "Welcome to three dimensions! Volume measures the amount of three-dimensional space inside an object, like water filling a fish tank or wooden blocks stacking inside a toy chest.",
                "key_takeaway": "Volume is measured in cubic units (cm³, m³)."
            },
            {
                "slide_id": 2,
                "title": "Volume Formula: Length * Width * Height",
                "visual_concept": "Length = 4 cm, Width = 3 cm, Height = 2 cm. Base layer = 12 cubes. Two layers = 24 cubic cm.",
                "narration_text": "To find the volume of a rectangular prism, multiply length by width by height. The base layer has four times three, or twelve cubes. Stack two layers high, and you get twenty-four cubic centimeters!",
                "key_takeaway": "Volume = l * w * h."
            },
            {
                "slide_id": 3,
                "title": "Powers of Ten Shortcut",
                "visual_concept": "5 * 10 = 50, 5 * 100 = 500, 5 * 1000 = 5,000 (each power of 10 shifts the decimal 1 place right).",
                "narration_text": "When calculating big measurements, multiplying by powers of ten is super easy. Each zero in ten, one hundred, or one thousand shifts every digit one place value to the left!",
                "key_takeaway": "Multiplying by 10^n shifts decimal n places to the right."
            },
            {
                "slide_id": 4,
                "title": "Interactive Check",
                "visual_concept": "Cubic Box: Length = 5 cm, Width = 2 cm, Height = 4 cm. What is the volume?",
                "narration_text": "Quick calculation! A box measures five centimeters long, two centimeters wide, and four centimeters high. Five times two is ten, times four is forty cubic centimeters!",
                "key_takeaway": "5 * 2 * 4 = 40 cm³.",
                "interactive_check": {
                    "question": "What is the volume of a box with dimensions 5 cm by 2 cm by 4 cm?",
                    "options": ["11 cm³", "20 cm³", "40 cm³", "50 cm³"],
                    "correct": "40 cm³"
                }
            },
            {
                "slide_id": 5,
                "title": "3D Mastery Achieved!",
                "visual_concept": "You are ready for multi-dimensional volume and power-of-ten quests.",
                "narration_text": "Fantastic job! You now understand how unit cubes build 3D volume. Take on the practice questions to earn bonus quest XP!",
                "key_takeaway": "Solid understanding of 3D geometry!"
            }
        ]
    },
    "g5-data-handling": {
        "topic_id": "g5-data-handling",
        "title": "Data Handling: Smart Charts & Line Symmetry",
        "total_slides": 5,
        "slides": [
            {
                "slide_id": 1,
                "title": "Turning Data into Pictures",
                "visual_concept": "Bar charts make comparisons obvious at a single glance.",
                "narration_text": "Hello Explorer! Data handling is all about gathering facts and organizing them with charts and graphs so anyone can understand the pattern in seconds.",
                "key_takeaway": "Graphs show comparisons and patterns visually."
            },
            {
                "slide_id": 2,
                "title": "Reading the Bar Graph Scale",
                "visual_concept": "Y-axis shows values (counts), X-axis shows categories. Always inspect the scale steps (2s, 5s, 10s).",
                "narration_text": "When reading a bar graph, look carefully at the vertical axis. Check if each line counts by ones, twos, fives, or tens. That step size is called the scale.",
                "key_takeaway": "The scale tells you what each grid line represents."
            },
            {
                "slide_id": 3,
                "title": "Lines of Symmetry",
                "visual_concept": "A butterfly folds down the middle with matching left and right halves.",
                "narration_text": "Symmetry means balance! If you can draw a line down the middle of a shape and fold it so both halves match identically, that fold is a line of symmetry.",
                "key_takeaway": "A line of symmetry creates identical mirror-image halves."
            },
            {
                "slide_id": 4,
                "title": "Interactive Check",
                "visual_concept": "How many lines of symmetry does a regular square have?",
                "narration_text": "Test your intuition! How many lines of symmetry does a square have? You can fold it vertically, horizontally, and along both diagonals. That makes four lines of symmetry!",
                "key_takeaway": "A square has 4 lines of symmetry.",
                "interactive_check": {
                    "question": "How many lines of symmetry does a square have?",
                    "options": ["1", "2", "3", "4"],
                    "correct": "4"
                }
            },
            {
                "slide_id": 5,
                "title": "Data Explorer Badge Ready!",
                "visual_concept": "You are equipped to analyze graphs, tables, and symmetry patterns.",
                "narration_text": "Bravo! You can now analyze smart charts and identify symmetrical designs. Let us jump into the quiz arena and claim your points!",
                "key_takeaway": "Data literacy unlocked!"
            }
        ]
    },
    "g6-integers": {
        "topic_id": "g6-integers",
        "title": "Integers: The Other Side of Zero",
        "total_slides": 5,
        "slides": [
            {
                "slide_id": 1,
                "title": "Welcome to the World of Negative Numbers",
                "visual_concept": "Number line with zero at the center: positive numbers to the right, negative numbers to the left.",
                "narration_text": "Welcome to Integers! In everyday life, we often need numbers below zero, like sub-zero winter temperatures, depths under the ocean, or elevator basements. These are called negative numbers.",
                "key_takeaway": "Integers include all positive whole numbers, negative whole numbers, and zero."
            },
            {
                "slide_id": 2,
                "title": "Walking the Number Line",
                "visual_concept": "Starting at 0: Walking right is positive (+), walking left is negative (-).",
                "narration_text": "Think of the number line as a giant sidewalk. Standing at zero, any step to the right adds positive numbers. Any step to the left subtracts and moves deeper into negative territory.",
                "key_takeaway": "Numbers to the right are always greater than numbers to the left."
            },
            {
                "slide_id": 3,
                "title": "Worked Example: -3 + 5",
                "visual_concept": "Start at -3 on the number line. Jump 5 steps to the right. You land squarely on +2!",
                "narration_text": "Let us solve negative three plus five. Start your marker at negative three. Because we are adding five, jump five spaces to the right: negative two, negative one, zero, one, two! You land on positive two.",
                "key_takeaway": "-3 + 5 = +2. Adding a positive moves right on the number line."
            },
            {
                "slide_id": 4,
                "title": "Interactive Integer Checkpoint",
                "visual_concept": "If the temperature is -4 degrees and rises by 6 degrees, what is the new temperature?",
                "narration_text": "Quick checkpoint! The temperature outside is negative four degrees. If it warms up by six degrees, what is the new temperature? Start at negative four and move six steps right. You reach two degrees!",
                "key_takeaway": "-4 + 6 = 2 degrees.",
                "interactive_check": {
                    "question": "What is -4 + 6?",
                    "options": ["-10", "-2", "2", "10"],
                    "correct": "2"
                }
            },
            {
                "slide_id": 5,
                "title": "Integer Explorer Milestone Unlocked!",
                "visual_concept": "You have mastered the number line and are ready for practice quests.",
                "narration_text": "Brilliant work! You now understand integers, signs, and number line movement. Step into the arena and claim your quest badges!",
                "key_takeaway": "Ready to conquer integer operations!"
            }
        ]
    },
    "g6-algebra": {
        "topic_id": "g6-algebra",
        "title": "Introduction to Algebra & Expressions",
        "total_slides": 5,
        "slides": [
            {
                "slide_id": 1,
                "title": "What is a Variable?",
                "visual_concept": "A mysterious gift box labeled 'x' holding an unknown number of shiny coins.",
                "narration_text": "Welcome to Algebra! In math, when we do not know a number yet, we use a letter like x or y as a placeholder. We call this letter a variable because its value can vary.",
                "key_takeaway": "A variable is a letter or symbol that represents an unknown quantity."
            },
            {
                "slide_id": 2,
                "title": "Writing Algebraic Expressions",
                "visual_concept": "Phrase: '3 more than a number' translates into: x + 3. 'Twice a number' is 2x.",
                "narration_text": "Algebra lets us translate English sentences into short math expressions. 'Five more than x' is written as x plus five. 'Three times y' is simply written as three y without a multiplication sign.",
                "key_takeaway": "When a number touches a variable like 3x, it means multiplication."
            },
            {
                "slide_id": 3,
                "title": "The Golden Rule of Balance: Solving x + 4 = 10",
                "visual_concept": "A balanced scale with (x + 4) on the left pan and 10 on the right pan. Remove 4 from both sides to find x = 6.",
                "narration_text": "An equation is like a balanced playground seesaw. Whatever you do to one side, you must do to the other. To solve x plus four equals ten, subtract four from both sides. Ten minus four leaves six, so x equals six!",
                "key_takeaway": "Use inverse operations: subtract 4 from both sides to isolate x."
            },
            {
                "slide_id": 4,
                "title": "Interactive Algebra Check",
                "visual_concept": "If x + 7 = 12, what is the value of x?",
                "narration_text": "Test your algebra instincts! If x plus seven equals twelve, what is x? Subtract seven from twelve to balance the equation. Twelve minus seven is five!",
                "key_takeaway": "x + 7 = 12 -> x = 12 - 7 = 5.",
                "interactive_check": {
                    "question": "Solve for x: x + 7 = 12",
                    "options": ["3", "5", "7", "19"],
                    "correct": "5"
                }
            },
            {
                "slide_id": 5,
                "title": "Algebraic Thinking Unlocked!",
                "visual_concept": "You are ready to solve linear equations and pattern quests in MathQuest.",
                "narration_text": "Spectacular! You have mastered variables and the secret of balanced equations. Head into the adaptive challenge to level up your algebra mastery!",
                "key_takeaway": "Algebra is the secret language of problem solving."
            }
        ]
    },
    "g6-fractions-division": {
        "topic_id": "g6-fractions-division",
        "title": "Fractions: Division & The Reciprocal Rule",
        "total_slides": 5,
        "slides": [
            {
                "slide_id": 1,
                "title": "Visualizing Fraction Division",
                "visual_concept": "How many 1/2-cup scoops of flour fit into 3 whole cups? (3 ÷ 1/2 = 6 scoops).",
                "narration_text": "Welcome to Fraction Division! When you divide a whole number by a fraction, ask yourself: how many small portions fit inside the whole? Three cups divided by half-cups gives six full scoops!",
                "key_takeaway": "Dividing by a fraction less than 1 results in a larger number."
            },
            {
                "slide_id": 2,
                "title": "The Reciprocal (Flipping the Fraction)",
                "visual_concept": "Fraction: 2/3. Flip it upside down -> Reciprocal: 3/2. Their product is always 1.",
                "narration_text": "Every fraction has a reciprocal, created by swapping the numerator and the denominator. The reciprocal of two thirds is three halves. When multiplied together, they equal one.",
                "key_takeaway": "A fraction times its reciprocal always equals 1."
            },
            {
                "slide_id": 3,
                "title": "The Golden Rule: Keep, Change, Flip!",
                "visual_concept": "1/2 ÷ 3/4 -> Keep 1/2, Change ÷ to ×, Flip 3/4 to 4/3 -> 1/2 × 4/3 = 4/6 = 2/3.",
                "narration_text": "To divide any fractions, remember the rhyme: Keep, Change, Flip! Keep the first fraction as it is. Change the division sign to multiplication. Flip the second fraction upside down. Then multiply across!",
                "key_takeaway": "Keep the first, Change to multiply, Flip the second fraction."
            },
            {
                "slide_id": 4,
                "title": "Interactive Division Check",
                "visual_concept": "What is 2/5 ÷ 1/2? Apply Keep, Change, Flip!",
                "narration_text": "Quick checkpoint! What is two fifths divided by one half? Keep two fifths, change to multiply, and flip one half to two over one. Two times two is four, over five: four fifths!",
                "key_takeaway": "2/5 ÷ 1/2 = 2/5 × 2/1 = 4/5.",
                "interactive_check": {
                    "question": "What is 2/5 ÷ 1/2?",
                    "options": ["1/5", "2/10", "4/5", "1"],
                    "correct": "4/5"
                }
            },
            {
                "slide_id": 5,
                "title": "Fraction Division Mastery Unlocked!",
                "visual_concept": "You are ready for multi-step fraction word problems and reciprocal challenges.",
                "narration_text": "Awesome job! You now understand the logic behind fraction division and the Keep-Change-Flip algorithm. Jump into the practice arena!",
                "key_takeaway": "Reciprocal division mastered!"
            }
        ]
    },
    "g6-decimals-play": {
        "topic_id": "g6-decimals-play",
        "title": "Decimals: Place Value & Operations",
        "total_slides": 5,
        "slides": [
            {
                "slide_id": 1,
                "title": "Beyond Hundredths: The Thousandths Place",
                "visual_concept": "1 unit block divided into 10 slices (tenths), 100 rods (hundredths), and 1,000 tiny cubes (thousandths).",
                "narration_text": "Welcome Grade 6 Explorer! In scientific measurements and sports timing, we measure down to thousandths of a second. Three decimal digits like zero point one two five represent one hundred twenty-five thousandths.",
                "key_takeaway": "Thousandths is 3 places to the right of the decimal point: 0.001."
            },
            {
                "slide_id": 2,
                "title": "Multiplying Decimals: Count the Decimal Places",
                "visual_concept": "0.3 × 0.2: 3 × 2 = 6. Total decimal digits = 1 + 1 = 2 -> 0.06.",
                "narration_text": "When multiplying decimals, first multiply the numbers as if there were no decimal points: three times two is six. Then count the total decimal places in both factors and shift the point left: zero point zero six!",
                "key_takeaway": "Total decimal places in the answer equals the sum of decimal places in the factors."
            },
            {
                "slide_id": 3,
                "title": "Worked Example: 1.5 × 0.4",
                "visual_concept": "15 × 4 = 60. Two decimal places -> 0.60 or 0.6.",
                "narration_text": "Let us multiply one point five by zero point four. Fifteen times four is sixty. One decimal place in one point five plus one in zero point four makes two places. Count two spots from the right to get zero point six zero!",
                "key_takeaway": "1.5 × 0.4 = 0.60 or 0.6."
            },
            {
                "slide_id": 4,
                "title": "Interactive Decimal Operations Check",
                "visual_concept": "What is 0.5 × 0.6?",
                "narration_text": "Test your skill! What is zero point five times zero point six? Five times six is thirty. Shift the decimal two places left to get zero point three zero!",
                "key_takeaway": "0.5 × 0.6 = 0.30.",
                "interactive_check": {
                    "question": "What is 0.5 × 0.6?",
                    "options": ["3.0", "0.30", "0.03", "30"],
                    "correct": "0.30"
                }
            },
            {
                "slide_id": 5,
                "title": "Decimal Operations Master!",
                "visual_concept": "You are equipped for decimal word problems, currency conversions, and precision math.",
                "narration_text": "Splendid! You have mastered multi-digit decimal operations. Head over to the adaptive quiz to earn high-tier quest badges!",
                "key_takeaway": "Precision decimal calculations unlocked."
            }
        ]
    },
    "g6-lines-angles": {
        "topic_id": "g6-lines-angles",
        "title": "Geometry: Lines, Angles & Constructions",
        "total_slides": 5,
        "slides": [
            {
                "slide_id": 1,
                "title": "Points, Lines, Rays, and Segments",
                "visual_concept": "Line (goes on forever in both directions), Ray (starts at 1 point, extends forever), Segment (fixed endpoints).",
                "narration_text": "Welcome to Geometry! A line segment has two fixed endpoints with a measurable length. A ray starts at one endpoint and shoots out endlessly in one direction, just like a laser beam.",
                "key_takeaway": "A ray has one endpoint; a line segment has two; a line goes infinitely in both ways."
            },
            {
                "slide_id": 2,
                "title": "Classifying Angles by Degrees",
                "visual_concept": "Acute (< 90°), Right (exactly 90° square corner), Obtuse (90° to 180°), Straight (exactly 180°).",
                "narration_text": "Angles measure rotational turn. An acute angle is sharp and less than ninety degrees. A right angle makes a square ninety-degree corner like the corner of a book. An obtuse angle opens wider than ninety degrees.",
                "key_takeaway": "Acute < 90°, Right = 90°, Obtuse is between 90° and 180°."
            },
            {
                "slide_id": 3,
                "title": "Parallel vs. Perpendicular Lines",
                "visual_concept": "Parallel (railroad tracks that never touch, ∥). Perpendicular (cross at crisp 90° right angles, ⊥).",
                "narration_text": "Look around your room! Parallel lines run side-by-side like train tracks and never meet, no matter how far they go. Perpendicular lines intersect at a crisp ninety-degree right angle, like window frames.",
                "key_takeaway": "Parallel lines never meet; Perpendicular lines meet at 90°."
            },
            {
                "slide_id": 4,
                "title": "Interactive Angle Check",
                "visual_concept": "An angle measures 115 degrees. What type of angle is it?",
                "narration_text": "Test your intuition! If an angle measures one hundred fifteen degrees, what type of angle is it? Since one hundred fifteen is greater than ninety but less than one hundred eighty, it is an obtuse angle!",
                "key_takeaway": "115° is between 90° and 180°, so it is obtuse.",
                "interactive_check": {
                    "question": "What type of angle is 115°?",
                    "options": ["Acute", "Right", "Obtuse", "Straight"],
                    "correct": "Obtuse"
                }
            },
            {
                "slide_id": 5,
                "title": "Geometric Navigator Badge Unlocked!",
                "visual_concept": "You are ready to identify angle pairs and construct geometric shapes.",
                "narration_text": "Fantastic job! You now understand line relationships and angle classifications. Step into the practice arena to test your skills!",
                "key_takeaway": "Geometric intuition fully activated."
            }
        ]
    },
    "g6-geometry-area": {
        "topic_id": "g6-geometry-area",
        "title": "Mensuration: Area of Triangles & Parallelograms",
        "total_slides": 5,
        "slides": [
            {
                "slide_id": 1,
                "title": "Why a Triangle's Area is Half of a Rectangle",
                "visual_concept": "A rectangle sliced along its diagonal creates two identical congruent triangles.",
                "narration_text": "Welcome to Mensuration! Have you ever wondered why the area formula for a triangle is one half times base times height? If you draw a diagonal across any rectangle, it cuts cleanly into two identical triangles!",
                "key_takeaway": "Area of Triangle = 1/2 × Base × Height."
            },
            {
                "slide_id": 2,
                "title": "Area of a Parallelogram",
                "visual_concept": "Cut the triangular tip off a parallelogram and slide it to the other side: it forms an exact rectangle! Area = Base × Height.",
                "narration_text": "A parallelogram is like a leaning rectangle. If you slice off the triangular edge and shift it to the other side, it forms a straight rectangle. That means its area is simply base times height!",
                "key_takeaway": "Area of Parallelogram = Base × Perpendicular Height."
            },
            {
                "slide_id": 3,
                "title": "Worked Example: Triangle with Base 10 cm and Height 6 cm",
                "visual_concept": "Area = 1/2 × 10 × 6 = 1/2 × 60 = 30 sq cm.",
                "narration_text": "Let us calculate the area of a triangle with a base of ten centimeters and a vertical height of six centimeters. First multiply ten by six to get sixty. Then take half of sixty: thirty square centimeters!",
                "key_takeaway": "1/2 × 10 × 6 = 30 cm²."
            },
            {
                "slide_id": 4,
                "title": "Interactive Mensuration Check",
                "visual_concept": "What is the area of a triangle with base 8 cm and height 5 cm?",
                "narration_text": "Quick calculation! A triangle has a base of eight centimeters and a height of five centimeters. Multiply eight by five to get forty, and take half: twenty square centimeters!",
                "key_takeaway": "1/2 × 8 × 5 = 20 cm².",
                "interactive_check": {
                    "question": "What is the area of a triangle with base 8 cm and height 5 cm?",
                    "options": ["13 cm²", "20 cm²", "40 cm²", "26 cm²"],
                    "correct": "20 cm²"
                }
            },
            {
                "slide_id": 5,
                "title": "Mensuration Mastery Complete!",
                "visual_concept": "You can now solve practical area, composite shape, and volume problems.",
                "narration_text": "Bravo! You now command the formulas for polygons, triangles, and parallelograms. Jump into the practice quest to level up!",
                "key_takeaway": "Precision area calculations mastered."
            }
        ]
    },
    "g6-data-handling": {
        "topic_id": "g6-data-handling",
        "title": "Data Handling & Statistics: Mean, Median, Mode",
        "total_slides": 5,
        "slides": [
            {
                "slide_id": 1,
                "title": "The Three Champions of Central Tendency",
                "visual_concept": "Mean (fair share balance), Median (middle number in order), Mode (most frequent number).",
                "narration_text": "Welcome to Statistics! When you collect a group of numbers, like test scores or game points, three special measures summarize the data: the Mean, the Median, and the Mode.",
                "key_takeaway": "Mean is the average; Median is the middle; Mode is most frequent."
            },
            {
                "slide_id": 2,
                "title": "How to Calculate the Mean (Average)",
                "visual_concept": "Scores: 4, 6, 8. Sum = 18. Count = 3. Mean = 18 ÷ 3 = 6.",
                "narration_text": "The Mean is the fair share value. To find it, add all numbers together to get the grand sum, then divide by the total count of numbers. If three friends score four, six, and eight, the sum is eighteen divided by three: six!",
                "key_takeaway": "Mean = Sum of all values divided by total count."
            },
            {
                "slide_id": 3,
                "title": "Finding the Median & Mode",
                "visual_concept": "Ordered set: [2, 3, 5, 5, 9]. Middle value is 5 (Median). Most common is 5 (Mode).",
                "narration_text": "To find the Median, always sort the numbers in order from smallest to greatest first! The number right in the center is the Median. The Mode is the number that pops up most frequently.",
                "key_takeaway": "Always sort data in order before identifying the Median."
            },
            {
                "slide_id": 4,
                "title": "Interactive Statistics Check",
                "visual_concept": "Find the Median of the set: [3, 7, 9, 12, 15].",
                "narration_text": "Test your statistics skills! Look at the sorted set: three, seven, nine, twelve, fifteen. Which number sits directly in the middle? Nine is the median!",
                "key_takeaway": "In [3, 7, 9, 12, 15], 9 is the middle number.",
                "interactive_check": {
                    "question": "What is the Median of [3, 7, 9, 12, 15]?",
                    "options": ["7", "9", "12", "46"],
                    "correct": "9"
                }
            },
            {
                "slide_id": 5,
                "title": "Statistics Master Unlocked!",
                "visual_concept": "You are equipped to analyze survey data, double bar graphs, and probability.",
                "narration_text": "Outstanding work! You have mastered Mean, Median, and Mode. Jump into the practice arena to test your skills!",
                "key_takeaway": "Statistical thinking unlocked."
            }
        ]
    }
}


def get_video_lesson(topic_id: str) -> Dict[str, Any] | None:
    """
    Returns slide lesson structure with full narration scripts.
    Resolves exact topic, or finds closest keyword match before falling back.
    """
    if topic_id in VIDEO_LESSONS:
        return VIDEO_LESSONS[topic_id]

    # Keyword intelligent lookup
    topic_clean = topic_id.lower().replace("-", " ")
    for key, lesson in VIDEO_LESSONS.items():
        key_clean = key.lower().replace("-", " ")
        if topic_clean in key_clean or key_clean in topic_clean:
            return lesson

    # Search by category keywords
    if "ratio" in topic_clean:
        return VIDEO_LESSONS.get("g6-ratios")
    if "integer" in topic_clean:
        return VIDEO_LESSONS.get("g6-integers")
    if "algebra" in topic_clean:
        return VIDEO_LESSONS.get("g6-algebra")
    if "angle" in topic_clean or "line" in topic_clean:
        return VIDEO_LESSONS.get("g6-lines-angles")
    if "stat" in topic_clean or "mean" in topic_clean:
        return VIDEO_LESSONS.get("g6-data-handling")
    if "decimal" in topic_clean:
        return VIDEO_LESSONS.get("g5-decimals")
    if "factor" in topic_clean or "multiple" in topic_clean:
        return VIDEO_LESSONS.get("g5-factors-multiples")
    if "place" in topic_clean or "value" in topic_clean:
        return VIDEO_LESSONS.get("g5-place-value")
    if "volume" in topic_clean or "power" in topic_clean:
        return VIDEO_LESSONS.get("g5-volume-powers")
    if "area" in topic_clean or "perimeter" in topic_clean:
        return VIDEO_LESSONS.get("g5-measurement-area")
    if "geometry" in topic_clean:
        return VIDEO_LESSONS.get("g5-geometry")

    return VIDEO_LESSONS["g5-fractions"]

