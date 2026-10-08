"""Text helpers shared by the API layer."""

# Persian (U+06F0..) and Arabic-Indic (U+0660..) digits -> ASCII.
_DIGIT_MAP = str.maketrans("۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩", "01234567890123456789")


def normalize_digits(value: str) -> str:
    """Convert Persian/Arabic digits to ASCII so IDs typed on a Persian keyboard match."""
    return value.translate(_DIGIT_MAP) if isinstance(value, str) else value
