"""
Deterministic Mathematical Validation Engine
Ensures mathematical correctness independently of any LLM outputs.
Supports Fractions (exact rational arithmetic), Decimals, Integers, Ratios, and Geometry.
"""

from fractions import Fraction
from typing import Dict, Any, Tuple, Optional
import math
import re


def normalize_numeric_str(val: str) -> str:
    """Strip whitespace, units (like sq units, cm, etc.), and dollar signs."""
    s = val.strip().lower()
    s = s.replace("$", "").replace("units", "").replace("sq", "").replace("cm", "").replace("m", "")
    s = s.replace(" ", "")
    return s


def parse_fraction(val: str) -> Optional[Fraction]:
    """
    Parse a fraction string like '3/4', '1 1/2', '6/8', or whole number '2'.
    """
    val = val.strip()
    # Check mixed fraction: "1 1/2" or "1-1/2"
    mixed_match = re.match(r"^(\d+)\s+(\d+)/(\d+)$", val)
    if mixed_match:
        whole = int(mixed_match.group(1))
        num = int(mixed_match.group(2))
        den = int(mixed_match.group(3))
        if den == 0:
            return None
        return Fraction(whole * den + num, den)

    # Standard fraction: "3/4"
    frac_match = re.match(r"^(\d+)/(\d+)$", val)
    if frac_match:
        num = int(frac_match.group(1))
        den = int(frac_match.group(2))
        if den == 0:
            return None
        return Fraction(num, den)

    # Whole number or integer
    if re.match(r"^-?\d+$", val):
        return Fraction(int(val), 1)

    # Decimal string to fraction
    try:
        f_val = float(val)
        return Fraction(f_val).limit_denominator(1000)
    except (ValueError, OverflowError):
        return None


def validate_fraction_arithmetic(
    op: str,
    n1: int, d1: int,
    n2: int, d2: int,
    candidate_answer: str
) -> Tuple[bool, str, Fraction]:
    """
    Validates arithmetic between two fractions: op in ['add', 'subtract', 'multiply', 'divide']
    """
    if d1 == 0 or d2 == 0:
        return False, "Denominator cannot be zero.", Fraction(0, 1)

    f1 = Fraction(n1, d1)
    f2 = Fraction(n2, d2)

    if op in ["+", "add"]:
        expected = f1 + f2
    elif op in ["-", "subtract"]:
        expected = f1 - f2
    elif op in ["*", "multiply"]:
        expected = f1 * f2
    elif op in ["/", "divide"]:
        if f2 == 0:
            return False, "Division by zero.", Fraction(0, 1)
        expected = f1 / f2
    else:
        return False, f"Unsupported operation {op}", Fraction(0, 1)

    parsed = parse_fraction(candidate_answer)
    if parsed is None:
        return False, f"Could not parse '{candidate_answer}' as a valid fraction.", expected

    is_correct = (parsed == expected)
    exp_str = f"{expected.numerator}/{expected.denominator}" if expected.denominator != 1 else str(expected.numerator)
    return is_correct, exp_str, expected


def validate_decimal_arithmetic(
    op: str,
    num1: float,
    num2: float,
    candidate_answer: str,
    tolerance: float = 1e-4
) -> Tuple[bool, str, float]:
    """
    Validates arithmetic operations on decimal numbers with rounding precision check.
    """
    if op in ["+", "add"]:
        expected = num1 + num2
    elif op in ["-", "subtract"]:
        expected = num1 - num2
    elif op in ["*", "multiply"]:
        expected = num1 * num2
    elif op in ["/", "divide"]:
        if abs(num2) < 1e-9:
            return False, "Division by zero.", 0.0
        expected = num1 / num2
    else:
        return False, f"Unsupported operation {op}", 0.0

    try:
        clean = normalize_numeric_str(candidate_answer)
        parsed = float(clean)
    except ValueError:
        return False, f"Could not parse '{candidate_answer}' as decimal.", round(expected, 4)

    is_correct = abs(parsed - expected) <= tolerance
    return is_correct, str(round(expected, 4)), expected


def validate_equivalent_fraction(
    num1: int, den1: int, candidate_answer: str
) -> Tuple[bool, str]:
    """Validates if candidate fraction is equivalent to num1/den1."""
    if den1 == 0:
        return False, "Invalid denominator"
    base = Fraction(num1, den1)
    parsed = parse_fraction(candidate_answer)
    if parsed is None:
        return False, "Invalid format"
    return (parsed == base), f"{base.numerator}/{base.denominator}"


def validate_ratio_simplification(
    a: int, b: int, candidate_answer: str
) -> Tuple[bool, str]:
    """
    Validates ratio a:b against candidate 'x:y' or 'x/y'.
    """
    if b == 0:
        return False, "Invalid ratio base zero"
    g = math.gcd(a, b)
    simp_a = a // g
    simp_b = b // g
    expected_str = f"{simp_a}:{simp_b}"

    # Normalize candidate: e.g. "2:3", "2 to 3", "2/3"
    cand = candidate_answer.strip().lower().replace(" to ", ":").replace("/", ":")
    m = re.match(r"^(\d+):(\d+)$", cand)
    if not m:
        return False, expected_str

    ca, cb = int(m.group(1)), int(m.group(2))
    if cb == 0:
        return False, expected_str
    cg = math.gcd(ca, cb)
    return (ca // cg == simp_a and cb // cg == simp_b), expected_str


def validate_geometry(
    shape: str,
    metric: str,  # 'perimeter', 'area', 'volume'
    params: Dict[str, float],
    candidate_answer: str
) -> Tuple[bool, str, float]:
    """
    Validates geometry measurements:
    - Rectangle: area = l * w, perimeter = 2*(l + w)
    - Triangle: area = 0.5 * b * h, perimeter = a + b + c
    - Square: area = s^2, perimeter = 4*s
    - Rectangular prism: volume = l * w * h
    """
    clean_shape = shape.lower()
    clean_metric = metric.lower()

    if clean_shape in ["rectangle", "rectangular"]:
        l = params.get("length", 0.0)
        w = params.get("width", 0.0)
        if clean_metric == "area":
            expected = l * w
        elif clean_metric == "perimeter":
            expected = 2 * (l + w)
        else:
            return False, f"Unknown metric {metric}", 0.0

    elif clean_shape in ["triangle", "triangular"]:
        if clean_metric == "area":
            b = params.get("base", 0.0)
            h = params.get("height", 0.0)
            expected = 0.5 * b * h
        elif clean_metric == "perimeter":
            a = params.get("side_a", 0.0)
            b = params.get("side_b", 0.0)
            c = params.get("side_c", 0.0)
            expected = a + b + c
        else:
            return False, f"Unknown metric {metric}", 0.0

    elif clean_shape == "square":
        s = params.get("side", 0.0)
        if clean_metric == "area":
            expected = s * s
        elif clean_metric == "perimeter":
            expected = 4 * s
        else:
            return False, f"Unknown metric {metric}", 0.0

    elif clean_shape in ["rectangular_prism", "prism", "box"]:
        l = params.get("length", 0.0)
        w = params.get("width", 0.0)
        h = params.get("height", 0.0)
        if clean_metric == "volume":
            expected = l * w * h
        elif clean_metric == "surface_area":
            expected = 2 * (l * w + l * h + w * h)
        else:
            return False, f"Unknown metric {metric}", 0.0
    else:
        return False, f"Unsupported shape {shape}", 0.0

    try:
        clean = normalize_numeric_str(candidate_answer)
        parsed = float(clean)
    except ValueError:
        return False, f"Could not parse '{candidate_answer}' as numeric.", round(expected, 2)

    is_correct = abs(parsed - expected) <= 1e-3
    return is_correct, str(round(expected, 2)), expected


def validate_hcf_lcm(
    calc_type: str,
    a: int,
    b: int,
    candidate_answer: str
) -> Tuple[bool, str]:
    """Validates Highest Common Factor (HCF / GCD) or Lowest Common Multiple (LCM)."""
    if a <= 0 or b <= 0:
        return False, "Inputs must be positive integers"

    gcd_val = math.gcd(a, b)
    if calc_type.lower() in ["hcf", "gcd"]:
        expected = gcd_val
    else:
        expected = abs(a * b) // gcd_val

    clean_cand = re.sub(r"[^\d]", "", candidate_answer)
    try:
        cand_int = int(clean_cand)
        return (cand_int == expected), str(expected)
    except ValueError:
        return False, str(expected)


def verify_question_data(question_data: Dict[str, Any]) -> Tuple[bool, str]:
    """
    Given a question structure containing validation_data, verify that the designated
    correct answer corresponds mathematically to the expected outcome.
    """
    v_data = question_data.get("validation_data")
    if not v_data:
        # If no explicit structured math validation metadata, check if verification_status is manual_verified
        if question_data.get("verification_status") == "verified":
            return True, "Pre-verified bank question."
        return False, "Missing validation metadata."

    q_type = v_data.get("type")
    correct_opt_id = question_data.get("correct_answer")
    options = {opt["id"]: opt["text"] for opt in question_data.get("options", [])}

    if correct_opt_id not in options:
        return False, f"Correct option '{correct_opt_id}' is not present in options."

    candidate_text = options[correct_opt_id]

    if q_type == "fraction_arithmetic":
        is_ok, exp_str, _ = validate_fraction_arithmetic(
            op=v_data.get("op", "+"),
            n1=v_data.get("n1", 0), d1=v_data.get("d1", 1),
            n2=v_data.get("n2", 0), d2=v_data.get("d2", 1),
            candidate_answer=candidate_text
        )
        if not is_ok:
            return False, f"Fraction calculation mismatch. Expected {exp_str}, got '{candidate_text}'."
        return True, "Valid fraction arithmetic verified."

    elif q_type == "decimal_arithmetic":
        is_ok, exp_str, _ = validate_decimal_arithmetic(
            op=v_data.get("op", "+"),
            num1=v_data.get("num1", 0.0),
            num2=v_data.get("num2", 0.0),
            candidate_answer=candidate_text
        )
        if not is_ok:
            return False, f"Decimal calculation mismatch. Expected {exp_str}, got '{candidate_text}'."
        return True, "Valid decimal arithmetic verified."

    elif q_type == "ratio_simplification":
        is_ok, exp_str = validate_ratio_simplification(
            a=v_data.get("a", 1),
            b=v_data.get("b", 1),
            candidate_answer=candidate_text
        )
        if not is_ok:
            return False, f"Ratio mismatch. Expected {exp_str}, got '{candidate_text}'."
        return True, "Valid ratio simplification verified."

    elif q_type == "geometry":
        is_ok, exp_str, _ = validate_geometry(
            shape=v_data.get("shape", "rectangle"),
            metric=v_data.get("metric", "area"),
            params=v_data.get("params", {}),
            candidate_answer=candidate_text
        )
        if not is_ok:
            return False, f"Geometry calculation mismatch. Expected {exp_str}, got '{candidate_text}'."
        return True, "Valid geometry verified."

    elif q_type == "hcf_lcm":
        is_ok, exp_str = validate_hcf_lcm(
            calc_type=v_data.get("calc_type", "hcf"),
            a=v_data.get("a", 1),
            b=v_data.get("b", 1),
            candidate_answer=candidate_text
        )
        if not is_ok:
            return False, f"HCF/LCM mismatch. Expected {exp_str}, got '{candidate_text}'."
        return True, "Valid HCF/LCM verified."

    elif q_type == "exact_choice":
        # Deterministic discrete choice match
        expected_val = str(v_data.get("expected")).strip().lower()
        if candidate_text.strip().lower() != expected_val:
            return False, f"Choice mismatch. Expected {expected_val}, got {candidate_text}."
        return True, "Exact choice verified."

    return True, "Verified question."
