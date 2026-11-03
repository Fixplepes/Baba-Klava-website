function getCart() {
    try {
        return JSON.parse(localStorage.getItem("babaCart")) || [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem("babaCart", JSON.stringify(cart));
    updateCartCount();
}

function addToCart(product) {
    const cart = getCart();
    const existing = cart.find(item => item.name === product.name);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart(cart);
    showToast("Добавлено в корзину: " + product.name);
}

function removeFromCart(name) {
    let cart = getCart().filter(item => item.name !== name);
    saveCart(cart);
    renderCart();
}

function clearCart() {
    localStorage.removeItem("babaCart");
    updateCartCount();
    renderCart();
    showToast("Корзина очищена");
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);

    document.querySelectorAll("#cart-count").forEach(el => {
        el.textContent = count;
    });
}

function renderCart() {
    const cart = getCart();
    const container = document.getElementById("cart-items");
    const emptyBlock = document.getElementById("cart-empty");
    const summary = document.getElementById("cart-summary");
    const totalEl = document.getElementById("cart-total");

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = "";
        if (emptyBlock) emptyBlock.style.display = "block";
        if (summary) summary.style.display = "none";
        return;
    }

    if (emptyBlock) emptyBlock.style.display = "none";
    if (summary) summary.style.display = "block";

    let total = 0;
    container.innerHTML = "";

    cart.forEach(item => {
        total += item.price * item.quantity;

        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <div class="cart-item-info">
                <img src="${item.img || ''}" class="cart-item-img" alt="">
                <div>
                    <h3>${item.name}</h3>
                    <p>${item.price} ₽ × ${item.quantity}</p>
                </div>
            </div>
            <div class="cart-item-actions">
                <span class="cart-item-price">${item.price * item.quantity} ₽</span>
                <button class="remove-btn" data-name="${item.name}">Удалить</button>
            </div>
        `;
        container.appendChild(div);
    });

    if (totalEl) totalEl.textContent = total;

    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            removeFromCart(this.getAttribute("data-name"));
        });
    });
}

function showToast(message) {
    const old = document.querySelector(".baba-toast");
    if (old) old.remove();

    const toast = document.createElement("div");
    toast.className = "baba-toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 2800);
}

document.addEventListener("DOMContentLoaded", function () {
    updateCartCount();
    renderCart();

    // Кнопки Купить
    document.querySelectorAll(".product button").forEach(btn => {
        btn.addEventListener("click", function () {
            const productEl = this.closest(".product");
            if (!productEl) return;

            const name = productEl.querySelector("h3").textContent.trim();
            const imgEl = productEl.querySelector(".product-img");
            const img = imgEl ? imgEl.src : "";

            let price = 300;
            if (name.includes("Пельмени")) price = 350;
            else if (name.includes("Шарф")) price = 890;
            else if (name.includes("варенья") || name.includes("Варенья")) price = 250;

            addToCart({ name, img, price });

            const original = this.textContent;
            this.textContent = "В корзине ✓";
            this.style.background = "#4ecdc4";

            setTimeout(() => {
                this.textContent = original;
                this.style.background = "#ff6b35";
            }, 1400);
        });
    });


    document.querySelectorAll(".donate-btn").forEach(btn => {
    if (btn.closest("form") && btn.type === "submit") return;

    btn.addEventListener("click", function () {
        const text = this.textContent.trim();

        if (text.includes("1₽")) {
            showToast("БабаКлава говорит: Жмот ты внучек 💔 (Кинуть 1₽)");
        } else {
            showToast("БабаКлава говорит: Спасибо, внучек ❤️ (" + text + ")");
        }

        this.style.transform = "scale(0.92)";
        setTimeout(() => {
            this.style.transform = "scale(1)";
        }, 150);
    });
});

    const clearBtn = document.getElementById("clear-cart");
    if (clearBtn) {
        clearBtn.addEventListener("click", clearCart);
    }

    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", function () {
            if (getCart().length === 0) return;
            showToast("Заказ принят! БабаКлава уже варит...");
            setTimeout(() => {
                clearCart();
                showToast("Спасибо за покупку!");
            }, 1600);
        });
        console.log(localStorage.getItem("babaCart"))
    }

    const form = document.getElementById("registration");
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            let valid = true;
            form.querySelectorAll(".error-msg").forEach(el => el.textContent = "");

            const lastname = document.getElementById("lastname");
            const firstname = document.getElementById("firstname");
            const email = document.getElementById("email");
            const phone = document.getElementById("phone");
            const password = document.getElementById("password");
            const password2 = document.getElementById("password2");
            const agree = document.getElementById("agree");
            const country = document.getElementById("country");
            const city = document.getElementById("city");
            const birthdate = document.getElementById("birthdate");

            function showError(input, message) {
                const msg = input.closest(".form-group").querySelector(".error-msg");
                if (msg) msg.textContent = message;
                valid = false;
            }

            if (!lastname.value.trim()) showError(lastname, "Поле обязательно");
            else if (lastname.value.trim().length < 2) showError(lastname, "Минимум 2 символа");

            if (!firstname.value.trim()) showError(firstname, "Поле обязательно");
            else if (firstname.value.trim().length < 2) showError(firstname, "Минимум 2 символа");

            if (!email.value.trim()) showError(email, "Поле обязательно");
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) showError(email, "Некорректный email");

            if (!phone.value.trim()) showError(phone, "Поле обязательно");

            if (!password.value) showError(password, "Поле обязательно");
            else if (password.value.length < 8) showError(password, "Минимум 8 символов");
            else if (!/[A-ZА-Я]/.test(password.value)) showError(password, "Нужна заглавная буква");
            else if (!/[0-9]/.test(password.value)) showError(password, "Нужна цифра");

            if (password.value !== password2.value) showError(password2, "Пароли не совпадают");

            if (!agree.checked) showError(agree, "Нужно согласие с правилами");

            if (!country.value) showError(country, "Выберите страну");
            if (!city.value.trim()) showError(city, "Поле обязательно");
            if (!birthdate.value) showError(birthdate, "Укажите дату");

            if (valid) {
                form.style.display = "none";
                document.getElementById("success-block").style.display = "block";
                document.getElementById("success-name").textContent = firstname.value + " " + lastname.value;
                document.getElementById("success-email").textContent = email.value;
            }
        });
    }


    const anketa = document.getElementById("anketa");
    if (anketa) {
        anketa.addEventListener("submit", function (e) {
            e.preventDefault();
            alert("Анкета отправлена! БабаКлава гордится тобой ❤️");
            anketa.reset();
        });
    }
});