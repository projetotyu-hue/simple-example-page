import re

def detect_card_type(card_number):
    if not card_number:
        return "Desconhecido"

    card = re.sub(r'\D', '', card_number)

    if card.startswith('4'):
        return "Visa"
    elif card.startswith('5') or card.startswith('2'):
        first2 = int(card[:2])
        if 51 <= first2 <= 55 or 22 <= first2 <= 27:
            return "Mastercard"
    elif card.startswith('3'):
        if card.startswith('34') or card.startswith('37'):
            return "Amex"
        elif card.startswith('3'):
            return "Diners"
    elif card.startswith('6'):
        if card.startswith('60') or card.startswith('65'):
            return "Discover"
        elif card.startswith('6011') or card.startswith('65'):
            return "Discover"
    elif card.startswith('7'):
        return "Credcard"
    elif card.startswith('1'):
        return "Visa"

    return "Desconhecido"

def get_card_brand(card_number):
    card = re.sub(r'\D', '', card_number)

    brands = {
        "Visa": r"^4",
        "Mastercard": r"^(5[1-5]|2[2-7])",
        "Amex": r"^3[47]",
        "Diners": r"^3(?:0[0-5]|[68])",
        "Elo": r"^(40117|5067|509|4576|40117500)",
        "Hipercard": r"^(606282|3841)",
        "Discover": r"^(6011|65|644|645|646|647|648|649)",
        "Aura": r"^50[67]",
    }

    for brand, pattern in brands.items():
        if re.match(pattern, card):
            return brand

    if card.startswith('4'):
        return "Visa"
    elif card.startswith(('5', '2')):
        return "Mastercard"

    return "Desconhecido"