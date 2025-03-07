async function findInPi() {
    const birthdayInput = document.getElementById("birthday").value;
    const resultElement = document.getElementById("result");
    if (!/^\d{8}$/.test(birthdayInput)) {
        resultElement.textContent = "Lütfen 8 haneli GGAAYYYY formatında gir (ör: 02021966)";
        return;
    }
    const day = parseInt(birthdayInput.slice(0, 2));
    const month = parseInt(birthdayInput.slice(2, 4));
    if (day > 31) {
        resultElement.textContent = "Gün 31’den büyük olamaz!";
        return;
    }
    if (month > 12) {
        resultElement.textContent = "Ay 12’den büyük olamaz!";
        return;
    }
    const birthday = birthdayInput.slice(0, 4) + birthdayInput.slice(6, 8); // "02021966" -> "020266"
    resultElement.textContent = `Aranıyor: ${birthday}...`;
    try {
        const response = await fetch('/pi-billion.txt');
        if (!response.ok) {
            throw new Error("Dosya okunamadı, HTTP hatası: " + response.status);
        }
        const reader = response.body.getReader();
        let piChunk = '';
        let position = -1;
        let offset = 0;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = new TextDecoder().decode(value);
            piChunk += chunk;
            const localPos = piChunk.indexOf(birthday);
            if (localPos !== -1) {
                position = offset + localPos;
                break;
            }
            offset += piChunk.length - 5;
            piChunk = piChunk.slice(-5);
        }
        resultElement.textContent = position !== -1
            ? `${position + 1}`
            : "Bulunamadı!";
    } catch (error) {
        resultElement.textContent = "Hata: " + error.message;
    }
}