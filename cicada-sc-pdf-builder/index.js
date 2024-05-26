import getPdfAuthorizingLetter from "./getPdfAuthorizingLetter.js";

const userData = {
    "organizationName": "ООО \"Информационные технологии\"",
    "address": "ул. Примерная, д. 1, г. Москва, РФ, 123456",
    "phone": "+7 (123) 456-78-90",
    "inn": "1234567890",
    "ogrn": "1234567890123",
    "letterNumber": "123/456",
    "currentDate": "2024-05-26",
    "representative": "Алексеев Алексей Алексеевич",
    "endPeriodDate": "2024-12-31",
    "representativeInitials": "Алексеев А.А."
};

await getPdfAuthorizingLetter(userData);