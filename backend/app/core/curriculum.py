"""
Georgia Mathematics Standards (GMS) Topic Catalog & Learning Objectives
Covers Grades 5 & 6 standards with verified mathematical alignments.
"""

from typing import Dict, List, Any, Optional

# Georgia Mathematics Standards Aligned Catalog for Grade 5 and Grade 6
CURRICULUM_CATALOG: Dict[str, Dict[str, Any]] = {
    "g5-fractions": {
        "topic_id": "g5-fractions",
        "grade": 5,
        "title": "Fractions: Addition & Subtraction",
        "category": "Fractions",
        "curriculum_reference": "Georgia Standards of Excellence (GSE) 5.NR.3 / 5.NR.3.1 - Add and subtract fractions with like and unlike denominators",
        "description": "Master adding and subtracting fractions using visual models, equivalent fractions, and common denominators.",
        "icon": "PieChart",
        "learning_objectives": [
            "Understand fractions as parts of a whole visual unit",
            "Identify equivalent fractions by multiplying or dividing numerator and denominator",
            "Add and subtract fractions with common and uncommon denominators",
            "Solve word problems involving addition and subtraction of fractions"
        ],
        "default_difficulty": "easy",
        "recommended_video": "Adding fractions with common denominators visually"
    },
    "g5-decimals": {
        "topic_id": "g5-decimals",
        "grade": 5,
        "title": "Decimals: Place Value & Operations",
        "category": "Decimals",
        "curriculum_reference": "Georgia Standards of Excellence (GSE) 5.NR.2 / 5.NR.2.1 - Read, write, and compare decimals to thousandths; perform operations with decimals to hundredths",
        "description": "Explore decimal place values, tenths, hundredths, and adding/subtracting decimals in everyday contexts.",
        "icon": "Coins",
        "learning_objectives": [
            "Read and represent tenths, hundredths, and thousandths",
            "Compare and order decimals using place value understanding",
            "Add and subtract decimals up to hundredths accurately",
            "Apply decimal operations to practical situations like money and measurement"
        ],
        "default_difficulty": "easy",
        "recommended_video": "Understanding decimals through coins and place value grids"
    },
    "g5-geometry": {
        "topic_id": "g5-geometry",
        "grade": 5,
        "title": "Geometry: 2D Shapes & Perimeter",
        "category": "Geometry",
        "curriculum_reference": "Georgia Standards of Excellence (GSE) 5.GSR.8 - Classify polygons based on properties; calculate perimeters and explore areas",
        "description": "Investigate properties of polygons, triangles, quadrilaterals, and compute perimeters and rectangular areas.",
        "icon": "Shapes",
        "learning_objectives": [
            "Classify two-dimensional figures based on angles and side lengths",
            "Distinguish between equilateral, isosceles, and scalene triangles",
            "Calculate perimeters of regular and irregular polygons",
            "Calculate areas of rectangles and composite rectangular shapes"
        ],
        "default_difficulty": "easy",
        "recommended_video": "Classifying triangles and calculating polygon perimeter"
    },
    "g5-place-value": {
        "topic_id": "g5-place-value",
        "grade": 5,
        "title": "Number Systems: Indian vs. International Place Value",
        "category": "Number Sense",
        "curriculum_reference": "NCERT Class 5 / CBSE Chapter 1 'The Fish Tale' & US CCSS.MATH.CONTENT.5.NBT.A.1",
        "description": "Master reading and writing numbers in Lakhs & Crores (Indian System) versus Millions & Billions (International System).",
        "icon": "Hash",
        "learning_objectives": [
            "Identify place value periods in the Indian System: Ones, Thousands, Lakhs, Crores",
            "Identify place value periods in the International System: Ones, Thousands, Millions",
            "Convert between Indian and International systems (e.g. 1 Million = 10 Lakhs)",
            "Compare and order multi-digit numbers using standard, word, and expanded forms"
        ],
        "default_difficulty": "easy",
        "recommended_video": "Comparing Lakhs with Millions: Visual Place Value Chart"
    },
    "g5-factors-multiples": {
        "topic_id": "g5-factors-multiples",
        "grade": 5,
        "title": "Factors, Multiples, HCF & LCM",
        "category": "Number Sense",
        "curriculum_reference": "NCERT Class 5 Chapter 6 'Be My Multiple, I'll be Your Factor' & Singapore Math Primary 5",
        "description": "Discover prime vs. composite numbers, factor rainbows, common multiples, and calculate HCF and LCM.",
        "icon": "Layers",
        "learning_objectives": [
            "Distinguish between prime and composite numbers up to 100",
            "Find all factor pairs of a given whole number",
            "Calculate the Highest Common Factor (HCF / GCD) of two numbers",
            "Determine the Lowest Common Multiple (LCM) using prime factorization and listing"
        ],
        "default_difficulty": "medium",
        "recommended_video": "Finding HCF and LCM with Venn Diagrams and Factor Trees"
    },
    "g5-measurement-area": {
        "topic_id": "g5-measurement-area",
        "grade": 5,
        "title": "Measurement: Perimeter, Area & Units",
        "category": "Measurement",
        "curriculum_reference": "NCERT Class 5 Chapter 3 'How Many Squares?' & Chapter 11 'Area and its Boundary'",
        "description": "Calculate boundaries (perimeter) and unit square areas of irregular and rectangular shapes, with length and mass units.",
        "icon": "Ruler",
        "learning_objectives": [
            "Calculate perimeter of regular and irregular polygons using grid squares",
            "Apply the Area formula (Length × Width) for rectangles and squares",
            "Convert between metric units: meters, centimeters, kilometers, and kilograms",
            "Solve real-world fencing and floor-tiling word problems"
        ],
        "default_difficulty": "easy",
        "recommended_video": "Measuring boundary perimeter vs. surface area visually"
    },
    "g5-volume-powers": {
        "topic_id": "g5-volume-powers",
        "grade": 5,
        "title": "Volume of 3D Objects & Powers of Ten",
        "category": "Geometry & Measurement",
        "curriculum_reference": "NCERT Class 5 Chapter 9 'Boxes and Sketches' & US CCSS 5.MD.C.3 / Singapore Math",
        "description": "Explore volume using unit cubes (V = l × w × h) and observe patterns when multiplying by 10, 100, and 1,000.",
        "icon": "Box",
        "learning_objectives": [
            "Understand volume as the measure of solid space using cubic units (cm³, m³)",
            "Calculate volume of cubes and rectangular prisms using Length × Width × Height",
            "Multiply and divide whole numbers and decimals by powers of 10",
            "Interpret 2D nets that fold into 3D boxes"
        ],
        "default_difficulty": "medium",
        "recommended_video": "Stacking unit cubes to discover the 3D volume formula"
    },
    "g5-data-handling": {
        "topic_id": "g5-data-handling",
        "grade": 5,
        "title": "Data Handling: Bar Graphs, Patterns & Symmetry",
        "category": "Data & Patterns",
        "curriculum_reference": "NCERT Class 5 Chapter 12 'Smart Charts' & Chapter 5 'Does it Look the Same?'",
        "description": "Analyze pictographs, bar graphs, lines of symmetry, and find simple averages (mean).",
        "icon": "BarChart3",
        "learning_objectives": [
            "Read and construct bar graphs and pictographs with varied scale steps",
            "Identify lines of symmetry in 2D shapes and rotational symmetry (half/quarter turn)",
            "Identify and extend numerical and geometrical pattern sequences",
            "Calculate simple averages (mean) from sample observations"
        ],
        "default_difficulty": "easy",
        "recommended_video": "Creating smart bar charts and finding lines of symmetry"
    },
    "g6-ratios": {
        "topic_id": "g6-ratios",
        "grade": 6,
        "title": "Ratios, Rates & Unitary Method",
        "category": "Ratios & Algebra",
        "curriculum_reference": "NCERT Class 6 Chapter 12 'Ratio and Proportion' & GSE 6.PAR.4 / US CCSS 6.RP.A",
        "description": "Understand ratio notation, equivalent ratios, scaling tables, and solve unitary method word problems.",
        "icon": "Scale",
        "learning_objectives": [
            "Understand ratio notation (a:b, a to b, a/b) to compare two quantities",
            "Determine equivalent ratios using ratio scaling and tables",
            "Apply the Unitary Method to find cost per unit and total price",
            "Solve percentage, discounts, and real-world proportional rate problems"
        ],
        "default_difficulty": "easy",
        "recommended_video": "Understanding ratios with visual fruit comparisons and scaling"
    },
    "g6-integers": {
        "topic_id": "g6-integers",
        "grade": 6,
        "title": "Integers: The Other Side of Zero",
        "category": "Number Systems",
        "curriculum_reference": "NCERT Class 6 Chapter 6 'Integers' & US CCSS.MATH.CONTENT.6.NS.C.5",
        "description": "Explore positive and negative numbers, the number line, absolute value, and comparing integers in real-life contexts (temperatures, elevation).",
        "icon": "Hash",
        "learning_objectives": [
            "Represent real-life quantities using positive and negative integers (temperatures, debts)",
            "Plot and compare integers on horizontal and vertical number lines",
            "Understand absolute value as distance from zero (|x|)",
            "Perform addition and subtraction of integers with sign rules"
        ],
        "default_difficulty": "easy",
        "recommended_video": "Walking the number line: positive steps vs. negative steps"
    },
    "g6-algebra": {
        "topic_id": "g6-algebra",
        "grade": 6,
        "title": "Introduction to Algebra & Expressions",
        "category": "Algebra & Patterns",
        "curriculum_reference": "NCERT Class 6 Chapter 11 'Algebra' & US CCSS.MATH.CONTENT.6.EE.A.2",
        "description": "Transition from arithmetic to algebra using matchstick patterns, variables (x, y), writing algebraic expressions, and solving simple equations.",
        "icon": "Variable",
        "learning_objectives": [
            "Understand variables as unknown quantities in mathematical patterns",
            "Write algebraic expressions from word statements (e.g., '5 more than twice x')",
            "Evaluate expressions with exponents and substitution",
            "Solve one-step linear equations using inverse operations"
        ],
        "default_difficulty": "medium",
        "recommended_video": "From matchstick patterns to algebraic formulas"
    },
    "g6-fractions-division": {
        "topic_id": "g6-fractions-division",
        "grade": 6,
        "title": "Fractions: Division & Multi-Step",
        "category": "Fractions & Decimals",
        "curriculum_reference": "NCERT Class 6 Chapter 7 'Fractions' & US CCSS.MATH.CONTENT.6.NS.A.1",
        "description": "Understand dividing fractions by fractions using reciprocal relationships (keep-change-flip) and solve multi-step problems.",
        "icon": "Divide",
        "learning_objectives": [
            "Interpret quotients of fractions using visual fraction strips and bar models",
            "Apply the reciprocal algorithm (keep-change-flip) with conceptual understanding",
            "Divide mixed numbers and improper fractions",
            "Solve real-world division word problems"
        ],
        "default_difficulty": "medium",
        "recommended_video": "Visualizing fraction division: how many halves fit in three quarters?"
    },
    "g6-decimals-play": {
        "topic_id": "g6-decimals-play",
        "grade": 6,
        "title": "Decimals: Place Value & Operations",
        "category": "Fractions & Decimals",
        "curriculum_reference": "NCERT Class 6 Chapter 8 'Decimals' & US CCSS.MATH.CONTENT.6.NS.B.3",
        "description": "Represent tenths and hundredths on place value grids, convert fractions to decimals, and multiply and divide decimals fluently.",
        "icon": "Coins",
        "learning_objectives": [
            "Read, write, and expand decimals to thousandths",
            "Convert between fractions, mixed numbers, and decimals",
            "Add and subtract decimals with unequal decimal places",
            "Multiply and divide decimals using standard algorithms"
        ],
        "default_difficulty": "easy",
        "recommended_video": "Connecting tenths and hundredths to money and place value charts"
    },
    "g6-lines-angles": {
        "topic_id": "g6-lines-angles",
        "grade": 6,
        "title": "Geometry: Lines, Angles & Constructions",
        "category": "Geometry",
        "curriculum_reference": "NCERT Class 6 Chapter 4 'Basic Geometrical Ideas' & Chapter 5 'Understanding Elementary Shapes'",
        "description": "Explore points, rays, line segments, acute/right/obtuse/reflex angles, perpendicular lines, and geometric symmetry.",
        "icon": "Compass",
        "learning_objectives": [
            "Distinguish between points, lines, line segments, and rays",
            "Classify angles into acute, right, obtuse, straight, and reflex angles",
            "Identify parallel, perpendicular, and intersecting lines",
            "Identify lines of symmetry and rotational reflections in geometric figures"
        ],
        "default_difficulty": "easy",
        "recommended_video": "Classifying angles with clock hands and geometry tools"
    },
    "g6-geometry-area": {
        "topic_id": "g6-geometry-area",
        "grade": 6,
        "title": "Mensuration: Area, Perimeter & Surface Area",
        "category": "Measurement",
        "curriculum_reference": "NCERT Class 6 Chapter 10 'Mensuration' & US CCSS.MATH.CONTENT.6.G.A.1",
        "description": "Calculate perimeters of regular polygons and compute areas of triangles, parallelograms, trapezoids, and surface areas of rectangular prisms.",
        "icon": "Box",
        "learning_objectives": [
            "Calculate area of triangles using Area = 1/2 * base * height",
            "Calculate area of parallelograms and special quadrilaterals",
            "Find surface area and volume of rectangular prisms using nets",
            "Solve fencing and tiling real-world composite shape word problems"
        ],
        "default_difficulty": "medium",
        "recommended_video": "Why a triangle's area is half of a rectangle: visual dissection"
    },
    "g6-data-handling": {
        "topic_id": "g6-data-handling",
        "grade": 6,
        "title": "Data Handling & Statistics: Mean, Median & Mode",
        "category": "Data & Statistics",
        "curriculum_reference": "NCERT Class 6 Chapter 9 'Data Handling' & US CCSS.MATH.CONTENT.6.SP.B.5",
        "description": "Collect, organize, and interpret data using tally charts, pictographs, bar graphs, and calculate central tendencies (Mean, Median, Mode, Range).",
        "icon": "BarChart3",
        "learning_objectives": [
            "Organize raw survey data into frequency tally distribution tables",
            "Construct and interpret single and double bar graphs with uniform scales",
            "Calculate central tendencies: Mean (average), Median (middle value), and Mode",
            "Determine the Range (spread) of a statistical data set"
        ],
        "default_difficulty": "easy",
        "recommended_video": "Calculating Mean, Median, and Mode with step-by-step examples"
    }
}


def get_topics_for_grade(grade: int) -> List[Dict[str, Any]]:
    """Return all topic definitions aligned with a specific grade."""
    return [t for t in CURRICULUM_CATALOG.values() if t["grade"] == grade]


def get_topic_by_id(topic_id: str) -> Optional[Dict[str, Any]]:
    """Return topic specification by topic_id."""
    return CURRICULUM_CATALOG.get(topic_id)
