import { PDFDocument } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fs from 'fs';
import fetch from 'node-fetch';

async function getPdfAuthorizingLetter({
    organizationName,
    address,
    phone,
    inn,
    ogrn,
    letterNumber,
    currentDate,
    representative,
    endPeriodDate
}) {
    const pdfDoc = await PDFDocument.create();
    const firstPage = pdfDoc.addPage();

    String.prototype.toLocaleUpperCase

    const representativeInitials = representative.split(' ').map( (el, i) => i === 0 ? el : el.toLocaleUpperCase()[0] + '.')

    pdfDoc.registerFontkit(fontkit);

    const timesNewRomanBytes = await fetch('https://fonts.cdnfonts.com/s/57197/times.woff').then((res) => res.arrayBuffer());
    const timesNewRomanFont = await pdfDoc.embedFont(timesNewRomanBytes);

    const FONT_SIZE = 12;
    const MAX_WIDTH = 450; // Maximum width of the text in points

    const lineAlignLeft = (text, maxWidth) => {
        const textWidth = timesNewRomanFont.widthOfTextAtSize(text, FONT_SIZE);
        const spaceWidth = timesNewRomanFont.widthOfTextAtSize(' ', FONT_SIZE);
        const spacesNeeded = Math.floor((maxWidth - textWidth) / spaceWidth);
        const alignedText = ' '.repeat(spacesNeeded) + text;
        return alignedText;
    };

    const rebalanceText = (text, maxWidth, font, fontSize) => {
        const words = text.split(' ');
        let lines = [];
        let currentLine = '';

        words.forEach(word => {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const textWidth = font.widthOfTextAtSize(testLine, fontSize);
            if (textWidth < maxWidth) {
                currentLine = testLine;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        });

        if (currentLine) {
            lines.push(currentLine);
        }

        return lines.join('\n');
    };

    const template = `
${lineAlignLeft(organizationName, MAX_WIDTH)}
${lineAlignLeft(`Адрес: ${address.split(',').join(',')}`, MAX_WIDTH)}
${lineAlignLeft(`Телефон: ${phone}`, MAX_WIDTH)}

${lineAlignLeft(`ИНН ${inn}, ОГРН ${ogrn}`, MAX_WIDTH)}

${lineAlignLeft(`№ ${letterNumber}`, MAX_WIDTH)}
${lineAlignLeft(currentDate, MAX_WIDTH)}

${lineAlignLeft('ООО "Тестовые Решения"', MAX_WIDTH)}
${lineAlignLeft('Адрес: ул. Образцовая, д. 2, г. Москва, РФ, 123456', MAX_WIDTH)}

${lineAlignLeft('ИНН 0987654321, ОГРН 9876543210987', MAX_WIDTH)}

                                                    Авторизационное письмо

${rebalanceText(`Представитель - ${representative}, ${organizationName} (далее — "Заказчик"), действующего на основании Устава, настоящим уполномочивает ООО "Тестовые Решения" (далее — "Исполнитель"), в лице Генерального директора Петрова Петра Петровича, действующего на основании Устава, на выполнение следующих действий, направленных на тестирование информационных систем Заказчика:`, MAX_WIDTH, timesNewRomanFont, FONT_SIZE)}

${rebalanceText(`Проведение анализа уязвимостей информационных систем Заказчика. Проведение тестирования на проникновение (пентестинг) информационных систем Заказчика. Проведение анализа безопасности и оценка защищенности данных. Подготовка отчета по результатам тестирования и предоставление рекомендаций по устранению выявленных уязвимостей. Данные полномочия предоставляются на период с ${currentDate} года по ${endPeriodDate} года.`, MAX_WIDTH, timesNewRomanFont, FONT_SIZE)}
                                                   
${rebalanceText(`Исполнитель обязуется соблюдать требования законодательства Российской Федерации в области защиты информации, в том числе Федерального закона от 27 июля 2006 г. N 152-ФЗ "О персональных данных", Федерального закона от 27 июля 2006 г. N 149-ФЗ "Об информации, информационных технологиях и о защите информации", и иных нормативных актов.`, MAX_WIDTH, timesNewRomanFont, FONT_SIZE)}
                                                    
${rebalanceText(`Все действия, выполненные Исполнителем в рамках настоящих полномочий, должны быть согласованы с Заказчиком и не должны нарушать действующее законодательство Российской Федерации.`, MAX_WIDTH, timesNewRomanFont, FONT_SIZE)}
                                                    
Представитель                                           Генеральный директор
${organizationName}                                     ООО "Тестовые Решения"
_________________ ${representativeInitials}             _________________ Петров П.П.
`;

    const documentContent = template;
    const lines = documentContent.split('\n');

    const MARGIN_LEFT = 75;
    const MARGIN_TOP = 45;
    let page = firstPage;
    let yPosition = page.getSize().height - MARGIN_TOP;

    const drawText = (line) => {
        const wrappedLines = line.split('\n');
        for (const wrappedLine of wrappedLines) {
            if (yPosition < FONT_SIZE + MARGIN_TOP) { 
            //     page = pdfDoc.addPage();
                yPosition = page.getSize().height - MARGIN_TOP; 
            }
            page.drawText(wrappedLine, { x: MARGIN_LEFT, y: yPosition, size: FONT_SIZE, font: timesNewRomanFont });
            yPosition -= FONT_SIZE + 5;
        }
    };

    
    for (const line of lines) {
        drawText(line);
    }

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
    // fs.writeFileSync('AuthMessage.pdf', pdfBytes);
}

export default getPdfAuthorizingLetter;