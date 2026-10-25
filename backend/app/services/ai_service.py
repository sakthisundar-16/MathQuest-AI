"""
Gemini AI Educational Service
Interfaces with the official Google GenAI SDK.
Generates age-appropriate explanations, worked examples, structured questions with mathematical validation,
and educational infographics using Gemini image generation models.
Includes comprehensive resilience fallbacks so the app remains 100% functional even offline or without API keys.
"""

import os
import json
import base64
from typing import Dict, Any, List, Optional
from app.validators.math_validator import verify_question_data
from app.core.question_bank import get_verified_questions
from app.core.curriculum import get_topic_by_id
from app.core.video_lessons import get_video_lesson

# Static educational fallback infographics (SVG data URIs) mathematically verified
FALLBACK_INFOGRAPHICS: Dict[str, str] = {
    "g5-fractions": (
        "data:image/svg+xml;utf8,"
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' width='100%' height='100%'>"
        "<rect width='600' height='400' fill='%23f8fafc' rx='16'/>"
        "<text x='300' y='45' text-anchor='middle' font-family='sans-serif' font-size='22' font-weight='bold' fill='%231e293b'>Fractions: Parts of a Whole &amp; Addition</text>"
        "<!-- 1 Whole Bar -->"
        "<text x='50' y='95' font-family='sans-serif' font-size='16' font-weight='600' fill='%23334155'>1 Whole Unit</text>"
        "<rect x='50' y='105' width='500' height='40' fill='%236366f1' rx='6'/>"
        "<text x='300' y='130' text-anchor='middle' font-family='sans-serif' font-size='16' font-weight='bold' fill='%23ffffff'>1</text>"
        "<!-- Halves -->"
        "<text x='50' y='175' font-family='sans-serif' font-size='16' font-weight='600' fill='%23334155'>Divided into Halves (1/2 + 1/2 = 1)</text>"
        "<rect x='50' y='185' width='245' height='40' fill='%233b82f6' rx='6'/>"
        "<text x='172' y='210' text-anchor='middle' font-family='sans-serif' font-size='16' font-weight='bold' fill='%23ffffff'>1/2</text>"
        "<rect x='305' y='185' width='245' height='40' fill='%2360a5fa' rx='6'/>"
        "<text x='427' y='210' text-anchor='middle' font-family='sans-serif' font-size='16' font-weight='bold' fill='%23ffffff'>1/2</text>"
        "<!-- Fourths -->"
        "<text x='50' y='255' font-family='sans-serif' font-size='16' font-weight='600' fill='%23334155'>Divided into Fourths (2/4 = 1/2)</text>"
        "<rect x='50' y='265' width='118' height='40' fill='%2310b981' rx='6'/>"
        "<text x='109' y='290' text-anchor='middle' font-family='sans-serif' font-size='14' font-weight='bold' fill='%23ffffff'>1/4</text>"
        "<rect x='177' y='265' width='118' height='40' fill='%2334d399' rx='6'/>"
        "<text x='236' y='290' text-anchor='middle' font-family='sans-serif' font-size='14' font-weight='bold' fill='%23ffffff'>1/4</text>"
        "<rect x='305' y='265' width='118' height='40' fill='%236ee7b7' rx='6'/>"
        "<text x='364' y='290' text-anchor='middle' font-family='sans-serif' font-size='14' font-weight='bold' fill='%23064e3b'>1/4</text>"
        "<rect x='432' y='265' width='118' height='40' fill='%23a7f3d0' rx='6'/>"
        "<text x='491' y='290' text-anchor='middle' font-family='sans-serif' font-size='14' font-weight='bold' fill='%23064e3b'>1/4</text>"
        "<!-- Rule callout -->"
        "<rect x='50' y='325' width='500' height='55' fill='%23fef3c7' stroke='%23f59e0b' stroke-width='2' rx='8'/>"
        "<text x='300' y='347' text-anchor='middle' font-family='sans-serif' font-size='15' font-weight='bold' fill='%2392400e'>Key Rule: Like Denominators</text>"
        "<text x='300' y='368' text-anchor='middle' font-family='sans-serif' font-size='13' fill='%2378350f'>Keep the denominator the same and add or subtract the numerators! (1/5 + 2/5 = 3/5)</text>"
        "</svg>"
    ),
    "g5-decimals": (
        "data:image/svg+xml;utf8,"
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' width='100%' height='100%'>"
        "<rect width='600' height='400' fill='%23f8fafc' rx='16'/>"
        "<text x='300' y='45' text-anchor='middle' font-family='sans-serif' font-size='22' font-weight='bold' fill='%231e293b'>Decimal Place Value &amp; Addition</text>"
        "<rect x='60' y='90' width='130' height='80' fill='%23e0e7ff' stroke='%234f46e5' stroke-width='2' rx='8'/>"
        "<text x='125' y='125' text-anchor='middle' font-family='sans-serif' font-size='20' font-weight='bold' fill='%233730a3'>Ones</text>"
        "<text x='125' y='155' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%234338ca'>1.0</text>"
        "<circle cx='215' cy='140' r='7' fill='%23ef4444'/>"
        "<text x='215' y='175' text-anchor='middle' font-family='sans-serif' font-size='12' font-weight='bold' fill='%23b91c1c'>Decimal Point</text>"
        "<rect x='240' y='90' width='130' height='80' fill='%23dcfce7' stroke='%2316a34a' stroke-width='2' rx='8'/>"
        "<text x='305' y='125' text-anchor='middle' font-family='sans-serif' font-size='20' font-weight='bold' fill='%23166534'>Tenths</text>"
        "<text x='305' y='155' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%2315803d'>0.1 (1/10)</text>"
        "<rect x='410' y='90' width='130' height='80' fill='%23fef9c3' stroke='%23ca8a04' stroke-width='2' rx='8'/>"
        "<text x='475' y='125' text-anchor='middle' font-family='sans-serif' font-size='20' font-weight='bold' fill='%23854d0e'>Hundredths</text>"
        "<text x='475' y='155' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%23a16207'>0.01 (1/100)</text>"
        "<rect x='60' y='210' width='480' height='150' fill='%23ffffff' stroke='%23cbd5e1' stroke-width='1.5' rx='8'/>"
        "<text x='300' y='245' text-anchor='middle' font-family='sans-serif' font-size='16' font-weight='bold' fill='%230f172a'>Adding Decimals: Always Line Up the Decimal Point!</text>"
        "<text x='270' y='285' font-family='monospace' font-size='20' fill='%23334155'>  4 . 7 5</text>"
        "<text x='270' y='315' font-family='monospace' font-size='20' fill='%23334155'>+ 1 . 2 5</text>"
        "<line x1='250' y1='325' x2='380' y2='325' stroke='%2364748b' stroke-width='2'/>"
        "<text x='270' y='350' font-family='monospace' font-size='20' font-weight='bold' fill='%2316a34a'>  6 . 0 0</text>"
        "</svg>"
    ),
    "g6-ratios": (
        "data:image/svg+xml;utf8,"
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' width='100%' height='100%'>"
        "<rect width='600' height='400' fill='%23f8fafc' rx='16'/>"
        "<text x='300' y='45' text-anchor='middle' font-family='sans-serif' font-size='22' font-weight='bold' fill='%231e293b'>Ratios &amp; Proportions: Visual Comparison</text>"
        "<!-- Apples visual -->"
        "<text x='80' y='95' font-family='sans-serif' font-size='16' font-weight='bold' fill='%23dc2626'>Red Apples (2 parts)</text>"
        "<circle cx='100' cy='140' r='25' fill='%23ef4444'/>"
        "<circle cx='170' cy='140' r='25' fill='%23ef4444'/>"
        "<text x='320' y='95' font-family='sans-serif' font-size='16' font-weight='bold' fill='%2316a34a'>Green Apples (3 parts)</text>"
        "<circle cx='340' cy='140' r='25' fill='%2322c55e'/>"
        "<circle cx='410' cy='140' r='25' fill='%2322c55e'/>"
        "<circle cx='480' cy='140' r='25' fill='%2322c55e'/>"
        "<!-- Ways to write ratio -->"
        "<rect x='60' y='195' width='480' height='90' fill='%23f1f5f9' rx='8'/>"
        "<text x='300' y='225' text-anchor='middle' font-family='sans-serif' font-size='16' font-weight='bold' fill='%231e293b'>3 Equivalent Ways to Write this Ratio:</text>"
        "<text x='130' y='265' font-family='sans-serif' font-size='18' font-weight='bold' fill='%234f46e5'>2 to 3</text>"
        "<text x='300' y='265' text-anchor='middle' font-family='sans-serif' font-size='18' font-weight='bold' fill='%234f46e5'>2 : 3</text>"
        "<text x='470' y='265' text-anchor='middle' font-family='sans-serif' font-size='18' font-weight='bold' fill='%234f46e5'>2 / 3</text>"
        "<!-- Scaling box -->"
        "<rect x='60' y='305' width='480' height='75' fill='%23fef3c7' stroke='%23d97706' stroke-width='1.5' rx='8'/>"
        "<text x='300' y='335' text-anchor='middle' font-family='sans-serif' font-size='15' font-weight='bold' fill='%2392400e'>Scaling Equivalent Ratios:</text>"
        "<text x='300' y='360' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%2378350f'>Multiply both terms by the same number: 2:3 = (2x3):(3x3) = 6:9</text>"
        "</svg>"
    ),
    "g5-place-value": (
        "data:image/svg+xml;utf8,"
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' width='100%' height='100%'>"
        "<rect width='600' height='400' fill='%23f8fafc' rx='16'/>"
        "<text x='300' y='45' text-anchor='middle' font-family='sans-serif' font-size='22' font-weight='bold' fill='%231e293b'>Place Value: Indian vs. International Systems</text>"
        "<!-- Indian System -->"
        "<rect x='40' y='75' width='520' height='120' fill='%23eff6ff' stroke='%233b82f6' stroke-width='2' rx='10'/>"
        "<text x='60' y='105' font-family='sans-serif' font-size='16' font-weight='bold' fill='%231d4ed8'>Indian System (Lakhs &amp; Crores)</text>"
        "<text x='60' y='130' font-family='sans-serif' font-size='13' fill='%231e40af'>Grouping: 3 digits, then every 2 digits (e.g. 10,00,000)</text>"
        "<rect x='60' y='145' width='110' height='35' fill='%23dbeafe' rx='6'/>"
        "<text x='115' y='168' text-anchor='middle' font-family='sans-serif' font-size='13' font-weight='bold' fill='%231e40af'>Crores (10^7)</text>"
        "<rect x='180' y='145' width='110' height='35' fill='%23dbeafe' rx='6'/>"
        "<text x='235' y='168' text-anchor='middle' font-family='sans-serif' font-size='13' font-weight='bold' fill='%231e40af'>Lakhs (10^5)</text>"
        "<rect x='300' y='145' width='120' height='35' fill='%23dbeafe' rx='6'/>"
        "<text x='360' y='168' text-anchor='middle' font-family='sans-serif' font-size='13' font-weight='bold' fill='%231e40af'>Thousands (10^3)</text>"
        "<rect x='430' y='145' width='110' height='35' fill='%23dbeafe' rx='6'/>"
        "<text x='485' y='168' text-anchor='middle' font-family='sans-serif' font-size='13' font-weight='bold' fill='%231e40af'>Ones (10^0)</text>"
        "<!-- International System -->"
        "<rect x='40' y='210' width='520' height='120' fill='%23ecfdf5' stroke='%2310b981' stroke-width='2' rx='10'/>"
        "<text x='60' y='240' font-family='sans-serif' font-size='16' font-weight='bold' fill='%23047857'>International System (Millions &amp; Billions)</text>"
        "<text x='60' y='265' font-family='sans-serif' font-size='13' fill='%23065f46'>Grouping: 3 digits every period (e.g. 1,000,000)</text>"
        "<rect x='60' y='280' width='150' height='35' fill='%23d1fae5' rx='6'/>"
        "<text x='135' y='303' text-anchor='middle' font-family='sans-serif' font-size='13' font-weight='bold' fill='%23065f46'>Billions (10^9)</text>"
        "<rect x='225' y='280' width='150' height='35' fill='%23d1fae5' rx='6'/>"
        "<text x='300' y='303' text-anchor='middle' font-family='sans-serif' font-size='13' font-weight='bold' fill='%23065f46'>Millions (10^6)</text>"
        "<rect x='390' y='280' width='150' height='35' fill='%23d1fae5' rx='6'/>"
        "<text x='465' y='303' text-anchor='middle' font-family='sans-serif' font-size='13' font-weight='bold' fill='%23065f46'>Thousands (10^3)</text>"
        "<!-- Conversion Callout -->"
        "<rect x='40' y='345' width='520' height='40' fill='%23fef3c7' stroke='%23f59e0b' stroke-width='1.5' rx='8'/>"
        "<text x='300' y='370' text-anchor='middle' font-family='sans-serif' font-size='14' font-weight='bold' fill='%2392400e'>Golden Rule: 1 Million = 10 Lakhs | 1 Crore = 10 Millions</text>"
        "</svg>"
    ),
    "g5-factors-multiples": (
        "data:image/svg+xml;utf8,"
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' width='100%' height='100%'>"
        "<rect width='600' height='400' fill='%23f8fafc' rx='16'/>"
        "<text x='300' y='45' text-anchor='middle' font-family='sans-serif' font-size='22' font-weight='bold' fill='%231e293b'>Factors, Multiples, HCF &amp; LCM</text>"
        "<!-- Factors of 12 & 18 Venn Diagram -->"
        "<circle cx='240' cy='180' r='100' fill='%236366f1' fill-opacity='0.25' stroke='%234f46e5' stroke-width='2'/>"
        "<circle cx='360' cy='180' r='100' fill='%23ec4899' fill-opacity='0.25' stroke='%23db2777' stroke-width='2'/>"
        "<text x='180' y='120' font-family='sans-serif' font-size='16' font-weight='bold' fill='%234338ca'>Factors of 12</text>"
        "<text x='190' y='170' font-family='sans-serif' font-size='16' fill='%23312e81'>4, 12</text>"
        "<text x='400' y='120' font-family='sans-serif' font-size='16' font-weight='bold' fill='%23be185d'>Factors of 18</text>"
        "<text x='390' y='170' font-family='sans-serif' font-size='16' fill='%23831843'>9, 18</text>"
        "<text x='300' y='145' text-anchor='middle' font-family='sans-serif' font-size='14' font-weight='bold' fill='%231e293b'>Common</text>"
        "<text x='300' y='175' text-anchor='middle' font-family='sans-serif' font-size='16' font-weight='bold' fill='%231e293b'>1, 2, 3, 6</text>"
        "<text x='300' y='205' text-anchor='middle' font-family='sans-serif' font-size='14' font-weight='bold' fill='%23059669'>HCF = 6</text>"
        "<!-- Multiples summary box -->"
        "<rect x='60' y='300' width='480' height='80' fill='%23fef3c7' stroke='%23d97706' stroke-width='1.5' rx='8'/>"
        "<text x='300' y='330' text-anchor='middle' font-family='sans-serif' font-size='15' font-weight='bold' fill='%2392400e'>LCM (Lowest Common Multiple):</text>"
        "<text x='300' y='355' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%2378350f'>Multiples of 4: 4, 8, 12, 16... | Multiples of 6: 6, 12, 18... -&gt; LCM = 12</text>"
        "</svg>"
    ),
    "g5-measurement-area": (
        "data:image/svg+xml;utf8,"
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' width='100%' height='100%'>"
        "<rect width='600' height='400' fill='%23f8fafc' rx='16'/>"
        "<text x='300' y='45' text-anchor='middle' font-family='sans-serif' font-size='22' font-weight='bold' fill='%231e293b'>Perimeter (Boundary) vs. Area (Surface)</text>"
        "<!-- Rectangle diagram -->"
        "<rect x='100' y='100' width='400' height='160' fill='%23dbeafe' stroke='%232563eb' stroke-width='4' rx='8'/>"
        "<text x='300' y='85' text-anchor='middle' font-family='sans-serif' font-size='16' font-weight='bold' fill='%231d4ed8'>Length = 10 meters</text>"
        "<text x='300' y='285' text-anchor='middle' font-family='sans-serif' font-size='16' font-weight='bold' fill='%231d4ed8'>Length = 10 meters</text>"
        "<text x='55' y='185' font-family='sans-serif' font-size='16' font-weight='bold' fill='%231d4ed8'>Width = 4m</text>"
        "<text x='515' y='185' font-family='sans-serif' font-size='16' font-weight='bold' fill='%231d4ed8'>Width = 4m</text>"
        "<text x='300' y='170' text-anchor='middle' font-family='sans-serif' font-size='20' font-weight='bold' fill='%231e3a8a'>Area = L × W = 10 × 4 = 40 sq m</text>"
        "<text x='300' y='200' text-anchor='middle' font-family='sans-serif' font-size='16' font-weight='bold' fill='%2316a34a'>Perimeter = 2 × (L + W) = 2 × (10 + 4) = 28 m</text>"
        "<!-- Takeaway Box -->"
        "<rect x='60' y='310' width='480' height='65' fill='%23fef9c3' stroke='%23ca8a04' stroke-width='1.5' rx='8'/>"
        "<text x='300' y='335' text-anchor='middle' font-family='sans-serif' font-size='14' font-weight='bold' fill='%23854d0e'>Perimeter is the fence around outside (linear units: m, cm).</text>"
        "<text x='300' y='358' text-anchor='middle' font-family='sans-serif' font-size='14' font-weight='bold' fill='%23854d0e'>Area is the carpet tiles covering inside (square units: sq m, cm²).</text>"
        "</svg>"
    ),
    "g5-volume-powers": (
        "data:image/svg+xml;utf8,"
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' width='100%' height='100%'>"
        "<rect width='600' height='400' fill='%23f8fafc' rx='16'/>"
        "<text x='300' y='45' text-anchor='middle' font-family='sans-serif' font-size='22' font-weight='bold' fill='%231e293b'>3D Volume &amp; Powers of Ten</text>"
        "<!-- 3D Box Visual -->"
        "<polygon points='160,180 320,180 320,280 160,280' fill='%2393c5fd' stroke='%231d4ed8' stroke-width='2'/>"
        "<polygon points='320,180 400,120 400,220 320,280' fill='%2360a5fa' stroke='%231d4ed8' stroke-width='2'/>"
        "<polygon points='160,180 240,120 400,120 320,180' fill='%23bfdbfe' stroke='%231d4ed8' stroke-width='2'/>"
        "<text x='240' y='305' text-anchor='middle' font-family='sans-serif' font-size='15' font-weight='bold' fill='%231e3a8a'>Length = 5 cm</text>"
        "<text x='380' y='265' font-family='sans-serif' font-size='15' font-weight='bold' fill='%231e3a8a'>Width = 3 cm</text>"
        "<text x='125' y='235' font-family='sans-serif' font-size='15' font-weight='bold' fill='%231e3a8a'>Height = 4 cm</text>"
        "<text x='300' y='95' text-anchor='middle' font-family='sans-serif' font-size='18' font-weight='bold' fill='%23047857'>Volume = L × W × H = 5 × 3 × 4 = 60 cm³</text>"
        "<!-- Powers of 10 Box -->"
        "<rect x='60' y='325' width='480' height='60' fill='%23fef3c7' stroke='%23d97706' stroke-width='1.5' rx='8'/>"
        "<text x='300' y='348' text-anchor='middle' font-family='sans-serif' font-size='14' font-weight='bold' fill='%2392400e'>Powers of 10: Each zero shifts digits 1 place left!</text>"
        "<text x='300' y='370' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%2378350f'>45 × 10 = 450 | 45 × 100 = 4,500 | 45 × 1,000 = 45,000</text>"
        "</svg>"
    ),
    "g5-data-handling": (
        "data:image/svg+xml;utf8,"
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' width='100%' height='100%'>"
        "<rect width='600' height='400' fill='%23f8fafc' rx='16'/>"
        "<text x='300' y='45' text-anchor='middle' font-family='sans-serif' font-size='22' font-weight='bold' fill='%231e293b'>Data Handling, Smart Charts &amp; Symmetry</text>"
        "<!-- Bar Chart -->"
        "<line x1='100' y1='250' x2='380' y2='250' stroke='%23334155' stroke-width='2'/>"
        "<line x1='100' y1='250' x2='100' y2='90' stroke='%23334155' stroke-width='2'/>"
        "<text x='75' y='100' font-family='sans-serif' font-size='12' fill='%23475569'>25</text>"
        "<text x='75' y='140' font-family='sans-serif' font-size='12' fill='%23475569'>20</text>"
        "<text x='75' y='180' font-family='sans-serif' font-size='12' fill='%23475569'>15</text>"
        "<text x='75' y='220' font-family='sans-serif' font-size='12' fill='%23475569'>10</text>"
        "<rect x='130' y='180' width='45' height='70' fill='%236366f1' rx='4'/>"
        "<text x='152' y='270' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%231e293b'>Mon</text>"
        "<rect x='200' y='140' width='45' height='110' fill='%233b82f6' rx='4'/>"
        "<text x='222' y='270' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%231e293b'>Tue</text>"
        "<rect x='270' y='100' width='45' height='150' fill='%2310b981' rx='4'/>"
        "<text x='292' y='270' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%231e293b'>Wed</text>"
        "<!-- Symmetry Visual -->"
        "<rect x='410' y='100' width='130' height='150' fill='%23fef3c7' stroke='%23d97706' stroke-width='2' rx='8'/>"
        "<text x='475' y='125' text-anchor='middle' font-family='sans-serif' font-size='13' font-weight='bold' fill='%2392400e'>Symmetry</text>"
        "<line x1='475' y1='135' x2='475' y2='240' stroke='%23dc2626' stroke-width='2' stroke-dasharray='4'/>"
        "<text x='475' y='265' text-anchor='middle' font-family='sans-serif' font-size='11' fill='%23dc2626'>Vertical Fold Line</text>"
        "<rect x='60' y='305' width='480' height='70' fill='%23f1f5f9' rx='8'/>"
        "<text x='300' y='330' text-anchor='middle' font-family='sans-serif' font-size='14' font-weight='bold' fill='%231e293b'>Smart Charts Rule: Always check the scale unit step (e.g. 1 tick = 5 units).</text>"
        "<text x='300' y='355' text-anchor='middle' font-family='sans-serif' font-size='13' fill='%23475569'>Symmetry: A shape has line symmetry if folding along the line matches both halves perfectly.</text>"
        "</svg>"
    ),
    "g5-geometry": (
        "data:image/svg+xml;utf8,"
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' width='100%' height='100%'>"
        "<rect width='600' height='400' fill='%23f8fafc' rx='16'/>"
        "<text x='300' y='45' text-anchor='middle' font-family='sans-serif' font-size='22' font-weight='bold' fill='%231e293b'>Geometry: 2D Shapes, Angles &amp; Polygons</text>"
        "<!-- Triangle Types -->"
        "<polygon points='100,190 150,90 200,190' fill='%23dbeafe' stroke='%232563eb' stroke-width='2'/>"
        "<text x='150' y='215' text-anchor='middle' font-family='sans-serif' font-size='13' font-weight='bold' fill='%231e40af'>Equilateral (3 equal sides)</text>"
        "<polygon points='270,190 320,90 340,190' fill='%23dcfce7' stroke='%2316a34a' stroke-width='2'/>"
        "<text x='305' y='215' text-anchor='middle' font-family='sans-serif' font-size='13' font-weight='bold' fill='%23166534'>Isosceles (2 equal sides)</text>"
        "<polygon points='400,190 440,90 530,190' fill='%23fef3c7' stroke='%23d97706' stroke-width='2'/>"
        "<text x='465' y='215' text-anchor='middle' font-family='sans-serif' font-size='13' font-weight='bold' fill='%2392400e'>Scalene (no equal sides)</text>"
        "<!-- Angles summary -->"
        "<rect x='60' y='245' width='480' height='130' fill='%23ffffff' stroke='%23cbd5e1' stroke-width='1.5' rx='8'/>"
        "<text x='300' y='275' text-anchor='middle' font-family='sans-serif' font-size='16' font-weight='bold' fill='%230f172a'>Angle Classifications:</text>"
        "<text x='300' y='305' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%23334155'>Acute Angle: Less than 90° | Right Angle: Exactly 90° (L-shape)</text>"
        "<text x='300' y='330' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%23334155'>Obtuse Angle: Between 90° and 180° | Straight Angle: Exactly 180°</text>"
        "<text x='300' y='355' text-anchor='middle' font-family='sans-serif' font-size='13' font-weight='bold' fill='%234f46e5'>Perimeter of any polygon = Sum of all outer side lengths.</text>"
        "</svg>"
    )
}

# Pre-verified dedicated pedagogical lessons for all Grade 5 topics
TOPIC_VERIFIED_LESSONS: Dict[str, Dict[str, Any]] = {
    "g5-fractions": {
        "concept_title": "Mastering Fractions: Addition & Subtraction",
        "simple_explanation": (
            "A fraction represents parts of a whole unit, like slices of a warm pizza. "
            "The top number is the numerator (how many slices you have), and the bottom number is the denominator "
            "(how many slices make up one entire pizza). When denominators match, the slices are already identical in size, "
            "so you only need to add or subtract the top numbers!"
        ),
        "worked_example": {
            "problem_statement": "Aarya ate 1/5 of a watermelon in the morning and 2/5 in the evening. How much watermelon did Aarya eat in total?",
            "step_by_step_solution": [
                "Step 1: Check denominators. Both fractions have 5 as their denominator.",
                "Step 2: Keep the denominator 5, because the slice sizes are identical.",
                "Step 3: Add the numerators together: 1 + 2 = 3.",
                "Step 4: Combine into the final fraction: 3/5."
            ],
            "final_answer": "3/5 of the watermelon"
        },
        "common_mistake": "Never add the denominators! 1/5 + 2/5 is NOT 3/10. The denominator tells slice size, not count.",
        "quick_practice_tip": "Keep the bottom, add the top! Think of equal pizza slices before writing your final fraction."
    },
    "g5-decimals": {
        "concept_title": "Mastering Decimals: Place Value & Operations",
        "simple_explanation": (
            "Decimals are another way to write fractions whose denominators are 10, 100, or 1,000. "
            "The decimal point acts like an anchor separating whole numbers from fractions of a whole. "
            "The first spot to the right is the tenths place (0.1), and the second is the hundredths place (0.01), "
            "just like 10 cents and 1 cent in pocket money!"
        ),
        "worked_example": {
            "problem_statement": "Rohan bought a pencil for $4.75 and an eraser for $1.25. How much did he spend altogether?",
            "step_by_step_solution": [
                "Step 1: Line up the numbers vertically so the decimal points are directly underneath each other.",
                "Step 2: Add the hundredths: 5 + 5 = 10 hundredths (write 0, carry 1 to the tenths place).",
                "Step 3: Add the tenths: 7 + 2 + 1 (carried) = 10 tenths (write 0, carry 1 to the ones place).",
                "Step 4: Bring the decimal point straight down: .00.",
                "Step 5: Add the ones: 4 + 1 + 1 (carried) = 6."
            ],
            "final_answer": "$6.00"
        },
        "common_mistake": "Never misalign the decimal points when adding or subtracting! 4.75 + 1.2 is NOT 4.87.",
        "quick_practice_tip": "Always drop the decimal point straight down like an anchor before starting your addition."
    },
    "g5-geometry": {
        "concept_title": "Mastering 2D Geometry: Polygons, Angles & Perimeter",
        "simple_explanation": (
            "Polygons are flat closed 2D shapes made of straight sides. Triangles have 3 sides, quadrilaterals have 4, "
            "and pentagons have 5. The perimeter is simply the distance all the way around the outside fence of the shape. "
            "To find the perimeter of any polygon, just walk around all sides and add their lengths together!"
        ),
        "worked_example": {
            "problem_statement": "Find the perimeter of a rectangular garden that has a length of 6 meters and a width of 4 meters.",
            "step_by_step_solution": [
                "Step 1: A rectangle has 4 sides: 2 matching lengths and 2 matching widths.",
                "Step 2: Formula for perimeter = Length + Width + Length + Width = 2 × (Length + Width).",
                "Step 3: Add length and width: 6 + 4 = 10 meters.",
                "Step 4: Multiply by 2: 10 × 2 = 20 meters."
            ],
            "final_answer": "20 meters"
        },
        "common_mistake": "Do not confuse perimeter with area! Perimeter is the boundary distance around the edge, measured in linear meters.",
        "quick_practice_tip": "Perimeter = Path around the park! Walk every side and sum the lengths."
    },
    "g5-place-value": {
        "concept_title": "Mastering Place Value: Indian vs. International Systems",
        "simple_explanation": (
            "Both the Indian and International systems name big numbers, but they group digits using different periods! "
            "In the Indian System, commas start after 3 digits from the right, and then appear every 2 digits (Ones, Thousands, Lakhs, Crores). "
            "In the International System, commas appear every 3 digits consistently (Ones, Thousands, Millions, Billions). "
            "The magic conversion to remember is that 1 Million equals 10 Lakhs, and 1 Crore equals 10 Millions!"
        ),
        "worked_example": {
            "problem_statement": "Convert 50 Lakhs from the Indian System into the International System.",
            "step_by_step_solution": [
                "Step 1: In the Indian System, 50 Lakhs is written as 50,00,000 (a 5 followed by six zeros).",
                "Step 2: Group the same number with International commas (3 digits per period): 5,000,000.",
                "Step 3: Read the periods: the first comma is thousands, the second is millions.",
                "Step 4: 5,000,000 is 5 Millions (since 10 Lakhs = 1 Million, 50 / 10 = 5 Millions)."
            ],
            "final_answer": "5 Millions"
        },
        "common_mistake": "Putting commas every 3 digits in the Indian system! In India, only the first group has 3 digits; all higher periods have 2 digits (e.g., 12,34,567).",
        "quick_practice_tip": "Remember: 10 Lakhs = 1 Million. Just divide the Lakhs by 10 to get Millions!"
    },
    "g5-factors-multiples": {
        "concept_title": "Mastering Factors, Multiples, HCF & LCM",
        "simple_explanation": (
            "Factors are numbers that divide evenly into another number with zero remainder (the building blocks). "
            "Multiples are what you get when you multiply a number by 1, 2, 3, etc. (the skip-counting numbers). "
            "The Highest Common Factor (HCF) is the largest factor shared by two numbers. "
            "The Lowest Common Multiple (LCM) is the smallest shared number when you list their multiples!"
        ),
        "worked_example": {
            "problem_statement": "Find the Highest Common Factor (HCF) of 12 and 18.",
            "step_by_step_solution": [
                "Step 1: List all factors of 12: 1, 2, 3, 4, 6, 12.",
                "Step 2: List all factors of 18: 1, 2, 3, 6, 9, 18.",
                "Step 3: Identify the common factors in both lists: 1, 2, 3, 6.",
                "Step 4: Pick the highest number from the common factors: 6."
            ],
            "final_answer": "HCF = 6"
        },
        "common_mistake": "Mixing up HCF and LCM! HCF is always smaller than or equal to the numbers, while LCM is always larger than or equal to the numbers.",
        "quick_practice_tip": "Factors divide down into pieces; Multiples multiply up to bigger numbers!"
    },
    "g5-measurement-area": {
        "concept_title": "Mastering Measurement: Perimeter, Area & Metric Units",
        "simple_explanation": (
            "Perimeter is the length of the boundary line around a flat shape, like putting up a fence. "
            "Area is the amount of flat surface inside the boundary, like counting how many unit square tiles are needed to cover a bedroom floor. "
            "For a rectangle, Area = Length × Width, and Perimeter = 2 × (Length + Width)!"
        ),
        "worked_example": {
            "problem_statement": "A square tile has sides measuring 8 cm each. What is its total surface area?",
            "step_by_step_solution": [
                "Step 1: Identify the shape: a square has 4 sides that are all equal (side = 8 cm).",
                "Step 2: Use the Area formula for squares: Area = side × side.",
                "Step 3: Multiply: 8 × 8 = 64.",
                "Step 4: Attach the square metric unit: square centimeters (cm²)."
            ],
            "final_answer": "64 cm²"
        },
        "common_mistake": "Writing area units without 'square' or '²'! Area is 2D surface space, so always write cm² or square meters.",
        "quick_practice_tip": "Tile the floor for Area (L × W); Walk the fence for Perimeter (2L + 2W)!"
    },
    "g5-volume-powers": {
        "concept_title": "Mastering 3D Volume & Powers of Ten",
        "simple_explanation": (
            "Volume measures the amount of 3-dimensional solid space inside an object, like filling a cardboard toy box with 1-cm cubic blocks. "
            "For rectangular prisms (boxes), Volume = Length × Width × Height (in cubic units, cm³). "
            "Powers of ten (10, 100, 1000) are shortcuts for place-value shifts: multiplying by 10 moves every digit one spot to the left and adds a zero!"
        ),
        "worked_example": {
            "problem_statement": "A gift box has a length of 5 cm, a width of 3 cm, and a height of 4 cm. What is its volume?",
            "step_by_step_solution": [
                "Step 1: Identify dimensions: Length = 5 cm, Width = 3 cm, Height = 4 cm.",
                "Step 2: Formula for rectangular prism volume: V = Length × Width × Height.",
                "Step 3: Multiply length by width: 5 × 3 = 15 cm² (the base area).",
                "Step 4: Multiply by height: 15 × 4 = 60 cm³."
            ],
            "final_answer": "60 cm³"
        },
        "common_mistake": "Adding the 3 dimensions instead of multiplying them! 5 + 3 + 4 = 12 is incorrect. Volume requires multiplying L × W × H.",
        "quick_practice_tip": "Think of 3D layers: calculate the floor layer (L × W) and multiply by how many layers tall it is (H)!"
    },
    "g5-data-handling": {
        "concept_title": "Mastering Data Handling: Smart Charts & Lines of Symmetry",
        "simple_explanation": (
            "Data handling teaches us to organize numbers into visual stories! Bar graphs use colored bars where the height indicates quantity. "
            "Always check the scale axis on the left—sometimes 1 grid line represents 1, but often it counts by 2s, 5s, or 10s. "
            "Symmetry means balance: if a shape can be folded along a straight line so that both halves match exactly, that line is a line of symmetry!"
        ),
        "worked_example": {
            "problem_statement": "In a school library bar chart, each tick mark on the vertical scale represents 5 books. If the bar for Science books reaches 4 tick marks, how many Science books were borrowed?",
            "step_by_step_solution": [
                "Step 1: Check the scale increment: 1 tick mark = 5 books.",
                "Step 2: Count how many tick marks tall the bar is: 4 marks.",
                "Step 3: Multiply: 4 marks × 5 books per mark = 20 books."
            ],
            "final_answer": "20 books"
        },
        "common_mistake": "Assuming every graph counts by 1! Always look at the vertical numbers on the axis before reading the bar height.",
        "quick_practice_tip": "First check the scale step, then read the bar! For symmetry, imagine folding paper along the mirror line."
    },
    "g6-ratios": {
        "concept_title": "Mastering Ratios & Proportional Reasoning",
        "simple_explanation": (
            "A ratio is a mathematical comparison of two quantities. "
            "For instance, if a recipe calls for 2 cups of sugar for every 3 cups of flour, the ratio of sugar to flour is 2:3. "
            "Ratios can be simplified just like fractions by dividing both numbers by their common factor!"
        ),
        "worked_example": {
            "problem_statement": "In a basket there are 6 red apples and 9 green apples. What is the simplified ratio of red to green apples?",
            "step_by_step_solution": [
                "Step 1: Write the initial comparison: 6 red to 9 green (6:9).",
                "Step 2: Find the highest common factor of 6 and 9, which is 3.",
                "Step 3: Divide both terms by 3: 6 ÷ 3 = 2, and 9 ÷ 3 = 3.",
                "Step 4: Write the simplified ratio: 2:3."
            ],
            "final_answer": "2:3"
        },
        "common_mistake": "Reversing the terms! The ratio of red to green (2:3) is not the same as green to red (3:2). Order matters in ratios.",
        "quick_practice_tip": "Treat ratio terms like numerator and denominator: divide both by the same number to simplify!"
    }
}


class GeminiAIService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "")
        self.model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        self.image_model_name = os.getenv("GEMINI_IMAGE_MODEL", "imagen-3.0-generate-002")
        self.client = None

        if self.api_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
                print(f"[AI] Initialized official Google GenAI Client with model: {self.model_name}")
            except Exception as e:
                print(f"[AI] Could not initialize google.genai client: {e}")

    async def generate_explanation(
        self,
        grade: int,
        topic_id: str,
        learning_objective: str
    ) -> Dict[str, Any]:
        """
        Generates an age-appropriate mathematical explanation with worked examples.
        """
        topic = get_topic_by_id(topic_id)
        topic_title = topic["title"] if topic else topic_id

        if self.client:
            prompt = f"""
            You are an encouraging Grade {grade} mathematics specialist teacher for MathQuest AI.
            Create a clear, structured educational lesson for the topic: '{topic_title}'.
            Learning Objective: {learning_objective}
            
            Return ONLY a valid JSON object matching this schema:
            {{
                "concept_title": "String title",
                "simple_explanation": "2-3 short, friendly paragraphs using familiar analogies (food, sports, measurements)",
                "worked_example": {{
                    "problem_statement": "Real world problem",
                    "step_by_step_solution": [
                        "Step 1: ...",
                        "Step 2: ...",
                        "Step 3: ..."
                    ],
                    "final_answer": "Explicit answer"
                }},
                "common_mistake": "One common student pitfall and how to avoid it",
                "quick_practice_tip": "A fun memory trick or practical check"
            }}
            """
            try:
                response = self.client.models.generate_content(
                    model=self.model_name,
                    contents=prompt,
                    config={"response_mime_type": "application/json"}
                )
                if response.text:
                    parsed = json.loads(response.text)
                    return {
                        "source": "gemini-ai",
                        "data": parsed
                    }
            except Exception as e:
                print(f"[AI] Gemini explanation generation failed ({e}), using verified local curriculum.")

        # Dedicated high-quality deterministic pedagogical fallback per topic
        lesson_data = TOPIC_VERIFIED_LESSONS.get(topic_id)
        if not lesson_data:
            # Fallback to general template if unknown topic
            lesson_data = {
                "concept_title": f"Mastering {topic_title}",
                "simple_explanation": (
                    f"Welcome to {topic_title}! In Grade {grade}, mathematics gives us powerful tools to understand the world. "
                    "By following step-by-step visual patterns, solving math problems becomes fun and intuitive!"
                ),
                "worked_example": {
                    "problem_statement": f"Example Problem for {topic_title}",
                    "step_by_step_solution": [
                        "Step 1: Read the problem carefully and identify the given numbers.",
                        "Step 2: Identify the correct mathematical rule or formula.",
                        "Step 3: Calculate step-by-step and verify your final answer."
                    ],
                    "final_answer": f"Completed solution for {topic_title}"
                },
                "common_mistake": "Rushing through calculations without checking units or step alignment.",
                "quick_practice_tip": "Always estimate your answer first to see if your result makes sense!"
            }

        return {
            "source": "verified-curriculum",
            "data": lesson_data
        }

    async def generate_socratic_hint(
        self,
        grade: int,
        topic_id: str,
        question_text: str,
        options: List[Dict[str, str]]
    ) -> Dict[str, str]:
        """
        Generates a Socratic hint using LLM: does NOT give the answer away,
        instead asks a guiding question or points to a foundational rule (BYJU'S + Duolingo methodology).
        """
        topic = get_topic_by_id(topic_id)
        topic_title = topic["title"] if topic else topic_id

        if self.client:
            prompt = f"""
            You are Questie, a friendly, encouraging AI Math Owl mentor for Grade {grade} students.
            A student is currently looking at this question on '{topic_title}':
            Question: "{question_text}"
            Options: {[o.get('text', '') for o in options]}

            Provide a short Socratic hint (1-2 friendly sentences) that helps the student think through the problem
            WITHOUT stating the final answer or revealing which option is correct.
            Follow it with 1 short guiding question.
            Output strictly JSON matching:
            {{
                "hint": "Gentle conceptual clue or analogy...",
                "socratic_question": "One guiding thought question..."
            }}
            """
            try:
                response = self.client.models.generate_content(
                    model=self.model_name,
                    contents=prompt,
                    config={"response_mime_type": "application/json"}
                )
                if response.text:
                    parsed = json.loads(response.text)
                    return {
                        "hint": parsed.get("hint", "Look closely at the numbers and remember to apply the core rule step-by-step!"),
                        "socratic_question": parsed.get("socratic_question", "What is the first step you take before calculating?"),
                        "source": "gemini-ai"
                    }
            except Exception as e:
                print(f"[AI] Gemini hint generation fallback ({e}).")

        # High-quality deterministic pedagogical fallback hints by topic
        fallback_hints = {
            "g5-fractions": {
                "hint": "Check whether the denominators (the bottom numbers) match. If they match, keep the bottom and focus on adding or subtracting the top numbers!",
                "socratic_question": "What happens to the denominator when fractions are already identical in size?"
            },
            "g5-decimals": {
                "hint": "Line up each number carefully by its decimal point before adding or subtracting.",
                "socratic_question": "Which place value comes immediately after the decimal point: tenths or hundredths?"
            },
            "g5-geometry": {
                "hint": "Remember that perimeter means measuring the entire fence around the outside border of the shape.",
                "socratic_question": "How many outer sides does this polygon have in total?"
            },
            "g5-place-value": {
                "hint": "In the Indian system, 1 Lakh has 5 zeros (1,00,000) and 1 Crore has 7 zeros (1,00,00,000). In the International system, 1 Million has 6 zeros.",
                "socratic_question": "How many Lakhs do you need to group together to reach 1 Million?"
            },
            "g5-factors-multiples": {
                "hint": "Factors divide evenly into a number with zero remainder; multiples grow larger like skip counting.",
                "socratic_question": "Does this number have any divisors other than 1 and itself?"
            },
            "g5-measurement-area": {
                "hint": "Perimeter is the fence around the edges (Length + Width + Length + Width), while Area is the carpet inside (Length × Width).",
                "socratic_question": "Are you measuring the outer boundary or the flat surface tiles inside?"
            },
            "g5-volume-powers": {
                "hint": "For 3D boxes, multiply all 3 dimensions together: Length × Width × Height.",
                "socratic_question": "If you multiply the base area by how tall the prism is, what do you get?"
            },
            "g5-data-handling": {
                "hint": "Always check the axis scale first: does each line step up by 1, 2, or 5 units?",
                "socratic_question": "What number does the bar reach when you trace straight across to the vertical scale?"
            },
            "g6-ratios": {
                "hint": "Write the quantities as a fraction and divide both numbers by their greatest common factor.",
                "socratic_question": "What common number divides both terms evenly?"
            },
            "g6-integers": {
                "hint": "Think of a thermometer or walking along a number line: positive numbers move right/up, negative numbers move left/down.",
                "socratic_question": "When moving away from zero to the left, which negative number is closer to zero?"
            },
            "g6-algebra": {
                "hint": "A variable like 'x' is just an empty basket waiting for a number. Replace the letter with the given value!",
                "socratic_question": "What inverse operation undoes addition or subtraction in the equation?"
            },
            "g6-decimals-play": {
                "hint": "When multiplying decimals, count the total number of digits behind decimal points in both numbers.",
                "socratic_question": "How many total decimal places must your final product have?"
            },
            "g6-lines-angles": {
                "hint": "Remember: Acute < 90° (sharp), Right = 90° (square corner), Obtuse > 90° (wide open).",
                "socratic_question": "Is this angle smaller or larger than the corner of a book?"
            },
            "g6-geometry-area": {
                "hint": "The area of any triangle is exactly half of a rectangle with the same base and height: 1/2 × base × height.",
                "socratic_question": "Did you multiply base times height and then divide by 2?"
            },
            "g6-data-handling": {
                "hint": "For Median, always put the numbers in order from least to greatest first, then pick the exact middle one.",
                "socratic_question": "Are your numbers arranged in ascending order?"
            }
        }
        res = fallback_hints.get(topic_id, {
            "hint": f"Take your time to break down '{topic_title}' into small parts. Re-read the question carefully!",
            "socratic_question": "What information does the problem already give you?"
        })
        return {
            "hint": res["hint"],
            "socratic_question": res["socratic_question"],
            "source": "verified-pedagogy"
        }

    async def generate_practice_question(
        self,
        grade: int,
        topic_id: str,
        difficulty: str,
        excluded_ids: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Generates a validated practice question.
        Validates mathematical correctness deterministically before returning.
        Falls back to verified question bank if API is unavailable or math validation fails.
        """
        topic = get_topic_by_id(topic_id)
        topic_title = topic["title"] if topic else topic_id

        if self.client:
            prompt = f"""
            You are a rigorous mathematics teacher creating a Grade {grade} multiple-choice question for: '{topic_title}'.
            Target Difficulty: {difficulty}.
            
            Return ONLY a valid JSON object matching this schema:
            {{
                "question_text": "Clear, age-appropriate question statement",
                "options": [
                    {{"id": "A", "text": "Option A"}},
                    {{"id": "B", "text": "Option B"}},
                    {{"id": "C", "text": "Option C"}},
                    {{"id": "D", "text": "Option D"}}
                ],
                "correct_answer": "One of: A, B, C, D",
                "explanation": "Clear explanation of why the correct answer is right and why others are wrong.",
                "learning_objective": "Specific standard skill",
                "validation_data": {{
                    "type": "exact_choice",
                    "expected": "Exact matching string of correct option"
                }}
            }}
            Ensure there is exactly one correct answer and that the option letter matches the expected value!
            """
            for attempt in range(2):
                try:
                    response = self.client.models.generate_content(
                        model=self.model_name,
                        contents=prompt,
                        config={"response_mime_type": "application/json"}
                    )
                    if response.text:
                        q_data = json.loads(response.text)
                        # Verify the mathematical consistency
                        is_valid, reason = verify_question_data(q_data)
                        if is_valid:
                            q_data["question_id"] = f"ai-{topic_id}-{difficulty}-{os.urandom(3).hex()}"
                            q_data["grade"] = grade
                            q_data["topic_id"] = topic_id
                            q_data["difficulty"] = difficulty
                            q_data["verification_status"] = "ai_verified"
                            return q_data
                        else:
                            print(f"[AI] Generated question failed validation: {reason}. Retrying...")
                except Exception as e:
                    print(f"[AI] Gemini question generation error: {e}")
                    break

        # Fallback to pre-verified question bank with excluded_ids filtering
        bank_questions = get_verified_questions(topic_id, difficulty, excluded_ids=excluded_ids)
        if not bank_questions:
            bank_questions = get_verified_questions(topic_id, excluded_ids=excluded_ids)
        if not bank_questions:
            # If all were exhausted, allow repeating from bank
            bank_questions = get_verified_questions(topic_id, difficulty) or get_verified_questions(topic_id)

        if bank_questions:
            selected = dict(bank_questions[0])
            selected["verification_status"] = "bank_verified"
            return selected

        # Generic safe math question fallback
        return {
            "question_id": f"fb-{topic_id}-{difficulty}",
            "topic_id": topic_id,
            "grade": grade,
            "difficulty": difficulty,
            "question_text": "What is 1/3 + 1/3?",
            "options": [
                {"id": "A", "text": "2/6"},
                {"id": "B", "text": "2/3"},
                {"id": "C", "text": "1/3"},
                {"id": "D", "text": "1/6"}
            ],
            "correct_answer": "B",
            "explanation": "Add the numerators (1 + 1 = 2) and keep the common denominator (3). Result: 2/3.",
            "learning_objective": "Basic fraction addition",
            "validation_data": {
                "type": "fraction_arithmetic",
                "op": "+",
                "n1": 1, "d1": 3,
                "n2": 1, "d2": 3
            },
            "verification_status": "verified"
        }

    async def generate_infographic(
        self,
        grade: int,
        topic_id: str
    ) -> Dict[str, Any]:
        """
        Generates an educational infographic visual.
        First tries Gemini image generation endpoint (e.g. Imagen via Google GenAI SDK).
        If unavailable or fails, returns the mathematically verified vector infographic fallback.
        """
        topic = get_topic_by_id(topic_id)
        topic_title = topic["title"] if topic else topic_id

        # Check if live Gemini Image Generation is available
        if self.client:
            prompt = (
                f"A clean, child-friendly educational mathematics infographic for Grade {grade} students explaining {topic_title}. "
                "Featuring clear visual fraction bars or geometric shapes, pastel colors, high contrast, clean educational typography, no clutter."
            )
            try:
                # Attempt using generate_images if supported in the SDK
                if hasattr(self.client.models, "generate_images"):
                    result = self.client.models.generate_images(
                        model=self.image_model_name,
                        prompt=prompt,
                        config=dict(number_of_images=1, output_mime_type="image/png")
                    )
                    if result.generated_images:
                        b64_img = base64.b64encode(result.generated_images[0].image.image_bytes).decode("utf-8")
                        return {
                            "status": "success",
                            "source": "gemini-imagen",
                            "topic_id": topic_id,
                            "image_url": f"data:image/png;base64,{b64_img}",
                            "title": f"AI Infographic: {topic_title}",
                            "caption": f"Generated visual reference for Grade {grade} {topic_title}."
                        }
            except Exception as e:
                print(f"[AI] Gemini image generation endpoint unavailable or unsupported ({e}).")

        # Deterministic mathematically accurate vector infographic fallback
        fallback_url = FALLBACK_INFOGRAPHICS.get(
            topic_id,
            FALLBACK_INFOGRAPHICS["g5-fractions"]
        )
        return {
            "status": "success",
            "source": "verified-vector-infographic",
            "topic_id": topic_id,
            "image_url": fallback_url,
            "title": f"Educational Infographic: {topic_title}",
            "caption": f"Georgia Curriculum Aligned Visual Concept Guide for Grade {grade}."
        }

    async def generate_student_behavior_analysis(
        self,
        student_id: str,
        grade: int,
        rl_profile: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Uses LLM to analyze student's RL performance profile (easy topics, tough topics, accuracy)
        and generate encouraging metacognitive coaching, personalized study advice, and key learning tips.
        """
        mastered = [t["title"] for t in rl_profile.get("mastered_topics", [])]
        tough = [t["title"] for t in rl_profile.get("tough_topics", [])]
        in_progress = [t["title"] for t in rl_profile.get("in_progress_topics", [])]
        accuracy = rl_profile.get("overall_accuracy", 0.0)

        # Resilient heuristic default
        encouragement = (
            f"You are showing great perseverance, Adventurer! You have strong understanding in "
            f"{', '.join(mastered) if mastered else 'foundational concepts'}. "
            f"For {', '.join(tough) if tough else 'new topics'}, take your time to review the animated visual lessons!"
        )
        study_tips = [
            "Use visual models (fraction bars, grid drawings) before computing numbers.",
            "Double-check your calculations step-by-step.",
            "Celebrate every problem solved — consistency builds mathematical power!"
        ]

        if self.client:
            prompt = (
                f"You are an empathetic, encouraging Grade {grade} mathematics mentor. "
                f"A student's performance shows:\n"
                f"- Overall accuracy: {accuracy}%\n"
                f"- Topics Mastered (Easy for them): {', '.join(mastered) if mastered else 'None yet'}\n"
                f"- Topics Struggling (Tough for them): {', '.join(tough) if tough else 'None yet'}\n"
                f"- Topics In Progress: {', '.join(in_progress) if in_progress else 'None'}\n\n"
                "Provide a brief, child-friendly feedback message (2-3 sentences) encouraging their growth mindset, "
                "and 3 short bullet action tips. Output strictly JSON with keys 'mentor_message' and 'action_tips'."
            )
            try:
                response = self.client.models.generate_content(
                    model=self.model_name,
                    contents=prompt,
                    config=dict(temperature=0.4, response_mime_type="application/json")
                )
                if response.text:
                    parsed = json.loads(response.text)
                    return {
                        "status": "success",
                        "source": "gemini",
                        "mentor_message": parsed.get("mentor_message", encouragement),
                        "action_tips": parsed.get("action_tips", study_tips)
                    }
            except Exception as e:
                print(f"[AI] Gemini behavior analysis fallback ({e}).")

        return {
            "status": "success",
            "source": "adaptive_profiler",
            "mentor_message": encouragement,
            "action_tips": study_tips
        }

    async def ask_tutor(
        self,
        grade: int,
        topic_id: str,
        question: str
    ) -> Dict[str, Any]:
        """
        AI Math Tutor conversational assistant for Grade 5/6 students.
        Explains math questions, clears doubts, and provides friendly worked examples.
        """
        topic = get_topic_by_id(topic_id)
        topic_title = topic["title"] if topic else topic_id

        # High quality topic-aware fallback
        q_lower = question.lower()
        if "denominator" in q_lower or "fraction" in topic_id:
            answer = (
                "Think of the denominator as the 'name' or 'size' of the pizza slices. "
                "When you add 1/8 and 2/8, the size of the slice (eighths) doesn't change! "
                "You are just counting how many slices you have: 1 + 2 = 3 slices of eighths (3/8)."
            )
            example = "Example: 2/5 + 1/5 = (2 + 1)/5 = 3/5. Denominator stays 5!"
            encouragement = "Awesome question! Knowing 'why' makes you an unstoppable mathematician! 🌟"
        elif "decimal" in q_lower or "decimal" in topic_id:
            answer = (
                "Decimals are just another way to write fractions based on tens, hundreds, and thousands! "
                "Always line up the decimal point vertically like buttons on a shirt so you add tenths with tenths and hundredths with hundredths."
            )
            example = "Example: 3.25 + 1.50 -> line up decimals: 3.25 + 1.50 = 4.75."
            encouragement = "Great curiosity! Line up the dots and you'll never miss a step! 🎯"
        elif "ratio" in q_lower or "ratio" in topic_id:
            answer = (
                "A ratio compares two quantities, like 2 apples to 3 oranges (2:3). "
                "To find an equivalent ratio, multiply or divide both parts by the exact same number!"
            )
            example = "Example: 2:3 scaled by 2 becomes (2×2):(3×2) = 4:6."
            encouragement = "You're thinking like a mathematician! Keep exploring! 🚀"
        else:
            answer = (
                f"In {topic_title}, always break the problem down step-by-step. "
                "Identify what is given, what you need to find, and sketch a quick diagram to visualize the numbers!"
            )
            example = "Example: Draw a picture or number line to represent the quantities before calculating."
            encouragement = "Keep asking questions — that's how true math champions learn! 🏆"

        if self.client:
            prompt = (
                f"You are Professor Owl, an empathetic, engaging, and world-class Grade {grade} Math Tutor. "
                f"The curriculum is Georgia Standards of Excellence (GSE). "
                f"The current topic is '{topic_title}'. "
                f"A student asks: \"{question}\"\n\n"
                f"Respond in a child-friendly, conversational, and encouraging tone suitable for a 10-12 year old. "
                f"Include a short conceptual explanation, a worked example, and a warm encouraging note. "
                f"Keep your response concise (under 120 words). "
                f"Output strictly JSON with keys: 'answer', 'worked_example', 'encouragement'."
            )
            try:
                response = self.client.models.generate_content(
                    model=self.model_name,
                    contents=prompt,
                    config=dict(temperature=0.3, response_mime_type="application/json")
                )
                if response.text:
                    parsed = json.loads(response.text)
                    return {
                        "answer": parsed.get("answer", answer),
                        "worked_example": parsed.get("worked_example", example),
                        "encouragement": parsed.get("encouragement", encouragement),
                        "source": "gemini-tutor"
                    }
            except Exception as e:
                print(f"[AI] Gemini Tutor fallback: {e}")

        return {
            "answer": answer,
            "worked_example": example,
            "encouragement": encouragement,
            "source": "tutor_knowledge_base"
        }

    async def generate_video_lesson(
        self,
        topic_id: str,
        custom_prompt: Optional[str] = None,
        grade: int = 5
    ) -> Dict[str, Any]:
        """
        Generates an educational, narrated slide-style video lesson for a math topic
        using Gemini AI with structured JSON schema, with guaranteed verified curriculum fallback.
        Strictly aligned with Georgia Mathematics Standards.
        """
        topic = get_topic_by_id(topic_id)
        topic_title = topic["title"] if topic else topic_id.replace("-", " ").title()
        fallback_lesson = get_video_lesson(topic_id)

        if self.client:
            prompt = f"""
            You are an expert Math Curriculum Designer and Narrator creating an animated, slide-based video lesson
            for Grade {grade} students (aged 10-12), strictly aligned with Georgia Mathematics Standards.
            Topic: '{topic_title}' (ID: {topic_id}).
            {"Special Focus: " + custom_prompt if custom_prompt else ""}

            Create a 5-slide narrated video lesson.
            For each slide:
            - slide_id: integer (1 to 5)
            - title: Catchy, engaging title (e.g. 'Welcome to Fraction Adventure!')
            - visual_concept: Description of what is drawn on the visual whiteboard canvas (e.g., pizza sliced into 8 pieces, number line jumping).
            - narration_text: Friendly, conversational voice narration script (35-50 words). Tone should be encouraging and clear like Khan Academy Kids.
            - key_takeaway: 1 short sentence summarizing the core math rule.
            - interactive_check: On slide 4 only, an interactive checkpoint question with:
                - question: Multiple choice question checking understanding.
                - options: List of exactly 4 strings.
                - correct: The string of the correct answer from options.

            Output strictly JSON matching this structure:
            {{
                "topic_id": "{topic_id}",
                "title": "{topic_title}",
                "total_slides": 5,
                "slides": [
                    {{
                        "slide_id": 1,
                        "title": "...",
                        "visual_concept": "...",
                        "narration_text": "...",
                        "key_takeaway": "...",
                        "interactive_check": null
                    }},
                    {{
                        "slide_id": 2,
                        "title": "...",
                        "visual_concept": "...",
                        "narration_text": "...",
                        "key_takeaway": "...",
                        "interactive_check": null
                    }},
                    {{
                        "slide_id": 3,
                        "title": "...",
                        "visual_concept": "...",
                        "narration_text": "...",
                        "key_takeaway": "...",
                        "interactive_check": null
                    }},
                    {{
                        "slide_id": 4,
                        "title": "...",
                        "visual_concept": "...",
                        "narration_text": "...",
                        "key_takeaway": "...",
                        "interactive_check": {{
                            "question": "...",
                            "options": ["A", "B", "C", "D"],
                            "correct": "A"
                        }}
                    }},
                    {{
                        "slide_id": 5,
                        "title": "...",
                        "visual_concept": "...",
                        "narration_text": "...",
                        "key_takeaway": "...",
                        "interactive_check": null
                    }}
                ]
            }}
            """
            try:
                response = self.client.models.generate_content(
                    model=self.model_name,
                    contents=prompt,
                    config=dict(temperature=0.3, response_mime_type="application/json")
                )
                if response.text:
                    parsed = json.loads(response.text)
                    if "slides" in parsed and len(parsed["slides"]) > 0:
                        parsed["source"] = "gemini-ai"
                        return parsed
            except Exception as e:
                print(f"[AI] Gemini video lesson generation fallback: {e}")

        # Return verified fallback
        if fallback_lesson:
            return {
                **fallback_lesson,
                "source": "verified-curriculum"
            }

        return {
            "topic_id": topic_id,
            "title": topic_title,
            "total_slides": 1,
            "slides": [
                {
                    "slide_id": 1,
                    "title": topic_title,
                    "visual_concept": f"Visual breakdown of {topic_title}",
                    "narration_text": f"Welcome! Today we are exploring {topic_title}. Follow along with each step to master this concept!",
                    "key_takeaway": f"Understanding {topic_title} helps build strong mathematical confidence.",
                    "interactive_check": None
                }
            ],
            "source": "fallback"
        }


ai_service = GeminiAIService()

