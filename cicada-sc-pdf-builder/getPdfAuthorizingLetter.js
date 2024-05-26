import { PDFDocument, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fs from 'fs';
import fetch from 'node-fetch';
import Handlebars from 'handlebars';

// const template = `
// {{organizationName}}
// Адрес: {{address}}
// Телефон: {{phone}}

// ИНН {{inn}}, ОГРН {{ogrn}}

// № {{letterNumber}}
// {{currentDate}}

// ООО "Тестовые Решения"
// Адрес: ул. Образцовая, д. 2, г. Москва, РФ, 123456

// ИНН 0987654321, ОГРН 9876543210987

// Авторизационное письмо

// {{organizationName}} (далее — "Заказчик") в лице {{representative}}, в лице Генерального
// директора {{ceo}}, действующего на основании Устава, настоящим уполномочивает ООО
// "Тестовые Решения" (далее — "Исполнитель"), в лице Генерального директора Петрова
// Петра Петровича, действующего на основании Устава, на выполнение следующих действий,
// направленных на тестирование информационных систем Заказчика:

// Проведение анализа уязвимостей информационных систем Заказчика.
// Проведение тестирования на проникновение (пентестинг) информационных систем
// Заказчика.
// Проведение анализа безопасности и оценка защищенности данных.
// Подготовка отчета по результатам тестирования и предоставление рекомендаций по
// устранению выявленных уязвимостей.
// Данные полномочия предоставляются на период с {{currentDate}} года по {{endPeriodDate}}
// года.

// Исполнитель обязуется соблюдать требования законодательства Российской Федерации в
// области защиты информации, в том числе Федерального закона от 27 июля 2006 г. N 152-ФЗ
// "О персональных данных", Федерального закона от 27 июля 2006 г. N 149-ФЗ "Об
// информации, информационных технологиях и о защите информации", и иных нормативных
// актов.

// Все действия, выполненные Исполнителем в рамках настоящих полномочий, должны быть
// согласованы с Заказчиком и не должны нарушать действующее законодательство Российской
// Федерации.

// Генеральный директор Генеральный директор
// {{organizationName}} ООО "Тестовые Решения"
// _________________ {{ceoInitials}} _________________ Петров П.П.
// `;

async function getPdfAuthorizingLetter({
    organizationName,
    address,
    phone,
    inn,
    ogrn,
    letterNumber,
    currentDate,
    representative,
    ceo,
    endPeriodDate,
    ceoInitials
}) {
    

    const pdfDoc = await PDFDocument.create();
    const firstPage = pdfDoc.addPage();

    const template = `
                                                                                ${organizationName}
                                                                                Адрес: ${address}
                                                                                Телефон: ${phone}

                                                                                ИНН ${inn}, ОГРН ${ogrn}

                                                                                № ${letterNumber}
                                                                                ${currentDate}

                                                                                ООО "Тестовые Решения"
                                                                                Адрес: ул. Образцовая, д. 2, г. Москва, РФ, 123456

                                                                                ИНН 0987654321, ОГРН 9876543210987

                                                                Авторизационное письмо

${organizationName} (далее — "Заказчик") в лице ${representative}, в лице Генерального
директора ${ceo}, действующего на основании Устава, настоящим уполномочивает ООО
"Тестовые Решения" (далее — "Исполнитель"), в лице Генерального директора Петрова
Петра Петровича, действующего на основании Устава, на выполнение следующих действий,
направленных на тестирование информационных систем Заказчика:

Проведение анализа уязвимостей информационных систем Заказчика.
Проведение тестирования на проникновение (пентестинг) информационных систем
Заказчика.
Проведение анализа безопасности и оценка защищенности данных.
Подготовка отчета по результатам тестирования и предоставление рекомендаций по
устранению выявленных уязвимостей.
Данные полномочия предоставляются на период с ${currentDate} года по ${endPeriodDate}
года.

Исполнитель обязуется соблюдать требования законодательства Российской Федерации в
области защиты информации, в том числе Федерального закона от 27 июля 2006 г. N 152-ФЗ
"О персональных данных", Федерального закона от 27 июля 2006 г. N 149-ФЗ "Об
информации, информационных технологиях и о защите информации", и иных нормативных
актов.

Все действия, выполненные Исполнителем в рамках настоящих полномочий, должны быть
согласованы с Заказчиком и не должны нарушать действующее законодательство Российской
Федерации.

Генеральный директор                                    Генеральный директор
${organizationName}                                     ООО "Тестовые Решения"
_________________ ${ceoInitials}                        _________________ Петров П.П.
`;

    const documentContent = template;

    pdfDoc.registerFontkit(fontkit);

    const timesNewRomanBytes = await fetch('https://fonts.cdnfonts.com/s/57197/times.woff').then((res) => res.arrayBuffer());
    const timesNewRomanFont = await pdfDoc.embedFont(timesNewRomanBytes);

    const lines = documentContent.split('\n');

    // Initial settings
    const fontSize = 12;
    const margin = 50;
    let page = pdfDoc.getPages()[0];
    let yPosition = page.getSize().height - margin;

    const drawText = (line) => {
        page.drawText(line, { x: margin, y: yPosition, size: fontSize, font: timesNewRomanFont });
        yPosition -= fontSize + 5; // Move down by fontSize + padding
    };

    // Draw text line by line, adding new pages as necessary
    for (const line of lines) {
        if (yPosition < margin) { // Check if we need a new page
            page = pdfDoc.addPage();
            yPosition = page.getSize().height - margin;
        }
        drawText(line);
    }

    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync('result.pdf', pdfBytes);
}

export default getPdfAuthorizingLetter;