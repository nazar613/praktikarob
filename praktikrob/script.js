// ----------- Реєстрація користувача ----------
function registerUser() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let pass = document.getElementById("pass").value;

    let key = prompt("Введіть ключ для шифрування (запам'ятайте його!)");

    if (!name || !email || !pass || !key) {
        document.getElementById("userMsg").innerText = "Заповніть усі поля!";
        return;
    }

    let obj = {
        name: name,
        email: email,
        password: pass,
        time: new Date().toLocaleString()
    };

    let encrypted = CryptoJS.AES.encrypt(JSON.stringify(obj), key).toString();

    let users = JSON.parse(localStorage.getItem("users") || "[]");
    users.push(encrypted);
    localStorage.setItem("users", JSON.stringify(users));

    document.getElementById("userMsg").innerText = "Користувача зашифровано та збережено!";
}

// ----------- Авторизація адміністратора ----------
async function adminLogin() {
    const user = document.getElementById("adminUser").value;
    const pass = document.getElementById("adminPass").value;

    let admin = await fetch("admin.json").then(r => r.json());

    if (user === admin.username && pass === admin.password) {
        document.getElementById("adminMsg").innerText = "Успішний вхід!";
        setTimeout(() => location.href = "admin.html", 700);
    } else {
        document.getElementById("adminMsg").innerText = "Невірні дані";
    }
}

// ----------- Завантаження та розшифровка ----------
function loadUsers() {
    let key = document.getElementById("key").value;
    let table = document.querySelector("#table tbody");
    table.innerHTML = "";

    let users = JSON.parse(localStorage.getItem("users") || "[]");

    users.forEach((encrypted, i) => {
        let decoded;

        try {
            decoded = JSON.parse(CryptoJS.AES.decrypt(encrypted, key).toString(CryptoJS.enc.Utf8));
        } catch {
            decoded = null;
        }

        let row = document.createElement("tr");

        if (!decoded) {
            row.innerHTML = `<td>${i+1}</td><td colspan="3">Неможливо розшифрувати (ключ невірний)</td>`;
        } else {
            row.innerHTML = `
                <td>${i+1}</td>
                <td>${decoded.name}</td>
                <td>${decoded.email}</td>
                <td>${decoded.time}</td>
            `;
        }

        table.appendChild(row);
    });
}
