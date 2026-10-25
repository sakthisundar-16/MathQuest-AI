import pytest
from fractions import Fraction
from app.validators.math_validator import (
    validate_fraction_arithmetic,
    validate_decimal_arithmetic,
    validate_ratio_simplification,
    validate_geometry,
    verify_question_data,
    parse_fraction
)


def test_fraction_parsing():
    assert parse_fraction("3/4") == Fraction(3, 4)
    assert parse_fraction("1 1/2") == Fraction(3, 2)
    assert parse_fraction("5") == Fraction(5, 1)
    assert parse_fraction("invalid") is None


def test_fraction_arithmetic_addition():
    # 1/5 + 2/5 = 3/5
    is_valid, exp_str, val = validate_fraction_arithmetic("+", 1, 5, 2, 5, "3/5")
    assert is_valid is True
    assert exp_str == "3/5"

    # Incorrect candidate: 3/10
    is_valid, exp_str, _ = validate_fraction_arithmetic("+", 1, 5, 2, 5, "3/10")
    assert is_valid is False

    # Unlike denominators: 1/2 + 1/4 = 3/4
    is_valid, exp_str, _ = validate_fraction_arithmetic("+", 1, 2, 1, 4, "3/4")
    assert is_valid is True


def test_decimal_arithmetic():
    # 0.4 + 0.3 = 0.7
    is_valid, exp_str, _ = validate_decimal_arithmetic("+", 0.4, 0.3, "0.7")
    assert is_valid is True

    # 4.75 - 1.25 = 3.5
    is_valid, exp_str, _ = validate_decimal_arithmetic("-", 4.75, 1.25, "3.5")
    assert is_valid is True

    # Incorrect answer
    is_valid, _, _ = validate_decimal_arithmetic("+", 0.4, 0.3, "0.12")
    assert is_valid is False


def test_ratio_simplification():
    # 6:9 -> 2:3
    is_valid, exp_str = validate_ratio_simplification(6, 9, "2:3")
    assert is_valid is True
    assert exp_str == "2:3"

    # Equivalent notation "2 to 3"
    is_valid, _ = validate_ratio_simplification(6, 9, "2 to 3")
    assert is_valid is True

    # Incorrect
    is_valid, _ = validate_ratio_simplification(6, 9, "3:2")
    assert is_valid is False


def test_geometry_validation():
    # Rectangle perimeter: length=6, width=4 -> 2*(6+4) = 20
    is_valid, exp_str, _ = validate_geometry("rectangle", "perimeter", {"length": 6.0, "width": 4.0}, "20")
    assert is_valid is True

    # Square area: side=7 -> 49
    is_valid, _, _ = validate_geometry("square", "area", {"side": 7.0}, "49")
    assert is_valid is True

    # Triangle area: base=8, height=5 -> 0.5 * 8 * 5 = 20
    is_valid, _, _ = validate_geometry("triangle", "area", {"base": 8.0, "height": 5.0}, "20")
    assert is_valid is True


def test_question_data_verification():
    q_data_valid = {
        "question_id": "test-1",
        "options": [
            {"id": "A", "text": "3/10"},
            {"id": "B", "text": "3/5"},
            {"id": "C", "text": "1/5"}
        ],
        "correct_answer": "B",
        "validation_data": {
            "type": "fraction_arithmetic",
            "op": "+",
            "n1": 1, "d1": 5,
            "n2": 2, "d2": 5
        }
    }
    is_valid, _ = verify_question_data(q_data_valid)
    assert is_valid is True

    # Intentionally corrupted answer key (says A: 3/10 is correct)
    q_data_invalid = dict(q_data_valid)
    q_data_invalid["correct_answer"] = "A"
    is_valid, reason = verify_question_data(q_data_invalid)
    assert is_valid is False
    assert "Fraction calculation mismatch" in reason
