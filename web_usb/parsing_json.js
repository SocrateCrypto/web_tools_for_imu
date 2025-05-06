
//import { rotateObjectWithQuaternion } from './quaternion_function.js';

let buffer1 = "";
let counter_of_pocket = 0;
let error_of_parsing = 0;

let flagRunFunction = false; // начало приема пакетов для обработки

function handleDecodedString(decodedString, startPrefix, endPrefix) {
    //console.log("строка ", decodedString);
    if ((decodedString.indexOf(startPrefix) >= 0) && (flagRunFunction === false)) {
        flagRunFunction = true; // включаем обработку
        counter_of_pocket = 0;
        error_of_parsing = 0;
        buffer1 = "";

        //displayText2("прием Data Base пакетов:  ");
    }

    buffer1 += decodedString;

    if ((decodedString.indexOf(endPrefix) >= 0) && (flagRunFunction === true)) {
        flagRunFunction = false; // выключаем обработку 
        // Обработка оставшегося буфера перед завершением
        processBuffer();
        console.log("return true", decodedString.indexOf(endPrefix));
        return true;
    }

    if (flagRunFunction) {
        processBuffer();
    }

    function processBuffer() {
        let startIndex = buffer1.indexOf('{');
        let endIndex = buffer1.indexOf('}');

        while (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
            let jsonString = buffer1.substring(startIndex, endIndex + 1).trim();

            // Обработка спецсимволов и пробелов
            jsonString = jsonString.replace(/\n/g, '').replace(/\r/g, '');

            try {
                const jsonObject = JSON.parse(jsonString);

                // import statement moved to the top level
                displayText1( jsonString);
                
                //rotateObjectWithQuaternion(controls, jsonObject.m, jsonObject.x, jsonObject.y, jsonObject.z);
                ++counter_of_pocket;
               // displayText2("пакетов:  " + counter_of_pocket + "   error:  " + error_of_parsing);
            } catch (error) {
                console.error("Ошибка при разборе JSON:", error, jsonString);
                ++error_of_parsing;
               // displayText2("пакетов:  " + counter_of_pocket + "   error:  " + error_of_parsing);
            }

            buffer1 = buffer1.substring(endIndex + 1);
            startIndex = buffer1.indexOf('{');
            endIndex = buffer1.indexOf('}');
        }
    }

    return false;
}



// Функция для обновления содержимого на странице
function displayText1(text) {
    // Находим элемент по id
    const container = document.getElementById('dynamic-text');
    // Устанавливаем переданный текст в содержимое элемента
    container.textContent = text;
}

