"""
Question Bank for Grades 5 and 6
Contains pre-verified mathematical questions with full step-by-step explanations
and validation metadata for deterministic checks. Used as robust fallback and baseline.
"""

from typing import List, Dict, Any

VERIFIED_QUESTIONS: List[Dict[str, Any]] = [
    # GRADE 5: FRACTIONS
    {
        "question_id": "g5-frac-e1",
        "topic_id": "g5-fractions",
        "grade": 5,
        "difficulty": "easy",
        "question_text": "What is 1/5 + 2/5?",
        "options": [
            {"id": "A", "text": "3/10"},
            {"id": "B", "text": "3/5"},
            {"id": "C", "text": "2/25"},
            {"id": "D", "text": "1/5"}
        ],
        "correct_answer": "B",
        "explanation": "When fractions have the same denominator, add the numerators together (1 + 2 = 3) and keep the denominator the same (5). So, 1/5 + 2/5 = 3/5.",
        "learning_objective": "Add fractions with like denominators",
        "validation_data": {
            "type": "fraction_arithmetic",
            "op": "+",
            "n1": 1, "d1": 5,
            "n2": 2, "d2": 5
        },
        "verification_status": "verified"
    },
    {
        "question_id": "g5-frac-e2",
        "topic_id": "g5-fractions",
        "grade": 5,
        "difficulty": "easy",
        "question_text": "Subtract the fractions: 5/8 - 2/8.",
        "options": [
            {"id": "A", "text": "3/8"},
            {"id": "B", "text": "3/0"},
            {"id": "C", "text": "7/8"},
            {"id": "D", "text": "3/16"}
        ],
        "correct_answer": "A",
        "explanation": "Since denominators are equal (8), subtract numerators: 5 - 2 = 3. The result is 3/8.",
        "learning_objective": "Subtract fractions with like denominators",
        "validation_data": {
            "type": "fraction_arithmetic",
            "op": "-",
            "n1": 5, "d1": 8,
            "n2": 2, "d2": 8
        },
        "verification_status": "verified"
    },
    {
        "question_id": "g5-frac-m1",
        "topic_id": "g5-fractions",
        "grade": 5,
        "difficulty": "medium",
        "question_text": "What is 1/2 + 1/4?",
        "options": [
            {"id": "A", "text": "2/6"},
            {"id": "B", "text": "3/4"},
            {"id": "C", "text": "1/8"},
            {"id": "D", "text": "2/4"}
        ],
        "correct_answer": "B",
        "explanation": "Find a common denominator: 1/2 is equivalent to 2/4. Now add: 2/4 + 1/4 = 3/4.",
        "learning_objective": "Add fractions with unlike denominators",
        "validation_data": {
            "type": "fraction_arithmetic",
            "op": "+",
            "n1": 1, "d1": 2,
            "n2": 1, "d2": 4
        },
        "verification_status": "verified"
    },
    {
        "question_id": "g5-frac-h1",
        "topic_id": "g5-fractions",
        "grade": 5,
        "difficulty": "hard",
        "question_text": "Maya baked a tray of brownies. She ate 1/3 of the tray on Friday and 1/6 on Saturday. How much of the tray did she eat in total?",
        "options": [
            {"id": "A", "text": "2/9"},
            {"id": "B", "text": "1/2"},
            {"id": "C", "text": "5/6"},
            {"id": "D", "text": "3/6"}
        ],
        "correct_answer": "B",
        "explanation": "Convert 1/3 to 2/6 so the denominators match. 2/6 + 1/6 = 3/6, which simplifies to 1/2.",
        "learning_objective": "Solve real-world addition of fractions with unlike denominators",
        "validation_data": {
            "type": "fraction_arithmetic",
            "op": "+",
            "n1": 1, "d1": 3,
            "n2": 1, "d2": 6
        },
        "verification_status": "verified"
    },

    # GRADE 5: DECIMALS
    {
        "question_id": "g5-dec-e1",
        "topic_id": "g5-decimals",
        "grade": 5,
        "difficulty": "easy",
        "question_text": "Calculate: 0.4 + 0.3",
        "options": [
            {"id": "A", "text": "0.7"},
            {"id": "B", "text": "0.12"},
            {"id": "C", "text": "0.07"},
            {"id": "D", "text": "1.0"}
        ],
        "correct_answer": "A",
        "explanation": "Line up the tenths place: 4 tenths + 3 tenths = 7 tenths = 0.7.",
        "learning_objective": "Add decimals to tenths",
        "validation_data": {
            "type": "decimal_arithmetic",
            "op": "+",
            "num1": 0.4,
            "num2": 0.3
        },
        "verification_status": "verified"
    },
    {
        "question_id": "g5-dec-m1",
        "topic_id": "g5-decimals",
        "grade": 5,
        "difficulty": "medium",
        "question_text": "What is 4.75 - 1.25?",
        "options": [
            {"id": "A", "text": "3.5"},
            {"id": "B", "text": "3.50"},
            {"id": "C", "text": "3.25"},
            {"id": "D", "text": "5.0"}
        ],
        "correct_answer": "A",
        "explanation": "Subtract hundredths (0.05 - 0.05 = 0), then tenths (0.7 - 0.2 = 0.5), then whole numbers (4 - 1 = 3). 4.75 - 1.25 = 3.5.",
        "learning_objective": "Subtract decimals to hundredths",
        "validation_data": {
            "type": "decimal_arithmetic",
            "op": "-",
            "num1": 4.75,
            "num2": 1.25
        },
        "verification_status": "verified"
    },
    {
        "question_id": "g5-dec-h1",
        "topic_id": "g5-decimals",
        "grade": 5,
        "difficulty": "hard",
        "question_text": "Liam bought a book for $8.45 and a pencil case for $3.80. How much did he spend in total?",
        "options": [
            {"id": "A", "text": "12.25"},
            {"id": "B", "text": "11.25"},
            {"id": "C", "text": "12.05"},
            {"id": "D", "text": "11.85"}
        ],
        "correct_answer": "A",
        "explanation": "8.45 + 3.80: 5 + 0 = 5 in hundredths. 4 + 8 = 12 tenths (write 2, carry 1). 1 + 8 + 3 = 12 wholes. Total is $12.25.",
        "learning_objective": "Multi-digit decimal addition with regrouping",
        "validation_data": {
            "type": "decimal_arithmetic",
            "op": "+",
            "num1": 8.45,
            "num2": 3.80
        },
        "verification_status": "verified"
    },

    # GRADE 5: GEOMETRY
    {
        "question_id": "g5-geo-e1",
        "topic_id": "g5-geometry",
        "grade": 5,
        "difficulty": "easy",
        "question_text": "A rectangular garden has a length of 6 meters and a width of 4 meters. What is its perimeter?",
        "options": [
            {"id": "A", "text": "24"},
            {"id": "B", "text": "20"},
            {"id": "C", "text": "10"},
            {"id": "D", "text": "12"}
        ],
        "correct_answer": "B",
        "explanation": "Perimeter of a rectangle is 2 * (length + width) = 2 * (6 + 4) = 2 * 10 = 20 meters.",
        "learning_objective": "Calculate perimeter of rectangles",
        "validation_data": {
            "type": "geometry",
            "shape": "rectangle",
            "metric": "perimeter",
            "params": {"length": 6.0, "width": 4.0}
        },
        "verification_status": "verified"
    },
    {
        "question_id": "g5-geo-m1",
        "topic_id": "g5-geometry",
        "grade": 5,
        "difficulty": "medium",
        "question_text": "What is the area of a square table with each side measuring 7 feet?",
        "options": [
            {"id": "A", "text": "28"},
            {"id": "B", "text": "49"},
            {"id": "C", "text": "14"},
            {"id": "D", "text": "21"}
        ],
        "correct_answer": "B",
        "explanation": "Area of a square = side * side = 7 * 7 = 49 square feet.",
        "learning_objective": "Calculate area of squares",
        "validation_data": {
            "type": "geometry",
            "shape": "square",
            "metric": "area",
            "params": {"side": 7.0}
        },
        "verification_status": "verified"
    },

    # GRADE 6: RATIOS
    {
        "question_id": "g6-ratio-e1",
        "topic_id": "g6-ratios",
        "grade": 6,
        "difficulty": "easy",
        "question_text": "In a basket there are 6 red apples and 9 green apples. What is the simplified ratio of red apples to green apples?",
        "options": [
            {"id": "A", "text": "6:9"},
            {"id": "B", "text": "2:3"},
            {"id": "C", "text": "3:2"},
            {"id": "D", "text": "1:3"}
        ],
        "correct_answer": "B",
        "explanation": "Divide both numbers by their greatest common factor (3): 6/3 = 2 and 9/3 = 3. The simplified ratio is 2:3.",
        "learning_objective": "Simplify ratios to lowest terms",
        "validation_data": {
            "type": "ratio_simplification",
            "a": 6, "b": 9
        },
        "verification_status": "verified"
    },
    {
        "question_id": "g6-ratio-m1",
        "topic_id": "g6-ratios",
        "grade": 6,
        "difficulty": "medium",
        "question_text": "A car travels 180 miles in 3 hours. What is its unit rate in miles per hour?",
        "options": [
            {"id": "A", "text": "50"},
            {"id": "B", "text": "60"},
            {"id": "C", "text": "90"},
            {"id": "D", "text": "45"}
        ],
        "correct_answer": "B",
        "explanation": "Unit rate = total miles / total hours = 180 / 3 = 60 miles per hour.",
        "learning_objective": "Calculate unit rates",
        "validation_data": {
            "type": "decimal_arithmetic",
            "op": "/",
            "num1": 180.0,
            "num2": 3.0
        },
        "verification_status": "verified"
    },

    # GRADE 6: FRACTION DIVISION
    {
        "question_id": "g6-fracdiv-m1",
        "topic_id": "g6-fractions-division",
        "grade": 6,
        "difficulty": "medium",
        "question_text": "What is 3/4 divided by 1/2?",
        "options": [
            {"id": "A", "text": "3/8"},
            {"id": "B", "text": "3/2"},
            {"id": "C", "text": "6/4"},
            {"id": "D", "text": "2/3"}
        ],
        "correct_answer": "B",
        "explanation": "Dividing by a fraction is the same as multiplying by its reciprocal: 3/4 * 2/1 = 6/4 = 3/2 (or 1 1/2).",
        "learning_objective": "Compute quotients of fractions",
        "validation_data": {
            "type": "fraction_arithmetic",
            "op": "/",
            "n1": 3, "d1": 4,
            "n2": 1, "d2": 2
        },
        "verification_status": "verified"
    },

    # GRADE 6: GEOMETRY AREA
    {
        "question_id": "g6-geo-area-m1",
        "topic_id": "g6-geometry-area",
        "grade": 6,
        "difficulty": "medium",
        "question_text": "What is the area of a triangle with a base of 8 cm and a height of 5 cm?",
        "options": [
            {"id": "A", "text": "40"},
            {"id": "B", "text": "20"},
            {"id": "C", "text": "13"},
            {"id": "D", "text": "26"}
        ],
        "correct_answer": "B",
        "explanation": "Area of a triangle = (1/2) * base * height = 0.5 * 8 * 5 = 20 square cm.",
        "learning_objective": "Calculate area of triangles",
        "validation_data": {
            "type": "geometry",
            "shape": "triangle",
            "metric": "area",
            "params": {"base": 8.0, "height": 5.0}
        },
        "verification_status": "verified"
    },
    # GRADE 5: PLACE VALUE (INDIAN & INTERNATIONAL)
    {
        "question_id": "g5-pv-e1",
        "topic_id": "g5-place-value",
        "grade": 5,
        "difficulty": "easy",
        "question_text": "How many Lakhs are in 1 Million in the International System?",
        "options": [
            {"id": "A", "text": "1 Lakh"},
            {"id": "B", "text": "10 Lakhs"},
            {"id": "C", "text": "100 Lakhs"},
            {"id": "D", "text": "5 Lakhs"}
        ],
        "correct_answer": "B",
        "explanation": "1 Million has six zeros (1,000,000). When written in the Indian system, 10,00,000 equals exactly 10 Lakhs.",
        "learning_objective": "Convert between Indian and International systems",
        "validation_data": {
            "type": "exact_choice",
            "expected": "10 Lakhs"
        },
        "verification_status": "verified"
    },
    {
        "question_id": "g5-pv-e2",
        "topic_id": "g5-place-value",
        "grade": 5,
        "difficulty": "easy",
        "question_text": "Which of the following numbers shows correct comma grouping in the Indian System for 25 Lakhs?",
        "options": [
            {"id": "A", "text": "2,500,000"},
            {"id": "B", "text": "25,00,000"},
            {"id": "C", "text": "250,0000"},
            {"id": "D", "text": "2500,000"}
        ],
        "correct_answer": "B",
        "explanation": "In the Indian system, commas appear after the first 3 digits from the right, then every 2 digits: 25,00,000.",
        "learning_objective": "Identify place value periods in Indian System",
        "validation_data": {
            "type": "exact_choice",
            "expected": "25,00,000"
        },
        "verification_status": "verified"
    },
    {
        "question_id": "g5-pv-m1",
        "topic_id": "g5-place-value",
        "grade": 5,
        "difficulty": "medium",
        "question_text": "How many Millions equal 1 Crore?",
        "options": [
            {"id": "A", "text": "1 Million"},
            {"id": "B", "text": "10 Millions"},
            {"id": "C", "text": "100 Millions"},
            {"id": "D", "text": "1,000 Millions"}
        ],
        "correct_answer": "B",
        "explanation": "1 Crore = 1,00,00,000 (seven zeros). In the International system, 10,000,000 is 10 Millions.",
        "learning_objective": "Convert Crores to Millions",
        "validation_data": {
            "type": "exact_choice",
            "expected": "10 Millions"
        },
        "verification_status": "verified"
    },

    # GRADE 5: FACTORS, MULTIPLES, HCF & LCM
    {
        "question_id": "g5-fm-e1",
        "topic_id": "g5-factors-multiples",
        "grade": 5,
        "difficulty": "easy",
        "question_text": "Which of the following is a prime number?",
        "options": [
            {"id": "A", "text": "9"},
            {"id": "B", "text": "15"},
            {"id": "C", "text": "17"},
            {"id": "D", "text": "21"}
        ],
        "correct_answer": "C",
        "explanation": "17 has only two factors: 1 and itself (17). Numbers like 9, 15, and 21 are composite.",
        "learning_objective": "Identify prime numbers",
        "validation_data": {
            "type": "exact_choice",
            "expected": "17"
        },
        "verification_status": "verified"
    },
    {
        "question_id": "g5-fm-m1",
        "topic_id": "g5-factors-multiples",
        "grade": 5,
        "difficulty": "medium",
        "question_text": "What is the HCF (Highest Common Factor) of 12 and 18?",
        "options": [
            {"id": "A", "text": "2"},
            {"id": "B", "text": "3"},
            {"id": "C", "text": "6"},
            {"id": "D", "text": "12"}
        ],
        "correct_answer": "C",
        "explanation": "Factors of 12: 1, 2, 3, 4, 6, 12. Factors of 18: 1, 2, 3, 6, 9, 18. Common factors are 1, 2, 3, 6. The highest is 6.",
        "learning_objective": "Calculate HCF of two numbers",
        "validation_data": {
            "type": "hcf_lcm",
            "calc_type": "hcf",
            "a": 12,
            "b": 18
        },
        "verification_status": "verified"
    },
    {
        "question_id": "g5-fm-m2",
        "topic_id": "g5-factors-multiples",
        "grade": 5,
        "difficulty": "medium",
        "question_text": "What is the LCM (Lowest Common Multiple) of 4 and 6?",
        "options": [
            {"id": "A", "text": "12"},
            {"id": "B", "text": "24"},
            {"id": "C", "text": "2"},
            {"id": "D", "text": "10"}
        ],
        "correct_answer": "A",
        "explanation": "Multiples of 4: 4, 8, 12, 16. Multiples of 6: 6, 12, 18. The smallest common multiple is 12.",
        "learning_objective": "Calculate LCM of two numbers",
        "validation_data": {
            "type": "hcf_lcm",
            "calc_type": "lcm",
            "a": 4,
            "b": 6
        },
        "verification_status": "verified"
    },

    # GRADE 5: MEASUREMENT & AREA
    {
        "question_id": "g5-ma-e1",
        "topic_id": "g5-measurement-area",
        "grade": 5,
        "difficulty": "easy",
        "question_text": "A rectangular playground has a length of 10 meters and a width of 4 meters. What is its perimeter?",
        "options": [
            {"id": "A", "text": "40"},
            {"id": "B", "text": "28"},
            {"id": "C", "text": "14"},
            {"id": "D", "text": "24"}
        ],
        "correct_answer": "B",
        "explanation": "Perimeter = 2 * (Length + Width) = 2 * (10 + 4) = 2 * 14 = 28 meters.",
        "learning_objective": "Calculate perimeter of rectangles",
        "validation_data": {
            "type": "geometry",
            "shape": "rectangle",
            "metric": "perimeter",
            "params": {"length": 10.0, "width": 4.0}
        },
        "verification_status": "verified"
    },
    {
        "question_id": "g5-ma-m1",
        "topic_id": "g5-measurement-area",
        "grade": 5,
        "difficulty": "medium",
        "question_text": "What is the area of a square tile with a side length of 8 cm?",
        "options": [
            {"id": "A", "text": "32"},
            {"id": "B", "text": "64"},
            {"id": "C", "text": "16"},
            {"id": "D", "text": "24"}
        ],
        "correct_answer": "B",
        "explanation": "Area of a square = side * side = 8 * 8 = 64 square cm.",
        "learning_objective": "Calculate area of squares",
        "validation_data": {
            "type": "geometry",
            "shape": "square",
            "metric": "area",
            "params": {"side": 8.0}
        },
        "verification_status": "verified"
    },

    # GRADE 5: 3D VOLUME & POWERS OF TEN
    {
        "question_id": "g5-vp-e1",
        "topic_id": "g5-volume-powers",
        "grade": 5,
        "difficulty": "easy",
        "question_text": "What is 45 * 100?",
        "options": [
            {"id": "A", "text": "450"},
            {"id": "B", "text": "4,500"},
            {"id": "C", "text": "45,000"},
            {"id": "D", "text": "45"}
        ],
        "correct_answer": "B",
        "explanation": "Multiplying by 100 shifts the digits two place values to the left, appending two zeros: 4,500.",
        "learning_objective": "Multiply whole numbers by powers of 10",
        "validation_data": {
            "type": "exact_choice",
            "expected": "4,500"
        },
        "verification_status": "verified"
    },
    {
        "question_id": "g5-vp-m1",
        "topic_id": "g5-volume-powers",
        "grade": 5,
        "difficulty": "medium",
        "question_text": "What is the volume of a rectangular prism with length 5 cm, width 3 cm, and height 4 cm?",
        "options": [
            {"id": "A", "text": "12"},
            {"id": "B", "text": "60"},
            {"id": "C", "text": "24"},
            {"id": "D", "text": "30"}
        ],
        "correct_answer": "B",
        "explanation": "Volume = length * width * height = 5 * 3 * 4 = 60 cubic cm.",
        "learning_objective": "Calculate volume of rectangular prisms",
        "validation_data": {
            "type": "geometry",
            "shape": "rectangular_prism",
            "metric": "volume",
            "params": {"length": 5.0, "width": 3.0, "height": 4.0}
        },
        "verification_status": "verified"
    },

    # GRADE 5: DATA HANDLING
    {
        "question_id": "g5-dh-e1",
        "topic_id": "g5-data-handling",
        "grade": 5,
        "difficulty": "easy",
        "question_text": "How many lines of symmetry does a regular rectangle (that is not a square) have?",
        "options": [
            {"id": "A", "text": "1"},
            {"id": "B", "text": "2"},
            {"id": "C", "text": "4"},
            {"id": "D", "text": "0"}
        ],
        "correct_answer": "B",
        "explanation": "A non-square rectangle has exactly 2 lines of symmetry: one vertical and one horizontal fold down the center.",
        "learning_objective": "Identify lines of symmetry in 2D shapes",
        "validation_data": {
            "type": "exact_choice",
            "expected": "2"
        },
        "verification_status": "verified"
    },
    {
        "question_id": "g5-dh-e2",
        "topic_id": "g5-data-handling",
        "grade": 5,
        "difficulty": "easy",
        "question_text": "In a pictograph where 1 smile icon represents 4 students, what do 3 smile icons represent?",
        "options": [
            {"id": "A", "text": "7"},
            {"id": "B", "text": "12"},
            {"id": "C", "text": "16"},
            {"id": "D", "text": "34"}
        ],
        "correct_answer": "B",
        "explanation": "Multiply the count of icons by the scale value: 3 × 4 = 12 students.",
        "learning_objective": "Read and interpret pictograph scales",
        "validation_data": {
            "type": "exact_choice",
            "expected": "12"
        },
        "verification_status": "verified"
    },
    {
        "question_id": "g5-dh-m1",
        "topic_id": "g5-data-handling",
        "grade": 5,
        "difficulty": "medium",
        "question_text": "In a bar chart, the scale marks count by 5s. If a bar reaches the 4th tick mark, what value does it represent?",
        "options": [
            {"id": "A", "text": "9"},
            {"id": "B", "text": "20"},
            {"id": "C", "text": "25"},
            {"id": "D", "text": "15"}
        ],
        "correct_answer": "B",
        "explanation": "Each tick mark represents 5 units. 4 tick marks = 4 * 5 = 20 units.",
        "learning_objective": "Interpret scale steps on a bar chart",
        "validation_data": {
            "type": "exact_choice",
            "expected": "20"
        },
        "verification_status": "verified"
    },
    {
        "question_id": "g5-dh-h1",
        "topic_id": "g5-data-handling",
        "grade": 5,
        "difficulty": "hard",
        "question_text": "Four students scored 8, 12, 10, and 14 points in a math game. What is their average (mean) score?",
        "options": [
            {"id": "A", "text": "10"},
            {"id": "B", "text": "11"},
            {"id": "C", "text": "12"},
            {"id": "D", "text": "14"}
        ],
        "correct_answer": "B",
        "explanation": "Add all scores: 8 + 12 + 10 + 14 = 44. Divide by total count of students: 44 / 4 = 11.",
        "learning_objective": "Calculate simple average mean",
        "validation_data": {
            "type": "exact_choice",
            "expected": "11"
        },
        "verification_status": "verified"
    },

    # ADDITIONAL GRADE 5 PLACE VALUE QUESTIONS
    {
        "question_id": "g5-pv-h1",
        "topic_id": "g5-place-value",
        "grade": 5,
        "difficulty": "hard",
        "question_text": "What is the difference between 1 Crore and 10 Lakhs in the Indian System?",
        "options": [
            {"id": "A", "text": "90 Lakhs"},
            {"id": "B", "text": "9 Lakhs"},
            {"id": "C", "text": "99 Lakhs"},
            {"id": "D", "text": "10 Lakhs"}
        ],
        "correct_answer": "A",
        "explanation": "1 Crore = 100 Lakhs. Subtracting 10 Lakhs: 100 Lakhs - 10 Lakhs = 90 Lakhs.",
        "learning_objective": "Calculate differences with Lakhs and Crores",
        "validation_data": {
            "type": "exact_choice",
            "expected": "90 Lakhs"
        },
        "verification_status": "verified"
    },

    # ADDITIONAL GRADE 5 FACTORS & MULTIPLES QUESTIONS
    {
        "question_id": "g5-fm-h1",
        "topic_id": "g5-factors-multiples",
        "grade": 5,
        "difficulty": "hard",
        "question_text": "What is the LCM of 6, 8, and 12?",
        "options": [
            {"id": "A", "text": "12"},
            {"id": "B", "text": "24"},
            {"id": "C", "text": "48"},
            {"id": "D", "text": "36"}
        ],
        "correct_answer": "B",
        "explanation": "Multiples of 12: 12, 24, 36... 24 is divisible by 6 (24/6=4), by 8 (24/8=3), and by 12 (24/12=2). Thus LCM = 24.",
        "learning_objective": "Find LCM of three numbers",
        "validation_data": {
            "type": "exact_choice",
            "expected": "24"
        },
        "verification_status": "verified"
    },

    # ADDITIONAL GRADE 5 MEASUREMENT & AREA QUESTIONS
    {
        "question_id": "g5-ma-h1",
        "topic_id": "g5-measurement-area",
        "grade": 5,
        "difficulty": "hard",
        "question_text": "A rectangular room has an area of 48 square meters. If the length is 8 meters, what is its perimeter?",
        "options": [
            {"id": "A", "text": "28"},
            {"id": "B", "text": "14"},
            {"id": "C", "text": "24"},
            {"id": "D", "text": "32"}
        ],
        "correct_answer": "A",
        "explanation": "Width = Area / Length = 48 / 8 = 6 meters. Perimeter = 2 * (Length + Width) = 2 * (8 + 6) = 2 * 14 = 28 meters.",
        "learning_objective": "Calculate perimeter from area and length",
        "validation_data": {
            "type": "geometry",
            "shape": "rectangle",
            "metric": "perimeter",
            "params": {"length": 8.0, "width": 6.0}
        },
        "verification_status": "verified"
    },

    # ADDITIONAL GRADE 5 3D VOLUME & POWERS OF 10 QUESTIONS
    {
        "question_id": "g5-vp-h1",
        "topic_id": "g5-volume-powers",
        "grade": 5,
        "difficulty": "hard",
        "question_text": "A water tank shaped like a cube has an edge length of 10 cm. What is its volume in cubic centimeters?",
        "options": [
            {"id": "A", "text": "100"},
            {"id": "B", "text": "1,000"},
            {"id": "C", "text": "600"},
            {"id": "D", "text": "30"}
        ],
        "correct_answer": "B",
        "explanation": "Volume of a cube = side * side * side = 10 * 10 * 10 = 1,000 cubic cm.",
        "learning_objective": "Calculate volume of cubes",
        "validation_data": {
            "type": "exact_choice",
            "expected": "1,000"
        },
        "verification_status": "verified"
    },

    # ADDITIONAL GRADE 5 GEOMETRY QUESTIONS
    {
        "question_id": "g5-geo-e2",
        "topic_id": "g5-geometry",
        "grade": 5,
        "difficulty": "easy",
        "question_text": "How many total degrees are inside any triangle?",
        "options": [
            {"id": "A", "text": "90°"},
            {"id": "B", "text": "180°"},
            {"id": "C", "text": "360°"},
            {"id": "D", "text": "270°"}
        ],
        "correct_answer": "B",
        "explanation": "The sum of the three interior angles of any triangle is always exactly 180 degrees.",
        "learning_objective": "Understand angle sum property of triangles",
        "validation_data": {
            "type": "exact_choice",
            "expected": "180°"
        },
        "verification_status": "verified"
    },
    {
        "question_id": "g5-geo-h1",
        "topic_id": "g5-geometry",
        "grade": 5,
        "difficulty": "hard",
        "question_text": "A triangle has side lengths of 7 cm, 10 cm, and 12 cm. What is its perimeter?",
        "options": [
            {"id": "A", "text": "29"},
            {"id": "B", "text": "30"},
            {"id": "C", "text": "27"},
            {"id": "D", "text": "84"}
        ],
        "correct_answer": "A",
        "explanation": "Perimeter of a triangle = side_a + side_b + side_c = 7 + 10 + 12 = 29 cm.",
        "learning_objective": "Calculate perimeter of scalene triangles",
        "validation_data": {
            "type": "geometry",
            "shape": "triangle",
            "metric": "perimeter",
            "params": {"side_a": 7.0, "side_b": 10.0, "side_c": 12.0}
        },
        "verification_status": "verified"
    },

    # GRADE 6: INTEGERS (THE OTHER SIDE OF ZERO)
    {
        "question_id": "g6-int-e1",
        "topic_id": "g6-integers",
        "grade": 6,
        "difficulty": "easy",
        "question_text": "A submarine dives 250 meters below sea level. Which integer best represents its position?",
        "options": [
            {"id": "A", "text": "+250"},
            {"id": "B", "text": "-250"},
            {"id": "C", "text": "0"},
            {"id": "D", "text": "-500"}
        ],
        "correct_answer": "B",
        "explanation": "Sea level is considered 0. Going below sea level is represented by negative integers, so 250 meters below is -250.",
        "learning_objective": "Represent real-life quantities with signed integers",
        "validation_data": {
            "type": "exact_choice",
            "expected": "-250"
        },
        "verification_status": "verified"
    },
    {
        "question_id": "g6-int-e2",
        "topic_id": "g6-integers",
        "grade": 6,
        "difficulty": "easy",
        "question_text": "Which integer is greater: -3 or -8?",
        "options": [
            {"id": "A", "text": "-8"},
            {"id": "B", "text": "-3"},
            {"id": "C", "text": "They are equal"},
            {"id": "D", "text": "Cannot be compared"}
        ],
        "correct_answer": "B",
        "explanation": "On a number line, numbers further to the right are greater. -3 is to the right of -8, meaning -3 is greater than -8.",
        "learning_objective": "Compare integers on a number line",
        "validation_data": {
            "type": "exact_choice",
            "expected": "-3"
        },
        "verification_status": "verified"
    },
    {
        "question_id": "g6-int-m1",
        "topic_id": "g6-integers",
        "grade": 6,
        "difficulty": "medium",
        "question_text": "What is (-7) + (+12)?",
        "options": [
            {"id": "A", "text": "-19"},
            {"id": "B", "text": "+5"},
            {"id": "C", "text": "-5"},
            {"id": "D", "text": "+19"}
        ],
        "correct_answer": "B",
        "explanation": "When adding integers with opposite signs, subtract the smaller absolute value from the larger (12 - 7 = 5) and keep the sign of the larger number (+12). The result is +5.",
        "learning_objective": "Add integers with different signs",
        "validation_data": {
            "type": "exact_choice",
            "expected": "+5"
        },
        "verification_status": "verified"
    },
    {
        "question_id": "g6-int-h1",
        "topic_id": "g6-integers",
        "grade": 6,
        "difficulty": "hard",
        "question_text": "In Leh, Ladakh, the temperature was -4°C at midnight. By noon, it rose by 9°C. What was the noon temperature?",
        "options": [
            {"id": "A", "text": "-13°C"},
            {"id": "B", "text": "+5°C"},
            {"id": "C", "text": "+13°C"},
            {"id": "D", "text": "-5°C"}
        ],
        "correct_answer": "B",
        "explanation": "-4 + 9 = 5°C. Moving 9 units to the right from -4 on the number line reaches +5.",
        "learning_objective": "Solve real-world temperature problems with integers",
        "validation_data": {
            "type": "exact_choice",
            "expected": "+5°c"
        },
        "verification_status": "verified"
    },

    # GRADE 6: ALGEBRA & EXPRESSIONS
    {
        "question_id": "g6-alg-e1",
        "topic_id": "g6-algebra",
        "grade": 6,
        "difficulty": "easy",
        "question_text": "If 1 box contains 'x' pencils, how many pencils are in 5 such boxes?",
        "options": [
            {"id": "A", "text": "x + 5"},
            {"id": "B", "text": "5x"},
            {"id": "C", "text": "x - 5"},
            {"id": "D", "text": "x / 5"}
        ],
        "correct_answer": "B",
        "explanation": "5 boxes of x pencils each means 5 times x, written as 5x in algebra.",
        "learning_objective": "Write algebraic expressions for word patterns",
        "validation_data": {
            "type": "exact_choice",
            "expected": "5x"
        },
        "verification_status": "verified"
    },
    {
        "question_id": "g6-alg-m1",
        "topic_id": "g6-algebra",
        "grade": 6,
        "difficulty": "medium",
        "question_text": "What is the value of the algebraic expression 3y + 4 when y = 6?",
        "options": [
            {"id": "A", "text": "18"},
            {"id": "B", "text": "22"},
            {"id": "C", "text": "24"},
            {"id": "D", "text": "13"}
        ],
        "correct_answer": "B",
        "explanation": "Substitute y = 6: 3(6) + 4 = 18 + 4 = 22.",
        "learning_objective": "Evaluate expressions by variable substitution",
        "validation_data": {
            "type": "exact_choice",
            "expected": "22"
        },
        "verification_status": "verified"
    },
    {
        "question_id": "g6-alg-h1",
        "topic_id": "g6-algebra",
        "grade": 6,
        "difficulty": "hard",
        "question_text": "Solve the one-step equation: x - 15 = 25.",
        "options": [
            {"id": "A", "text": "10"},
            {"id": "B", "text": "40"},
            {"id": "C", "text": "375"},
            {"id": "D", "text": "50"}
        ],
        "correct_answer": "B",
        "explanation": "To isolate x, apply the inverse operation: add 15 to both sides. x = 25 + 15 = 40.",
        "learning_objective": "Solve one-step linear equations",
        "validation_data": {
            "type": "exact_choice",
            "expected": "40"
        },
        "verification_status": "verified"
    },

    # GRADE 6: DECIMALS PLAY & OPERATIONS
    {
        "question_id": "g6-dec-e1",
        "topic_id": "g6-decimals-play",
        "grade": 6,
        "difficulty": "easy",
        "question_text": "Convert 3/5 into a decimal.",
        "options": [
            {"id": "A", "text": "0.35"},
            {"id": "B", "text": "0.6"},
            {"id": "C", "text": "0.53"},
            {"id": "D", "text": "1.5"}
        ],
        "correct_answer": "B",
        "explanation": "Divide numerator by denominator: 3 ÷ 5 = 0.6 (or multiply both numerator and denominator by 2 to get 6/10 = 0.6).",
        "learning_objective": "Convert fractions to decimals",
        "validation_data": {
            "type": "exact_choice",
            "expected": "0.6"
        },
        "verification_status": "verified"
    },
    {
        "question_id": "g6-dec-m1",
        "topic_id": "g6-decimals-play",
        "grade": 6,
        "difficulty": "medium",
        "question_text": "Calculate: 12.5 × 0.4",
        "options": [
            {"id": "A", "text": "5.0"},
            {"id": "B", "text": "50.0"},
            {"id": "C", "text": "0.50"},
            {"id": "D", "text": "12.9"}
        ],
        "correct_answer": "A",
        "explanation": "Multiply as whole numbers: 125 × 4 = 500. Count total decimal places: one in 12.5 plus one in 0.4 = two places. 500 becomes 5.00 = 5.0.",
        "learning_objective": "Multiply decimals accurately",
        "validation_data": {
            "type": "exact_choice",
            "expected": "5.0"
        },
        "verification_status": "verified"
    },

    # GRADE 6: LINES, ANGLES & GEOMETRY
    {
        "question_id": "g6-la-e1",
        "topic_id": "g6-lines-angles",
        "grade": 6,
        "difficulty": "easy",
        "question_text": "An angle measuring 135° is classified as which type of angle?",
        "options": [
            {"id": "A", "text": "Acute Angle"},
            {"id": "B", "text": "Obtuse Angle"},
            {"id": "C", "text": "Right Angle"},
            {"id": "D", "text": "Reflex Angle"}
        ],
        "correct_answer": "B",
        "explanation": "An angle between 90° and 180° is an obtuse angle. Since 135° is greater than 90° and less than 180°, it is obtuse.",
        "learning_objective": "Classify angles by degrees",
        "validation_data": {
            "type": "exact_choice",
            "expected": "obtuse angle"
        },
        "verification_status": "verified"
    },
    {
        "question_id": "g6-la-m1",
        "topic_id": "g6-lines-angles",
        "grade": 6,
        "difficulty": "medium",
        "question_text": "Two lines that remain the same distance apart and never intersect no matter how far extended are called:",
        "options": [
            {"id": "A", "text": "Perpendicular lines"},
            {"id": "B", "text": "Parallel lines"},
            {"id": "C", "text": "Intersecting lines"},
            {"id": "D", "text": "Transversal lines"}
        ],
        "correct_answer": "B",
        "explanation": "Parallel lines run side by side at an identical distance apart (like railway tracks) and never meet.",
        "learning_objective": "Identify parallel and perpendicular lines",
        "validation_data": {
            "type": "exact_choice",
            "expected": "parallel lines"
        },
        "verification_status": "verified"
    },

    # GRADE 6: DATA HANDLING & STATISTICS
    {
        "question_id": "g6-dh-e1",
        "topic_id": "g6-data-handling",
        "grade": 6,
        "difficulty": "easy",
        "question_text": "Find the Median of this arranged data set: 3, 5, 7, 9, 11.",
        "options": [
            {"id": "A", "text": "5"},
            {"id": "B", "text": "7"},
            {"id": "C", "text": "9"},
            {"id": "D", "text": "35"}
        ],
        "correct_answer": "B",
        "explanation": "The median is the exact middle number when data is placed in order. In 3, 5, 7, 9, 11, the middle value is 7.",
        "learning_objective": "Determine median of an ordered data set",
        "validation_data": {
            "type": "exact_choice",
            "expected": "7"
        },
        "verification_status": "verified"
    },
    {
        "question_id": "g6-dh-m1",
        "topic_id": "g6-data-handling",
        "grade": 6,
        "difficulty": "medium",
        "question_text": "Which measure of central tendency represents the number that occurs most frequently in a data set?",
        "options": [
            {"id": "A", "text": "Mean"},
            {"id": "B", "text": "Mode"},
            {"id": "C", "text": "Median"},
            {"id": "D", "text": "Range"}
        ],
        "correct_answer": "B",
        "explanation": "The Mode is the value that appears most often in a distribution.",
        "learning_objective": "Distinguish between mean, median, and mode",
        "validation_data": {
            "type": "exact_choice",
            "expected": "mode"
        },
        "verification_status": "verified"
    },

    # GRADE 6: RATIOS & UNITARY METHOD
    {
        "question_id": "g6-ratio-u1",
        "topic_id": "g6-ratios",
        "grade": 6,
        "difficulty": "medium",
        "question_text": "If 6 notebooks cost $18, what is the cost of 10 notebooks using the Unitary Method?",
        "options": [
            {"id": "A", "text": "$24"},
            {"id": "B", "text": "$30"},
            {"id": "C", "text": "$36"},
            {"id": "D", "text": "$28"}
        ],
        "correct_answer": "B",
        "explanation": "First find cost of 1 notebook (unit value): $18 ÷ 6 = $3. Then multiply for 10 notebooks: 10 × $3 = $30.",
        "learning_objective": "Apply the unitary method to solve rate problems",
        "validation_data": {
            "type": "exact_choice",
            "expected": "$30"
        },
        "verification_status": "verified"
    }
]


def get_verified_questions(
    topic_id: str,
    difficulty: str = None,
    excluded_ids: List[str] = None
) -> List[Dict[str, Any]]:
    """Retrieve pre-verified questions filtered by topic, optional difficulty, and excluding already delivered IDs."""
    qs = [q for q in VERIFIED_QUESTIONS if q["topic_id"] == topic_id]
    if excluded_ids:
        qs_filtered = [q for q in qs if q["question_id"] not in excluded_ids]
        if qs_filtered:
            qs = qs_filtered

    if difficulty:
        diff_qs = [q for q in qs if q["difficulty"] == difficulty]
        if diff_qs:
            return diff_qs
    return qs
